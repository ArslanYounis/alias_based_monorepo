import axios from "axios";

const stringToUint8 = (str: string): Uint8Array<ArrayBuffer> => {
  const cleaned = str.replace(/\s+/g, "");
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (base64Regex.test(cleaned)) {
    const binary = atob(cleaned);
    const u8 = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);
    return u8;
  }
  const u8 = new Uint8Array(new ArrayBuffer(str.length));
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
    const contentType = (res.headers?.["content-type"]) || undefined;
    return new Blob([res.data], contentType ? { type: contentType } : undefined);
  } catch (err) {
    console.warn("arraybuffer fetch failed, falling back to JSON/string handling:", err);

    const res2 = await axios.get("/file/download", {
      params: { args: url },
      responseType: "json",
    });
    const data = res2.data;
    const contentType = (res2.headers?.["content-type"]) || undefined;

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
        return new Blob([u8], contentType ? { type: contentType } : undefined);
      }
    }

    if (typeof data === "string") {
      const u8 = stringToUint8(data);
      return new Blob([u8], contentType ? { type: contentType } : undefined);
    }

    throw new Error("Unable to parse download response");
  }
};

export const useDownload = () => {
  const download = (url: string, filename = "payment-slip") => {
    fetchBlob(url)
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(objectUrl);
      })
      .catch((err) => console.error("Download failed:", err));
  };

  return { download };
};
