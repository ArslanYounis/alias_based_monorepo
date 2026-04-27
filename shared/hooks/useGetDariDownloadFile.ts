import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type DownloadParams = {
    applicationID: string;
    applicationType: string;
    documentType: string;
    subType: string;
};

/** Helper: convert base64 or raw binary string into Uint8Array */
const stringToUint8 = (str: string) => {
    const cleaned = str.replace(/\s+/g, "");
    const base64Regex = /^[A-Za-z0-9+/=]+$/;

    if (base64Regex.test(cleaned)) {
        const binary = atob(cleaned);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
        return u8;
    }

    const len = str.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = str.charCodeAt(i) & 0xff;
    return u8;
};

const getDariDownloadFile = async (params?: DownloadParams) => {
    if (!params) throw new Error("No download params provided");

    const res = await axios.get("dari/file/doc-download", {
        params,
        responseType: "arraybuffer",
    });

    const contentType = res.headers?.["content-type"] || "";

    //  Detect if response is actually JSON (even though it's arraybuffer)
    const isJson =
        contentType.includes("application/json") ||
        contentType.includes("text/json");

    // CASE 1: Backend returned JSON (your case)
    if (isJson) {
        const text = new TextDecoder().decode(res.data);
        const json = JSON.parse(text);

        const bytes = json?.result?.bytes;
        const fileName = json?.result?.fileName || "document";
        const fileType =
            json?.result?.fileExtension || "application/octet-stream";

        if (!bytes) throw new Error("Missing file bytes");

        const u8 = stringToUint8(bytes);

        return {
            blob: new Blob([u8], { type: fileType }),
            fileName,
        };
    }

    // CASE 2: Backend returns real file (future-proof)
    return {
        blob: new Blob([res.data], { type: contentType }),
        fileName: "document",
    };
};

export const useGetDariDownloadFile = (params?: DownloadParams) => {
    return useQuery({
        queryKey: ["get-dari-download-file", params],
        queryFn: () => getDariDownloadFile(params),
        enabled: !!params,
    });
};