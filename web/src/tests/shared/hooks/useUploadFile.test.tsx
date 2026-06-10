import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useUploadFile,
  type UploadFileArgs,
} from "@shared/hooks/useUploadFile";

vi.mock("axios");
const mockedAxios = axios as any;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const args: UploadFileArgs = {
  payload: {
    name: "doc",
    file: {
      file_name: "doc.pdf",
      file_type: "application/pdf",
      file_content: "base64data",
      file_identifier: "id-1",
      file_extension: "pdf",
    },
  },
  uploadUrl: "upload-token",
};

describe("useUploadFile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts payload and resolves with response data on success", async () => {
    mockedAxios.post.mockResolvedValue({ data: { uploaded: true } });
    const { result } = renderHook(() => useUploadFile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(args);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith("/file/upload", args.payload, {
      params: { args: "upload-token" },
    });
    expect(result.current.data).toEqual({ uploaded: true });
  });

  it("passes undefined args param when uploadUrl missing", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useUploadFile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: args.payload });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith("/file/upload", args.payload, {
      params: { args: undefined },
    });
  });

  it("sets isError when upload fails", async () => {
    mockedAxios.post.mockRejectedValue(new Error("upload failed"));
    const { result } = renderHook(() => useUploadFile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(args);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
