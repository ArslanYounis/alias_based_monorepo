/**
 * Tests for useCalculateRentFees shared hook.
 */
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useCalculateRentFees } from "@shared/hooks/useCalculateRentFees";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const rentFeesPayload = {
  tenancyContractTypeId: 1,
  ranchLandClassificationId: 2,
  plotId: 1001,
};

describe("useCalculateRentFees (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a mutation object", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("calls the correct API endpoint on mutate", async () => {
    const mockResponse = { annualFee: 5000, monthlyFee: 417 };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(rentFeesPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/tenancy/calculate-rent-fees",
      rentFeesPayload
    );
  });

  it("returns calculated fees data", async () => {
    const mockResponse = { annualFee: 5000, monthlyFee: 417 };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(rentFeesPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it("sets isError when the API call fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Calculation failed"));
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(rentFeesPayload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  it("can be called multiple times with different payloads", async () => {
    mockedAxios.post.mockResolvedValue({ data: { annualFee: 6000 } });

    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ ...rentFeesPayload, tenancyContractTypeId: 2 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.mutate({ ...rentFeesPayload, tenancyContractTypeId: 3 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
  });
});
