/**
 * Tests for useVerifyPayment shared hook.
 */
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useVerifyPayment } from "@shared/hooks/useVerifyPayment";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useVerifyPayment (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a mutation object with mutate and mutateAsync", () => {
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("calls the correct API endpoint on mutate", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        payload: { MunicipalityId: 1, ApplicationPaymentId: 100 },
        args: "test",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/verify-payment",
      { MunicipalityId: 1, ApplicationPaymentId: 100 },
      { params: { args: "test" } }
    );
  });

  it("calls API without args when args is undefined", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        payload: { MunicipalityId: 2, ApplicationPaymentId: 200 },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it("sets isError when the API call fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Payment verification failed"));
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        payload: { MunicipalityId: 1, ApplicationPaymentId: 100 },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  it("returns data from successful mutation", async () => {
    const mockResponse = { verified: true, paymentId: 100 };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        payload: { MunicipalityId: 1, ApplicationPaymentId: 100 },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });
});
