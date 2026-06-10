import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGetSearchByCompanyOwner = vi.fn(() =>
  Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })
);

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  useGetSearchByCompanyOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByCompanyOwner: (...args: unknown[]) =>
    mockGetSearchByCompanyOwner(...(args as [])),
}));

// Mock sub-components to avoid deep rendering
vi.mock("@shared/components/SearchPlot/SearchOwnerResult", () => ({
  default: (props: any) => (
    <div data-testid="search-owner-result">
      OwnerResult
      <button data-testid="page-change" onClick={() => props.onPageChange?.(2)}>
        page
      </button>
      <button data-testid="close-drawer" onClick={() => props.onCloseDrawer?.()}>
        close
      </button>
    </div>
  ),
}));

import ByCompanyOwner from "@shared/components/SearchPlot/ByCompanyOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchPlot ByCompanyOwner", () => {
  // ── Render ────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
  });

  it("renders Company Name label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders Certificate Number label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
    expect(screen.getByText("رقم الشهادة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Props ─────────────────────────────────────────────────────────────────

  it("renders with selected prop", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" selected={[]} />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" args="test" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  // ── Optional dynamic fields (MultiSelect) ───────────────────────────────────

  it("reveals all optional fields and can remove one again", async () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const combo = screen.getByText("Add search type");
    for (const label of [
      "Trade License",
      "Western Region Archive No",
      "Abu Dhabi Archive No",
      "Al Ain Archive No",
    ]) {
      fireEvent.click(combo);
      const option = await screen.findByText(label);
      fireEvent.click(option);
    }
    await waitFor(() => {
      expect(screen.getByText("Western Region Archive No.")).toBeInTheDocument();
      expect(screen.getByText("Abu Dhabi Archive No.")).toBeInTheDocument();
      expect(screen.getByText("Al Ain Archive No.")).toBeInTheDocument();
    });
    // remove Trade License -> exercises useEffect resetField branch
    fireEvent.click(combo);
    const optionEls = await screen.findAllByText("Trade License");
    const tradeOption = optionEls
      .map((el) => el.closest('[role="option"]'))
      .find(Boolean) as HTMLElement;
    fireEvent.click(tradeOption);
  });

  // ── Submit flow ─────────────────────────────────────────────────────────────

  it("calls getSearchByCompanyOwner and opens the results drawer on Search", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 5, companyName: "ACME", certificateNumber: "C1", tradeLicense: "T1" },
        { ownerId: null, companyName: null, certificateNumber: null, tradeLicense: null },
      ],
      pageNumber: 0,
      totalCount: 2,
    } as never);
    renderWithQueryClient(<ByCompanyOwner language="en" onSubmit={() => {}} />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetSearchByCompanyOwner).toHaveBeenCalled());
    await screen.findByTestId("search-owner-result");
  });

  it("submits in Arabic with no items returned", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
    } as never);
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => expect(mockGetSearchByCompanyOwner).toHaveBeenCalled());
  });

  it("swallows the submit error without crashing", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    mockGetSearchByCompanyOwner.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetSearchByCompanyOwner).toHaveBeenCalled());
    // drawer should not have opened
    expect(screen.queryByTestId("search-owner-result")).not.toBeInTheDocument();
  });

  it("handles pagination and drawer close from the result view", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("search-owner-result");
    const after = mockGetSearchByCompanyOwner.mock.calls.length;
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 9, companyName: "Page Co" },
        { ownerId: null, companyName: null },
      ],
      pageNumber: 1,
      totalCount: 2,
    } as never);
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() =>
      expect(mockGetSearchByCompanyOwner.mock.calls.length).toBeGreaterThan(after)
    );
    fireEvent.click(screen.getByTestId("close-drawer"));
  });

  it("logs an error when pagination request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByCompanyOwner.mockClear();
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("search-owner-result");
    mockGetSearchByCompanyOwner.mockRejectedValueOnce(new Error("page boom"));
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() =>
      expect(errSpy).toHaveBeenCalledWith(
        "Pagination fetch failed:",
        expect.any(Error)
      )
    );
    errSpy.mockRestore();
  });
});
