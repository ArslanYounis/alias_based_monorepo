/**
 * Tests for useGetSearchByDariPlot shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useGetSearchByDariPlot,
  getSearchByDariPlot,
} from "@shared/hooks/useGetSearchByDariPlot";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse = {
  result: {
    properties: [{ plotID: 1, plotNumber: "P-1" }],
    totalCount: 1,
    pageNumber: 0,
  },
  pageSize: 10,
};

describe("useGetSearchByDariPlot (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when page undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByDariPlot({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize undefined", () => {
    const { result } = renderHook(() => useGetSearchByDariPlot({ page: 0 }), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("posts params and returns data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(
      () => useGetSearchByDariPlot({ page: 0, pageSize: 10, plotNumber: "P-1" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith("dari/property/properties", {
      page: 0,
      pageSize: 10,
      plotNumber: "P-1",
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(
      () => useGetSearchByDariPlot({ page: 0, pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByDariPlot (standalone)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns full response data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    const res = await getSearchByDariPlot({ page: 0, pageSize: 10 });
    expect(res).toEqual(mockResponse);
  });
});
