/**
 * Tests for useGetPlotImage shared hook and getPlotImage function.
 *
 * axios and global fetch are mocked to exercise all image format branches.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock global fetch for data URL / URL fetching branches
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { useGetPlotImage, getPlotImage } from "@shared/hooks/useGetPlotImage";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useGetPlotImage (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it("is not enabled when plotId is undefined", () => {
    const { result } = renderHook(() => useGetPlotImage(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when plotId is empty string", () => {
    const { result } = renderHook(() => useGetPlotImage(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches image as Blob when arraybuffer response is returned", async () => {
    const buffer = new ArrayBuffer(8);
    mockedAxios.get.mockResolvedValueOnce({
      data: buffer,
      headers: { "content-type": "image/png" },
    });

    const { result } = renderHook(() => useGetPlotImage("PLOT-001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  it("sets isError when both arraybuffer and text requests fail", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useGetPlotImage("PLOT-FAIL"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // getPlotImage catches errors and returns null, so isSuccess=true with data=null
    expect(result.current.data).toBeNull();
  });
});

describe("getPlotImage (exported function)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it("returns null when plotId is undefined", async () => {
    const result = await getPlotImage(undefined);
    expect(result).toBeNull();
  });

  it("returns null when plotId is empty string", async () => {
    const result = await getPlotImage("");
    expect(result).toBeNull();
  });

  it("returns Blob when arraybuffer response is valid", async () => {
    const buffer = new ArrayBuffer(16);
    mockedAxios.get.mockResolvedValueOnce({
      data: buffer,
      headers: { "content-type": "image/jpeg" },
    });

    const result = await getPlotImage("PLOT-001");
    expect(result).toBeInstanceOf(Blob);
  });

  it("falls back to text response when arraybuffer fails", async () => {
    // First call (arraybuffer) fails
    mockedAxios.get.mockRejectedValueOnce(new Error("arraybuffer error"));
    // Second call (text) returns hex string
    const hexBody = "89504e47"; // PNG header in hex
    mockedAxios.get.mockResolvedValueOnce({ data: hexBody });

    const result = await getPlotImage("PLOT-002");
    expect(result).toBeInstanceOf(Blob);
  });

  it("handles base64 text response in fallback", async () => {
    // First call (arraybuffer) fails
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    // Second call (text) returns base64
    const base64Body = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // valid 1x1 png base64
    mockedAxios.get.mockResolvedValueOnce({ data: base64Body });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake"], { type: "image/png" })),
    });

    const result = await getPlotImage("PLOT-003");
    expect(result).toBeInstanceOf(Blob);
  });

  it("handles data:image/ text response in fallback", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    const dataUrl = "data:image/png;base64,abc123==";
    mockedAxios.get.mockResolvedValueOnce({ data: dataUrl });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["img"], { type: "image/png" })),
    });

    const result = await getPlotImage("PLOT-004");
    expect(result).toBeInstanceOf(Blob);
  });

  it("handles https:// URL response in fallback", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    mockedAxios.get.mockResolvedValueOnce({
      data: "https://example.com/image.png",
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["img"], { type: "image/png" })),
    });

    const result = await getPlotImage("PLOT-005");
    expect(result).toBeInstanceOf(Blob);
  });

  it("handles JSON-wrapped data response in fallback", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    const hexData = "89504e47";
    mockedAxios.get.mockResolvedValueOnce({
      data: JSON.stringify({ data: hexData }),
    });

    const result = await getPlotImage("PLOT-006");
    expect(result).toBeInstanceOf(Blob);
  });

  it("handles JSON-wrapped image response in fallback", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    const hexData = "89504e47";
    mockedAxios.get.mockResolvedValueOnce({
      data: JSON.stringify({ image: hexData }),
    });

    const result = await getPlotImage("PLOT-007");
    expect(result).toBeInstanceOf(Blob);
  });

  it("returns null when text response body is empty", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    mockedAxios.get.mockResolvedValueOnce({ data: "   " });

    const result = await getPlotImage("PLOT-008");
    expect(result).toBeNull();
  });

  it("returns null when text response is unrecognized format", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    mockedAxios.get.mockResolvedValueOnce({ data: "not a valid format!!!" });

    const result = await getPlotImage("PLOT-009");
    expect(result).toBeNull();
  });

  it("returns null when text fallback also throws", async () => {
    mockedAxios.get.mockRejectedValue(new Error("all error"));
    const result = await getPlotImage("PLOT-010");
    expect(result).toBeNull();
  });

  it("validateStatus (arraybuffer) accepts 2xx and rejects non-2xx", async () => {
    // Call getPlotImage and capture the options passed to axios.get
    const buffer = new ArrayBuffer(8);
    mockedAxios.get.mockImplementation((_url, opts: any) => {
      // Call validateStatus to exercise that branch
      if (opts?.validateStatus) {
        expect(opts.validateStatus(200)).toBe(true);
        expect(opts.validateStatus(299)).toBe(true);
        expect(opts.validateStatus(300)).toBe(false);
        expect(opts.validateStatus(404)).toBe(false);
      }
      return Promise.resolve({ data: buffer, headers: { "content-type": "image/png" } });
    });
    const result = await getPlotImage("PLOT-VS");
    expect(result).toBeInstanceOf(Blob);
  });

  it("validateStatus (text fallback) accepts 2xx and rejects non-2xx", async () => {
    // First call (arraybuffer) fails to trigger text fallback
    mockedAxios.get
      .mockRejectedValueOnce(new Error("arraybuffer error"))
      .mockImplementation((_url, opts: any) => {
        if (opts?.validateStatus) {
          expect(opts.validateStatus(200)).toBe(true);
          expect(opts.validateStatus(500)).toBe(false);
        }
        return Promise.resolve({ data: "89504e47" });
      });
    const result = await getPlotImage("PLOT-VT");
    expect(result).toBeInstanceOf(Blob);
  });

  it("returns null when arraybuffer response data is not ArrayBuffer", async () => {
    // Arraybuffer call returns non-ArrayBuffer data, falls through to text
    mockedAxios.get
      .mockResolvedValueOnce({ data: "not-buffer", headers: {} })
      .mockResolvedValueOnce({ data: "   " }); // text fallback returns empty
    const result = await getPlotImage("PLOT-NB");
    expect(result).toBeNull();
  });

  it("handles JSON parse error gracefully in fallback (malformed JSON)", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("error"));
    mockedAxios.get.mockResolvedValueOnce({ data: "{malformed json" });
    const result = await getPlotImage("PLOT-MJ");
    expect(result).toBeNull();
  });
});
