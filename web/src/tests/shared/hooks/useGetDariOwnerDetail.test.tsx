import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import useGetDariOwnerDetail from "@shared/hooks/useGetDariOwnerDetail";

vi.mock("axios");
const mockedAxios = axios as any;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockResponse = {
  success: true,
  result: {
    owner: {
      ownerID: 42,
      ownernameEn: "John Doe",
      ownernameAr: "جون دو",
      unifiedNumber: "U-1",
    },
  },
};

describe("useGetDariOwnerDetail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when ownerId is undefined", () => {
    const { result } = renderHook(() => useGetDariOwnerDetail(undefined), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches owner detail when ownerId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useGetDariOwnerDetail(42), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/dari/owner/details/42");
    expect(result.current.data).toEqual(mockResponse.result.owner);
    expect(result.current.data?.ownernameEn).toBe("John Doe");
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("not found"));
    const { result } = renderHook(() => useGetDariOwnerDetail("99"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
