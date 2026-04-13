import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  useVerifyPayment,
  type VerifyPaymentArgs,
} from "@shared/hooks/useVerifyPayment";

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

const validArgs: VerifyPaymentArgs = {
  payload: {
    MunicipalityId: 1,
    ApplicationPaymentId: 55,
  },
  args: "tenant-context",
};

const validArgsNoOptional: VerifyPaymentArgs = {
  payload: {
    MunicipalityId: 2,
    ApplicationPaymentId: 88,
  },
};

describe("useVerifyPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a mutation in idle state initially", () => {
    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("posts to /payment/verify-payment with payload and args", async () => {
    const mockResponse = { success: true, status: "VERIFIED", transactionId: "TXN-500" };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/verify-payment",
      validArgs.payload,
      { params: { args: validArgs.args } }
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("passes the correct payload fields to the API", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const postedPayload = mockedAxios.post.mock.calls[0][1];
    expect(postedPayload.MunicipalityId).toBe(1);
    expect(postedPayload.ApplicationPaymentId).toBe(55);
  });

  it("works without optional args field", async () => {
    const mockResponse = { success: true };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgsNoOptional);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/verify-payment",
      validArgsNoOptional.payload,
      { params: { args: undefined } }
    );
  });

  it("sets isError on mutation failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Payment verification failed"));

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Payment verification failed");
  });

  it("mutateAsync resolves with data on success", async () => {
    const mockData = { success: true, status: "CONFIRMED" };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.mutateAsync(validArgs);
    });

    expect(returnedData).toEqual(mockData);
  });

  it("mutateAsync rejects on error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Conflict"));

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync(validArgs)
      ).rejects.toThrow("Conflict");
    });
  });

  it("handles different MunicipalityId values", async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    const differentMunicipality: VerifyPaymentArgs = {
      payload: { MunicipalityId: 99, ApplicationPaymentId: 1001 },
      args: "ctx-99",
    };

    await act(async () => {
      result.current.mutate(differentMunicipality);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const postedPayload = mockedAxios.post.mock.calls[0][1];
    expect(postedPayload.MunicipalityId).toBe(99);
    expect(postedPayload.ApplicationPaymentId).toBe(1001);
  });

  it("resets to idle after reset()", async () => {
    const mockData = { success: true };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useVerifyPayment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      result.current.reset();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    expect(result.current.data).toBeUndefined();
  });
});
