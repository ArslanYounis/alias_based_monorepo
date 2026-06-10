import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useGetSearchByOwner,
  getSearchByOwner,
  type OwnerSearchParams,
} from "@shared/hooks/useGetSearchByOwner";

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

const mockPaginatedOwnerResponse = {
  result: {
    items: [
      {
        id: "1",
        ownerId: "O-001",
        ownerName: "Jane Smith",
        ownerName_ar: "جين سميث",
        nationalNumber: "784-1990-0000001-1",
        moiUnifiedNumber: "987654321",
        nationalityName: "Emirati",
        nationalityName_ar: "إماراتي",
        backgroundColor: "#FFFFFF",
        language: false,
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

const enabledParams: OwnerSearchParams = {
  ownerName: "Jane",
  pageNumber: 1,
  pageSize: 10,
};

describe("useGetSearchByOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByOwner({ ownerName: "Jane" }),
      { wrapper: createWrapper() }
    );

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy", () => {
    const { result } = renderHook(
      () => useGetSearchByOwner({ ownerName: "Jane", pageNumber: 1, pageSize: 0 }),
      { wrapper: createWrapper() }
    );

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches owners when pageNumber and pageSize are set", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedOwnerResponse });

    const { result } = renderHook(
      () => useGetSearchByOwner(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "owner",
      expect.objectContaining({ params: expect.any(Object) })
    );
    expect(result.current.data).toEqual(mockPaginatedOwnerResponse.result);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedOwnerResponse });

    const { result } = renderHook(
      () => useGetSearchByOwner(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].ownerId).toBe("O-001");
    expect(result.current.data?.totalCount).toBe(1);
    expect(result.current.data?.pageNumber).toBe(1);
    expect(result.current.data?.pageSize).toBe(10);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(
      () => useGetSearchByOwner(enabledParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("getSearchByOwner (standalone)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters out empty string, null, and undefined values from params", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedOwnerResponse });

    await getSearchByOwner({
      ownerName: "Jane",
      nationalNumber: "",
      nationalityId: undefined,
      passPortNumber: null as any,
      pageNumber: 1,
      pageSize: 10,
    });

    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).not.toHaveProperty("nationalNumber");
    expect(callParams).not.toHaveProperty("nationalityId");
    expect(callParams).not.toHaveProperty("passPortNumber");
    expect(callParams).toHaveProperty("ownerName", "Jane");
  });

  it("uses default empty params when called with no arguments", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedOwnerResponse });

    await getSearchByOwner();

    expect(mockedAxios.get).toHaveBeenCalledWith("owner", {
      params: {},
    });
  });

  it("passes all non-empty params correctly", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPaginatedOwnerResponse });

    await getSearchByOwner({
      ownerName: "John",
      moiUnifiedNumber: "111222333",
      pageNumber: 2,
      pageSize: 5,
    });

    const callParams = mockedAxios.get.mock.calls[0][1].params;
    expect(callParams).toMatchObject({
      ownerName: "John",
      moiUnifiedNumber: "111222333",
      pageNumber: 2,
      pageSize: 5,
    });
  });
});
