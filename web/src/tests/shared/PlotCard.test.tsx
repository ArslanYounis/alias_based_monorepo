import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlotCard from "@shared/components/PlotCard/PlotCard";

const samplePlots = [
  {
    plotId: "1",
    plotArgs: "args-1",
    plotNumber: "PLT-001",
    plotNumber_ar: "PLT-001",
    fields: [
      { label: "Area", label_ar: "المساحة", value: "500 sqm", value_ar: "500 م²" },
      { label: "Zone", label_ar: "المنطقة", value: "Zone A", value_ar: "المنطقة أ" },
    ],
  },
];

describe("PlotCard (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<PlotCard plots={samplePlots} title="Plots" />);
  });

  it("renders plot title and field values when expanded", () => {
    render(<PlotCard plots={samplePlots} title="Plots" language="en" defaultExpanded={true} />);
    // When expanded, cardTitle shows "Plots" and field labels/values are shown
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("500 sqm")).toBeInTheDocument();
  });

  it("renders field labels in English", () => {
    render(<PlotCard plots={samplePlots} title="Plots" language="en" />);
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("Zone")).toBeInTheDocument();
  });

  it("renders field values in Arabic when language is 'ar'", () => {
    render(<PlotCard plots={samplePlots} title="Plots" title_ar="القطع" language="ar" />);
    expect(screen.getByText("500 م²")).toBeInTheDocument();
  });

  it("renders View button by default", () => {
    render(<PlotCard plots={samplePlots} title="Plots" language="en" />);
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("calls onPressView when View button is clicked", () => {
    const onPressView = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        language="en"
        onPressView={onPressView}
      />
    );
    fireEvent.click(screen.getByText("View"));
    expect(onPressView).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("renders Change Plot button when showChangePlotButton is true", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showChangePlotButton={true}
        language="en"
      />
    );
    expect(screen.getByText("Change Plot")).toBeInTheDocument();
  });

  it("calls onPressPlotChange when Change Plot is clicked", () => {
    const onPressPlotChange = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showChangePlotButton={true}
        onPressPlotChange={onPressPlotChange}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Change Plot"));
    expect(onPressPlotChange).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("renders Owners button when showOwnersButton is true", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showOwnersButton={true}
        language="en"
      />
    );
    expect(screen.getByText("Owners")).toBeInTheDocument();
  });

  it("calls onPressOwners when Owners button is clicked", () => {
    const onPressOwners = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showOwnersButton={true}
        onPressOwners={onPressOwners}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Owners"));
    expect(onPressOwners).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("collapses and expands a plot card", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        defaultExpanded={true}
        language="en"
      />
    );
    // Should be expanded by default, so Collapse button available
    const collapseBtn = screen.getByRole("button", { name: /collapse/i });
    fireEvent.click(collapseBtn);
    // After collapse field labels should not be visible
    expect(screen.queryByText("Area")).not.toBeInTheDocument();
  });

  it("renders with defaultExpanded=false without crashing", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        defaultExpanded={false}
        language="en"
      />
    );
    // Component renders without throwing
    expect(screen.getByText("Plots")).toBeInTheDocument();
  });

  it("renders multiple plots with their fields", () => {
    const multiPlots = [
      ...samplePlots,
      {
        plotId: "2",
        plotArgs: "args-2",
        plotNumber: "PLT-002",
        fields: [{ label: "Area2", value: "300 sqm" }],
      },
    ];
    render(<PlotCard plots={multiPlots} title="Plots" language="en" defaultExpanded={true} />);
    // Both plots expanded — their field labels visible
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("Area2")).toBeInTheDocument();
  });

  it("renders mobile platform without crashing", () => {
    render(<PlotCard plots={samplePlots} title="Plots" platform="mobile" />);
  });

  it("toggleExpand updates expandedIndices when plot is collapsed", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        defaultExpanded={true}
        language="en"
      />
    );
    // Initially expanded - Area label is visible
    expect(screen.getByText("Area")).toBeInTheDocument();
    // Collapse
    const collapseBtn = screen.getByRole("button", { name: /collapse/i });
    fireEvent.click(collapseBtn);
    // After collapse, field labels should not be visible
    expect(screen.queryByText("Area")).not.toBeInTheDocument();
    // Plot number should still be visible in collapsed title
    expect(screen.getByText("PLT-001")).toBeInTheDocument();
  });

  it("hides View button when showViewButton is false", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showViewButton={false}
        language="en"
      />
    );
    expect(screen.queryByText("View")).not.toBeInTheDocument();
  });

  it("renders plot with empty fields gracefully", () => {
    const plotNoFields = [
      { plotId: "1", plotArgs: "args-1", plotNumber: "PLT-001", fields: [] },
    ];
    render(<PlotCard plots={plotNoFields} title="Plots" language="en" />);
    expect(screen.getAllByText("Plots").length).toBeGreaterThan(0);
  });

  it("renders all three action buttons together", () => {
    const onPressView = vi.fn();
    const onPressPlotChange = vi.fn();
    const onPressOwners = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showViewButton={true}
        showChangePlotButton={true}
        showOwnersButton={true}
        onPressView={onPressView}
        onPressPlotChange={onPressPlotChange}
        onPressOwners={onPressOwners}
        language="en"
      />
    );
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Change Plot")).toBeInTheDocument();
    expect(screen.getByText("Owners")).toBeInTheDocument();
    fireEvent.click(screen.getByText("View"));
    fireEvent.click(screen.getByText("Change Plot"));
    fireEvent.click(screen.getByText("Owners"));
    expect(onPressView).toHaveBeenCalledWith(samplePlots[0]);
    expect(onPressPlotChange).toHaveBeenCalledWith(samplePlots[0]);
    expect(onPressOwners).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("renders with defaultShowMore true", () => {
    const plotsWithManyFields = [
      {
        plotId: "1",
        plotArgs: "args-1",
        plotNumber: "PLT-001",
        fields: Array.from({ length: 5 }, (_, i) => ({
          label: `Field ${i}`,
          value: `Value ${i}`,
        })),
      },
    ];
    render(
      <PlotCard plots={plotsWithManyFields} title="Plots" defaultShowMore={true} language="en" />
    );
    expect(screen.getByText("Field 4")).toBeInTheDocument();
  });

  // ── Additional callback coverage ──────────────────────────────────────────

  it("toggleExpand re-expands a collapsed plot card", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        defaultExpanded={true}
        language="en"
      />
    );
    // Initially expanded
    expect(screen.getByText("Area")).toBeInTheDocument();
    // Collapse via the Collapse aria-label button
    const collapseBtn = screen.getByRole("button", { name: /collapse/i });
    fireEvent.click(collapseBtn);
    expect(screen.queryByText("Area")).not.toBeInTheDocument();
    // Re-expand by clicking the collapsed container (which has onClick handler)
    // The collapsed state shows the plot number text - click on it
    fireEvent.click(screen.getByText("PLT-001"));
    expect(screen.getByText("Area")).toBeInTheDocument();
  });

  it("toggleExpand works with multiple plots", () => {
    const multiPlots = [
      ...samplePlots,
      {
        plotId: "2",
        plotArgs: "args-2",
        plotNumber: "PLT-002",
        plotNumber_ar: "PLT-002",
        fields: [{ label: "Size", value: "300 sqm" }],
      },
    ];
    render(
      <PlotCard
        plots={multiPlots}
        title="Plots"
        defaultExpanded={true}
        language="en"
      />
    );
    // Both expanded initially
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();

    // Collapse the first plot
    const collapseBtns = screen.getAllByRole("button", { name: /collapse/i });
    fireEvent.click(collapseBtns[0]);
    // First plot collapsed, second still expanded
    expect(screen.queryByText("Area")).not.toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
  });

  it("handleAction with view action calls onPressView", () => {
    const onPressView = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showViewButton={true}
        onPressView={onPressView}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("View"));
    expect(onPressView).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("handleAction with change_plot action calls onPressPlotChange", () => {
    const onPressPlotChange = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showChangePlotButton={true}
        onPressPlotChange={onPressPlotChange}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Change Plot"));
    expect(onPressPlotChange).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("handleAction with owners action calls onPressOwners", () => {
    const onPressOwners = vi.fn();
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        showOwnersButton={true}
        onPressOwners={onPressOwners}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Owners"));
    expect(onPressOwners).toHaveBeenCalledWith(samplePlots[0]);
  });

  it("mapFieldsToRows handles empty fields array", () => {
    const plotNoFields = [
      { plotId: "1", plotArgs: "args-1", plotNumber: "PLT-001", fields: [] },
    ];
    render(
      <PlotCard plots={plotNoFields} title="Plots" language="en" />
    );
    // Should render without fields but not crash - title still shows "Plots"
    expect(screen.getAllByText("Plots").length).toBeGreaterThan(0);
  });

  it("renders Arabic title and field labels", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        title_ar="القطع"
        language="ar"
        defaultExpanded={true}
      />
    );
    expect(screen.getByText("المساحة")).toBeInTheDocument();
    expect(screen.getByText("500 م²")).toBeInTheDocument();
  });

  it("renders with all buttons on multiple plots", () => {
    const onPressView = vi.fn();
    const onPressPlotChange = vi.fn();
    const onPressOwners = vi.fn();
    const multiPlots = [
      ...samplePlots,
      {
        plotId: "2",
        plotArgs: "args-2",
        plotNumber: "PLT-002",
        plotNumber_ar: "PLT-002",
        fields: [{ label: "Size", value: "300 sqm" }],
      },
    ];
    render(
      <PlotCard
        plots={multiPlots}
        title="Plots"
        showViewButton={true}
        showChangePlotButton={true}
        showOwnersButton={true}
        onPressView={onPressView}
        onPressPlotChange={onPressPlotChange}
        onPressOwners={onPressOwners}
        language="en"
      />
    );
    // Should have 2 View, 2 Change Plot, 2 Owners buttons
    expect(screen.getAllByText("View").length).toBe(2);
    expect(screen.getAllByText("Change Plot").length).toBe(2);
    expect(screen.getAllByText("Owners").length).toBe(2);
    // Click second plot's buttons
    fireEvent.click(screen.getAllByText("View")[1]);
    expect(onPressView).toHaveBeenCalledWith(multiPlots[1]);
    fireEvent.click(screen.getAllByText("Change Plot")[1]);
    expect(onPressPlotChange).toHaveBeenCalledWith(multiPlots[1]);
    fireEvent.click(screen.getAllByText("Owners")[1]);
    expect(onPressOwners).toHaveBeenCalledWith(multiPlots[1]);
  });

  it("does not throw when clicking View with default onPressView (no-op)", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        language="en"
        showViewButton
      />
    );
    expect(() => fireEvent.click(screen.getByText("View"))).not.toThrow();
  });

  it("does not throw when clicking Change Plot with default onPressPlotChange", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        language="en"
        showChangePlotButton
      />
    );
    expect(() => fireEvent.click(screen.getByText("Change Plot"))).not.toThrow();
  });

  it("does not throw when clicking Owners with default onPressOwners", () => {
    render(
      <PlotCard
        plots={samplePlots}
        title="Plots"
        language="en"
        showOwnersButton
      />
    );
    expect(() => fireEvent.click(screen.getByText("Owners"))).not.toThrow();
  });
});
