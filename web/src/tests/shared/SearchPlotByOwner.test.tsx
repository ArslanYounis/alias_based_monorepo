import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGetSearchByOwner = vi.fn(() =>
  Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })
);

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  useGetSearchByOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByOwner: (...args: unknown[]) => mockGetSearchByOwner(...(args as [])),
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

import ByOwner from "@shared/components/SearchPlot/ByOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchPlot ByOwner", () => {
  // ── Render ────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByOwner language="en" />);
  });

  it("renders National Number label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders Owner Name label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
  });

  it("renders Family Name label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Family Name")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("الرقم الوطني")).toBeInTheDocument();
    expect(screen.getByText("اسم المالك")).toBeInTheDocument();
    expect(screen.getByText("اسم العائلة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<ByOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Props ─────────────────────────────────────────────────────────────────

  it("renders with selected prop", () => {
    renderWithQueryClient(<ByOwner language="en" selected={[]} />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<ByOwner language="en" args="test" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  // ── Optional dynamic fields (MultiSelect) ───────────────────────────────────

  it("reveals all optional fields and can remove one again", async () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const combo = screen.getByText("Add search type");
    for (const label of [
      "Passport Number",
      "Abu Dhabi Archive No",
      "Family No / City",
      "Western Region Archive No",
      "Moi Unified Number",
      "Al Ain Archive No",
    ]) {
      fireEvent.click(combo);
      const option = await screen.findByText(label);
      fireEvent.click(option);
    }
    await waitFor(() => {
      expect(screen.getByText("Family No/City")).toBeInTheDocument();
      expect(screen.getByText("MOI Unified Number")).toBeInTheDocument();
      expect(screen.getByText("Al Ain Archive Number")).toBeInTheDocument();
    });
    // remove Moi Unified Number -> exercises useEffect resetField branch
    fireEvent.click(combo);
    const optionAgain = await screen.findByText("Moi Unified Number");
    fireEvent.click(optionAgain);
    await waitFor(() => {
      expect(screen.queryByText("MOI Unified Number")).not.toBeInTheDocument();
    });
  });

  // ── Submit flow ─────────────────────────────────────────────────────────────

  it("calls getSearchByOwner and opens the results drawer on Search", async () => {
    mockGetSearchByOwner.mockClear();
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 5, ownerName: "Mapped" },
        { ownerId: null, ownerName: null },
      ],
      pageNumber: 0,
      totalCount: 2,
    } as never);
    renderWithQueryClient(<ByOwner language="en" onSubmit={() => {}} />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetSearchByOwner).toHaveBeenCalled());
    await screen.findByTestId("search-owner-result");
  });

  it("submits in Arabic with no items returned", async () => {
    mockGetSearchByOwner.mockClear();
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
    } as never);
    renderWithQueryClient(<ByOwner language="ar" />);
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => expect(mockGetSearchByOwner).toHaveBeenCalled());
  });

  it("handles pagination and drawer close from the result view", async () => {
    mockGetSearchByOwner.mockClear();
    renderWithQueryClient(<ByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("search-owner-result");
    const after = mockGetSearchByOwner.mock.calls.length;
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [{ ownerId: 9, ownerName: "P" }, { ownerId: null, ownerName: null }],
      pageNumber: 1,
      totalCount: 2,
    } as never);
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() =>
      expect(mockGetSearchByOwner.mock.calls.length).toBeGreaterThan(after)
    );
    fireEvent.click(screen.getByTestId("close-drawer"));
  });

  it("logs an error when the search request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByOwner.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<ByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(errSpy).toHaveBeenCalled());
    errSpy.mockRestore();
  });

  it("logs an unknown error when search rejects with a non-Error", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByOwner.mockRejectedValueOnce("string failure");
    renderWithQueryClient(<ByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(errSpy).toHaveBeenCalledWith("Unknown error", "string failure")
    );
    errSpy.mockRestore();
  });

  it("logs an error when pagination request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByOwner.mockClear();
    renderWithQueryClient(<ByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("search-owner-result");
    mockGetSearchByOwner.mockRejectedValueOnce(new Error("page boom"));
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
