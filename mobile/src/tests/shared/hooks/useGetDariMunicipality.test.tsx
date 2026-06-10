/**
 * Tests for useGetDariMunicipality shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetDariMunicipality } from "@shared/hooks/useGetDariMunicipality";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockLocations = [
  {
    communityID: 1,
    communityNameEn: "Central",
    municipalityID: 1,
    municipalityNameEn: "Abu Dhabi",
  },
];

describe("useGetDariMunicipality (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it("fetches municipalities successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { locations: mockLocations } });
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "dari/authentication/locations"
    );
    expect(result.current.data).toEqual(mockLocations);
  });

  it("returns empty array when locations missing", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("returns empty array when axios throws (caught error branch)", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useGetDariMunicipality(), {
      wrapper: createWrapper(),
    });

    // queryFn catches the error and resolves to [] so query is successful
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
