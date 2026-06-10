import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import useGetPlotDetail from "@shared/hooks/useGetPlotDetail";

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

const mockPlotDetail = {
  ownersList: {
    ownerNameE: "John Doe",
    ownerNameA: "جون دو",
    nationalityId: "784",
    moiUnifiedNumber: "123456789",
    plotShares: [{ share: "100", rightsHoldType: { rightsHoldTypeNameE: "Owner" } }],
  },
  plotAddress: "123 Main St",
  plotNumber: "P-001",
  plotFileNumber: "PF-001",
  plotAreaFeet: "5000",
  plotAreaSquareMeter: "465",
  constructionStatusE: "Built",
  constructionStatusA: "مبني",
  community: { communityNameE: "Downtown", communityNameA: "وسط المدينة" },
  district: { districtNameE: "Central", districtNameA: "المركز" },
  municipality: { municipalityNameE: "Abu Dhabi", municipalityNameA: "أبوظبي" },
  landUse: { landuseNameE: "Residential", landuseNameA: "سكني" },
  owners: [{ ownerNameE: "John Doe", ownershipPercent: 100 }],
};

describe("useGetPlotDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("single plotId (string)", () => {
    it("fetches plot detail for a single string plotId", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPlotDetail });

      const { result } = renderHook(() => useGetPlotDetail("123"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/123");
      expect(result.current.data).toEqual(mockPlotDetail);
    });

    it("fetches plot detail for a single numeric plotId", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPlotDetail });

      const { result } = renderHook(() => useGetPlotDetail(456), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/456");
    });

    it("returns correct data shape for single plotId", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPlotDetail });

      const { result } = renderHook(() => useGetPlotDetail("123"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const data = result.current.data as typeof mockPlotDetail;
      expect(data.plotNumber).toBe("P-001");
      expect(data.community?.communityNameE).toBe("Downtown");
      expect(data.owners).toHaveLength(1);
    });

    it("sets isError on failure for single plotId", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Not found"));

      const { result } = renderHook(() => useGetPlotDetail("999"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe("array of plotIds", () => {
    it("calls the API for each plotId in the array", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPlotDetail });

      renderHook(() => useGetPlotDetail(["100", "200"]), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      });

      expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/100");
      expect(mockedAxios.get).toHaveBeenCalledWith("/plot/detail/200");
    });

    it("returns array-format result for array input (data, isPending, isError, queries)", () => {
      mockedAxios.get.mockReturnValue(new Promise(() => {})); // pending forever

      const { result } = renderHook(() => useGetPlotDetail(["100", "200"]), {
        wrapper: createWrapper(),
      });

      const r = result.current as any;
      // array input returns the array-format shape
      expect(r).toHaveProperty("data");
      expect(r).toHaveProperty("isPending");
      expect(r).toHaveProperty("isError");
      expect(r).toHaveProperty("queries");
      expect(Array.isArray(r.data)).toBe(true);
      expect(Array.isArray(r.queries)).toBe(true);
    });

    it("returns empty data array for empty plotIds array", () => {
      const { result } = renderHook(() => useGetPlotDetail([]), {
        wrapper: createWrapper(),
      });

      const r = result.current as any;
      expect(r.data).toEqual([]);
      expect(r.isPending).toBe(false);
    });

    it("isPending is true while any query is loading", () => {
      mockedAxios.get.mockReturnValue(new Promise(() => {})); // never resolves

      const { result } = renderHook(() => useGetPlotDetail(["100", "200"]), {
        wrapper: createWrapper(),
      });

      const r = result.current as any;
      expect(r.isPending).toBe(true);
    });
  });

  describe("fallback for undefined/null", () => {
    it("handles null/undefined plotId gracefully", () => {
      const { result } = renderHook(
        () => useGetPlotDetail(null as any),
        { wrapper: createWrapper() }
      );

      const r = result.current as any;
      expect(r).toBeDefined();
    });
  });
});
