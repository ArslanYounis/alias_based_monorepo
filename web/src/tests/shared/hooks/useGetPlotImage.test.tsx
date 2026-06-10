import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetPlotImage, getPlotImage } from "@shared/hooks/useGetPlotImage";

vi.mock("axios");
const mockedAxios = axios as any;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetPlotImage (hook)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled when no plotId is provided", () => {
    const { result } = renderHook(() => useGetPlotImage(), {
      wrapper: createWrapper(),
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });

  it("fetches image blob when plotId is provided", async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    mockedAxios.get.mockResolvedValue({
      data: mockArrayBuffer,
      headers: { "content-type": "image/png" },
    });

    const { result } = renderHook(() => useGetPlotImage("plot-001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/document/thumbnail",
      expect.objectContaining({ params: { args: "plot-001" } })
    );
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  it("is loading initially when plotId is provided", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useGetPlotImage("plot-002"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

describe("getPlotImage (standalone function)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when no plotId is provided", async () => {
    const result = await getPlotImage(undefined);
    expect(result).toBeNull();
  });

  it("returns null when plotId is empty string", async () => {
    const result = await getPlotImage("");
    expect(result).toBeNull();
  });

  it("returns a Blob from arraybuffer response", async () => {
    const buffer = new ArrayBuffer(16);
    mockedAxios.get.mockResolvedValueOnce({
      data: buffer,
      headers: { "content-type": "image/png" },
    });

    const result = await getPlotImage("plot-123");
    expect(result).toBeInstanceOf(Blob);
  });

  it("falls back to text response and handles base64 data", async () => {
    // First call (arraybuffer) fails
    mockedAxios.get.mockRejectedValueOnce(new Error("arraybuffer fail"));

    // Second call (text) returns base64
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockedAxios.get.mockResolvedValueOnce({ data: base64 });

    // Mock global fetch for the data URL conversion
    const mockBlob = new Blob(["fake-image"], { type: "image/png" });
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await getPlotImage("plot-base64");
    expect(result).toBeInstanceOf(Blob);

    fetchSpy.mockRestore();
  });

  it("returns null when text response is empty", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("arraybuffer fail"));
    mockedAxios.get.mockResolvedValueOnce({ data: "   " });

    const result = await getPlotImage("plot-empty");
    expect(result).toBeNull();
  });

  it("handles hex string response", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("arraybuffer fail"));
    // Valid hex string (PNG magic bytes in hex)
    mockedAxios.get.mockResolvedValueOnce({ data: "89504e470d0a1a0a" });

    const result = await getPlotImage("plot-hex");
    expect(result).toBeInstanceOf(Blob);
  });

  it("handles data URL response", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("arraybuffer fail"));
    const dataUrl = "data:image/png;base64,abc=";
    mockedAxios.get.mockResolvedValueOnce({ data: dataUrl });

    const mockBlob = new Blob(["img"], { type: "image/png" });
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await getPlotImage("plot-dataurl");
    expect(result).toBeInstanceOf(Blob);

    fetchSpy.mockRestore();
  });

  it("handles JSON-wrapped response with data field", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("arraybuffer fail"));
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockedAxios.get.mockResolvedValueOnce({
      data: JSON.stringify({ data: base64 }),
    });

    const mockBlob = new Blob(["img"], { type: "image/png" });
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await getPlotImage("plot-json-data");
    expect(result).toBeInstanceOf(Blob);

    fetchSpy.mockRestore();
  });
});
