import axios from "axios";

const stringToUint8 = (str: string) => {
  const cleaned = str.replace(/\s+/g, "");
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
    const binary = atob(cleaned);
    const u8 = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);
    return u8;
  }
  const u8 = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) u8[i] = str.charCodeAt(i) & 0xff;
  return u8;
};

const fetchBlob = async (url: string): Promise<Blob> => {
  const isFullUrl = /^https?:\/\//i.test(url) || url.startsWith("/");

  if (isFullUrl) {
    const res = await axios.get(url, { responseType: "blob" });
    return res.data as Blob;
  }

  try {
    const res = await axios.get("/file/download", {
      params: { args: url },
      responseType: "arraybuffer",
    });
    const contentType = res.headers?.["content-type"] || undefined;
    return new Blob([res.data], contentType ? { type: contentType } : undefined);
  } catch {
    const res2 = await axios.get("/file/download", {
      params: { args: url },
      responseType: "json",
    });
    const data = res2.data;
    const contentType = res2.headers?.["content-type"] || undefined;

    if (data && typeof data === "object") {
      const candidate =
        typeof (data as Record<string, unknown>).downloadFileResponse === "string"
          ? (data as Record<string, string>).downloadFileResponse
          : typeof (data as Record<string, unknown>).file === "string"
            ? (data as Record<string, string>).file
            : typeof (data as Record<string, unknown>).data === "string"
              ? (data as Record<string, string>).data
              : null;
      if (candidate)
        return new Blob([stringToUint8(candidate)], contentType ? { type: contentType } : undefined);
    }

    if (typeof data === "string")
      return new Blob([stringToUint8(data)], contentType ? { type: contentType } : undefined);

    throw new Error("Unable to parse download response");
  }
};

export const useDownload = () => {
  const download = async (url: string, fileName = "document") => {
    try {
      const blob = await fetchBlob(url);
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error("Failed to download file", e);
    }
  };

  return { download };
};
