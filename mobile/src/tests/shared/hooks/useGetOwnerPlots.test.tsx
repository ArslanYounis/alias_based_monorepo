/**
 * Tests for useGetOwnerPlots shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetOwnerPlots, getOwnerPlots } from "@shared/hooks/useGetOwnerPlots";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockOwnerPlotsResponse = {
  ownerPlots: [
    { id: "1", plotId: "P-001", communityName: "Central", districtname: "Zone A", landuseName: "Residential" },
    { id: "2", plotId: "P-002", communityName: "East", districtname: "Zone B", landuseName: "Commercial" },
  ],
  totalCount: 2,
  pageNumber: 1,
  pageSize: 10,
};

describe("useGetOwnerPlots (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Disabled by default ───────────────────────────────────────────────────
  // The hook has enabled: false, so it never auto-fetches

  it("is always disabled (enabled: false) even when ownerId is provided", () => {
    const { result } = renderHook(() => useGetOwnerPlots("OWN-001"), {
      wrapper: createWrapper(),
    });
    // fetchStatus is 'idle' because enabled: false
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns a query object with refetch function", () => {
    const { result } = renderHook(() => useGetOwnerPlots("OWN-001"), {
      wrapper: createWrapper(),
    });
    expect(result.current).toHaveProperty("refetch");
    expect(typeof result.current.refetch).toBe("function");
  });

  it("fetches owner plots when refetch is called manually", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerPlotsResponse });
    const { result } = renderHook(() => useGetOwnerPlots("OWN-001"), {
      wrapper: createWrapper(),
    });

    result.current.refetch();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockOwnerPlotsResponse);
    expect(mockedAxios.get).toHaveBeenCalledWith("owner/plots", {
      params: { ownerId: "OWN-001" },
    });
  });

  it("sets isError when API call fails on manual refetch", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
    const { result } = renderHook(() => useGetOwnerPlots("OWN-001"), {
      wrapper: createWrapper(),
    });

    result.current.refetch();
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getOwnerPlots (exported function)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls the correct API endpoint with ownerId param", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerPlotsResponse });
    await getOwnerPlots("OWN-001");

    expect(mockedAxios.get).toHaveBeenCalledWith("owner/plots", {
      params: { ownerId: "OWN-001" },
    });
  });

  it("returns the owner plots data", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerPlotsResponse });
    const result = await getOwnerPlots("OWN-001");
    expect(result).toEqual(mockOwnerPlotsResponse);
  });

  it("throws when API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    await expect(getOwnerPlots("OWN-FAIL")).rejects.toThrow("API Error");
  });
});
