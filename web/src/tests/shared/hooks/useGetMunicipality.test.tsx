import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetMunicipality } from "@shared/hooks/useGetMunicipality";

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

const mockMunicipalities = [
  {
    adgeId: "ADG-001",
    applicationFlags: null,
    customerId: 1,
    evaluatorTradeLicenseNumber: "TL-001",
    genericGcsCodeId: "GCS-001",
    inboxId: 100,
    isDisableEmailNotification: false,
    mailBoxTradeLicenseNumber: "ML-001",
    municipalityConst: "MUN_ABU_DHABI",
    municipalityFlagIndex: 1,
    municipalityId: 1,
    municipalityNameA: "أبوظبي",
    municipalityNameE: "Abu Dhabi",
    profLicenseDepEmail: "auh@example.com",
    isAreaNeeded: true,
    urlArgs: null,
  },
  {
    adgeId: "ADG-002",
    applicationFlags: { flag1: true },
    customerId: 2,
    evaluatorTradeLicenseNumber: "TL-002",
    genericGcsCodeId: "GCS-002",
    inboxId: 200,
    isDisableEmailNotification: true,
    mailBoxTradeLicenseNumber: "ML-002",
    municipalityConst: "MUN_AL_AIN",
    municipalityFlagIndex: 2,
    municipalityId: 2,
    municipalityNameA: "العين",
    municipalityNameE: "Al Ain",
    profLicenseDepEmail: "alain@example.com",
    isAreaNeeded: false,
    urlArgs: { key: "value" },
  },
];

describe("useGetMunicipality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts fetching immediately (no enabling condition)", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith("/municipality");
  });

  it("returns municipalities data on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockMunicipalities });

    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMunicipalities);
  });

  it("maps municipalities to options with label, label_ar, and value", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockMunicipalities });

    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.options).toEqual([
      { label: "Abu Dhabi", label_ar: "أبوظبي", value: "1" },
      { label: "Al Ain", label_ar: "العين", value: "2" },
    ]);
  });

  it("returns empty options array when data is undefined", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // pending forever

    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    expect(result.current.options).toEqual([]);
  });

  it("returns empty options when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.options).toEqual([]);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useGetMunicipality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("exposes standard query properties plus options", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockMunicipalities });

    const { result } = renderHook(() => useGetMunicipality(), {
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
