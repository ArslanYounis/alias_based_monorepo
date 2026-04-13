import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import {
  usePrintPaymentSlip,
  type PrintPaymentSlipArgs,
} from "@shared/hooks/usePrintPaymentSlip";

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

const validArgs: PrintPaymentSlipArgs = {
  payload: {
    applicationPaymentId: 99,
  },
  args: "municipality-context",
};

const validArgsNoOptional: PrintPaymentSlipArgs = {
  payload: {
    applicationPaymentId: 100,
  },
};

describe("usePrintPaymentSlip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a mutation in idle state initially", () => {
    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("posts to /payment/print-payment-slip with payload and args", async () => {
    const mockResponse = { result: { downloadUrl: "https://example.com/slip.pdf" } };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/print-payment-slip",
      validArgs.payload,
      { params: { args: validArgs.args } }
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("returns the download URL in the result", async () => {
    const mockResponse = { result: { downloadUrl: "https://example.com/slip.pdf" } };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.result?.downloadUrl).toBe(
      "https://example.com/slip.pdf"
    );
  });

  it("works without optional args field", async () => {
    const mockResponse = { result: { downloadUrl: "https://example.com/slip2.pdf" } };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgsNoOptional);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/payment/print-payment-slip",
      validArgsNoOptional.payload,
      { params: { args: undefined } }
    );
  });

  it("sets isError on mutation failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Print service unavailable"));

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(validArgs);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Print service unavailable");
  });

  it("mutateAsync resolves with data on success", async () => {
    const mockData = { result: { downloadUrl: "https://example.com/slip3.pdf" } };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.mutateAsync(validArgs);
    });

    expect(returnedData).toEqual(mockData);
    expect(returnedData.result.downloadUrl).toBe("https://example.com/slip3.pdf");
  });

  it("mutateAsync rejects on error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Timeout"));

    const { result } = renderHook(() => usePrintPaymentSlip(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync(validArgs)
      ).rejects.toThrow("Timeout");
    });
  });

  it("resets to idle after reset()", async () => {
    const mockData = { result: { downloadUrl: "https://example.com/slip.pdf" } };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => usePrintPaymentSlip(), {
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
