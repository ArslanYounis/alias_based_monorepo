import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetDistrict } from "@shared/hooks/useGetDistrict";

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

const mockDistricts = [
  {
    districtId: 10,
    districtNameA: "منطقة 1",
    districtNameE: "District One",
    districtNumber: "D001",
    municipalityId: 5,
    zoneId: 3,
    businessFlags: null,
    migNote: 0,
    urlArgs: null,
  },
  {
    districtId: 11,
    districtNameA: "منطقة 2",
    districtNameE: "District Two",
    districtNumber: "D002",
    municipalityId: 5,
    zoneId: 3,
    businessFlags: { active: true },
    migNote: 1,
    urlArgs: { key: "val" },
  },
];

describe("useGetDistrict", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled and returns empty options when no municipalityId is provided", () => {
    const { result } = renderHook(() => useGetDistrict(), {
      wrapper: createWrapper(),
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.options).toEqual([]);
  });

  it("fetches districts when municipalityId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockDistricts });

    const { result } = renderHook(() => useGetDistrict(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/district/5");
    expect(result.current.data).toEqual(mockDistricts);
  });

  it("maps districts to options with label, label_ar, and value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockDistricts });

    const { result } = renderHook(() => useGetDistrict(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "District One", label_ar: "منطقة 1", value: "10" },
      { label: "District Two", label_ar: "منطقة 2", value: "11" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useGetDistrict(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useGetDistrict(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("embeds municipalityId correctly in the URL", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockDistricts });

    const { result } = renderHook(() => useGetDistrict(42), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/district/42");
  });

  it("includes standard query properties in the return value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockDistricts });

    const { result } = renderHook(() => useGetDistrict(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("options");
    expect(result.current).toHaveProperty("refetch");
  });
});
