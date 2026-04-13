import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterButton from "@platform/FilterBar/FilterButton";

// Mock FilterIcon SVG asset
vi.mock("@/assets/svg/filterIcon", () => ({
  default: () => <svg data-testid="filter-icon" />,
}));

describe("FilterButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<FilterButton />);
    expect(screen.getByText("All Filters")).toBeInTheDocument();
  });

  it("renders the default label 'All Filters'", () => {
    render(<FilterButton />);
    expect(screen.getByText("All Filters")).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<FilterButton label="My Filters" />);
    expect(screen.getByText("My Filters")).toBeInTheDocument();
  });

  // ── Default FilterIcon ────────────────────────────────────────────────────

  it("renders the default FilterIcon when no icon prop is provided", () => {
    render(<FilterButton />);
    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
  });

  it("renders a custom icon when icon prop is provided", () => {
    render(<FilterButton icon={<svg data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("filter-icon")).not.toBeInTheDocument();
  });

  // ── Count badge ───────────────────────────────────────────────────────────

  it("does not show count badge when count=0 (default)", () => {
    render(<FilterButton count={0} />);
    // There should be no badge number element
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("does not show count badge when count is not provided", () => {
    render(<FilterButton />);
    // count defaults to 0
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows count badge when count > 0", () => {
    render(<FilterButton count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows count badge with value 1", () => {
    render(<FilterButton count={1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  // ── isActive styling ──────────────────────────────────────────────────────

  it("applies active background class when isActive=true", () => {
    const { container } = render(<FilterButton isActive />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-filter-button-bg-selected");
  });

  it("applies active border class when isActive=true", () => {
    const { container } = render(<FilterButton isActive />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-filter-button-stroke-selected");
  });

  it("does not apply active classes when isActive=false (default)", () => {
    const { container } = render(<FilterButton isActive={false} />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain("bg-filter-button-bg-selected");
  });

  // ── onClick handler ───────────────────────────────────────────────────────

  it("calls onClick when the component is clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<FilterButton onClick={onClick} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when clicked without onClick prop", () => {
    const { container } = render(<FilterButton />);
    expect(() =>
      fireEvent.click(container.firstChild as HTMLElement)
    ).not.toThrow();
  });

  it("sets cursor pointer style when onClick is provided", () => {
    const { container } = render(<FilterButton onClick={vi.fn()} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.cursor).toBe("pointer");
  });

  it("does not set cursor style when onClick is not provided", () => {
    const { container } = render(<FilterButton />);
    const root = container.firstChild as HTMLElement;
    // cursor style should be empty/undefined when no onClick
    expect(root.style.cursor).toBe("");
  });

  // ── Custom className ──────────────────────────────────────────────────────

  it("applies custom className to the root div", () => {
    const { container } = render(<FilterButton className="custom-class" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  it("renders with empty className by default (no extra classes appended)", () => {
    const { container } = render(<FilterButton />);
    const root = container.firstChild as HTMLElement;
    // className should not end with stray trailing chars from empty className
    expect(root).toBeInTheDocument();
  });

  // ── Combined props ────────────────────────────────────────────────────────

  it("renders label, count and icon together correctly", () => {
    render(
      <FilterButton
        label="Status"
        count={5}
        icon={<svg data-testid="status-icon" />}
        isActive
      />
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
  });
});
