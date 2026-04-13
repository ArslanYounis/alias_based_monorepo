import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "@platform/Checkbox";

describe("Checkbox", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders with role='checkbox'", () => {
    render(<Checkbox id="cb1" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Checkbox id="cb1" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("renders an SVG checkmark inside", () => {
    render(<Checkbox id="cb1" />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  // ── Controlled: checked prop ──────────────────────────────────────────────

  it("reflects checked=true via aria-checked", () => {
    render(<Checkbox id="cb1" checked={true} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("reflects checked=false via aria-checked", () => {
    render(<Checkbox id="cb1" checked={false} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("syncs when controlled checked prop changes", () => {
    const { rerender } = render(<Checkbox id="cb1" checked={false} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
    rerender(<Checkbox id="cb1" checked={true} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  // ── Uncontrolled toggling ─────────────────────────────────────────────────

  it("toggles from unchecked to checked on click (uncontrolled)", () => {
    render(<Checkbox id="cb1" />);
    const cb = screen.getByRole("checkbox");
    fireEvent.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  it("toggles back to unchecked on second click (uncontrolled)", () => {
    render(<Checkbox id="cb1" />);
    const cb = screen.getByRole("checkbox");
    fireEvent.click(cb);
    fireEvent.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  // ── onChange callback ─────────────────────────────────────────────────────

  it("calls onChange with (id, true) when clicked while unchecked", () => {
    const onChange = vi.fn();
    render(<Checkbox id="cb-test" onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("cb-test", true);
  });

  it("calls onChange with (id, false) when clicked while checked (uncontrolled)", () => {
    const onChange = vi.fn();
    render(<Checkbox id="cb-test" onChange={onChange} />);
    const cb = screen.getByRole("checkbox");
    fireEvent.click(cb); // check it
    fireEvent.click(cb); // uncheck
    expect(onChange).toHaveBeenLastCalledWith("cb-test", false);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Checkbox id="cb1" disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("has aria-disabled=true when disabled", () => {
    render(<Checkbox id="cb1" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
  });

  it("applies disabled styles class when disabled", () => {
    render(<Checkbox id="cb1" disabled />);
    expect(screen.getByRole("checkbox")).toHaveClass(
      "bg-form-fields-checkbox-radio-cbr-select-disable"
    );
  });

  it("has tabIndex=-1 when disabled", () => {
    render(<Checkbox id="cb1" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "-1");
  });

  it("has tabIndex=0 when enabled", () => {
    render(<Checkbox id="cb1" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "0");
  });

  it("applies pointer-events-none class when disabled", () => {
    render(<Checkbox id="cb1" disabled />);
    expect(screen.getByRole("checkbox")).toHaveClass("pointer-events-none");
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("applies error styles when hasError is true (and not disabled or checked)", () => {
    render(<Checkbox id="cb1" hasError />);
    expect(screen.getByRole("checkbox")).toHaveClass("border-form-fields-error");
  });

  // ── Checked styles ────────────────────────────────────────────────────────

  it("applies checked styles when checked is true and not disabled/error", () => {
    render(<Checkbox id="cb1" checked={true} />);
    expect(screen.getByRole("checkbox")).toHaveClass(
      "bg-form-fields-checkbox-radio-cbr-bg-selected"
    );
  });

  // ── Keyboard interaction ──────────────────────────────────────────────────

  it("toggles on Enter keydown", () => {
    render(<Checkbox id="cb1" />);
    const cb = screen.getByRole("checkbox");
    fireEvent.keyDown(cb, { key: "Enter" });
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on Space keydown", () => {
    render(<Checkbox id="cb1" />);
    const cb = screen.getByRole("checkbox");
    fireEvent.keyDown(cb, { key: " " });
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle on other key", () => {
    render(<Checkbox id="cb1" />);
    const cb = screen.getByRole("checkbox");
    fireEvent.keyDown(cb, { key: "Tab" });
    expect(cb).toHaveAttribute("aria-checked", "false");
  });
});
