/**
 * Tests for useOverridePayment shared hook.
 */
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useOverridePayment } from "@shared/hooks/useOverridePayment";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const overridePayload = {
  applicationPaymentId: 101,
  receiptNumber: "REC-001",
  receiptDate: "2024-01-15",
  amount: "5000",
  duplicateReceiptNumber: false,
};

describe("useOverridePayment (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a mutation object", () => {
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("calls the correct API endpoint on mutate", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        payload: overridePayload,
        args: "override-args",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/override-payment",
      overridePayload,
      { params: { args: "override-args" } }
    );
  });

  it("calls API without args when args is not provided", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: overridePayload });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/override-payment",
      overridePayload,
      { params: { args: undefined } }
    );
  });

  it("sets isError when the API call fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Override failed"));
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: overridePayload });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  it("returns data from successful mutation", async () => {
    const mockResponse = { overridden: true };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: overridePayload });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });
});
