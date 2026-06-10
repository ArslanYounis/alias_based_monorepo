/**
 * Tests for useGetTenancyContracts shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useGetTenancyContracts,
  getTenancyContracts,
} from "@shared/hooks/useGetTenancyContracts";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse = {
  result: {
    totalCount: 1,
    items: [
      {
        contractNumber: "CN-1",
        tenancyContractId: "TC-1",
        startDate: "2024-01-01",
        isRenew: 0,
      },
    ],
    pageNumber: 1,
    pageSize: 10,
  },
};

describe("useGetTenancyContracts (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is disabled when params is empty object", () => {
    const { result } = renderHook(() => useGetTenancyContracts({}), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches when params has at least one key", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(
      () => useGetTenancyContracts({ contractNumber: "CN-1" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("tenancy/contracts", {
      params: { contractNumber: "CN-1" },
    });
    expect(result.current.data).toEqual(mockResponse.result);
  });

  it("sets isError on failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(
      () => useGetTenancyContracts({ contractNumber: "CN-1" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getTenancyContracts (standalone)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("passes params and returns result", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const res = await getTenancyContracts({
      tenancyContractId: "TC-1",
      pageNumber: 1,
      pageSize: 10,
    });
    expect(mockedAxios.get).toHaveBeenCalledWith("tenancy/contracts", {
      params: { tenancyContractId: "TC-1", pageNumber: 1, pageSize: 10 },
    });
    expect(res).toEqual(mockResponse.result);
  });
});
