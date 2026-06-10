import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useCalculateRentFees } from "@shared/hooks/useCalculateRentFees";

vi.mock("axios");
const mockedAxios = axios as any;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const validPayload = {
  tenancyContractTypeId: 1,
  ranchLandClassificationId: 2,
  plotId: 100,
};

describe("useCalculateRentFees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a mutation function and is idle initially", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("posts to /tenancy/calculate-rent-fees with the payload", async () => {
    const mockResponse = { result: { totalFees: 500, annualFees: 250 } };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/tenancy/calculate-rent-fees",
      validPayload
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("returns data on successful mutation", async () => {
    const mockData = { result: { totalFees: 1200, breakdownItems: [] } };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("sets isError on mutation failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validPayload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Network error");
  });

  it("mutateAsync resolves with data on success", async () => {
    const mockData = { result: { totalFees: 800 } };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.mutateAsync(validPayload);
    });

    expect(returnedData).toEqual(mockData);
  });

  it("mutateAsync rejects on error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync(validPayload)
      ).rejects.toThrow("Server error");
    });
  });

  it("resets to idle state after reset()", async () => {
    const mockData = { result: { totalFees: 300 } };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validPayload);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      result.current.reset();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    expect(result.current.data).toBeUndefined();
  });
});
