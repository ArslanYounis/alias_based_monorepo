/**
 * Tests for useDecreeDetails shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useDecreeDetails } from "@shared/hooks/useDecreeDetail";

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
    decree: {
      decreeId: 1,
      decreeNumber: "D-001",
      decreeSourceNameE: "Source",
    },
  },
};

describe("useDecreeDetails (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when id is undefined", () => {
    const { result } = renderHook(() => useDecreeDetails(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches decree detail when id provided and returns result", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(() => useDecreeDetails("123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/decree/allotment-name/123");
    expect(result.current.data).toEqual(mockResponse.result);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useDecreeDetails("123"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
