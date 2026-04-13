import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock ViewPlotDetail to avoid deep rendering / hooks
vi.mock("@shared/components/ViewPlotDetail/ViewPlotDetail", () => ({
  default: () => <div data-testid="view-plot-detail">ViewPlotDetail</div>,
}));

import SearchOwnerPlotsResult from "@shared/components/SearchPlot/SearchOwnerPlotsResult";
import type { IOwnerPlotsSearchResult } from "@shared/components/SearchPlot/SearchOwnerPlotsResult";

const makePlot = (id: string): IOwnerPlotsSearchResult => ({
  id,
  plotId: id,
  communityName: `Community ${id}`,
  districtname: `District ${id}`,
  landuseName: `Land Use ${id}`,
});

describe("SearchOwnerPlotsResult", () => {
  const baseProps = {
    plots: [makePlot("1"), makePlot("2")],
    isLoading: false,
    language: "en" as const,
  };

  // ── Render ────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<SearchOwnerPlotsResult {...baseProps} />);
    // Both heading and button say "Select Plot", so use getAllByText
    expect(screen.getAllByText("Select Plot").length).toBeGreaterThanOrEqual(1);
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it("shows loading text when isLoading=true", () => {
    render(<SearchOwnerPlotsResult {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text", () => {
    render(<SearchOwnerPlotsResult {...baseProps} isLoading={true} language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it("shows 'No plots found' when plots is empty", () => {
    render(<SearchOwnerPlotsResult {...baseProps} plots={[]} />);
    expect(screen.getByText("No plots found")).toBeInTheDocument();
  });

  it("shows Arabic empty text", () => {
    render(<SearchOwnerPlotsResult {...baseProps} plots={[]} language="ar" />);
    expect(screen.getByText("لم يتم العثور على قطع")).toBeInTheDocument();
  });

  // ── Plot cards ────────────────────────────────────────────────────────────

  it("renders a card for each plot", () => {
    render(<SearchOwnerPlotsResult {...baseProps} />);
    expect(screen.getByText("Community 1")).toBeInTheDocument();
    expect(screen.getByText("Community 2")).toBeInTheDocument();
  });

  it("renders district and land use in cards", () => {
    render(<SearchOwnerPlotsResult {...baseProps} />);
    expect(screen.getByText("District 1")).toBeInTheDocument();
    expect(screen.getByText("Land Use 1")).toBeInTheDocument();
  });

  it("renders Details button for each card", () => {
    render(<SearchOwnerPlotsResult {...baseProps} />);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  // ── Selection ─────────────────────────────────────────────────────────────

  it("calls onSelectPlot when a card is clicked", () => {
    const onSelectPlot = vi.fn();
    render(<SearchOwnerPlotsResult {...baseProps} onSelectPlot={onSelectPlot} />);
    fireEvent.click(screen.getByText("Community 1"));
    expect(onSelectPlot).toHaveBeenCalledWith(makePlot("1"));
  });

  it("Select Plot button is disabled when no plots selected", () => {
    render(<SearchOwnerPlotsResult {...baseProps} selectedPlots={[]} />);
    // Find the bottom "Select Plot" button (heading also says "Select Plot")
    const buttons = screen.getAllByText("Select Plot");
    const btn = buttons.find((b) => b.closest("button"));
    expect(btn?.closest("button")).toBeDisabled();
  });

  // ── Submit ────────────────────────────────────────────────────────────────

  it("calls onSubmit and onCloseDrawer when Select Plot is clicked with selection", () => {
    const onSubmit = vi.fn();
    const onCloseDrawer = vi.fn();
    render(
      <SearchOwnerPlotsResult
        {...baseProps}
        selectedPlots={[makePlot("1")]}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    const buttons = screen.getAllByText("Select Plot");
    const btn = buttons.find((b) => b.closest("button") && !b.closest("button")?.disabled);
    fireEvent.click(btn!);
    expect(onSubmit).toHaveBeenCalledWith(makePlot("1"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not call onSubmit when selectedPlots has no plotId", () => {
    const onSubmit = vi.fn();
    render(
      <SearchOwnerPlotsResult
        {...baseProps}
        selectedPlots={[{ id: "x" }]}
        onSubmit={onSubmit}
      />
    );
    const buttons = screen.getAllByText("Select Plot");
    const btn = buttons.find((b) => b.closest("button") && !b.closest("button")?.disabled);
    if (btn) fireEvent.click(btn);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic heading", () => {
    render(<SearchOwnerPlotsResult {...baseProps} language="ar" />);
    // Both the heading and button say "اختر القطعة", so use getAllByText
    const elements = screen.getAllByText("اختر القطعة");
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });
});
