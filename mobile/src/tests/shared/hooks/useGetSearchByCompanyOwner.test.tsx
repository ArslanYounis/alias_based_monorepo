/**
 * Tests for useGetSearchByCompanyOwner shared hook.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useGetSearchByCompanyOwner,
  getSearchByCompanyOwner,
} from "@shared/hooks/useGetSearchByCompanyOwner";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockCompanyResponse = {
  result: {
    items: [
      {
        companyId: 500,
        ownerId: 600,
        companyName: "ACME Corp",
        tradeLicense: "TL-001",
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

describe("useGetSearchByCompanyOwner (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("is not enabled when pageNumber is undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByCompanyOwner({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize is 0/undefined", () => {
    const { result } = renderHook(
      () => useGetSearchByCompanyOwner({ pageNumber: 1 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches company owner search results when params are valid", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCompanyResponse });
    const { result } = renderHook(
      () => useGetSearchByCompanyOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCompanyResponse.result);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const { result } = renderHook(
      () => useGetSearchByCompanyOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("getSearchByCompanyOwner (exported function)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("filters out empty string, null, and undefined values", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCompanyResponse });
    await getSearchByCompanyOwner({
      pageNumber: 1,
      pageSize: 10,
      companyName: "",
      tradeLicense: undefined,
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "owner/companies",
      expect.objectContaining({
        params: { pageNumber: 1, pageSize: 10 },
      })
    );
  });

  it("returns the result from API response", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCompanyResponse });
    const result = await getSearchByCompanyOwner({ pageNumber: 1, pageSize: 10 });
    expect(result).toEqual(mockCompanyResponse.result);
  });

  it("passes all non-empty params to API", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCompanyResponse });
    await getSearchByCompanyOwner({
      pageNumber: 1,
      pageSize: 10,
      companyName: "ACME",
      tradeLicense: "TL-001",
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "owner/companies",
      expect.objectContaining({
        params: expect.objectContaining({
          companyName: "ACME",
          tradeLicense: "TL-001",
        }),
      })
    );
  });
});
