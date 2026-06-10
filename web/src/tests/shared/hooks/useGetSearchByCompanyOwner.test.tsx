import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useGetSearchByCompanyOwner,
  getSearchByCompanyOwner,
  type CompanyOwnerSearchParams,
} from "@shared/hooks/useGetSearchByCompanyOwner";

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

const mockPaginatedResponse = {
  result: {
    items: [
      {
        companyId: 1,
        ownerId: 100,
        companyName: "ABC Corp",
        tradeLicense: "TL-001",
        certificateNumber: "CN-001",
        westernRegionArchiveNo: "",
        abuDhabiArchiveNo: "AD-001",
        alAinArchiveNo: "",
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

const enabledParams: CompanyOwnerSearchParams = {
  companyName: "ABC",
  pageNumber: 1,
  pageSize: 10,
};

const disabledParams: CompanyOwnerSearchParams = {
  companyName: "ABC",
  // no pageNumber or pageSize → query is disabled
};

describe("useGetSearchByCompanyOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByCompanyOwner(disabledParams),
      { wrapper: createWrapper() }
    );

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy", () => {
    const { result } = renderHook(
      () => useGetSearchByCompanyOwner({ companyName: "Test", pageNumber: 1, pageSize: 0 }),
      { wrapper: createWrapper() }
    );

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches when pageNumber and pageSize are set", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedResponse });

    const { result } = renderHook(
      () => useGetSearchByCompanyOwner(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "owner/companies",
      expect.objectContaining({ params: expect.any(Object) })
    );
    expect(result.current.data).toEqual(mockPaginatedResponse.result);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedResponse });

    const { result } = renderHook(
      () => useGetSearchByCompanyOwner(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.totalCount).toBe(1);
    expect(result.current.data?.pageNumber).toBe(1);
    expect(result.current.data?.pageSize).toBe(10);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Forbidden"));

    const { result } = renderHook(
      () => useGetSearchByCompanyOwner(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByCompanyOwner (standalone)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters out empty, null, and undefined params before sending", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedResponse });

    await getSearchByCompanyOwner({
      companyName: "Test",
      tradeLicense: "",
      certificateNumber: undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).not.toHaveProperty("tradeLicense");
    expect(callParams).not.toHaveProperty("certificateNumber");
    expect(callParams).toHaveProperty("companyName", "Test");
    expect(callParams).toHaveProperty("pageNumber", 1);
  });

  it("passes through non-empty params", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedResponse });

    await getSearchByCompanyOwner({
      companyName: "XYZ Ltd",
      tradeLicense: "TL-999",
      pageNumber: 2,
      pageSize: 5,
    });

    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).toHaveProperty("companyName", "XYZ Ltd");
    expect(callParams).toHaveProperty("tradeLicense", "TL-999");
  });
});
