import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const cleanHex = (s: string) => s.replace(/0x|,|\s+/g, "").trim();
const isHexString = (s: string) => /^[0-9a-fA-F]+$/.test(s);
const hexToUint8Array = (hex: string) => {
  const cleaned = cleanHex(hex);
  const len = cleaned.length;
  const out = new Uint8Array(Math.floor(len / 2));
  for (let i = 0; i < len; i += 2) {
    out[i / 2] = parseInt(cleaned.substr(i, 2), 16);
  }
  return out;
};
const isBase64 = (s: string) => {
  const str = s.replace(/\s+/g, "");
  return /^[A-Za-z0-9+/=]+$/.test(str) && str.length % 4 === 0;
};

async function fetchDataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  if (!res.ok) throw new Error("Failed to convert data URL to blob");
  return res.blob();
}

export const getPlotImage = async (plotId?: string): Promise<Blob | null> => {
  if (!plotId) return null;
  const url = `/document/thumbnail`;

  try {
    const resp = await axios.get<ArrayBuffer>(url, {
      params: { args: plotId },
      responseType: "arraybuffer",
      validateStatus: (s) => s >= 200 && s < 300,
    });
    const contentType = resp.headers["content-type"] ?? "image/png";
    const data = resp.data;
    if (data && (data instanceof ArrayBuffer || ArrayBuffer.isView(data))) {
      return new Blob([data], { type: contentType });
    }
  } catch {
    // fallback below
  }

  try {
    const resp = await axios.get<string>(url, {
      params: { args: plotId },
      responseType: "text",
      validateStatus: (s) => s >= 200 && s < 300,
    });
    let body: string = resp.data?.trim?.() ?? "";
    if (!body) return null;
    if (body.startsWith("{")) {
      try {
        const parsed = JSON.parse(body) as Record<string, unknown>;
        if (typeof parsed.data === "string") body = parsed.data;
        else if (typeof parsed.image === "string") body = parsed.image;
      } catch {
        // ignore
      }
    }
    if (body.startsWith("data:image/")) {
      return fetchDataUrlToBlob(body);
    }
    const maybeHex = cleanHex(body);
    if (isHexString(maybeHex)) {
      const uint8 = hexToUint8Array(maybeHex);
      return new Blob([uint8], { type: "image/png" });
    }
    if (isBase64(body)) {
      return fetchDataUrlToBlob(`data:image/png;base64,${body}`);
    }
    if (/^https?:\/\//i.test(body)) {
      const res2 = await fetch(body);
      if (!res2.ok) throw new Error("Failed to fetch image URL");
      return res2.blob();
    }
    return null;
  } catch {
    return null;
  }
};

export function useGetPlotImage(plotId?: string) {
  return useQuery<Blob | null>({
    queryKey: ["plotImage", plotId],
    queryFn: () => getPlotImage(plotId),
    enabled: !!plotId,
  });
}
