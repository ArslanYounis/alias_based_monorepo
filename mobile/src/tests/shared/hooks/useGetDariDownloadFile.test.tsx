/**
 * Tests for useGetDariDownloadFile shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetDariDownloadFile } from "@shared/hooks/useGetDariDownloadFile";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const params = {
  applicationID: "1",
  applicationType: "t",
  documentType: "d",
  subType: "s",
};

// Encode a JSON object into an arraybuffer the way the backend would.
function jsonToArrayBuffer(obj: unknown): ArrayBuffer {
  const text = JSON.stringify(obj);
  const u8 = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) u8[i] = text.charCodeAt(i);
  return u8.buffer;
}

describe("useGetDariDownloadFile (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when params undefined", () => {
    const { result } = renderHook(() => useGetDariDownloadFile(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("parses JSON arraybuffer response into a blob (CASE 1)", async () => {
    const ab = jsonToArrayBuffer({
      result: { bytes: "aGVsbG8=", fileName: "f.pdf", fileExtension: "application/pdf" },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: ab,
      headers: { "content-type": "application/json" },
    });

    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("dari/file/doc-download", {
      params,
      responseType: "arraybuffer",
    });
    expect(result.current.data?.fileName).toBe("f.pdf");
    expect(result.current.data?.blob).toBeInstanceOf(Blob);
  });

  it("falls back to default fileName when JSON has no fileName", async () => {
    const ab = jsonToArrayBuffer({ result: { bytes: "aGVsbG8=" } });
    mockedAxios.get.mockResolvedValueOnce({
      data: ab,
      headers: { "content-type": "application/json" },
    });

    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.fileName).toBe("document");
  });

  it("errors when JSON response is missing bytes", async () => {
    const ab = jsonToArrayBuffer({ result: {} });
    mockedAxios.get.mockResolvedValueOnce({
      data: ab,
      headers: { "content-type": "application/json" },
    });

    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("returns raw file blob when content-type is not JSON (CASE 2)", async () => {
    const u8 = new Uint8Array([1, 2, 3]);
    mockedAxios.get.mockResolvedValueOnce({
      data: u8.buffer,
      headers: { "content-type": "application/pdf" },
    });

    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.fileName).toBe("document");
    expect(result.current.data?.blob).toBeInstanceOf(Blob);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useGetDariDownloadFile(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
