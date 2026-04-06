import axios from "axios";
import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

const BASE64_TABLE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    result += BASE64_TABLE[b0 >> 2];
    result += BASE64_TABLE[((b0 & 0x3) << 4) | (b1 >> 4)];
    result +=
      i + 1 < bytes.length ? BASE64_TABLE[((b1 & 0xf) << 2) | (b2 >> 6)] : "=";
    result += i + 2 < bytes.length ? BASE64_TABLE[b2 & 0x3f] : "=";
  }
  return result;
};

const ensureBase64 = (str: string): string => {
  const cleaned = str.replace(/\s+/g, "");
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned)) return cleaned;
  const buf = new ArrayBuffer(str.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i) & 0xff;
  return arrayBufferToBase64(buf);
};

const base64ToBytes = (base64: string): Uint8Array => {
  const lookup = new Uint8Array(128);
  for (let i = 0; i < BASE64_TABLE.length; i++)
    lookup[BASE64_TABLE.charCodeAt(i)] = i;

  const cleaned = base64.replace(/[^A-Za-z0-9+/]/g, "");
  const len = cleaned.length;
  const byteLen = (len * 3) >> 2;
  const bytes = new Uint8Array(byteLen);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const a = lookup[cleaned.charCodeAt(i)];
    const b = lookup[cleaned.charCodeAt(i + 1)];
    const c = lookup[cleaned.charCodeAt(i + 2)];
    const d = lookup[cleaned.charCodeAt(i + 3)];
    bytes[p++] = (a << 2) | (b >> 4);
    if (p < byteLen) bytes[p++] = ((b & 0xf) << 4) | (c >> 2);
    if (p < byteLen) bytes[p++] = ((c & 0x3) << 6) | d;
  }
  return bytes;
};

/** Map file extension → MIME type & Apple UTI */
const getMimeInfo = (filename: string): { mimeType: string; UTI: string } => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, { mimeType: string; UTI: string }> = {
    pdf: { mimeType: "application/pdf", UTI: "com.adobe.pdf" },
    png: { mimeType: "image/png", UTI: "public.png" },
    jpg: { mimeType: "image/jpeg", UTI: "public.jpeg" },
    jpeg: { mimeType: "image/jpeg", UTI: "public.jpeg" },
    gif: { mimeType: "image/gif", UTI: "com.compuserve.gif" },
    webp: { mimeType: "image/webp", UTI: "public.webp" },
    svg: { mimeType: "image/svg+xml", UTI: "public.svg-image" },
    mp4: { mimeType: "video/mp4", UTI: "public.mpeg-4" },
    mov: { mimeType: "video/quicktime", UTI: "com.apple.quicktime-movie" },
    mp3: { mimeType: "audio/mpeg", UTI: "public.mp3" },
    wav: { mimeType: "audio/wav", UTI: "com.microsoft.waveform-audio" },
    doc: { mimeType: "application/msword", UTI: "com.microsoft.word.doc" },
    docx: {
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      UTI: "org.openxmlformats.wordprocessingml.document",
    },
    xls: {
      mimeType: "application/vnd.ms-excel",
      UTI: "com.microsoft.excel.xls",
    },
    xlsx: {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      UTI: "org.openxmlformats.spreadsheetml.sheet",
    },
    csv: { mimeType: "text/csv", UTI: "public.comma-separated-values-text" },
    txt: { mimeType: "text/plain", UTI: "public.plain-text" },
    json: { mimeType: "application/json", UTI: "public.json" },
    zip: { mimeType: "application/zip", UTI: "com.pkware.zip-archive" },
    html: { mimeType: "text/html", UTI: "public.html" },
  };
  return (
    map[ext] ?? { mimeType: "application/octet-stream", UTI: "public.data" }
  );
};

const downloadToCache = async (
  url: string,
  filename: string,
): Promise<string> => {
  const isAbsoluteHttp = /^https?:\/\//i.test(url);
  const isFullUrl = isAbsoluteHttp || url.startsWith("/");
  const file = new File(Paths.cache, filename);

  if (isAbsoluteHttp) {
    const cacheDir = new Directory(Paths.cache);
    if (!cacheDir.exists) cacheDir.create();
    const downloaded = await File.downloadFileAsync(url, cacheDir);
    if (downloaded.uri !== file.uri) {
      if (file.exists) file.delete();
      downloaded.move(new Directory(Paths.cache));
    }
    return downloaded.uri;
  }

  const targetUrl = isFullUrl ? url : "/file/download";
  const params = isFullUrl ? {} : { args: url };

  try {
    const res = await axios.get(targetUrl, {
      params,
      responseType: "arraybuffer",
    });
    file.write(new Uint8Array(res.data as ArrayBuffer));
    return file.uri;
  } catch (err) {
    console.warn(
      "arraybuffer fetch failed, falling back to JSON/string handling:",
      err,
    );

    const res2 = await axios.get(targetUrl, { params, responseType: "json" });
    const data = res2.data;

    let base64: string | null = null;

    if (data && typeof data === "object") {
      const candidate =
        typeof (data as Record<string, unknown>).downloadFileResponse ===
        "string"
          ? (data as Record<string, string>).downloadFileResponse
          : typeof (data as Record<string, unknown>).file === "string"
            ? (data as Record<string, string>).file
            : typeof (data as Record<string, unknown>).data === "string"
              ? (data as Record<string, string>).data
              : null;

      if (candidate) base64 = ensureBase64(candidate);
    }

    if (!base64 && typeof data === "string") base64 = ensureBase64(data);
    if (!base64) throw new Error("Unable to parse download response");

    file.write(base64ToBytes(base64));
    return file.uri;
  }
};

export const useDownload = () => {
  const download = async (url: string, filename = "paymentSlip.pdf") => {
    try {
      const localUri = await downloadToCache(url, filename);

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        console.warn("Sharing is not available on this device");
        return;
      }

      const { mimeType, UTI } = getMimeInfo(filename);

      await Sharing.shareAsync(localUri, {
        mimeType,
        UTI,
        dialogTitle: "Save or open file",
      });
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return { download };
};
