/**
 * Tests for useGetPlotDetail shared hook.
 *
 * The hook uses useQueries and supports both single plotId and array of plotIds.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import useGetPlotDetail from "@shared/hooks/useGetPlotDetail";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockPlotDetail = {
  ownersList: { ownerNameE: "John", ownerNameA: "جون" },
  plotAddress: "123 Main St",
  plotNumber: "P-001",
  plotFileNumber: "F-001",
  plotAreaFeet: "5000",
  plotAreaSquareMeter: "465",
  community: { communityNameE: "Central", communityNameA: "الوسط" },
  district: { districtNameE: "Zone A", districtNameA: "منطقة أ" },
};

describe("useGetPlotDetail (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Single plotId (string) ────────────────────────────────────────────────

  it("fetches a single plot detail when given a string plotId", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPlotDetail });
    const { result } = renderHook(() => useGetPlotDetail("P-001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPlotDetail);
    expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/P-001");
  });

  it("fetches a single plot detail when given a number plotId", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPlotDetail });
    const { result } = renderHook(() => useGetPlotDetail(1001), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/1001");
  });

  it("returns fallback object when plotId is null/undefined (single mode)", () => {
    const { result } = renderHook(
      () => useGetPlotDetail(undefined as unknown as string),
      { wrapper: createWrapper() }
    );
    // With empty array, should return the fallback object
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
  });

  it("sets isError when single plot API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => useGetPlotDetail("P-FAIL"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  // ── Array of plotIds ──────────────────────────────────────────────────────

  it("fetches multiple plots when given an array of plotIds", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { ...mockPlotDetail, plotNumber: "P-001" } })
      .mockResolvedValueOnce({ data: { ...mockPlotDetail, plotNumber: "P-002" } });

    const { result } = renderHook(() => useGetPlotDetail(["P-001", "P-002"]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const r = result.current as { data: unknown[]; isPending: boolean };
      return !r.isPending && Array.isArray(r.data) && r.data.length === 2;
    });

    expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/P-001");
    expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/P-002");
  });

  it("returns array format when input is an array", () => {
    const { result } = renderHook(() => useGetPlotDetail(["P-001"]), {
      wrapper: createWrapper(),
    });
    const r = result.current as { data: unknown[]; isPending: boolean; queries: unknown[] };
    expect(Array.isArray(r.data)).toBe(true);
    expect(r).toHaveProperty("queries");
  });

  it("returns empty data array when plotIds array is empty", () => {
    const { result } = renderHook(() => useGetPlotDetail([]), {
      wrapper: createWrapper(),
    });
    const r = result.current as { data: unknown[]; isPending: boolean };
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data).toHaveLength(0);
  });

  it("returns isPending=true when some queries are pending", () => {
    mockedAxios.get.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );
    const { result } = renderHook(() => useGetPlotDetail(["P-001", "P-002"]), {
      wrapper: createWrapper(),
    });
    const r = result.current as { isPending: boolean };
    expect(r.isPending).toBe(true);
  });
});
