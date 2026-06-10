import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

import { useDariDownload } from "@/hooks/useDariDownload";

const flush = () => new Promise((r) => setTimeout(r, 50));

const params = {
  applicationID: "A-1",
  applicationType: "T",
  documentType: "D",
  subType: "S",
};

const jsonToArrayBuffer = (obj: unknown) =>
  new TextEncoder().encode(JSON.stringify(obj)).buffer;

describe("useDariDownload (web)", () => {
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test");
    global.URL.revokeObjectURL = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});

    clickSpy = vi.fn();
    vi.spyOn(document.body, "appendChild").mockImplementation((el: any) => {
      el.click = clickSpy;
      return el;
    });
  });

  it("returns a download function", () => {
    const { result } = renderHook(() => useDariDownload());
    expect(typeof result.current.download).toBe("function");
  });

  it("requests arraybuffer with params and downloads a real-file blob", async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: new ArrayBuffer(8),
      headers: { "content-type": "application/pdf" },
    });

    const { result } = renderHook(() => useDariDownload());
    await result.current.download(params);
    await flush();

    expect(mockedAxios.get).toHaveBeenCalledWith("dari/file/doc-download", {
      params,
      responseType: "arraybuffer",
    });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("decodes JSON arraybuffer and downloads with parsed fileName", async () => {
    const payload = {
      result: {
        bytes: btoa("hello"),
        fileName: "doc.pdf",
        fileExtension: "application/pdf",
      },
    };
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: jsonToArrayBuffer(payload),
      headers: { "content-type": "application/json" },
    });

    const { result } = renderHook(() => useDariDownload());
    await result.current.download(params);
    await flush();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("uses default fileName/type when JSON omits them", async () => {
    const payload = { result: { bytes: btoa("data") } };
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: jsonToArrayBuffer(payload),
      headers: { "content-type": "text/json" },
    });

    const { result } = renderHook(() => useDariDownload());
    await result.current.download(params);
    await flush();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("logs error and skips download when JSON has no bytes", async () => {
    const payload = { result: {} };
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: jsonToArrayBuffer(payload),
      headers: { "content-type": "application/json" },
    });

    const { result } = renderHook(() => useDariDownload());
    await result.current.download(params);
    await flush();

    expect(console.error).toHaveBeenCalled();
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("logs error when request fails", async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useDariDownload());
    await result.current.download(params);
    await flush();

    expect(console.error).toHaveBeenCalled();
  });
});
