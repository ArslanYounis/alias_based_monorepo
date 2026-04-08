/**
 * Tests for useRanchRecipient shared hook.
 */
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useRanchRecipient } from "@shared/hooks/useRanchRecipient";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useRanchRecipient (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a mutation object", () => {
    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("calls the correct API endpoint on mutate with ownerId", async () => {
    const mockResponse = { success: true, data: { recipientId: 1, ownerId: 42 } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith("/ranch/recipient", {
      OwnerIdList: [42],
    });
  });

  it("wraps the id in OwnerIdList array", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(99);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/ranch/recipient",
      { OwnerIdList: [99] }
    );
  });

  it("returns response data on success", async () => {
    const mockResponse = {
      success: true,
      message: "Recipient found",
      data: { recipientId: 10, ownerId: 42 },
    };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it("sets isError when the API call fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Recipient not found"));

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(999);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  it("can be called with different owner IDs", async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useRanchRecipient(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.mutate(2);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    expect(mockedAxios.post).toHaveBeenNthCalledWith(1, "/ranch/recipient", { OwnerIdList: [1] });
    expect(mockedAxios.post).toHaveBeenNthCalledWith(2, "/ranch/recipient", { OwnerIdList: [2] });
  });
});
