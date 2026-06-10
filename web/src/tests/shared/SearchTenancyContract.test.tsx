import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Mock axios (used indirectly by the hook module) ──────────────────────────
vi.mock("axios", () => ({
  default: { get: vi.fn(() => Promise.resolve({ data: { result: {} } })) },
}));

// ── Mock the data fetcher used by useMutation ────────────────────────────────
const mockGetTenancyContracts = vi.fn();
vi.mock("@shared/hooks/useGetTenancyContracts", async () => {
  return {
    getTenancyContracts: (...args: unknown[]) => mockGetTenancyContracts(...args),
  };
});

// ── Mock the results child + drawer so we can inspect what gets passed ────────
vi.mock("@shared/components/SearchTenancyContract/searchTenancyContractResult", () => ({
  default: (props: any) => (
    <div data-testid="results">
      <span data-testid="results-count">{props.results.length}</span>
      <span data-testid="results-total">{props.totalCount}</span>
      <span data-testid="results-pagesize">{props.pageSize}</span>
      <span data-testid="results-loading">{String(props.isLoading)}</span>
      <button data-testid="results-page" onClick={() => props.onPageChange?.(2)}>
        page
      </button>
      <button data-testid="results-submit" onClick={() => props.onSubmit?.(props.results)}>
        submit
      </button>
      <button data-testid="results-close" onClick={() => props.onCloseDrawer?.()}>
        close
      </button>
    </div>
  ),
}));

// Drawer that simply renders children when open so we can assert results.
vi.mock("@platform/CustomDrawer", () => ({
  CustomDrawer: (props: any) =>
    props.open ? <div data-testid="drawer">{props.children}</div> : null,
}));

import SearchTenancyContract from "@shared/components/SearchTenancyContract/searchTenancyContract";

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

beforeEach(() => {
  mockGetTenancyContracts.mockReset();
});

describe("SearchTenancyContract (shared component – web platform)", () => {
  // ── Default render ───────────────────────────────────────────────────────────
  it("renders the contract type radios", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.getByText("New Tenancy")).toBeInTheDocument();
    expect(screen.getByText("Renew Tenancy")).toBeInTheDocument();
  });

  it("renders the form labels", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.getByText("Contract Number")).toBeInTheDocument();
    expect(screen.getByText("Contract Start Date")).toBeInTheDocument();
    expect(screen.getByText("Match Type")).toBeInTheDocument();
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders the Search button", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("does not show the drawer/results before searching", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  // ── Arabic ───────────────────────────────────────────────────────────────────
  it("renders Arabic labels when language=ar", () => {
    renderWithClient(<SearchTenancyContract language="ar" />);
    expect(screen.getByText("نوع عقد الايجار")).toBeInTheDocument();
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Contract type selection ──────────────────────────────────────────────────
  it("allows switching the contract type radio", () => {
    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Renew Tenancy"));
    expect(screen.getByText("Renew Tenancy")).toBeInTheDocument();
  });

  // ── Search submit → opens drawer with mapped results ─────────────────────────
  it("submits the search, opens the drawer and passes mapped results", async () => {
    mockGetTenancyContracts.mockResolvedValue({
      items: [
        { tenancyContractId: "1", contractNumber: "CN-1", startDate: "2026-01-01", isRenew: 0 },
        { tenancyContractId: "2", contractNumber: "CN-2", startDate: "2026-01-02", isRenew: 1 },
      ],
      totalCount: 2,
      pageNumber: 0,
    });

    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() =>
      expect(screen.getByTestId("drawer")).toBeInTheDocument()
    );
    expect(screen.getByTestId("results-count")).toHaveTextContent("2");
    expect(screen.getByTestId("results-total")).toHaveTextContent("2");
    expect(mockGetTenancyContracts).toHaveBeenCalledTimes(1);
  });

  it("sends contractType '0' for new and pageNumber 0 in the payload", async () => {
    mockGetTenancyContracts.mockResolvedValue({ items: [], totalCount: 0, pageNumber: 0 });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalled());
    const payload = mockGetTenancyContracts.mock.calls[0][0];
    expect(payload).toMatchObject({ contractType: "0", pageNumber: 0 });
    expect(payload.pageSize).toBe(5);
  });

  it("sends contractType '1' when renew is selected", async () => {
    mockGetTenancyContracts.mockResolvedValue({ items: [], totalCount: 0, pageNumber: 0 });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Renew Tenancy"));
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalled());
    expect(mockGetTenancyContracts.mock.calls[0][0]).toMatchObject({ contractType: "1" });
  });

  it("handles a response with no items (defaults to empty results)", async () => {
    mockGetTenancyContracts.mockResolvedValue({ totalCount: 0, pageNumber: 0 });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeInTheDocument());
    expect(screen.getByTestId("results-count")).toHaveTextContent("0");
  });

  // ── Search submit error path ─────────────────────────────────────────────────
  it("does not open the drawer when the search request fails", async () => {
    mockGetTenancyContracts.mockRejectedValue(new Error("boom"));
    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalled());
    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  // ── Pagination via child callback ────────────────────────────────────────────
  it("re-fetches with the next page number when onPageChange fires", async () => {
    mockGetTenancyContracts
      .mockResolvedValueOnce({
        items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
        totalCount: 10,
        pageNumber: 0,
      })
      .mockResolvedValueOnce({
        items: [{ tenancyContractId: "2", contractNumber: "CN-2", startDate: "y", isRenew: 0 }],
        totalCount: 10,
        pageNumber: 1,
      });

    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("results-page"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalledTimes(2));
    // page 2 → pageNumber index 1
    expect(mockGetTenancyContracts.mock.calls[1][0]).toMatchObject({ pageNumber: 1 });
  });

  it("logs an error and keeps the drawer open when pagination fetch fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetTenancyContracts
      .mockResolvedValueOnce({
        items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
        totalCount: 10,
        pageNumber: 0,
      })
      .mockRejectedValueOnce(new Error("page boom"));

    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("results-page"));
    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  // ── Child callbacks: submit + close ──────────────────────────────────────────
  it("forwards onSubmit from the results child to the consumer", async () => {
    const onSubmit = vi.fn();
    mockGetTenancyContracts.mockResolvedValue({
      items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
      totalCount: 1,
      pageNumber: 0,
    });
    renderWithClient(<SearchTenancyContract onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("results-submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("closes the drawer when the results child requests it", async () => {
    mockGetTenancyContracts.mockResolvedValue({
      items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
      totalCount: 1,
      pageNumber: 0,
    });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("results-close"));
    await waitFor(() => expect(screen.queryByTestId("drawer")).not.toBeInTheDocument());
  });

  // ── Platform / selected props ────────────────────────────────────────────────
  it("renders with mobile platform", () => {
    renderWithClient(<SearchTenancyContract platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("accepts a selected prop without crashing", () => {
    renderWithClient(
      <SearchTenancyContract
        selected={[
          { tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 },
        ]}
      />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
  });
});
