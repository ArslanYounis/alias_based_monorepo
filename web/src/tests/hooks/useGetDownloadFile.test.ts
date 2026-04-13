import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useGetDownloadFile } from "@/hooks/useGetDownloadFile";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useGetDownloadFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test");
    global.URL.revokeObjectURL = vi.fn();
  });

  // ── Disabled when no args ──────────────────────────────────────────────────

  it("is disabled and returns undefined data when args is undefined", () => {
    const { result } = renderHook(() => useGetDownloadFile(undefined), {
      wrapper: makeWrapper(),
    });
    expect(result.current.data).toBeUndefined();
    // React Query v5: disabled queries have isPending=true but fetchStatus="idle"
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is disabled and returns undefined data when args is empty string", () => {
    const { result } = renderHook(() => useGetDownloadFile(""), {
      wrapper: makeWrapper(),
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe("idle");
  });

  // ── Full URL (direct blob fetch) ───────────────────────────────────────────

  it("fetches blob directly for full https:// URL", async () => {
    const blob = new Blob(["content"], { type: "application/pdf" });
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const { result } = renderHook(
      () => useGetDownloadFile("https://example.com/file.pdf"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://example.com/file.pdf",
      { responseType: "blob" }
    );
    expect(result.current.data).toBe(blob);
  });

  it("fetches blob directly for root-relative / URL", async () => {
    const blob = new Blob(["data"], { type: "image/png" });
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: blob });

    const { result } = renderHook(
      () => useGetDownloadFile("/files/image.png"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/files/image.png",
      { responseType: "blob" }
    );
  });

  // ── ArrayBuffer path ───────────────────────────────────────────────────────

  it("fetches arraybuffer for non-URL args and returns Blob", async () => {
    const arrayBuffer = new ArrayBuffer(8);
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: arrayBuffer,
      headers: { "content-type": "application/pdf" },
    });

    const { result } = renderHook(
      () => useGetDownloadFile("some-file-key"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/file/download",
      expect.objectContaining({ params: { args: "some-file-key" }, responseType: "arraybuffer" })
    );
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  it("blob gets correct content-type from response headers", async () => {
    const arrayBuffer = new ArrayBuffer(4);
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: arrayBuffer,
      headers: { "content-type": "image/jpeg" },
    });

    const { result } = renderHook(
      () => useGetDownloadFile("img-key"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const blob = result.current.data as Blob;
    expect(blob.type).toBe("image/jpeg");
  });

  // ── JSON fallback: object with downloadFileResponse ────────────────────────

  it("falls back to JSON and parses downloadFileResponse field", async () => {
    // First call (arraybuffer) fails, second call (json) succeeds
    const base64Data = btoa("hello world");
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("arraybuffer fail"))
      .mockResolvedValueOnce({
        data: { downloadFileResponse: base64Data },
        headers: { "content-type": "application/octet-stream" },
      });

    const { result } = renderHook(
      () => useGetDownloadFile("file-token"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  it("falls back to JSON and parses 'file' field", async () => {
    const base64Data = btoa("file content");
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("arraybuffer fail"))
      .mockResolvedValueOnce({
        data: { file: base64Data },
        headers: {},
      });

    const { result } = renderHook(
      () => useGetDownloadFile("token-2"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  it("falls back to JSON and parses 'data' field", async () => {
    const base64Data = btoa("data content");
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("arraybuffer fail"))
      .mockResolvedValueOnce({
        data: { data: base64Data },
        headers: {},
      });

    const { result } = renderHook(
      () => useGetDownloadFile("token-3"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  // ── JSON fallback: raw string ──────────────────────────────────────────────

  it("falls back to JSON and handles raw string response", async () => {
    const rawStr = btoa("raw binary");
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("arraybuffer fail"))
      .mockResolvedValueOnce({
        data: rawStr,
        headers: {},
      });

    const { result } = renderHook(
      () => useGetDownloadFile("token-raw"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeInstanceOf(Blob);
  });

  // ── Error path ────────────────────────────────────────────────────────────

  it("returns error state when both arraybuffer and JSON fallback fail", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("arraybuffer fail"))
      .mockResolvedValueOnce({
        data: { unrecognized: true },
        headers: {},
      });

    const { result } = renderHook(
      () => useGetDownloadFile("bad-token"),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  it("throws error when no args provided (query disabled)", () => {
    const { result } = renderHook(
      () => useGetDownloadFile(undefined),
      { wrapper: makeWrapper() }
    );
    // Query is disabled, so no error state
    expect(result.current.isError).toBe(false);
  });

  // ── Query key ────────────────────────────────────────────────────────────

  it("exposes standard react-query fields", () => {
    const { result } = renderHook(
      () => useGetDownloadFile("key"),
      { wrapper: makeWrapper() }
    );
    expect("data" in result.current).toBe(true);
    expect("isSuccess" in result.current).toBe(true);
    expect("isError" in result.current).toBe(true);
    expect("isPending" in result.current).toBe(true);
    expect("refetch" in result.current).toBe(true);
  });
});
