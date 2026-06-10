import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useGetTenancyContracts,
  getTenancyContracts,
} from "@shared/hooks/useGetTenancyContracts";

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

describe("useGetTenancyContracts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when params is empty object", () => {
    const { result } = renderHook(() => useGetTenancyContracts({}), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches when params has at least one key", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(
      () => useGetTenancyContracts({ contractNumber: "CN-1" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("tenancy/contracts", {
      params: { contractNumber: "CN-1" },
    });
    expect(result.current.data).toEqual(mockResponse.result);
    expect(result.current.data?.items).toHaveLength(1);
  });

  it("sets isError on failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(
      () => useGetTenancyContracts({ contractNumber: "CN-1" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getTenancyContracts (standalone)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes params and returns result", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
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
