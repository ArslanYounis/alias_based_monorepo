import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetRoads } from "@shared/hooks/useGetRoads";

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

const mockRoads = [
  {
    municipalityId: 5,
    roadId: 1,
    roadNameA: "شارع الرئيسي",
    roadNameE: "Main Road",
    roadNumber: 101,
    urlArgs: null,
  },
  {
    municipalityId: 5,
    roadId: 2,
    roadNameA: "شارع الفرعي",
    roadNameE: "Side Street",
    roadNumber: 102,
    urlArgs: { type: "road" },
  },
];

describe("useGetRoads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled and returns empty options when no communityId is provided", () => {
    const { result } = renderHook(() => useGetRoads(), {
      wrapper: createWrapper(),
    });

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.options).toEqual([]);
  });

  it("fetches roads when communityId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRoads });

    const { result } = renderHook(() => useGetRoads(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/roads/7");
    expect(result.current.data).toEqual(mockRoads);
  });

  it("maps roads to options with label, label_ar, and value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRoads });

    const { result } = renderHook(() => useGetRoads(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "Main Road", label_ar: "شارع الرئيسي", value: "1" },
      { label: "Side Street", label_ar: "شارع الفرعي", value: "2" },
    ]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useGetRoads(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Connection refused"));

    const { result } = renderHook(() => useGetRoads(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("embeds communityId correctly in URL path", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRoads });

    const { result } = renderHook(() => useGetRoads(55), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/roads/55");
  });

  it("includes standard query properties in the return value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRoads });

    const { result } = renderHook(() => useGetRoads(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("refetch");
    expect(result.current).toHaveProperty("options");
  });
});
