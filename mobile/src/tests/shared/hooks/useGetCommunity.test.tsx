/**
 * Tests for useGetCommunity shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetCommunity } from "@shared/hooks/useGetCommunity";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockCommunities = [
  {
    businessFlags: null,
    communityId: 100,
    communityNameA: "الوسط",
    communityNameE: "Central Community",
    communityNumber: 1,
    districtId: 10,
    migNote: 0,
    municipalityId: 1,
    plotAppraisalGroupId: 5,
    sectorId: 3,
    urlArgs: null,
  },
  {
    businessFlags: null,
    communityId: 101,
    communityNameA: "الغرب",
    communityNameE: "West Community",
    communityNumber: 2,
    districtId: 10,
    migNote: 0,
    municipalityId: 1,
    plotAppraisalGroupId: 6,
    sectorId: 4,
    urlArgs: null,
  },
];

describe("useGetCommunity (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("is not enabled when districtId is undefined", () => {
    const { result } = renderHook(() => useGetCommunity(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when districtId is 0", () => {
    const { result } = renderHook(() => useGetCommunity(0), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns empty options when data is undefined", () => {
    const { result } = renderHook(() => useGetCommunity(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  it("fetches communities when districtId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCommunities });
    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/community/10");
  });

  it("transforms communities to options", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCommunities });
    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([
      { label: "Central Community", label_ar: "الوسط", value: "100" },
      { label: "West Community", label_ar: "الغرب", value: "101" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("returns empty array via refetch when districtId is undefined (covers if-guard branch)", async () => {
    const { result } = renderHook(() => useGetCommunity(undefined), {
      wrapper: createWrapper(),
    });
    // refetch bypasses enabled=false and executes the queryFn
    await result.current.refetch();
    // The if-guard returned [] without calling axios
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});