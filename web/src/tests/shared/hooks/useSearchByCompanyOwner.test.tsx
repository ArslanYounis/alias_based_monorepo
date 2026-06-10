import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useSearchByCompanyOwner,
  searchByCompanyOwner,
  type AllotmentCompanyOwnerSearchParams,
} from "@shared/hooks/useSearchByCompanyOwner";

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
    items: [
      {
        companyId: 1,
        allotmentNameId: 10,
        companyName: "ABC Corp",
        tradeLicense: "TL-001",
        tradeNumber: "TN-001",
        certificateNumber: "CN-001",
        familyBookNumber: "FB-001",
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

const enabledParams: AllotmentCompanyOwnerSearchParams = {
  companyName: "ABC",
  pageNumber: 1,
  pageSize: 10,
};

describe("useSearchByCompanyOwner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useSearchByCompanyOwner({ companyName: "ABC" }),
      { wrapper: createWrapper() }
    );
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy", () => {
    renderHook(
      () =>
        useSearchByCompanyOwner({
          companyName: "ABC",
          pageNumber: 1,
          pageSize: 0,
        }),
      { wrapper: createWrapper() }
    );
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches when pageNumber and pageSize are set", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useSearchByCompanyOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "decree/company-allotment-name",
      expect.objectContaining({ params: expect.any(Object) })
    );
    expect(result.current.data).toEqual(mockResponse.result);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useSearchByCompanyOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].companyName).toBe("ABC Corp");
    expect(result.current.data?.totalCount).toBe(1);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Server error"));
    const { result } = renderHook(() => useSearchByCompanyOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("searchByCompanyOwner (standalone)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters out empty, null, and undefined params", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    await searchByCompanyOwner({
      companyName: "Test",
      tradeLicense: "",
      certificateNumber: undefined,
      matchTypeId: null as any,
      pageNumber: 1,
      pageSize: 10,
    });
    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).not.toHaveProperty("tradeLicense");
    expect(callParams).not.toHaveProperty("certificateNumber");
    expect(callParams).not.toHaveProperty("matchTypeId");
    expect(callParams).toHaveProperty("companyName", "Test");
    expect(callParams).toHaveProperty("pageNumber", 1);
  });

  it("passes through non-empty params", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    await searchByCompanyOwner({
      companyName: "XYZ Ltd",
      tradeLicense: "TL-999",
      pageNumber: 2,
      pageSize: 5,
    });
    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).toMatchObject({
      companyName: "XYZ Ltd",
      tradeLicense: "TL-999",
      pageNumber: 2,
      pageSize: 5,
    });
  });
});
