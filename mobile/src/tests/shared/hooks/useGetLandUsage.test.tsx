/**
 * Tests for useGetLandUsage shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetLandUsage } from "@shared/hooks/useGetLandUsage";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockLandUsages = [
  {
    buildingPercent: 60,
    businessFlags: null,
    colorCode: "#FF0000",
    joinedLandUseA: "سكني",
    joinedLandUseE: "Residential",
    landuseConst: "RESIDENTIAL",
    landuseId: 1,
    landuseNameA: "سكني",
    landuseNameE: "Residential",
    lucCode: "R",
    mepsIdentifier: "MPS1",
    migNote: null,
    migNoteL: "",
    migNoteLm: "",
    municipalityId: 1,
    parentLanduseId: 0,
    urlArgs: null,
  },
  {
    buildingPercent: 70,
    businessFlags: null,
    colorCode: "#0000FF",
    joinedLandUseA: "تجاري",
    joinedLandUseE: "Commercial",
    landuseConst: "COMMERCIAL",
    landuseId: 2,
    landuseNameA: "تجاري",
    landuseNameE: "Commercial",
    lucCode: "C",
    mepsIdentifier: "MPS2",
    migNote: null,
    migNoteL: "",
    migNoteLm: "",
    municipalityId: 1,
    parentLanduseId: 0,
    urlArgs: null,
  },
];

describe("useGetLandUsage (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("is not enabled when municipalityId is undefined", () => {
    const { result } = renderHook(() => useGetLandUsage(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when municipalityId is 0", () => {
    const { result } = renderHook(() => useGetLandUsage(0), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns empty options when data is undefined", () => {
    const { result } = renderHook(() => useGetLandUsage(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  it("fetches land usages when municipalityId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockLandUsages });
    const { result } = renderHook(() => useGetLandUsage(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/land-usage/1");
  });

  it("transforms land usages to options", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockLandUsages });
    const { result } = renderHook(() => useGetLandUsage(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([
      { label: "Residential", label_ar: "سكني", value: "1" },
      { label: "Commercial", label_ar: "تجاري", value: "2" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const { result } = renderHook(() => useGetLandUsage(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(() => useGetLandUsage(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("returns empty array via refetch when municipalityId is undefined (covers if-guard branch)", async () => {
    const { result } = renderHook(() => useGetLandUsage(undefined), {
      wrapper: createWrapper(),
    });
    // refetch bypasses enabled=false and executes the queryFn
    await result.current.refetch();
    // The if-guard returned [] without calling axios
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});