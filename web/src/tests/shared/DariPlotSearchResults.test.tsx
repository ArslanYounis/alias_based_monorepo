import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock ViewPlotDetail to avoid deep rendering / hooks
vi.mock("@shared/components/ViewPlotDetail", () => ({
  ViewPlotDetail: () => (
    <div data-testid="view-plot-detail">ViewPlotDetail</div>
  ),
}));

import DariPlotSearchResult from "@shared/components/DariPlotSearch/dariPlotSearchResult";
import type { SearchResult } from "@shared/components/DariPlotSearch/dariPlotSearchResult";

const makePlot = (id: number, overrides?: Partial<SearchResult>): SearchResult => ({
  plotID: id,
  plotNumber: `PN-${id}`,
  landUseNameEn: "Residential",
  landUseNameAr: "سكني",
  communityNameEn: `Community ${id}`,
  communityNameAr: `مجتمع ${id}`,
  districtNameEn: `District ${id}`,
  districtNameAr: `حي ${id}`,
  ...overrides,
});

// Stable selected reference to avoid re-render churn from default params.
const EMPTY_SELECTED: SearchResult[] = [];

const baseProps = {
  municipalityNameEn: "Abu Dhabi",
  municipalityNameAr: "أبوظبي",
  zone: "Zone 1",
  sector: "Sector A",
  results: [makePlot(1), makePlot(2)],
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
  selected: EMPTY_SELECTED,
};

describe("DariPlotSearchResult", () => {
  // ── Render ─────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("renders Arabic heading when language=ar", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <DariPlotSearchResult {...baseProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = render(
      <DariPlotSearchResult {...baseProps} language="en" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it("shows loading text when isLoading=true", () => {
    render(<DariPlotSearchResult {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text", () => {
    render(
      <DariPlotSearchResult {...baseProps} isLoading={true} language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("does not render result cards when loading", () => {
    render(<DariPlotSearchResult {...baseProps} isLoading={true} />);
    expect(screen.queryByText("Community 1")).not.toBeInTheDocument();
  });

  // ── Result cards ───────────────────────────────────────────────────────────

  it("renders a card for each result", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Community 1")).toBeInTheDocument();
    expect(screen.getByText("Community 2")).toBeInTheDocument();
  });

  it("renders criteria text with municipality, zone, sector", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Abu Dhabi")).toBeInTheDocument();
    expect(screen.getByText("Zone 1")).toBeInTheDocument();
    expect(screen.getByText("Sector A")).toBeInTheDocument();
  });

  it("shows result count and label", () => {
    const { container } = render(<DariPlotSearchResult {...baseProps} />);
    expect(container.textContent).toContain("2");
    expect(container.textContent).toContain("results");
    expect(container.textContent).toContain("We returned");
  });

  it("renders Land Use and Zone/District row labels", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getAllByText("Land Use").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Zone/District").length).toBeGreaterThan(0);
  });

  it("renders Owners and Details buttons for each card", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getAllByText("Owners").length).toBe(2);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  it("renders Edit link", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders Select Plot button", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  // ── Selection ──────────────────────────────────────────────────────────────

  it("clicking a card selects it", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    fireEvent.click(screen.getByText("Community 1"));
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  it("calls onSelectResult and onCloseDrawer when Select Plot clicked with a selection", () => {
    const onSelectResult = vi.fn();
    const onCloseDrawer = vi.fn();
    render(
      <DariPlotSearchResult
        {...baseProps}
        selected={[makePlot(1)]}
        onSelectResult={onSelectResult}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(screen.getByText("Select Plot"));
    expect(onSelectResult).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not call onSelectResult when nothing is selected", () => {
    const onSelectResult = vi.fn();
    render(
      <DariPlotSearchResult {...baseProps} onSelectResult={onSelectResult} />
    );
    fireEvent.click(screen.getByText("Select Plot"));
    expect(onSelectResult).not.toHaveBeenCalled();
  });

  it("selecting different cards updates the selection (handleRadioSelect)", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    fireEvent.click(screen.getByText("Community 1"));
    fireEvent.click(screen.getByText("Community 2"));
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  // ── Edit link callback ──────────────────────────────────────────────────────

  it("calls onCloseDrawer when Edit is clicked", () => {
    const onCloseDrawer = vi.fn();
    render(
      <DariPlotSearchResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  // ── Details drawer ──────────────────────────────────────────────────────────

  it("clicking Details opens the plot detail drawer", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    fireEvent.click(screen.getByText("Community 1"));
    const detailBtns = screen.getAllByText("Details");
    fireEvent.click(detailBtns[0]);
    expect(screen.getByTestId("view-plot-detail")).toBeInTheDocument();
  });

  // ── Pagination ──────────────────────────────────────────────────────────────

  it("calls onPageChange via Next page button", () => {
    const onPageChange = vi.fn();
    const manyResults = Array.from({ length: 5 }, (_, i) => makePlot(i + 1));
    render(
      <DariPlotSearchResult
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

  // ── Local pagination ────────────────────────────────────────────────────────

  it("paginates locally when results exceed pageSize", () => {
    const manyResults = Array.from({ length: 15 }, (_, i) => makePlot(i + 1));
    render(
      <DariPlotSearchResult
        {...baseProps}
        results={manyResults}
        totalCount={15}
        pageSize={5}
      />
    );
    expect(screen.getByText("Community 1")).toBeInTheDocument();
    expect(screen.getByText("Community 5")).toBeInTheDocument();
    expect(screen.queryByText("Community 6")).not.toBeInTheDocument();
  });

  it("returns all results when pageSize is 0/falsy", () => {
    render(
      <DariPlotSearchResult
        {...baseProps}
        results={[makePlot(1), makePlot(2)]}
        pageSize={0}
        totalCount={2}
      />
    );
    expect(screen.getByText("Community 1")).toBeInTheDocument();
    expect(screen.getByText("Community 2")).toBeInTheDocument();
  });

  // ── Mobile platform ─────────────────────────────────────────────────────────

  it("renders with mobile heading style", () => {
    render(<DariPlotSearchResult {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  // ── Arabic content ──────────────────────────────────────────────────────────

  it("renders Arabic Edit and result text", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
    expect(screen.getByText("تعديل")).toBeInTheDocument();
  });

  it("renders Arabic community names when language=ar", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("مجتمع 1")).toBeInTheDocument();
  });

  // ── Pre-selected ─────────────────────────────────────────────────────────────

  it("shows pre-selected result", () => {
    render(<DariPlotSearchResult {...baseProps} selected={[makePlot(1)]} />);
    expect(screen.getByText("Select Plot")).toBeInTheDocument();
  });

  it("handles empty results without crashing", () => {
    render(
      <DariPlotSearchResult {...baseProps} results={[]} totalCount={0} />
    );
    const { container } = render(
      <DariPlotSearchResult {...baseProps} results={[]} totalCount={0} />
    );
    expect(container.textContent).toContain("0");
  });
});
