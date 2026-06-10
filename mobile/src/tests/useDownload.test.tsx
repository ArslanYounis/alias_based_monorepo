/**
 * Tests for the mobile useDownload hook.
 * Downloads via expo-file-system / axios and shares via expo-sharing.
 */
import { renderHook } from "@testing-library/react-native";
import axios from "axios";
import * as Sharing from "expo-sharing";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ── expo-file-system mock ───────────────────────────────────────────────────
// The jest.mock factory is hoisted above all module-scope consts, so it must be
// fully self-contained. It stashes its spies + mutable state on a `__state`
// object that the tests reach via the (mocked) imported module.
jest.mock("expo-file-system", () => {
  const state = {
    fileExists: false,
    cacheDirExists: true,
    downloadedUri: "file:///cache/remote.pdf",
    fileWrite: jest.fn(),
    fileDelete: jest.fn(),
    downloadedMove: jest.fn(),
    dirCreate: jest.fn(),
    downloadFileAsync: jest.fn(),
  };

  const FileMock = jest
    .fn()
    .mockImplementation((_dir: unknown, name: string) => ({
      uri: `file:///cache/${name}`,
      get exists() {
        return state.fileExists;
      },
      write: state.fileWrite,
      delete: state.fileDelete,
    }));
  (FileMock as unknown as { downloadFileAsync: jest.Mock }).downloadFileAsync =
    state.downloadFileAsync;

  const DirectoryMock = jest.fn().mockImplementation(() => ({
    get exists() {
      return state.cacheDirExists;
    },
    create: state.dirCreate,
  }));

  return {
    File: FileMock,
    Directory: DirectoryMock,
    Paths: { cache: "file:///cache" },
    __state: state,
  };
});

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

const mockedSharing = Sharing as jest.Mocked<typeof Sharing>;

// Reach the mock internals through the (mocked) imported module.
import * as ExpoFs from "expo-file-system";
const FileCtor = ExpoFs.File as unknown as jest.Mock;
const mockFs = (ExpoFs as unknown as { __state: {
  fileExists: boolean;
  cacheDirExists: boolean;
  downloadedUri: string;
  fileWrite: jest.Mock;
  fileDelete: jest.Mock;
  downloadedMove: jest.Mock;
  dirCreate: jest.Mock;
  downloadFileAsync: jest.Mock;
} }).__state;

import { useDownload } from "@platform/sharedHooks/useDownload";

