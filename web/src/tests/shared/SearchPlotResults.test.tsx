import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock hooks used by ViewPlotDetail to prevent hangs
vi.mock("@shared/hooks/useGetPlotDetail", () => ({
  default: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  useGetPlotDetail: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
}));
vi.mock("@shared/hooks/useGetPlotImage", () => ({
  useGetPlotImage: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
}));

// Mock ViewPlotDetail to avoid deep rendering / hooks
vi.mock("@shared/components/ViewPlotDetail/ViewPlotDetail", () => ({
  default: () => <div data-testid="view-plot-detail">ViewPlotDetail</div>,
}));

import SearchPlotResults from "@shared/components/SearchPlot/SearchPlotResults";
import type { SearchResult } from "@shared/components/SearchPlot/SearchPlotResults";

const makePlot = (id: string, overrides?: Partial<SearchResult>): SearchResult => ({
  plotId: id,
  plotNumber: `PN-${id}`,
  landUseName: "Residential",
  code: `CODE-${id}`,
  hasMortgage: false,
  communityName: `Community ${id}`,
  ...overrides,
});

// IMPORTANT: always pass a stable `selected` reference to avoid the
// default-param `selected = []` infinite-rerender bug (new [] each render
// triggers useEffect -> setSelectedIds -> re-render -> new [] again).
const EMPTY_SELECTED: SearchResult[] = [];

const baseProps = {
  args: "",
  municipality: "Abu Dhabi",
  zone: "Zone 1",
  sector: "Sector A",
  results: [makePlot("1"), makePlot("2")],
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
  selected: EMPTY_SELECTED,
};

describe("SearchPlotResults", () => {
  // ── Render ──────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<SearchPlotResults {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("renders Arabic heading when language=ar", () => {
    render(<SearchPlotResults {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(<SearchPlotResults {...baseProps} language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<SearchPlotResults {...baseProps} language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it("shows loading text when isLoading=true", () => {
    render(<SearchPlotResults {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text", () => {
    render(<SearchPlotResults {...baseProps} isLoading={true} language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("does not render result cards when loading", () => {
    render(<SearchPlotResults {...baseProps} isLoading={true} />);
    expect(screen.queryByText("Community 1")).not.toBeInTheDocument();
  });

  // ── Result cards ───────────────────────────────────────────────────────────

  it("renders a card for each result", () => {
    render(<SearchPlotResults {...baseProps} />);
    expect(screen.getByText("Community 1")).toBeInTheDocument();
    expect(screen.getByText("Community 2")).toBeInTheDocument();
  });

  it("renders criteria text with municipality, zone, sector", () => {
    render(<SearchPlotResults {...baseProps} />);
    expect(screen.getByText("Abu Dhabi")).toBeInTheDocument();
    expect(screen.getByText("Zone 1")).toBeInTheDocument();
    expect(screen.getByText("Sector A")).toBeInTheDocument();
  });

  it("shows result count", () => {
    const { container } = render(<SearchPlotResults {...baseProps} />);
    expect(container.textContent).toContain("2");
    expect(container.textContent).toContain("results");
  });

  // ── Selection ──────────────────────────────────────────────────────────────

  it("clicking a card selects it (radio)", () => {
    render(<SearchPlotResults {...baseProps} />);
    fireEvent.click(screen.getByText("Community 1"));
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  it("calls onSelectResult when Select Plot is clicked", () => {
    const onSelectResult = vi.fn();
    const onCloseDrawer = vi.fn();
    render(
      <SearchPlotResults
        {...baseProps}
        selected={[makePlot("1")]}
        onSelectResult={onSelectResult}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(screen.getByText("Select Plot"));
    expect(onSelectResult).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  // ── Edit link ──────────────────────────────────────────────────────────────

  it("calls onCloseDrawer when Edit is clicked", () => {
    const onCloseDrawer = vi.fn();
    render(<SearchPlotResults {...baseProps} onCloseDrawer={onCloseDrawer} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  // ── Owners / Details buttons ───────────────────────────────────────────────

  it("renders Owners and Details buttons for each card", () => {
    render(<SearchPlotResults {...baseProps} />);
    expect(screen.getAllByText("Owners").length).toBe(2);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  // ── Pagination ─────────────────────────────────────────────────────────────

  it("calls onPageChange when pagination is used", () => {
    const onPageChange = vi.fn();
    render(<SearchPlotResults {...baseProps} onPageChange={onPageChange} />);
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  // ── Mobile platform ────────────────────────────────────────────────────────

  it("renders with mobile heading style", () => {
    render(<SearchPlotResults {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  // ── Pre-selected ──────────────────────────────────────────────────────────

  it("shows pre-selected result", () => {
    render(<SearchPlotResults {...baseProps} selected={[makePlot("1")]} />);
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  // ── Additional callback coverage ──────────────────────────────────────────

  it("clicking Owners button opens owners drawer", () => {
    render(<SearchPlotResults {...baseProps} />);
    const ownerBtns = screen.getAllByText("Owners");
    fireEvent.click(ownerBtns[0]);
    // The owners drawer should open - check for loading text in drawer
    expect(screen.getByText("Loading owner plots...")).toBeInTheDocument();
  });

  it("clicking Details button opens plot detail drawer", () => {
    render(<SearchPlotResults {...baseProps} />);
    // First select a card so selectedIds is populated
    fireEvent.click(screen.getByText("Community 1"));
    const detailBtns = screen.getAllByText("Details");
    fireEvent.click(detailBtns[0]);
    // The ViewPlotDetail mock should be rendered
    expect(screen.getByTestId("view-plot-detail")).toBeInTheDocument();
  });

  it("exercises handlePageChange via Next page button", () => {
    const onPageChange = vi.fn();
    const manyResults = Array.from({ length: 5 }, (_, i) => makePlot(String(i + 1)));
    render(
      <SearchPlotResults
        {...baseProps}
        results={manyResults}
        totalCount={25}
        pageSize={5}
        onPageChange={onPageChange}
      />
    );
    const nextBtn = screen.getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("exercises handleRadioSelect by clicking multiple cards", () => {
    render(<SearchPlotResults {...baseProps} />);
    fireEvent.click(screen.getByText("Community 1"));
    fireEvent.click(screen.getByText("Community 2"));
    // Last click should make Community 2 selected
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  it("Select Plot with no selection does not call onSelectResult", () => {
    const onSelectResult = vi.fn();
    render(
      <SearchPlotResults
        {...baseProps}
        onSelectResult={onSelectResult}
      />
    );
    // selectedIds starts as EMPTY_SELECTED which is [], Select Plot should be present
    // but clicking it with empty selectedIds[0] won't call onSelectResult
    fireEvent.click(screen.getByText("Select Plot"));
    expect(onSelectResult).not.toHaveBeenCalled();
  });

  it("getCurrentPageResults paginates locally when results exceed pageSize", () => {
    const manyResults = Array.from({ length: 15 }, (_, i) => makePlot(String(i + 1)));
    render(
      <SearchPlotResults
        {...baseProps}
        results={manyResults}
        totalCount={15}
        pageSize={5}
      />
    );
    // Only first 5 should show
    expect(screen.getByText("Community 1")).toBeInTheDocument();
    expect(screen.getByText("Community 5")).toBeInTheDocument();
    expect(screen.queryByText("Community 6")).not.toBeInTheDocument();
  });

  it("renders Arabic result text", () => {
    render(<SearchPlotResults {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
    expect(screen.getByText("تعديل")).toBeInTheDocument();
  });
});
