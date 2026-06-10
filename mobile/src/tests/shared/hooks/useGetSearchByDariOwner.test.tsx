/**
 * Tests for useGetSearchByDariOwner shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useGetSearchByDariOwner,
  getSearchByDariOwner,
} from "@shared/hooks/useGetSearchByDariOwner";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockApiResponse = {
  owners: [{ ownerID: 1, ownerNameEn: "John" }],
  totalCount: 1,
};

describe("useGetSearchByDariOwner (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when pageNumber undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByDariOwner({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByDariOwner({ pageNumber: 1 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches and maps the paginated response", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockApiResponse });
    const { result } = renderHook(
      () => useGetSearchByDariOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      items: mockApiResponse.owners,
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
    });
  });

  it("sets isError on API failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(
      () => useGetSearchByDariOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByDariOwner (standalone)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("filters empty/null/undefined params before posting", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockApiResponse });
    await getSearchByDariOwner({
      pageNumber: 1,
      pageSize: 10,
      ownerNameEn: "",
      emiratesID: undefined,
      unifiedNumber: null as unknown as string,
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "dari/authentication/owner-search",
      { pageNumber: 1, pageSize: 10 }
    );
  });

  it("defaults items to empty array when owners missing", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { totalCount: 0 } });
    const res = await getSearchByDariOwner({ pageNumber: 1, pageSize: 10 });
    expect(res.items).toEqual([]);
  });

  it("works with no params (default {})", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockApiResponse });
    const res = await getSearchByDariOwner();
    expect(res.items).toEqual(mockApiResponse.owners);
  });
});
