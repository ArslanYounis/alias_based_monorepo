/**
 * Tests for useGetApplicationDetails shared hook.
 *
 * axios is mocked; every test gets a fresh QueryClient so queries
 * never share state across tests.
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { useGetApplicationDetails } from "@shared/hooks/useGetApplicationDetails";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockApplicationResponse = {
  result: {
    application: {
      applicationNumber: "APP-001",
      applicationCreatedDate: "2024-01-01",
      applicationReferenceNumber: "REF-001",
    },
    owners: [{ ownerId: "O1", ownerNameE: "John" }],
    plot: { plotId: "P1", plotNumber: "1234" },
    steps: [],
    documents: [],
  },
};

describe("useGetApplicationDetails (shared hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("is not enabled when applicationId is undefined", () => {
    const { result } = renderHook(() => useGetApplicationDetails(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is not enabled when applicationId is empty string", () => {
    const { result } = renderHook(() => useGetApplicationDetails(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns a query object with data, isPending, isError", () => {
    const { result } = renderHook(() => useGetApplicationDetails(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("data");
  });

  // ── Enabled state with data ───────────────────────────────────────────────

  it("fetches application details when applicationId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockApplicationResponse });
    const { result } = renderHook(
      () => useGetApplicationDetails("APP-001"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockApplicationResponse);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/ranch/application-detail",
      { params: { args: "APP-001" } }
    );
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("sets isError when the API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(
      () => useGetApplicationDetails("APP-FAIL"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });

  // ── Query key ─────────────────────────────────────────────────────────────

  it("passes different applicationIds as different query keys", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApplicationResponse });
    const { result: r1 } = renderHook(
      () => useGetApplicationDetails("A1"),
      { wrapper: createWrapper() }
    );
    const { result: r2 } = renderHook(
      () => useGetApplicationDetails("A2"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(r1.current.isSuccess).toBe(true));
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  // ── Cover queryFn guard branch (if !applicationId) via refetch ────────────

  it("covers queryFn guard branch when applicationId is undefined via refetch", async () => {
    const { result } = renderHook(
      () => useGetApplicationDetails(undefined),
      { wrapper: createWrapper() }
    );
    // refetch bypasses enabled=false and calls queryFn with no applicationId,
    // hitting the `if (!applicationId)` return branch
    await result.current.refetch();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});
