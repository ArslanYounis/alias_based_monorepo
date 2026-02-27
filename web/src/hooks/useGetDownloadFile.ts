import axios from "axios";
import { useQuery } from "@tanstack/react-query";

/** Helper: convert base64 or raw binary string into Uint8Array */
const stringToUint8 = (str: string) => {
    // If it looks like base64 (allow whitespace which we strip)
    const cleaned = str.replace(/\s+/g, "");
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (base64Regex.test(cleaned)) {
        // base64 -> binary
        const binary = atob(cleaned);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
        return u8;
    }

    // fallback: treat string as raw binary (each char code is a byte)
    const len = str.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = str.charCodeAt(i) & 0xff;
    return u8;
};

const getDownloadFile = async (args?: string) => {
    if (!args) throw new Error("No download args provided");

    // treat any absolute or root-relative path as a direct URL to fetch as blob
    const isFullUrl = /^https?:\/\//i.test(args) || args.startsWith("/");

    if (isFullUrl) {
        // Fetch direct URL as blob (best case)
        const res = await axios.get(args, { responseType: "blob" });
        return res.data as Blob;
    }

    // Try to fetch binary (arraybuffer) first
    try {
        const res = await axios.get("/file/download", {
            params: { args },
            responseType: "arraybuffer",
        });

        const contentType = (res.headers && res.headers["content-type"]) || undefined;
        return new Blob([res.data], contentType ? { type: contentType } : undefined);
    } catch (err: unknown) {
        // Use the error (avoid unused var ESLint) and fallback to JSON/string handling
        console.warn("arraybuffer fetch failed, falling back to JSON/string handling:", err);

        // Now try JSON/string fallback
        const res2 = await axios.get("/file/download", {
            params: { args },
            responseType: "json",
        });

        const data = res2.data;

        // Case A: object with a field that holds binary/base64
        // e.g. { downloadFileResponse: "<binary-or-base64-string>" }
        if (data && typeof data === "object") {
            const candidate =
                typeof (data as Record<string, unknown>).downloadFileResponse === "string"
                    ? (data as Record<string, string>).downloadFileResponse
                    : typeof (data as Record<string, unknown>).file === "string"
                        ? (data as Record<string, string>).file
                        : typeof (data as Record<string, unknown>).data === "string"
                            ? (data as Record<string, string>).data
                            : null;

            if (candidate) {
                const u8 = stringToUint8(candidate);
                const contentTypeHeader = (res2.headers && res2.headers["content-type"]) || undefined;
                return new Blob([u8], contentTypeHeader ? { type: contentTypeHeader } : undefined);
            }
        }

        // Case B: raw string body
        if (typeof data === "string") {
            const u8 = stringToUint8(data);
            const contentTypeHeader = (res2.headers && res2.headers["content-type"]) || undefined;
            return new Blob([u8], contentTypeHeader ? { type: contentTypeHeader } : undefined);
        }

        // Last fallback: if nothing matched—throw so caller can handle error
        throw new Error("Unable to parse download response");
    }
};

export const useGetDownloadFile = (args?: string) => {
    const query = useQuery({
        queryKey: ["get-download-file", args],
        queryFn: () => getDownloadFile(args),
        enabled: !!args,
    });

    return {
        ...query,
    };
};
