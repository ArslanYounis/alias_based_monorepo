import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

import { useDownload } from "@/hooks/useDownload";

const flush = () => new Promise((r) => setTimeout(r, 50));

describe("useDownload (web)", () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test");
    global.URL.revokeObjectURL = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});

    clickSpy = vi.fn();
    appendChildSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation((el: any) => {
        el.click = clickSpy;
        return el;
      });
  });

  it("returns a download function", () => {
    const { result } = renderHook(() => useDownload());
    expect(typeof result.current.download).toBe("function");
  });

  it("fetches blob for full https URL and triggers download", async () => {
    const blob = new Blob(["data"], { type: "application/pdf" });
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const { result } = renderHook(() => useDownload());
    await result.current.download("https://example.com/f.pdf", "my-file");
    await flush();

    expect(mockedAxios.get).toHaveBeenCalledWith("https://example.com/f.pdf", {
      responseType: "blob",
    });
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("fetches blob for root-relative URL", async () => {
    const blob = new Blob(["x"]);
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const { result } = renderHook(() => useDownload());
    await result.current.download("/files/c.pdf");
    await flush();

    expect(mockedAxios.get).toHaveBeenCalledWith("/files/c.pdf", {
      responseType: "blob",
    });
  });

  it("falls back to arraybuffer for non-URL args", async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: new ArrayBuffer(8),
      headers: { "content-type": "application/pdf" },
    });

    const { result } = renderHook(() => useDownload());
    await result.current.download("some-key");
    await flush();

    expect(mockedAxios.get).toHaveBeenCalledWith("/file/download", {
      params: { args: "some-key" },
      responseType: "arraybuffer",
    });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("JSON fallback — downloadFileResponse field", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("ab fail"))
      .mockResolvedValueOnce({
        data: { downloadFileResponse: btoa("hi") },
        headers: { "content-type": "application/pdf" },
      });

    const { result } = renderHook(() => useDownload());
    await result.current.download("key");
    await flush();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("JSON fallback — file field", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("ab fail"))
      .mockResolvedValueOnce({ data: { file: btoa("hi") }, headers: {} });

    const { result } = renderHook(() => useDownload());
    await result.current.download("key");
    await flush();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("JSON fallback — data field", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("ab fail"))
      .mockResolvedValueOnce({ data: { data: btoa("hi") }, headers: {} });

    const { result } = renderHook(() => useDownload());
    await result.current.download("key");
    await flush();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("JSON fallback — raw string body", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("ab fail"))
      .mockResolvedValueOnce({ data: btoa("raw"), headers: {} });

    const { result } = renderHook(() => useDownload());
    await result.current.download("key");
    await flush();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("logs error and skips download when both fetches fail (unparseable)", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("ab fail"))
      .mockResolvedValueOnce({ data: { weird: true }, headers: {} });

    const { result } = renderHook(() => useDownload());
    await result.current.download("key");
    await flush();

    expect(console.error).toHaveBeenCalled();
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("logs error when fetch rejects completely", async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useDownload());
    await result.current.download("https://fail.com/f");
    await flush();

    expect(console.error).toHaveBeenCalled();
  });
});
