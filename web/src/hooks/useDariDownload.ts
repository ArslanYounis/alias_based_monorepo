import axios from "axios";

type DariDownloadParams = {
  applicationID: string;
  applicationType: string;
  documentType: string;
  subType: string;
};

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

const fetchDariFile = async (params: DariDownloadParams) => {
  const res = await axios.get("dari/file/doc-download", {
    params,
    responseType: "arraybuffer",
  });

  const contentType = res.headers?.["content-type"] || "";
  const isJson =
    contentType.includes("application/json") ||
    contentType.includes("text/json");

  if (isJson) {
    const text = new TextDecoder().decode(res.data);
    const json = JSON.parse(text);
    const bytes = json?.result?.bytes;
    const fileName = json?.result?.fileName || "document";
    const fileType = json?.result?.fileExtension || "application/octet-stream";
    if (!bytes) throw new Error("Missing file bytes");
    return { blob: new Blob([stringToUint8(bytes)], { type: fileType }), fileName };
  }

  return { blob: new Blob([res.data], { type: contentType }), fileName: "document" };
};

export const useDariDownload = () => {
  const download = async (params: DariDownloadParams) => {
    try {
      const { blob, fileName } = await fetchDariFile(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download dari file", e);
    }
  };

  return { download };
};
