import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useOverridePayment,
  type OverridePaymentArgs,
} from "@shared/hooks/useOverridePayment";

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

const validArgs: OverridePaymentArgs = {
  payload: {
    applicationPaymentId: 42,
    receiptNumber: "REC-001",
    receiptDate: "2024-01-15",
    amount: "1500.00",
    duplicateReceiptNumber: false,
  },
  args: "some-args",
};

const validArgsNullArgs: OverridePaymentArgs = {
  payload: {
    applicationPaymentId: 42,
    receiptNumber: "REC-001",
    receiptDate: "2024-01-15",
    amount: "1500.00",
    duplicateReceiptNumber: true,
  },
};

describe("useOverridePayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a mutation in idle state initially", () => {
    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("posts to /payment/override-payment with payload and args", async () => {
    const mockResponse = { success: true, message: "Payment overridden" };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/override-payment",
      validArgs.payload,
      { params: { args: validArgs.args } }
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("works without optional args field", async () => {
    const mockResponse = { success: true };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgsNullArgs);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/override-payment",
      validArgsNullArgs.payload,
      { params: { args: undefined } }
    );
  });

  it("sets isError on mutation failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Validation failed"));

    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Validation failed");
  });

  it("mutateAsync resolves with data on success", async () => {
    const mockData = { success: true, transactionId: "TXN-123" };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.mutateAsync(validArgs);
    });

    expect(returnedData).toEqual(mockData);
  });

  it("mutateAsync rejects on error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Payment conflict"));

    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync(validArgs)
      ).rejects.toThrow("Payment conflict");
    });
  });

  it("handles duplicateReceiptNumber: true", async () => {
    const mockResponse = { success: true };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useOverridePayment(), {
      wrapper: createWrapper(),
    });

    const argsWithDuplicate: OverridePaymentArgs = {
      payload: { ...validArgs.payload, duplicateReceiptNumber: true },
    };

    await act(async () => {
      result.current.mutate(argsWithDuplicate);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const postedPayload = mockedAxios.post.mock.calls[0][1];
    expect(postedPayload.duplicateReceiptNumber).toBe(true);
  });
});
