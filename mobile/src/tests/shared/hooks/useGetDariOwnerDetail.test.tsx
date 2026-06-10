/**
 * Tests for useGetDariOwnerDetail shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import useGetDariOwnerDetail from "@shared/hooks/useGetDariOwnerDetail";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse = {
  success: true,
  result: { owner: { ownerID: 1, ownernameEn: "John" } },
};

describe("useGetDariOwnerDetail (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is not enabled when ownerId undefined", () => {
    const { result } = renderHook(() => useGetDariOwnerDetail(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches owner detail and returns owner object", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(() => useGetDariOwnerDetail("99"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/dari/owner/details/99");
    expect(result.current.data).toEqual(mockResponse.result.owner);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useGetDariOwnerDetail("99"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
