/**
 * Tests for useGetDariLanduses shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetDariLanduses } from "@shared/hooks/useGetDariLanduses";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockLandUses = [
  {
    landUseID: 1,
    parentLandUseID: 0,
    landUseNameAr: "سكني",
    landUseNameEn: "Residential",
  },
];

describe("useGetDariLanduses (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when municipalityId is undefined", () => {
    const { result } = renderHook(() => useGetDariLanduses(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches land uses when municipalityId provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { landUses: mockLandUses } });
    const { result } = renderHook(() => useGetDariLanduses(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "dari/authentication/land-uses?municipalityId=5"
    );
    expect(result.current.data).toEqual(mockLandUses);
  });

  it("returns empty array when response has no landUses", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useGetDariLanduses(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("returns empty array via refetch when municipalityId falsy (queryFn guard)", async () => {
    const { result } = renderHook(() => useGetDariLanduses(undefined), {
      wrapper: createWrapper(),
    });
    const res = await result.current.refetch();
    expect(res.data).toEqual([]);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useGetDariLanduses(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
