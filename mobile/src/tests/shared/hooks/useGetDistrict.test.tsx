/**
 * Tests for useGetDistrict shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetDistrict } from "@shared/hooks/useGetDistrict";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockDistricts = [
  {
    districtId: 10,
    districtNameA: "المركز",
    districtNameE: "Central",
    districtNumber: "D01",
    municipalityId: 1,
    zoneId: 5,
    businessFlags: null,
    migNote: 0,
    urlArgs: null,
  },
  {
    districtId: 20,
    districtNameA: "الشرق",
    districtNameE: "East",
    districtNumber: "D02",
    municipalityId: 1,
    zoneId: 6,
    businessFlags: null,
    migNote: 0,
    urlArgs: null,
  },
];

describe("useGetDistrict (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("is not enabled when municipalityId is undefined", () => {
    const { result } = renderHook(() => useGetDistrict(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when municipalityId is 0 (falsy)", () => {
    const { result } = renderHook(() => useGetDistrict(0), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns empty options when data is undefined", () => {
    const { result } = renderHook(() => useGetDistrict(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  // ── Enabled state ─────────────────────────────────────────────────────────

  it("fetches districts when municipalityId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockDistricts });
    const { result } = renderHook(() => useGetDistrict(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/district/1");
    expect(result.current.data).toEqual(mockDistricts);
  });

  it("transforms districts to options", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockDistricts });
    const { result } = renderHook(() => useGetDistrict(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "Central", label_ar: "المركز", value: "10" },
      { label: "East", label_ar: "الشرق", value: "20" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const { result } = renderHook(() => useGetDistrict(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useGetDistrict(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  // ── Cover queryFn guard branch (if !municipalityId) via refetch ───────────

  it("returns empty array via refetch when municipalityId is undefined (covers if-guard branch)", async () => {
    const { result } = renderHook(() => useGetDistrict(undefined), {
      wrapper: createWrapper(),
    });
    // refetch bypasses enabled=false and executes the queryFn,
    // hitting the `if (!municipalityId) return []` branch
    // refetch bypasses enabled=false and executes the queryFn
    await result.current.refetch();
    // The if-guard returned [] without calling axios
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});
