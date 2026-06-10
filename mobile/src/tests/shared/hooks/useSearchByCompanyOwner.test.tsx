/**
 * Tests for useSearchByCompanyOwner shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  useSearchByCompanyOwner,
  searchByCompanyOwner,
} from "@shared/hooks/useSearchByCompanyOwner";

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
    items: [{ companyId: 1, companyName: "Acme" }],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

describe("useSearchByCompanyOwner (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when pageNumber undefined", () => {
    const { result } = renderHook(
      () => useSearchByCompanyOwner({ pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when pageSize undefined", () => {
    const { result } = renderHook(
      () => useSearchByCompanyOwner({ pageNumber: 1 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches and returns result", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(
      () => useSearchByCompanyOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse.result);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(
      () => useSearchByCompanyOwner({ pageNumber: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("searchByCompanyOwner (standalone)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("filters empty/null/undefined params", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    await searchByCompanyOwner({
      pageNumber: 1,
      pageSize: 10,
      companyName: "",
      tradeLicense: undefined,
      certificateNumber: null as unknown as string,
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "decree/company-allotment-name",
      { params: { pageNumber: 1, pageSize: 10 } }
    );
  });

  it("returns the result from response", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const res = await searchByCompanyOwner({ pageNumber: 1, pageSize: 10 });
    expect(res).toEqual(mockResponse.result);
  });
});
