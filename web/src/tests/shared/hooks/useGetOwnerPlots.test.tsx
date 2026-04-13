import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetOwnerPlots, getOwnerPlots } from "@shared/hooks/useGetOwnerPlots";

vi.mock("axios");
const mockedAxios = axios as any;

// Each call returns a fresh QueryClient + wrapper to avoid cache leakage between tests
const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockOwnerPlotsResponse = {
  ownerPlots: [
    {
      id: "1",
      plotId: "P-001",
      communityName: "Downtown",
      districtname: "Central District",
      landuseName: "Residential",
    },
    {
      id: "2",
      plotId: "P-002",
      communityName: "Uptown",
      districtname: "North District",
      landuseName: "Commercial",
    },
  ],
  totalCount: 2,
  pageNumber: 1,
  pageSize: 10,
};

describe("useGetOwnerPlots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled by default (enabled: false) and does not auto-fetch", () => {
    const { result } = renderHook(() => useGetOwnerPlots("owner-123"), {
      wrapper: makeWrapper(),
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("exposes a refetch function", () => {
    const { result } = renderHook(() => useGetOwnerPlots("owner-abc"), {
      wrapper: makeWrapper(),
    });

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe("function");
  });

  it("has correct query properties in idle state", () => {
    const { result } = renderHook(() => useGetOwnerPlots("owner-123"), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("getOwnerPlots (standalone function)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls GET owner/plots with ownerId param", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockOwnerPlotsResponse });

    const result = await getOwnerPlots("owner-123");

    expect(mockedAxios.get).toHaveBeenCalledWith("owner/plots", {
      params: { ownerId: "owner-123" },
    });
    expect(result).toEqual(mockOwnerPlotsResponse);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockOwnerPlotsResponse });

    const result = await getOwnerPlots("owner-456");

    expect(result.ownerPlots).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.pageNumber).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.ownerPlots[0].communityName).toBe("Downtown");
  });

  it("throws on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Unauthorized"));

    await expect(getOwnerPlots("bad-owner")).rejects.toThrow("Unauthorized");
  });

  it("uses different ownerId values correctly", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockOwnerPlotsResponse });

    await getOwnerPlots("specific-owner");

    expect(mockedAxios.get).toHaveBeenCalledWith("owner/plots", {
      params: { ownerId: "specific-owner" },
    });
  });

  it("handles response with empty ownerPlots array", async () => {
    const emptyResponse = {
      ownerPlots: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
    };
    mockedAxios.get.mockResolvedValue({ data: emptyResponse });

    const result = await getOwnerPlots("owner-empty");
    expect(result.ownerPlots).toHaveLength(0);
    expect(result.totalCount).toBe(0);
  });
});
