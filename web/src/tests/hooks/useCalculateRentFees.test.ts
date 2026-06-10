import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useCalculateRentFees } from "@/hooks/useCalculateRentFees";

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useCalculateRentFees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("returns a mutate function initially", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("is idle initially", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.status).toBe("idle");
    expect(result.current.isPending).toBe(false);
  });

  it("data is undefined initially", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.data).toBeUndefined();
  });

  it("error is null initially", () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.error).toBeNull();
  });

  // ── Successful mutation ────────────────────────────────────────────────────

  it("returns expected data structure after successful mutation", async () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        tenancyContractTypeId: 1,
        ranchLandClassificationId: 2,
        plotId: 3,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      result: {
        rentFeesPerSqMeterUnit: "0",
        feeAmount: "0",
        amountInWords: "",
      },
    });
  });

  it("sets status to 'success' after mutation completes", async () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        tenancyContractTypeId: 1,
        ranchLandClassificationId: 2,
        plotId: 3,
      });
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
  });

  it("returns rentFeesPerSqMeterUnit as '0'", async () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        tenancyContractTypeId: 5,
        ranchLandClassificationId: 10,
        plotId: 99,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.result.rentFeesPerSqMeterUnit).toBe("0");
    expect(result.current.data?.result.feeAmount).toBe("0");
    expect(result.current.data?.result.amountInWords).toBe("");
  });

  // ── Reset ──────────────────────────────────────────────────────────────────

  it("resets to idle state after calling reset()", async () => {
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        tenancyContractTypeId: 1,
        ranchLandClassificationId: 2,
        plotId: 3,
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  // ── mutate (callback style) ────────────────────────────────────────────────

  it("calls onSuccess callback when mutate succeeds", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCalculateRentFees(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate(
        { tenancyContractTypeId: 1, ranchLandClassificationId: 2, plotId: 3 },
        { onSuccess }
      );
      // Wait for async mutation to settle
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    // Verify first argument has the expected shape
    const firstArg = onSuccess.mock.calls[0][0] as { result: { rentFeesPerSqMeterUnit: string } };
    expect(firstArg.result.rentFeesPerSqMeterUnit).toBe("0");
  });
});
