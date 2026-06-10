import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useDecreeDetails } from "@shared/hooks/useDecreeDetail";

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
    decree: {
      decreeId: 123,
      decreeNumber: "D-001",
      decreeDate: "2024-01-01",
      decreeSourceNameE: "Source",
      decreeSourceNameA: "مصدر",
    },
  },
};

describe("useDecreeDetails", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when id is undefined", () => {
    const { result } = renderHook(() => useDecreeDetails(undefined), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is disabled when id is empty string", () => {
    renderHook(() => useDecreeDetails(""), { wrapper: createWrapper() });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches decree detail when id is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useDecreeDetails("123"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/decree/allotment-name/123");
    expect(result.current.data).toEqual(mockResponse.result);
    expect(result.current.data?.decree.decreeNumber).toBe("D-001");
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("not found"));
    const { result } = renderHook(() => useDecreeDetails("999"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
