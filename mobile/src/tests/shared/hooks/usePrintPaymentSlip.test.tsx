/**
 * Tests for usePrintPaymentSlip shared hook.
 */
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { usePrintPaymentSlip } from "@shared/hooks/usePrintPaymentSlip";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("usePrintPaymentSlip (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a mutation object", () => {
    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("calls the correct API endpoint on mutate", async () => {
    const mockResponse = { result: { downloadUrl: "https://example.com/slip.pdf" } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        payload: { applicationPaymentId: 300 },
        args: "slip-args",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/print-payment-slip",
      { applicationPaymentId: 300 },
      { params: { args: "slip-args" } }
    );
  });

  it("returns downloadUrl in result", async () => {
    const downloadUrl = "https://example.com/slip.pdf";
    const mockResponse = { result: { downloadUrl } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: { applicationPaymentId: 300 } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
    expect((result.current.data as { result?: { downloadUrl?: string } })?.result?.downloadUrl).toBe(downloadUrl);
  });

  it("sets isError when the API call fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Print failed"));
    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: { applicationPaymentId: 999 } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  it("handles undefined args gracefully", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { result: {} } });
    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: { applicationPaymentId: 300 } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
