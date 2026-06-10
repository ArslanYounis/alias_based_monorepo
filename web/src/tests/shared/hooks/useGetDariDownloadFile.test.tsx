import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetDariDownloadFile } from "@shared/hooks/useGetDariDownloadFile";

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

const params = {
  applicationID: "A-1",
  applicationType: "T",
  documentType: "D",
  subType: "S",
};

const jsonToArrayBuffer = (obj: unknown) =>
  new TextEncoder().encode(JSON.stringify(obj)).buffer;

describe("useGetDariDownloadFile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when params is undefined", () => {
    const { result } = renderHook(() => useGetDariDownloadFile(undefined), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("requests arraybuffer with params when enabled", async () => {
    mockedAxios.get.mockResolvedValue({
      data: new ArrayBuffer(4),
      headers: { "content-type": "application/pdf" },
    });
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("dari/file/doc-download", {
      params,
      responseType: "arraybuffer",
    });
  });

  it("returns a real-file blob when response is not JSON", async () => {
    mockedAxios.get.mockResolvedValue({
      data: new ArrayBuffer(8),
      headers: { "content-type": "application/pdf" },
    });
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.blob).toBeInstanceOf(Blob);
    expect(result.current.data?.blob.type).toBe("application/pdf");
    expect(result.current.data?.fileName).toBe("document");
  });

  it("decodes JSON arraybuffer and builds blob from base64 bytes", async () => {
    const payload = {
      result: {
        bytes: btoa("hello world"),
        fileName: "report.pdf",
        fileExtension: "application/pdf",
      },
    };
    mockedAxios.get.mockResolvedValue({
      data: jsonToArrayBuffer(payload),
      headers: { "content-type": "application/json" },
    });
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.fileName).toBe("report.pdf");
    expect(result.current.data?.blob).toBeInstanceOf(Blob);
    expect(result.current.data?.blob.type).toBe("application/pdf");
  });

  it("falls back to defaults for fileName/fileType in JSON case", async () => {
    const payload = { result: { bytes: btoa("data") } };
    mockedAxios.get.mockResolvedValue({
      data: jsonToArrayBuffer(payload),
      headers: { "content-type": "text/json" },
    });
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.fileName).toBe("document");
    expect(result.current.data?.blob.type).toBe("application/octet-stream");
  });

  it("errors when JSON response has no bytes", async () => {
    const payload = { result: {} };
    mockedAxios.get.mockResolvedValue({
      data: jsonToArrayBuffer(payload),
      headers: { "content-type": "application/json" },
    });
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("sets isError when request fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
