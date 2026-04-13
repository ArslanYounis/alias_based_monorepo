import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetCommunity } from "@shared/hooks/useGetCommunity";

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

const mockCommunities = [
  {
    businessFlags: null,
    communityId: 1,
    communityNameA: "مجتمع 1",
    communityNameE: "Community One",
    communityNumber: 101,
    districtId: 10,
    migNote: 0,
    municipalityId: 5,
    plotAppraisalGroupId: 3,
    sectorId: 2,
    urlArgs: null,
  },
  {
    businessFlags: null,
    communityId: 2,
    communityNameA: "مجتمع 2",
    communityNameE: "Community Two",
    communityNumber: 102,
    districtId: 10,
    migNote: 0,
    municipalityId: 5,
    plotAppraisalGroupId: 4,
    sectorId: 2,
    urlArgs: null,
  },
];

describe("useGetCommunity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled and returns empty options when no districtId is provided", () => {
    const { result } = renderHook(() => useGetCommunity(), {
      wrapper: createWrapper(),
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.options).toEqual([]);
  });

  it("fetches communities when districtId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCommunities });

    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/community/10");
    expect(result.current.data).toEqual(mockCommunities);
  });

  it("maps communities to options with label, label_ar, and value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCommunities });

    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "Community One", label_ar: "مجتمع 1", value: "1" },
      { label: "Community Two", label_ar: "مجتمع 2", value: "2" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("uses districtId in the URL path", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCommunities });

    const { result } = renderHook(() => useGetCommunity(99), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/community/99");
  });

  it("spreads all query properties in the return value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCommunities });

    const { result } = renderHook(() => useGetCommunity(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("options");
  });
});
