import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useGetSearchByDariOwner,
  getSearchByDariOwner,
  type DariOwnerSearchParams,
} from "@shared/hooks/useGetSearchByDariOwner";

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

const mockApiResponse = {
  owners: [{ ownerId: 1, ownerNameEn: "Jane", ownerNameAr: "جين" }],
  totalCount: 1,
};

const enabledParams: DariOwnerSearchParams = { pageNumber: 1, pageSize: 10 };

describe("useGetSearchByDariOwner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByDariOwner({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("is disabled when pageSize is falsy", () => {
    renderHook(() => useGetSearchByDariOwner({ pageNumber: 1, pageSize: 0 }), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it("fetches via POST when pageNumber and pageSize set", async () => {
    mockedAxios.post.mockResolvedValue({ data: mockApiResponse });
    const { result } = renderHook(() => useGetSearchByDariOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "dari/authentication/owner-search",
      expect.any(Object)
    );
    expect(result.current.data?.items).toEqual(mockApiResponse.owners);
    expect(result.current.data?.totalCount).toBe(1);
    expect(result.current.data?.pageNumber).toBe(1);
    expect(result.current.data?.pageSize).toBe(10);
  });

  it("returns empty items when owners missing", async () => {
    mockedAxios.post.mockResolvedValue({ data: { totalCount: 0 } });
    const { result } = renderHook(() => useGetSearchByDariOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toEqual([]);
  });

  it("sets isError on failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useGetSearchByDariOwner(enabledParams), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByDariOwner (standalone)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters out empty/null/undefined before posting", async () => {
    mockedAxios.post.mockResolvedValue({ data: mockApiResponse });
    await getSearchByDariOwner({
      pageNumber: 1,
      pageSize: 10,
      ...({ a: "", b: undefined, c: null } as any),
    });
    const body = mockedAxios.post.mock.calls[0][1];
    expect(body).not.toHaveProperty("a");
    expect(body).not.toHaveProperty("b");
    expect(body).not.toHaveProperty("c");
    expect(body).toMatchObject({ pageNumber: 1, pageSize: 10 });
  });

  it("uses default empty params when no args", async () => {
    mockedAxios.post.mockResolvedValue({ data: mockApiResponse });
    const res = await getSearchByDariOwner();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "dari/authentication/owner-search",
      {}
    );
    expect(res.pageNumber).toBeUndefined();
  });
});
