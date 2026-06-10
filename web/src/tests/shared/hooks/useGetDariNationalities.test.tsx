import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetDariNationalities } from "@shared/hooks/useGetDariNationalities";

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
  nationalities: [
    {
      nationalityid: 1,
      nationalitynameAr: "إماراتي",
      nationalitynameEn: "Emirati",
      nationalityType: 1,
      countryNameAr: "الإمارات",
      countryNameEn: "UAE",
      moiID: 100,
    },
  ],
};

describe("useGetDariNationalities", () => {
  beforeEach(() => vi.clearAllMocks());

  it("starts fetching immediately", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "dari/authentication/nationalities"
    );
  });

  it("returns nationalities and maps options on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse.nationalities);
    expect(result.current.options).toEqual([
      { label: "Emirati", label_ar: "إماراتي", value: "1" },
    ]);
  });

  it("returns empty options when data is undefined", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useGetDariNationalities(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.options).toEqual([]);
  });
});
