import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetDariLanduses } from "@shared/hooks/useGetDariLanduses";

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

const mockResponse = {
  landUses: [
    {
      landUseID: 1,
      parentLandUseID: 0,
      landUseNameAr: "سكني",
      landUseNameEn: "Residential",
    },
  ],
};

describe("useGetDariLanduses", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when municipalityId is undefined", () => {
    const { result } = renderHook(() => useGetDariLanduses(undefined), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is disabled when municipalityId is 0", () => {
    renderHook(() => useGetDariLanduses(0), { wrapper: createWrapper() });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches land uses when municipalityId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useGetDariLanduses(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "dari/authentication/land-uses?municipalityId=5"
    );
    expect(result.current.data).toEqual(mockResponse.landUses);
  });

  it("returns empty array when landUses missing from response", async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useGetDariLanduses(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useGetDariLanduses(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
