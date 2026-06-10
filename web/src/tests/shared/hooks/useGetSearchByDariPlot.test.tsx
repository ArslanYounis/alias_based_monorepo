import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useGetSearchByDariPlot,
  getSearchByDariPlot,
  type DariPlotSearchParams,
} from "@shared/hooks/useGetSearchByDariPlot";

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

const mockResponse = {
  result: {
    properties: [
      {
        plotID: 1,
        communityID: 10,
        plotNumber: "P-1",
        landUseNameEn: "Residential",
        landUseNameAr: "سكني",
        communityNameEn: "Community",
        communityNameAr: "مجتمع",
        isMortgaged: false,
      },
    ],
    totalCount: 1,
    pageNumber: 1,
  },
  pageSize: 10,
};

const enabledParams: DariPlotSearchParams = { page: 1, pageSize: 10 };

describe("useGetSearchByDariPlot", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when page is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByDariPlot({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy", () => {
    renderHook(() => useGetSearchByDariPlot({ page: 1, pageSize: 0 }), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it("fetches via POST when page and pageSize set", async () => {
    mockedAxios.post.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useGetSearchByDariPlot(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "dari/property/properties",
      enabledParams
    );
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.result.properties).toHaveLength(1);
    expect(result.current.data?.pageSize).toBe(10);
  });

  it("sets isError on failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useGetSearchByDariPlot(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByDariPlot (standalone)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts params as body and returns data", async () => {
    mockedAxios.post.mockResolvedValue({ data: mockResponse });
    const res = await getSearchByDariPlot({
      page: 2,
      pageSize: 5,
      plotNumber: "P-9",
    });
    expect(mockedAxios.post).toHaveBeenCalledWith("dari/property/properties", {
      page: 2,
      pageSize: 5,
      plotNumber: "P-9",
    });
    expect(res).toEqual(mockResponse);
  });
});
