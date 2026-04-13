import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useGetSearchByPlot,
  getSearchByPlot,
  type PlotSearchParams,
} from "@shared/hooks/useGetSearchByPlot";

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

const mockPaginatedPlotResponse = {
  items: [
    {
      plotId: 1001,
      communityId: 5,
      code: "PLT-001",
      plotNumber: "P-001",
      landUseName: "Residential",
      landUseName_ar: "سكني",
      districtName: "Central",
      districtName_ar: "المركز",
      communityName: "Downtown",
      hasMortgage: false,
      backgroundColor: "#FFFFFF",
      ownerId: "O-001",
    },
  ],
  totalCount: 1,
  pageNumber: 1,
  pageSize: 10,
};

const enabledParams: PlotSearchParams = {
  municipality: "1",
  plotNumber: "P-001",
  pageNumber: 1,
  pageSize: 10,
};

describe("useGetSearchByPlot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByPlot({ municipality: "1", plotNumber: "P-001" }),
      { wrapper: createWrapper() }
    );

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy (0)", () => {
    const { result } = renderHook(
      () =>
        useGetSearchByPlot({ municipality: "1", pageNumber: 1, pageSize: 0 }),
      { wrapper: createWrapper() }
    );

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches plots when pageNumber and pageSize are set", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedPlotResponse });

    const { result } = renderHook(
      () => useGetSearchByPlot(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "plot/search",
      expect.objectContaining({ params: expect.any(Object) })
    );
    expect(result.current.data).toEqual(mockPaginatedPlotResponse);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedPlotResponse });

    const { result } = renderHook(
      () => useGetSearchByPlot(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].plotId).toBe(1001);
    expect(result.current.data?.totalCount).toBe(1);
    expect(result.current.data?.pageNumber).toBe(1);
    expect(result.current.data?.pageSize).toBe(10);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(
      () => useGetSearchByPlot(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("getSearchByPlot (standalone)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters out empty string, null, and undefined values from params", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedPlotResponse });

    await getSearchByPlot({
      municipality: "1",
      plotNumber: "P-001",
      zone: "",
      landuseId: undefined,
      roadId: null as any,
      pageNumber: 1,
      pageSize: 10,
    });

    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).not.toHaveProperty("zone");
    expect(callParams).not.toHaveProperty("landuseId");
    expect(callParams).not.toHaveProperty("roadId");
    expect(callParams).toHaveProperty("municipality", "1");
    expect(callParams).toHaveProperty("plotNumber", "P-001");
  });

  it("passes all non-empty params to the API", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedPlotResponse });

    await getSearchByPlot({
      municipality: "2",
      landuseId: "R1",
      plotNumber: "P-999",
      pageNumber: 3,
      pageSize: 20,
    });

    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).toMatchObject({
      municipality: "2",
      landuseId: "R1",
      plotNumber: "P-999",
      pageNumber: 3,
      pageSize: 20,
    });
  });

  it("returns data directly (not wrapped in result)", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedPlotResponse });

    const result = await getSearchByPlot(enabledParams);
    expect(result).toEqual(mockPaginatedPlotResponse);
    expect(result.items).toBeDefined();
  });
});
