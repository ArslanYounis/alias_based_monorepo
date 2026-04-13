import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SwitchButton } from "@platform/SwitchButton";

vi.mock("@platform/Container", () => ({
  Container: ({ children, className, style }: {
    children?: React.ReactNode; className?: string; style?: React.CSSProperties;
  }) => (
    <div className={className} style={style}>
      {children}
    </div>
  ),
}));

describe("SwitchButton", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders a label element", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    expect(document.querySelector("label")).toBeInTheDocument();
  });

  it("renders a checkbox input", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    const input = screen.getByRole("checkbox");
    expect(input).toBeInTheDocument();
  });

  // ── Type=Standard ──────────────────────────────────────────────────────────

  it("checkbox is checked when type='Standard'", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("thumb uses bg-text-link color when type='Standard'", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    // The thumb is the second div (inside label, after the track div)
    const divs = document.querySelectorAll("label > div");
    const thumb = divs[1];
    expect(thumb).toHaveClass("bg-text-link");
  });

  it("thumb is translated to 24px when type='Standard'", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    const divs = document.querySelectorAll("label > div");
    const thumb = divs[1] as HTMLElement;
    expect(thumb.style.transform).toBe("translateX(24px)");
  });

  // ── Type!=Standard (off position) ─────────────────────────────────────────

  it("checkbox is unchecked when type is not 'Standard'", () => {
    render(<SwitchButton type="Compact" onToggle={vi.fn()} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it("thumb uses bg-text-dimmed color when type is not 'Standard'", () => {
    render(<SwitchButton type="Compact" onToggle={vi.fn()} />);
    const divs = document.querySelectorAll("label > div");
    const thumb = divs[1];
    expect(thumb).toHaveClass("bg-text-dimmed");
  });

  it("thumb is at translateX(0) when type is not 'Standard'", () => {
    render(<SwitchButton type="Compact" onToggle={vi.fn()} />);
    const divs = document.querySelectorAll("label > div");
    const thumb = divs[1] as HTMLElement;
    expect(thumb.style.transform).toBe("translateX(0)");
  });

  // ── onToggle ───────────────────────────────────────────────────────────────

  it("calls onToggle when checkbox is changed", () => {
    const onToggle = vi.fn();
    render(<SwitchButton type="Standard" onToggle={onToggle} />);
    const input = screen.getByRole("checkbox");
    fireEvent.click(input);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("does not throw when no onToggle is provided", () => {
    render(<SwitchButton type="Standard" onToggle={undefined as unknown as () => void} />);
    expect(() =>
      fireEvent.change(screen.getByRole("checkbox"))
    ).not.toThrow();
  });

  // ── Layout ─────────────────────────────────────────────────────────────────

  it("applies cursor-pointer class to label", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    expect(document.querySelector("label")).toHaveClass("cursor-pointer");
  });

  it("checkbox has sr-only class (visually hidden)", () => {
    render(<SwitchButton type="Standard" onToggle={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toHaveClass("sr-only");
  });
});
