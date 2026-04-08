/**
 * Tests for useGetSearchByPlot shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useGetSearchByPlot,
  getSearchByPlot,
} from "@shared/hooks/useGetSearchByPlot";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockPlotResponse = {
  items: [
    {
      plotId: 1001,
      plotNumber: "P-001",
      landUseName: "Residential",
      districtName: "Central",
    },
  ],
  totalCount: 1,
  pageNumber: 1,
  pageSize: 10,
};

describe("useGetSearchByPlot (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("is not enabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByPlot({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize is 0/undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByPlot({ pageNumber: 1 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches plot search results when params are valid", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPlotResponse });
    const { result } = renderHook(
      () => useGetSearchByPlot({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPlotResponse);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(
      () => useGetSearchByPlot({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByPlot (exported function)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("filters out empty string, null, and undefined values", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPlotResponse });
    await getSearchByPlot({
      pageNumber: 1,
      pageSize: 10,
      municipality: "",
      plotNumber: undefined,
      landuseId: null as unknown as string,
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "plot/search",
      expect.objectContaining({
        params: { pageNumber: 1, pageSize: 10 },
      })
    );
  });

  it("returns the full paginated response", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPlotResponse });
    const result = await getSearchByPlot({ pageNumber: 1, pageSize: 10 });
    expect(result).toEqual(mockPlotResponse);
  });

  it("passes all non-empty params to API", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPlotResponse });
    await getSearchByPlot({
      pageNumber: 1,
      pageSize: 10,
      municipality: "ABD",
      plotNumber: "P-001",
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "plot/search",
      expect.objectContaining({
        params: expect.objectContaining({
          municipality: "ABD",
          plotNumber: "P-001",
        }),
      })
    );
  });
});
