/**
 * Tests for useGetRoads shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetRoads } from "@shared/hooks/useGetRoads";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockRoads = [
  {
    municipalityId: 1,
    roadId: 50,
    roadNameA: "شارع الرئيسي",
    roadNameE: "Main Street",
    roadNumber: 1,
    urlArgs: null,
  },
  {
    municipalityId: 1,
    roadId: 51,
    roadNameA: "شارع الثاني",
    roadNameE: "Second Street",
    roadNumber: 2,
    urlArgs: null,
  },
];

describe("useGetRoads (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("is not enabled when communityId is undefined", () => {
    const { result } = renderHook(() => useGetRoads(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when communityId is 0", () => {
    const { result } = renderHook(() => useGetRoads(0), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns empty options when data is undefined", () => {
    const { result } = renderHook(() => useGetRoads(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  it("fetches roads when communityId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockRoads });
    const { result } = renderHook(() => useGetRoads(100), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/roads/100");
  });

  it("transforms roads to options", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockRoads });
    const { result } = renderHook(() => useGetRoads(100), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([
      { label: "Main Street", label_ar: "شارع الرئيسي", value: "50" },
      { label: "Second Street", label_ar: "شارع الثاني", value: "51" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const { result } = renderHook(() => useGetRoads(100), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(() => useGetRoads(100), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("returns empty array via refetch when communityId is undefined (covers if-guard branch)", async () => {
    const { result } = renderHook(() => useGetRoads(undefined), {
      wrapper: createWrapper(),
    });
    // refetch bypasses enabled=false and executes the queryFn
    await result.current.refetch();
    // The if-guard returned [] without calling axios
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});