/**
 * Tests for useGetDariNationalities shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetDariNationalities } from "@shared/hooks/useGetDariNationalities";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockNationalities = [
  {
    nationalityid: 1,
    nationalitynameAr: "إماراتي",
    nationalitynameEn: "Emirati",
    nationalityType: 1,
    countryNameAr: "الإمارات",
    countryNameEn: "UAE",
    moiID: 10,
  },
];

describe("useGetDariNationalities (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns empty options when data undefined", () => {
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  it("fetches nationalities and transforms to options", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nationalities: mockNationalities },
    });
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "dari/authentication/nationalities"
    );
    expect(result.current.data).toEqual(mockNationalities);
    expect(result.current.options).toEqual([
      { label: "Emirati", label_ar: "إماراتي", value: "1" },
    ]);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.options).toEqual([]);
  });
});
