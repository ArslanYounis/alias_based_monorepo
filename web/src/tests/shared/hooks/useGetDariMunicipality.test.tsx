import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetDariMunicipality } from "@shared/hooks/useGetDariMunicipality";

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
  locations: [
    {
      communityID: 1,
      communityNameAr: "مجتمع",
      communityNameEn: "Community",
      communityNumber: "C-1",
      districtID: 1,
      districtNameAr: "حي",
      districtNameEn: "District",
      districtNumber: "D-1",
      municipalityID: 1,
      municipalityNameEn: "Abu Dhabi",
      municipalityNameAr: "أبوظبي",
      roadID: 1,
      roadNameAr: "طريق",
      roadNameEn: "Road",
      roadNumber: "R-1",
      userId: "u1",
    },
  ],
};

describe("useGetDariMunicipality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("starts fetching immediately (no enabling condition)", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "dari/authentication/locations"
    );
  });

  it("returns locations on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse.locations);
  });

  it("returns empty array when locations missing", async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("returns empty array (not error) when request fails — caught internally", async () => {
    mockedAxios.get.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
