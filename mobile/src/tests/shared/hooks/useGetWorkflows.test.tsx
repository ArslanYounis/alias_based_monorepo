/**
 * Tests for useGetWorkflows shared hook (mobile).
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetWorkflows } from "@shared/hooks/useGetWorkflows";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse = {
  "Group A": [{ workflowID: 1, workflowNameEn: "WF1", workflowNameAr: "WF1A" }],
  "Group B": [{ workflowID: 2, workflowNameEn: "WF2", workflowNameAr: "WF2A" }],
};

describe("useGetWorkflows (shared hook)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns empty groups when data undefined", () => {
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });
    expect(result.current.groups).toEqual([]);
  });

  it("is not enabled when enabled=false", () => {
    const { result } = renderHook(() => useGetWorkflows(false), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches and normalises keyed response into groups", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/dari/workflow/get-workflows"
    );
    expect(result.current.groups).toEqual([
      { key: "Group A", workflows: mockResponse["Group A"] },
      { key: "Group B", workflows: mockResponse["Group B"] },
    ]);
  });

  it("defaults to {} when response data is null", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.groups).toEqual([]);
  });

  it("sets isError on API failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
