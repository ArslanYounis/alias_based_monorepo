import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Container } from "@platform/Container";

describe("Container", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders a div element", () => {
    const { container } = render(<Container />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Container><span>Hello</span></Container>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  // ── className alias mapping ───────────────────────────────────────────────

  it("maps 'layout-root' to the correct Tailwind classes", () => {
    const { container } = render(<Container className="layout-root" />);
    expect(container.firstChild).toHaveClass("w-screen", "min-h-screen", "overflow-hidden");
  });

  it("maps 'layout-row' to flex w-full", () => {
    const { container } = render(<Container className="layout-row" />);
    expect(container.firstChild).toHaveClass("flex", "w-full");
  });

  it("maps 'layout-main' to relative w-full overflow-auto flex-1", () => {
    const { container } = render(<Container className="layout-main" />);
    expect(container.firstChild).toHaveClass("relative", "w-full", "overflow-auto", "flex-1");
  });

  it("maps 'layout-toast-wrap' to relative w-full flex justify-center", () => {
    const { container } = render(<Container className="layout-toast-wrap" />);
    expect(container.firstChild).toHaveClass("relative", "flex", "justify-center");
  });

  it("maps 'layout-children' to w-full", () => {
    const { container } = render(<Container className="layout-children" />);
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("maps 'layout-footer' to z-50 and border-t", () => {
    const { container } = render(<Container className="layout-footer" />);
    expect(container.firstChild).toHaveClass("z-50", "border-t");
  });

  // ── Unknown className passthrough ─────────────────────────────────────────

  it("uses the className as-is when it is not a known alias", () => {
    const { container } = render(<Container className="my-custom-class" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("renders with no className when none provided (defaults to empty string)", () => {
    const { container } = render(<Container />);
    // The default is empty string which maps to itself (empty — no class attribute)
    expect(container.firstChild).toBeTruthy();
  });

  // ── style prop ────────────────────────────────────────────────────────────

  it("applies inline style", () => {
    const { container } = render(
      <Container style={{ color: "rgb(255, 0, 0)" }} />
    );
    expect(container.firstChild).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  // ── dir prop ─────────────────────────────────────────────────────────────

  it("applies dir attribute when provided", () => {
    const { container } = render(<Container dir="rtl" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  // ── onClick ───────────────────────────────────────────────────────────────

  it("calls onClick when the div is clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Container onClick={onClick} />);
    fireEvent.click(container.firstChild!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onClick is not provided and div is clicked", () => {
    const { container } = render(<Container />);
    expect(() => fireEvent.click(container.firstChild!)).not.toThrow();
  });
});