describe("useDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.fileExists = false;
    mockFs.cacheDirExists = true;
    mockFs.downloadedUri = "file:///cache/remote.pdf";
    mockFs.downloadFileAsync.mockImplementation(async () => ({
      uri: mockFs.downloadedUri,
      move: mockFs.downloadedMove,
    }));
    (mockedSharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (mockedSharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  // ── download(): absolute http branch ──────────────────────────────────────
  it("downloads an absolute http url via File.downloadFileAsync and shares", async () => {
    const { result } = renderHook(() => useDownload());
    await result.current.download("https://example.com/file.pdf", "file.pdf");

    expect(mockFs.downloadFileAsync).toHaveBeenCalledWith(
      "https://example.com/file.pdf",
      expect.anything()
    );
    expect(mockedSharing.shareAsync).toHaveBeenCalledWith(
      mockFs.downloadedUri,
      expect.objectContaining({
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
      })
    );
  });

  it("creates cache dir when missing and moves downloaded file when uri differs", async () => {
    mockFs.cacheDirExists = false;
    mockFs.fileExists = true; // triggers existing file.delete()
    mockFs.downloadedUri = "file:///downloads/other.pdf"; // differs from File(cache,...).uri
    const { result } = renderHook(() => useDownload());
    await result.current.download("https://example.com/x.pdf", "file.pdf");

    expect(mockFs.dirCreate).toHaveBeenCalled();
    expect(mockFs.fileDelete).toHaveBeenCalled();
    expect(mockFs.downloadedMove).toHaveBeenCalled();
  });

  // ── download(): axios arraybuffer branch ──────────────────────────────────
  it("downloads via axios arraybuffer for relative args and writes file", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: new Uint8Array([1, 2]).buffer });
    const { result } = renderHook(() => useDownload());
    await result.current.download("some/relative/path", "doc.pdf");

    expect(mockedAxios.get).toHaveBeenCalledWith("/file/download", {
      params: { args: "some/relative/path" },
      responseType: "arraybuffer",
    });
    expect(mockFs.fileWrite).toHaveBeenCalled();
    expect(mockedSharing.shareAsync).toHaveBeenCalled();
  });

  it("uses the url directly (no args) when path starts with /", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: new Uint8Array([1]).buffer });
    const { result } = renderHook(() => useDownload());
    await result.current.download("/server/file", "doc.pdf");

    expect(mockedAxios.get).toHaveBeenCalledWith("/server/file", {
      params: {},
      responseType: "arraybuffer",
    });
  });

  // ── download(): axios arraybuffer fails → JSON fallback ────────────────────
  it("falls back to JSON handling when arraybuffer fetch fails (downloadFileResponse base64)", async () => {
    mockedAxios.get
      .mockRejectedValueOnce(new Error("ab failed"))
      .mockResolvedValueOnce({ data: { downloadFileResponse: "aGVsbG8=" } });
    const { result } = renderHook(() => useDownload());
    await result.current.download("rel/path", "doc.pdf");

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockFs.fileWrite).toHaveBeenCalled();
    expect(mockedSharing.shareAsync).toHaveBeenCalled();
  });

  it("handles JSON fallback when data is a raw base64 string", async () => {
    mockedAxios.get
      .mockRejectedValueOnce(new Error("ab failed"))
      .mockResolvedValueOnce({ data: "aGVsbG8=" });
    const { result } = renderHook(() => useDownload());
    await result.current.download("rel/path", "doc.pdf");

    expect(mockFs.fileWrite).toHaveBeenCalled();
  });

  it("swallows error when JSON fallback cannot parse the response", async () => {
    mockedAxios.get
      .mockRejectedValueOnce(new Error("ab failed"))
      .mockResolvedValueOnce({ data: { unexpected: 123 } });
    const { result } = renderHook(() => useDownload());
    // Inner throw is caught by download()'s outer try/catch → console.error
    await result.current.download("rel/path", "doc.pdf");

    expect(console.error).toHaveBeenCalled();
    expect(mockedSharing.shareAsync).not.toHaveBeenCalled();
  });

  // ── download(): sharing unavailable ───────────────────────────────────────
  it("does not share when sharing is unavailable", async () => {
    (mockedSharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);
    mockedAxios.get.mockResolvedValueOnce({ data: new Uint8Array([1]).buffer });
    const { result } = renderHook(() => useDownload());
    await result.current.download("/server/file", "doc.pdf");

    expect(mockedSharing.shareAsync).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it("uses default filename paymentSlip.pdf when none passed", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: new Uint8Array([1]).buffer });
    const { result } = renderHook(() => useDownload());
    await result.current.download("/server/file");

    expect(FileCtor).toHaveBeenCalledWith(expect.anything(), "paymentSlip.pdf");
  });

  // ── downloadDari(): JSON branch ───────────────────────────────────────────
  it("downloadDari writes file from JSON arraybuffer and shares", async () => {
    const json = JSON.stringify({
      result: { bytes: "aGVsbG8=", fileName: "dari.pdf" },
    });
    const u8 = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) u8[i] = json.charCodeAt(i);

    mockedAxios.get.mockResolvedValueOnce({
      data: u8.buffer,
      headers: { "content-type": "application/json" },
    });
    const { result } = renderHook(() => useDownload());
    await result.current.downloadDari({
      applicationID: "1",
      applicationType: "t",
      documentType: "d",
      subType: "s",
    });

    expect(mockedAxios.get).toHaveBeenCalledWith("dari/file/doc-download", {
      params: expect.objectContaining({ applicationID: "1" }),
      responseType: "arraybuffer",
    });
    expect(mockFs.fileWrite).toHaveBeenCalled();
    expect(mockedSharing.shareAsync).toHaveBeenCalled();
  });

  it("downloadDari throws (caught) when JSON has no bytes", async () => {
    const json = JSON.stringify({ result: {} });
    const u8 = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) u8[i] = json.charCodeAt(i);

    mockedAxios.get.mockResolvedValueOnce({
      data: u8.buffer,
      headers: { "content-type": "application/json" },
    });
    const { result } = renderHook(() => useDownload());
    await result.current.downloadDari({
      applicationID: "1",
      applicationType: "t",
      documentType: "d",
      subType: "s",
    });

    expect(console.error).toHaveBeenCalled();
    expect(mockedSharing.shareAsync).not.toHaveBeenCalled();
  });

  // ── downloadDari(): raw file branch ───────────────────────────────────────
  it("downloadDari writes raw file when content-type is not JSON", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: new Uint8Array([1, 2, 3]).buffer,
      headers: { "content-type": "application/pdf" },
    });
    const { result } = renderHook(() => useDownload());
    await result.current.downloadDari(
      {
        applicationID: "1",
        applicationType: "t",
        documentType: "d",
        subType: "s",
      },
      "myfile.pdf"
    );

    expect(mockFs.fileWrite).toHaveBeenCalled();
    expect(mockedSharing.shareAsync).toHaveBeenCalled();
  });

  it("downloadDari does not share when sharing unavailable", async () => {
    (mockedSharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);
    mockedAxios.get.mockResolvedValueOnce({
      data: new Uint8Array([1]).buffer,
      headers: { "content-type": "application/pdf" },
    });
    const { result } = renderHook(() => useDownload());
    await result.current.downloadDari({
      applicationID: "1",
      applicationType: "t",
      documentType: "d",
      subType: "s",
    });

    expect(mockedSharing.shareAsync).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it("downloadDari swallows axios errors", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("network"));
    const { result } = renderHook(() => useDownload());
    await result.current.downloadDari({
      applicationID: "1",
      applicationType: "t",
      documentType: "d",
      subType: "s",
    });

    expect(console.error).toHaveBeenCalled();
  });
});
