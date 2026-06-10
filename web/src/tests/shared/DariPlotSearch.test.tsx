import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock ByPlot to avoid deep rendering / hooks
vi.mock("@shared/components/DariPlotSearch/byPlot", () => ({
  default: (props: any) => (
    <div data-testid="by-plot">
      <button
        data-testid="by-plot-submit"
        onClick={() => props.onSelectResult?.({ plotID: 1 })}
      >
        Submit Plot
      </button>
      {props.selected?.length > 0 && (
        <span data-testid="by-plot-selected">selected</span>
      )}
      <span data-testid="by-plot-language">{props.language}</span>
      <span data-testid="by-plot-platform">{props.platform}</span>
    </div>
  ),
}));

import DariPlotSearch from "@shared/components/DariPlotSearch/dariPlotSearch";

describe("DariPlotSearch", () => {
  const defaultProps = {
    title: "Search Plot",
    title_ar: "بحث عن قطعة",
    subtitle: "Find your plot",
    subtitle_ar: "ابحث عن قطعتك",
  };

  it("renders without crashing", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByText("Search Plot")).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByText("Find your plot")).toBeInTheDocument();
  });

  it("renders ByPlot child", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  it("defaults language to en passed into ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByTestId("by-plot-language")).toHaveTextContent("en");
  });

  it("defaults platform to web passed into ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByTestId("by-plot-platform")).toHaveTextContent("web");
  });

  // ── Language ─────────────────────────────────────────────────────────────

  it("renders rtl direction when language=ar", () => {
    const { container } = render(
      <DariPlotSearch {...defaultProps} language="ar" />
    );
    expect(container.querySelector("[dir='rtl']")).toBeInTheDocument();
  });

  it("renders ltr direction when language=en", () => {
    const { container } = render(
      <DariPlotSearch {...defaultProps} language="en" />
    );
    expect(container.querySelector("[dir='ltr']")).toBeInTheDocument();
  });

  it("renders Arabic title when language=ar", () => {
    render(<DariPlotSearch {...defaultProps} language="ar" />);
    expect(screen.getByText("بحث عن قطعة")).toBeInTheDocument();
  });

  it("renders Arabic subtitle when language=ar", () => {
    render(<DariPlotSearch {...defaultProps} language="ar" />);
    expect(screen.getByText("ابحث عن قطعتك")).toBeInTheDocument();
  });

  it("passes mobile platform down to ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} platform="mobile" />);
    expect(screen.getByTestId("by-plot-platform")).toHaveTextContent("mobile");
  });

  // ── Title / subtitle conditionals ────────────────────────────────────────

  it("does not render title when title is empty", () => {
    render(<DariPlotSearch subtitle="Only subtitle" />);
    expect(screen.queryByText("Search Plot")).not.toBeInTheDocument();
    expect(screen.getByText("Only subtitle")).toBeInTheDocument();
  });

  it("does not render subtitle when subtitle is empty", () => {
    render(<DariPlotSearch title="Only title" />);
    expect(screen.getByText("Only title")).toBeInTheDocument();
  });

  it("falls back to title for title_ar when title_ar missing in ar", () => {
    render(<DariPlotSearch title="Fallback" language="ar" />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("renders with no props at all", () => {
    const { container } = render(<DariPlotSearch />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  // ── selected handling ────────────────────────────────────────────────────

  it("passes selected array to ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} selected={[{ plotID: 1 }]} />);
    expect(screen.getByTestId("by-plot-selected")).toBeInTheDocument();
  });

  it("treats null selected as empty array safely", () => {
    render(<DariPlotSearch {...defaultProps} selected={null} />);
    expect(screen.queryByTestId("by-plot-selected")).not.toBeInTheDocument();
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  // ── onSubmit callback ────────────────────────────────────────────────────

  it("calls onSubmit when ByPlot selects a result", () => {
    const onSubmit = vi.fn();
    render(<DariPlotSearch {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByTestId("by-plot-submit"));
    expect(onSubmit).toHaveBeenCalledWith({ plotID: 1 });
  });

  it("does not throw when onSubmit not provided", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(() =>
      fireEvent.click(screen.getByTestId("by-plot-submit"))
    ).not.toThrow();
  });
});
