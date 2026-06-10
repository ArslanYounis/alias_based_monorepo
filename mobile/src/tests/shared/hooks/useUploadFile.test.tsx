/**
 * Tests for useUploadFile shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useUploadFile } from "@shared/hooks/useUploadFile";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const payload = {
  name: "doc",
  file: {
    file_name: "a.pdf",
    file_type: "application/pdf",
    file_content: "base64data",
    file_identifier: "id-1",
    file_extension: "pdf",
  },
};

describe("useUploadFile (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("uploads file successfully and posts to /file/upload with args param", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });
    const { result } = renderHook(() => useUploadFile(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ payload, uploadUrl: "upload/here" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith("/file/upload", payload, {
      params: { args: "upload/here" },
    });
    expect(result.current.data).toEqual({ ok: true });
  });

  it("sets isError when upload fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useUploadFile(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ payload });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
