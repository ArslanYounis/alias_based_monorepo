import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetWorkflows } from "@shared/hooks/useGetWorkflows";

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
  "Group A": [
    { workflowID: 1, workflowNameEn: "WF One", workflowNameAr: "ون" },
  ],
  "Group B": [
    { workflowID: 2, workflowNameEn: "WF Two", workflowNameAr: "تو" },
  ],
};

describe("useGetWorkflows", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is disabled when enabled=false", () => {
    const { result } = renderHook(() => useGetWorkflows(false), {
      wrapper: createWrapper(),
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.groups).toEqual([]);
  });

  it("fetches by default and normalises groups", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/dari/workflow/get-workflows"
    );
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.groups).toEqual([
      { key: "Group A", workflows: mockResponse["Group A"] },
      { key: "Group B", workflows: mockResponse["Group B"] },
    ]);
  });

  it("returns empty groups when data is empty object", async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.groups).toEqual([]);
  });

  it("returns empty groups when response data is null", async () => {
    mockedAxios.get.mockResolvedValue({ data: null });
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({});
    expect(result.current.groups).toEqual([]);
  });

  it("sets isError on failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useGetWorkflows(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
