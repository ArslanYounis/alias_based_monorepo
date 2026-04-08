/**
 * Tests for useGetMunicipality shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetMunicipality } from "@shared/hooks/useGetMunicipality";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockMunicipalities = [
  {
    adgeId: "ADG1",
    applicationFlags: null,
    customerId: 1,
    evaluatorTradeLicenseNumber: "ETL-001",
    genericGcsCodeId: "GCS-001",
    inboxId: 100,
    isDisableEmailNotification: false,
    mailBoxTradeLicenseNumber: "MBT-001",
    municipalityConst: "ABU_DHABI",
    municipalityFlagIndex: 1,
    municipalityId: 1,
    municipalityNameA: "أبو ظبي",
    municipalityNameE: "Abu Dhabi",
    profLicenseDepEmail: "email@ad.ae",
    isAreaNeeded: true,
    urlArgs: null,
  },
  {
    adgeId: "ADG2",
    applicationFlags: null,
    customerId: 2,
    evaluatorTradeLicenseNumber: "ETL-002",
    genericGcsCodeId: "GCS-002",
    inboxId: 200,
    isDisableEmailNotification: false,
    mailBoxTradeLicenseNumber: "MBT-002",
    municipalityConst: "AL_AIN",
    municipalityFlagIndex: 2,
    municipalityId: 2,
    municipalityNameA: "العين",
    municipalityNameE: "Al Ain",
    profLicenseDepEmail: "email@alain.ae",
    isAreaNeeded: false,
    urlArgs: null,
  },
];

describe("useGetMunicipality (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a query object", () => {
    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("options");
  });

  it("returns an empty options array when data is undefined", () => {
    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });
    expect(result.current.options).toEqual([]);
  });

  it("fetches municipalities successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockMunicipalities });
    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMunicipalities);
    expect(mockedAxios.get).toHaveBeenCalledWith("/municipality");
  });

  it("transforms data into options with label, label_ar, and value", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockMunicipalities });
    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "Abu Dhabi", label_ar: "أبو ظبي", value: "1" },
      { label: "Al Ain", label_ar: "العين", value: "2" },
    ]);
  });

  it("sets isError when the API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("returns empty options array when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });
});
