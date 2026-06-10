import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetLandUsage } from "@shared/hooks/useGetLandUsage";

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
    lucCode: "R1",
    mepsIdentifier: "MEPS-001",
    migNote: null,
    migNoteL: "",
    migNoteLm: "",
    municipalityId: 5,
    parentLanduseId: 0,
    urlArgs: null,
  },
  {
    buildingPercent: 80,
    businessFlags: null,
    colorCode: "#00FF00",
    joinedLandUseA: "تجاري",
    joinedLandUseE: "Commercial",
    landuseConst: "COMMERCIAL",
    landuseId: 2,
    landuseNameA: "تجاري",
    landuseNameE: "Commercial",
    lucCode: "C1",
    mepsIdentifier: "MEPS-002",
    migNote: "note",
    migNoteL: "Note L",
    migNoteLm: "Note Lm",
    municipalityId: 5,
    parentLanduseId: 0,
    urlArgs: null,
  },
];

describe("useGetLandUsage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled and returns empty options when no municipalityId is provided", () => {
    const { result } = renderHook(() => useGetLandUsage(), {
      wrapper: createWrapper(),
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.options).toEqual([]);
  });

  it("fetches land usages when municipalityId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockLandUsages });

    const { result } = renderHook(() => useGetLandUsage(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/land-usage/5");
    expect(result.current.data).toEqual(mockLandUsages);
  });

  it("maps land usages to options with label, label_ar, and value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockLandUsages });

    const { result } = renderHook(() => useGetLandUsage(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "Residential", label_ar: "سكني", value: "1" },
      { label: "Commercial", label_ar: "تجاري", value: "2" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useGetLandUsage(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useGetLandUsage(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("embeds municipalityId correctly in URL path", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockLandUsages });

    const { result } = renderHook(() => useGetLandUsage(77), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/land-usage/77");
  });

  it("includes standard query properties in the return value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockLandUsages });

    const { result } = renderHook(() => useGetLandUsage(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("options");
  });
});
