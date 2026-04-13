import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchPlot from "@shared/components/SearchPlot/SearchPlot";

// Mock sub-components to avoid hanging from deep component trees with hooks
vi.mock("@shared/components/SearchPlot/ByPlot", () => ({
  default: (props: any) => (
    <div data-testid="by-plot">
      <button data-testid="by-plot-submit" onClick={() => props.onSelectResult?.({ plotId: "1" })}>
        Submit Plot
      </button>
      {props.selected?.length > 0 && <span data-testid="by-plot-selected">selected</span>}
    </div>
  ),
}));

vi.mock("@shared/components/SearchPlot/ByOwner", () => ({
  default: (props: any) => (
    <div data-testid="by-owner">
      <button data-testid="by-owner-submit" onClick={() => props.onSubmit?.({ ownerId: "1" })}>
        Submit Owner
      </button>
    </div>
  ),
}));

vi.mock("@shared/components/SearchPlot/ByCompanyOwner", () => ({
  default: (props: any) => (
    <div data-testid="by-company-owner">
      <button data-testid="by-company-submit" onClick={() => props.onSubmit?.({ companyId: "1" })}>
        Submit Company
      </button>
    </div>
  ),
}));

describe("SearchPlot", () => {
  const defaultProps = {
    title: "Search Plot",
    title_ar: "بحث عن قطعة",
    subtitle: "Find your plot",
    subtitle_ar: "ابحث عن قطعتك",
  };

  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<SearchPlot {...defaultProps} />);
    expect(screen.getByText("Search Plot")).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    render(<SearchPlot {...defaultProps} />);
    expect(screen.getByText("Find your plot")).toBeInTheDocument();
  });

  it("shows ByPlot component by default", () => {
    render(<SearchPlot {...defaultProps} />);
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  // ── Language ───────────────────────────────────────────────────────────────

  it("renders with rtl direction when language=ar", () => {
    const { container } = render(<SearchPlot {...defaultProps} language="ar" />);
    const el = container.querySelector("[dir='rtl']");
    expect(el).toBeInTheDocument();
  });

  it("renders Arabic title when language=ar", () => {
    render(<SearchPlot {...defaultProps} language="ar" />);
    expect(screen.getByText("بحث عن قطعة")).toBeInTheDocument();
  });

  // ── RadioCard tabs ─────────────────────────────────────────────────────────

  it("renders owner type radio cards with default labels", () => {
    render(<SearchPlot {...defaultProps} />);
    expect(screen.getByText("By Plot")).toBeInTheDocument();
    expect(screen.getByText("By Owner")).toBeInTheDocument();
    expect(screen.getByText("By Company Owner")).toBeInTheDocument();
    expect(screen.getByText("Random Allocation")).toBeInTheDocument();
  });

  it("switches to ByOwner when Owner card is clicked", () => {
    render(<SearchPlot {...defaultProps} />);
    fireEvent.click(screen.getByText("By Owner"));
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });

  it("switches to ByCompanyOwner when Company card is clicked", () => {
    render(<SearchPlot {...defaultProps} />);
    fireEvent.click(screen.getByText("By Company Owner"));
    expect(screen.getByTestId("by-company-owner")).toBeInTheDocument();
  });

  it("switches back to ByPlot when Plot is clicked after switching", () => {
    render(<SearchPlot {...defaultProps} />);
    fireEvent.click(screen.getByText("By Owner"));
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
    fireEvent.click(screen.getByText("By Plot"));
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  // ── onSubmit callback ─────────────────────────────────────────────────────

  it("calls onSubmit when ByPlot submits (via onSelectResult)", () => {
    const onSubmit = vi.fn();
    render(<SearchPlot {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByTestId("by-plot-submit"));
    expect(onSubmit).toHaveBeenCalledWith({ plotId: "1" });
  });

  it("calls onSubmit when ByOwner submits", () => {
    const onSubmit = vi.fn();
    render(<SearchPlot {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("By Owner"));
    fireEvent.click(screen.getByTestId("by-owner-submit"));
    expect(onSubmit).toHaveBeenCalledWith({ ownerId: "1" });
  });

  it("calls onSubmit when ByCompanyOwner submits", () => {
    const onSubmit = vi.fn();
    render(<SearchPlot {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("By Company Owner"));
    fireEvent.click(screen.getByTestId("by-company-submit"));
    expect(onSubmit).toHaveBeenCalledWith({ companyId: "1" });
  });

  // ── Selected prop ─────────────────────────────────────────────────────────

  it("passes selected prop to ByPlot", () => {
    const selected = [{ plotNumber: "123" }];
    render(<SearchPlot {...defaultProps} selected={selected as any} />);
    expect(screen.getByTestId("by-plot-selected")).toBeInTheDocument();
  });

  it("handles null selected gracefully", () => {
    render(<SearchPlot {...defaultProps} selected={null} />);
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  // ── enabledTabs ────────────────────────────────────────────────────────────

  it("hides Company tab when enabledTabs.company is false", () => {
    render(<SearchPlot {...defaultProps} enabledTabs={{ company: false }} />);
    expect(screen.queryByText("By Company Owner")).not.toBeInTheDocument();
  });

  it("hides Owner tab when enabledTabs.owner is false", () => {
    render(<SearchPlot {...defaultProps} enabledTabs={{ owner: false }} />);
    expect(screen.queryByText("By Owner")).not.toBeInTheDocument();
  });

  // ── initialOwnerType ──────────────────────────────────────────────────────

  it("starts on ByOwner when initialOwnerType='owner'", () => {
    render(<SearchPlot {...defaultProps} initialOwnerType="owner" />);
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });

  it("falls back to plot if initialOwnerType tab is disabled", () => {
    render(<SearchPlot {...defaultProps} initialOwnerType="company" enabledTabs={{ company: false }} />);
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });

  // ── No title ──────────────────────────────────────────────────────────────

  it("renders without title or subtitle", () => {
    const { container } = render(<SearchPlot />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // ── Custom ownerTypeOptions ───────────────────────────────────────────────

  it("renders custom ownerTypeOptions labels", () => {
    render(
      <SearchPlot
        {...defaultProps}
        ownerTypeOptions={{
          plot: "Land",
          plot_ar: "أرض",
          company: "Corp",
          company_ar: "شركة",
          owner: "Person",
          owner_ar: "شخص",
          randomAllocation: "Lottery",
          randomAllocation_ar: "يانصيب",
        }}
      />
    );
    expect(screen.getByText("Land")).toBeInTheDocument();
    expect(screen.getByText("Corp")).toBeInTheDocument();
    expect(screen.getByText("Person")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders ScrollContainer layout when platform='mobile'", () => {
    render(<SearchPlot {...defaultProps} platform="mobile" />);
    expect(screen.getByTestId("by-plot")).toBeInTheDocument();
  });
});
