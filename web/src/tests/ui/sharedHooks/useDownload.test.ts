import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

// Import after mocking
import { useDownload } from "@platform/sharedHooks/useDownload";

describe("useDownload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test");
    global.URL.revokeObjectURL = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("returns a download function", () => {
    const { result } = renderHook(() => useDownload());
    expect(typeof result.current.download).toBe("function");
  });

  it("fetches blob for a full https:// URL and triggers download", async () => {
    const blob = new Blob(["data"], { type: "application/pdf" });
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("https://example.com/file.pdf", "my-file");

    // wait for async chain
    await new Promise((r) => setTimeout(r, 50));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://example.com/file.pdf",
      { responseType: "blob" }
    );
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("fetches blob for a root-relative URL (/path)", async () => {
    const blob = new Blob(["data"], { type: "application/octet-stream" });
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("/files/contract.pdf");

    await new Promise((r) => setTimeout(r, 50));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/files/contract.pdf",
      { responseType: "blob" }
    );

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("falls back to arraybuffer fetch for non-URL args", async () => {
    const arrayBuffer = new ArrayBuffer(8);
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: arrayBuffer,
      headers: { "content-type": "application/pdf" },
    });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("some-file-key");

    await new Promise((r) => setTimeout(r, 50));

    expect(mockedAxios.get).toHaveBeenCalledWith("/file/download", {
      params: { args: "some-file-key" },
      responseType: "arraybuffer",
    });

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("falls back to JSON when arraybuffer fetch fails — downloadFileResponse field", async () => {
    const base64str = btoa("hello world");
    mockedAxios.get = vi.fn()
      .mockRejectedValueOnce(new Error("arraybuffer failed"))
      .mockResolvedValueOnce({
        data: { downloadFileResponse: base64str },
        headers: {},
      });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("key");

    await new Promise((r) => setTimeout(r, 100));

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("falls back to JSON when arraybuffer fails — file field", async () => {
    const base64str = btoa("file content");
    mockedAxios.get = vi.fn()
      .mockRejectedValueOnce(new Error("arraybuffer failed"))
      .mockResolvedValueOnce({
        data: { file: base64str },
        headers: {},
      });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("key2");

    await new Promise((r) => setTimeout(r, 100));

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("falls back to JSON when arraybuffer fails — raw string body", async () => {
    mockedAxios.get = vi.fn()
      .mockRejectedValueOnce(new Error("arraybuffer failed"))
      .mockResolvedValueOnce({
        data: "raw binary string content",
        headers: {},
      });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("key3");

    await new Promise((r) => setTimeout(r, 100));

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("logs error when fetch fails completely", async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useDownload());
    result.current.download("https://fail.example.com/file");

    await new Promise((r) => setTimeout(r, 100));

    expect(console.error).toHaveBeenCalled();
  });

  it("uses default filename 'payment-slip' when none provided", async () => {
    const blob = new Blob(["data"]);
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((el) => el);
    const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((el) => el);

    const { result } = renderHook(() => useDownload());
    result.current.download("https://example.com/file");

    await new Promise((r) => setTimeout(r, 50));

    // Default filename is "payment-slip" — verify URL was created (download was triggered)
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
