/**
 * Tests for useGetSearchByOwner shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useGetSearchByOwner,
  getSearchByOwner,
} from "@shared/hooks/useGetSearchByOwner";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockOwnerResponse = {
  result: {
    items: [
      {
        ownerId: "OWN-001",
        ownerName: "John Smith",
        nationalNumber: "784-1234",
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

describe("useGetSearchByOwner (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("is not enabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByOwner({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize is undefined/0", () => {
    const { result } = renderHook(
      () => useGetSearchByOwner({ pageNumber: 1 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  // ── Enabled state ─────────────────────────────────────────────────────────

  it("fetches owner search results when params are valid", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerResponse });
    const { result } = renderHook(
      () => useGetSearchByOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockOwnerResponse.result);
  });

  it("passes all non-empty params to axios", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerResponse });
    const { result } = renderHook(
      () =>
        useGetSearchByOwner({
          pageNumber: 1,
          pageSize: 10,
          ownerName: "John",
          nationalNumber: "784-1234",
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "owner",
      expect.objectContaining({
        params: expect.objectContaining({
          pageNumber: 1,
          pageSize: 10,
          ownerName: "John",
          nationalNumber: "784-1234",
        }),
      })
    );
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(
      () => useGetSearchByOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByOwner (exported function)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("filters out empty string, null, and undefined values from params", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerResponse });
    await getSearchByOwner({
      pageNumber: 1,
      pageSize: 10,
      ownerName: "",
      nationalNumber: undefined,
      nationalityId: null as unknown as string,
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "owner",
      expect.objectContaining({
        params: { pageNumber: 1, pageSize: 10 },
      })
    );
  });

  it("returns the result from API response", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOwnerResponse });
    const result = await getSearchByOwner({ pageNumber: 1, pageSize: 10 });
    expect(result).toEqual(mockOwnerResponse.result);
  });
});
