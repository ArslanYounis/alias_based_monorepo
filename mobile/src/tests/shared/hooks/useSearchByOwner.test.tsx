/**
 * Tests for useSearchByOwner (allotment) shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useSearchByOwner,
  searchByOwner,
} from "@shared/hooks/useSearchByOwner";

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
    items: [{ id: "1", ownerName: "John" }],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

describe("useSearchByOwner (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when pageNumber undefined", () => {
    const { result } = renderHook(() => useSearchByOwner({ pageSize: 10 }), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize undefined", () => {
    const { result } = renderHook(() => useSearchByOwner({ pageNumber: 1 }), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches and returns result", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(
      () => useSearchByOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse.result);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(
      () => useSearchByOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("searchByOwner (standalone)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("filters empty/null/undefined params", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    await searchByOwner({
      pageNumber: 1,
      pageSize: 10,
      // @ts-expect-error extra prop for filter coverage
      ownerName: "",
    });

    expect(mockedAxios.get).toHaveBeenCalledWith("decree/owner-allotment-name", {
      params: { pageNumber: 1, pageSize: 10 },
    });
  });

  it("works with no params (default {})", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const res = await searchByOwner();
    expect(res).toEqual(mockResponse.result);
  });
});
