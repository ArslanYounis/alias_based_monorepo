import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Buttons } from "@platform/Buttons";

// Mock Tooltip to isolate Buttons from its dependency
vi.mock("@platform/Tooltip", () => ({
  Tooltip: ({ text }: { text: string }) => <div data-testid="tooltip">{text}</div>,
}));

describe("Buttons", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders a button element by default", () => {
    render(<Buttons title="Click" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the English title", () => {
    render(<Buttons title="Submit" title_ar="إرسال" language="en" />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders the Arabic title when language is 'ar'", () => {
    render(<Buttons title="Submit" title_ar="إرسال" language="ar" />);
    expect(screen.getByText("إرسال")).toBeInTheDocument();
  });

  // ── onClick ───────────────────────────────────────────────────────────────

  it("calls onClick when button is clicked", () => {
    const onClick = vi.fn();
    render(<Buttons title="Go" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Buttons title="Go" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("button is disabled when disabled prop is true", () => {
    render(<Buttons title="Go" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies cursor-not-allowed class when disabled (primary)", () => {
    render(<Buttons title="Go" type="primary" disabled />);
    expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed");
  });

  // ── Type variants ─────────────────────────────────────────────────────────

  it("primary type: applies primary bg class when enabled", () => {
    render(<Buttons title="Go" type="primary" />);
    expect(screen.getByRole("button")).toHaveClass("bg-button-primary-default-bg");
  });

  it("secondary type: applies border class when enabled", () => {
    render(<Buttons title="Go" type="secondary" />);
    expect(screen.getByRole("button")).toHaveClass("border-button-primary-default-bg");
  });

  it("tertiary type: applies tertiary bg class", () => {
    render(<Buttons title="Go" type="tertiary" />);
    expect(screen.getByRole("button")).toHaveClass("bg-button-tertiary-default-bg");
  });

  it("text-link type: applies text-text-link class", () => {
    render(<Buttons title="Go" type="text-link" />);
    expect(screen.getByRole("button")).toHaveClass("text-text-link");
  });

  it("delete type: applies border-button-delete-stroke class", () => {
    render(<Buttons title="Go" type="delete" />);
    expect(screen.getByRole("button")).toHaveClass("border-button-delete-stroke");
  });

  // ── Hover state ───────────────────────────────────────────────────────────

  it("applies hover class on mouse enter for primary", () => {
    render(<Buttons title="Go" type="primary" />);
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    expect(btn).toHaveClass("bg-button-primary-hover");
  });

  it("reverts from hover class on mouse leave", () => {
    render(<Buttons title="Go" type="primary" />);
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(btn).toHaveClass("bg-button-primary-default-bg");
  });

  // ── Size variants ─────────────────────────────────────────────────────────

  it("size 's' applies !h-[24px] class", () => {
    render(<Buttons title="Go" size="s" />);
    expect(screen.getByRole("button")).toHaveClass("!h-[24px]");
  });

  it("size 'm' applies !h-[28px] class", () => {
    render(<Buttons title="Go" size="m" />);
    expect(screen.getByRole("button")).toHaveClass("!h-[28px]");
  });

  it("size 'l' applies !h-[40px] class", () => {
    render(<Buttons title="Go" size="l" />);
    expect(screen.getByRole("button")).toHaveClass("!h-[40px]");
  });

  // ── fullWidth ─────────────────────────────────────────────────────────────

  it("applies w-full class when fullWidth is true", () => {
    render(<Buttons title="Go" fullWidth />);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  // ── Icons ─────────────────────────────────────────────────────────────────

  it("renders leftIcon when provided", () => {
    render(
      <Buttons
        title="Go"
        leftIcon={<svg data-testid="left-icon" />}
      />
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon when provided", () => {
    render(
      <Buttons
        title="Go"
        rightIcon={<svg data-testid="right-icon" />}
      />
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies iconColor as fill to leftIcon", () => {
    const TestIcon = ({ fill }: { fill?: string }) => (
      <svg data-testid="colored-icon" fill={fill} />
    );
    render(<Buttons title="Go" leftIcon={<TestIcon />} iconColor="#ff0000" />);
    const icon = screen.getByTestId("colored-icon");
    expect(icon).toHaveAttribute("fill", "#ff0000");
  });

  // ── buttonType ────────────────────────────────────────────────────────────

  it("sets button type attribute to 'submit' when buttonType is 'submit'", () => {
    render(<Buttons title="Go" buttonType="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  // ── Tooltip variant ───────────────────────────────────────────────────────

  it("renders tooltip wrapper div when tooltip prop is provided", () => {
    render(
      <Buttons
        title="Go"
        tooltip={{ text: "Tip text", text_ar: "نص", language: "en" }}
      />
    );
    // With tooltip, the button is inside a wrapper div, not a bare button
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows tooltip when hovered (tooltip path)", () => {
    render(
      <Buttons
        title="Go"
        tooltip={{ text: "Tip text", text_ar: "نص", language: "en" }}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", () => {
    render(
      <Buttons
        title="Go"
        tooltip={{ text: "Tip text", text_ar: "نص", language: "en" }}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  // ── Default onClick (line 20) ─────────────────────────────────────────────
  // When no onClick prop is provided the default `() => null` is used.
  // Clicking must not throw and the no-op runs silently.
  it("does not throw when clicked with no onClick prop provided", () => {
    render(<Buttons title="Go" />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  // ── Tooltip container hover handlers (lines 141-142) ─────────────────────
  // Hovering the tooltip <div> itself sets/unsets isTooltipHovered, keeping
  // the tooltip visible when the cursor moves from the button to the tooltip.
  it("keeps tooltip visible when mouse enters the tooltip container (line 141)", () => {
    render(
      <Buttons
        title="Go"
        tooltip={{ text: "Keep visible", text_ar: "ابقَ مرئياً", language: "en" }}
      />
    );
    const btn = screen.getByRole("button");
    // Hover button to show tooltip
    fireEvent.mouseEnter(btn);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();

    // Move mouse to tooltip container — tooltip should stay visible
    const tooltipEl = screen.getByTestId("tooltip");
    const tooltipContainer = tooltipEl.parentElement!;
    fireEvent.mouseEnter(tooltipContainer);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when mouse leaves the tooltip container (line 142)", () => {
    render(
      <Buttons
        title="Go"
        tooltip={{ text: "Hide me", text_ar: "أخفني", language: "en" }}
      />
    );
    const btn = screen.getByRole("button");
    // Hover button then move to tooltip container
    fireEvent.mouseEnter(btn);
    const tooltipContainer = screen.getByTestId("tooltip").parentElement!;
    fireEvent.mouseEnter(tooltipContainer);
    // Now leave the tooltip container AND the outer wrapper
    fireEvent.mouseLeave(tooltipContainer);
    fireEvent.mouseLeave(btn);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  // ── Tooltip path with icons (lines 120-125, 132) ──────────────────────────
  it("renders leftIcon inside tooltip variant button (line 120-125)", () => {
    render(
      <Buttons
        title="Go"
        leftIcon={<svg data-testid="tooltip-left-icon" />}
        tooltip={{ text: "Tip", language: "en" }}
      />
    );
    expect(screen.getByTestId("tooltip-left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon inside tooltip variant button (line 132)", () => {
    render(
      <Buttons
        title="Go"
        rightIcon={<svg data-testid="tooltip-right-icon" />}
        tooltip={{ text: "Tip", language: "en" }}
      />
    );
    expect(screen.getByTestId("tooltip-right-icon")).toBeInTheDocument();
  });

  // ── tooltip.language fallback (line 147) ──────────────────────────────────
  it("uses component language when tooltip.language is not set (line 147)", () => {
    render(
      <Buttons
        title="Go"
        language="ar"
        tooltip={{ text: "Tip", text_ar: "نصيحة" }}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    // tooltip renders without error — language fallback fires
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });
});
