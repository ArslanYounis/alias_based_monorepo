import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useSearchByOwner,
  searchByOwner,
  type AllotmentOwnerSearchParams,
} from "@shared/hooks/useSearchByOwner";

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
        id: "1",
        ownerName: "Jane",
        fullName: "Jane Smith",
        allotmentNameId: "AN-1",
        familyBookNumber: "FB-1",
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

const enabledParams: AllotmentOwnerSearchParams = {
  pageNumber: 1,
  pageSize: 10,
};

describe("useSearchByOwner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when pageNumber is undefined", () => {
    const { result } = renderHook(() => useSearchByOwner({ pageSize: 10 }), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy", () => {
    renderHook(() => useSearchByOwner({ pageNumber: 1, pageSize: 0 }), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches when pageNumber and pageSize are set", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useSearchByOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "decree/owner-allotment-name",
      expect.objectContaining({ params: expect.any(Object) })
    );
    expect(result.current.data).toEqual(mockResponse.result);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useSearchByOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0].ownerName).toBe("Jane");
    expect(result.current.data?.totalCount).toBe(1);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useSearchByOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("searchByOwner (standalone)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters out empty/null/undefined params", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    await searchByOwner({
      pageNumber: 1,
      pageSize: 10,
      ...({ extra: "", other: undefined, nil: null } as any),
    });
    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).not.toHaveProperty("extra");
    expect(callParams).not.toHaveProperty("other");
    expect(callParams).not.toHaveProperty("nil");
    expect(callParams).toMatchObject({ pageNumber: 1, pageSize: 10 });
  });

  it("uses default empty params when called with no arguments", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    await searchByOwner();
    expect(mockedAxios.get).toHaveBeenCalledWith("decree/owner-allotment-name", {
      params: {},
    });
  });
});
