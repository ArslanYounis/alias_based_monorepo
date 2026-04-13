import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useRanchRecipient } from "@shared/hooks/useRanchRecipient";

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

describe("useRanchRecipient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a mutation in idle state initially", () => {
    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("posts to /ranch/recipient with the owner ID wrapped in OwnerIdList", async () => {
    const mockResponse = {
      success: true,
      message: "Recipient set",
      data: { recipientId: 1, ownerId: 42 },
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(42);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/ranch/recipient",
      { OwnerIdList: [42] }
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("returns correct data shape on success", async () => {
    const mockResponse = {
      success: true,
      message: "OK",
      data: { recipientId: 5, ownerId: 10 },
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(10);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data as typeof mockResponse;
    expect(data.success).toBe(true);
    expect(data.data?.recipientId).toBe(5);
    expect(data.data?.ownerId).toBe(10);
  });

  it("sets isError on mutation failure", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Owner not found"));

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(999);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Owner not found");
  });

  it("mutateAsync resolves with data on success", async () => {
    const mockData = { success: true, message: "Done", data: { recipientId: 7, ownerId: 21 } };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.mutateAsync(21);
    });

    expect(returnedData).toEqual(mockData);
    expect(returnedData.success).toBe(true);
  });

  it("mutateAsync rejects on error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync(0)
      ).rejects.toThrow("Unauthorized");
    });
  });

  it("handles different owner IDs correctly (passes them as single-element array)", async () => {
    const mockResponse = { success: true };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(777);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const postedBody = mockedAxios.post.mock.calls[0][1];
    expect(postedBody).toEqual({ OwnerIdList: [777] });
  });

  it("resets to idle after reset()", async () => {
    const mockData = { success: true };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      result.current.reset();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    expect(result.current.data).toBeUndefined();
  });
});
