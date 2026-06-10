import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import axios from "axios";
import { useGetApplicationDetails } from "@shared/hooks/useGetApplicationDetails";

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

const mockApplicationDetails = {
  result: {
    application: {
      applicationNumber: "APP-001",
      applicationCreatedDate: "2024-01-01",
      applicationReferenceNumber: "REF-001",
    },
    owners: [{ ownerId: "1", ownerName: "John Doe" }],
    plot: { plotId: "123", plotNumber: "P-123" },
    steps: [{ stepId: 1, stepName: "Submitted" }],
    documents: [{ documentId: 1, documentName: "ID" }],
  },
};

describe("useGetApplicationDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is disabled and does not fetch when no applicationId is provided", () => {
    const { result } = renderHook(() => useGetApplicationDetails(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches application details when applicationId is provided", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApplicationDetails });

    const { result } = renderHook(
      () => useGetApplicationDetails("APP-001"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith("/ranch/application-detail", {
      params: { args: "APP-001" },
    });
    expect(result.current.data).toEqual(mockApplicationDetails);
  });

  it("returns correct data shape on success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApplicationDetails });

    const { result } = renderHook(
      () => useGetApplicationDetails("APP-001"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data as typeof mockApplicationDetails;
    expect(data.result.application.applicationNumber).toBe("APP-001");
    expect(data.result.owners).toHaveLength(1);
    expect(data.result.plot.plotId).toBe("123");
    expect(data.result.steps).toHaveLength(1);
    expect(data.result.documents).toHaveLength(1);
  });

  it("sets isError on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(
      () => useGetApplicationDetails("APP-FAIL"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("uses correct query key with applicationId", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApplicationDetails });

    const { result } = renderHook(
      () => useGetApplicationDetails("APP-999"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAxios.get).toHaveBeenCalledWith("/ranch/application-detail", {
      params: { args: "APP-999" },
    });
  });

  it("is loading initially when applicationId is provided", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(
      () => useGetApplicationDetails("APP-001"),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
  });
});
