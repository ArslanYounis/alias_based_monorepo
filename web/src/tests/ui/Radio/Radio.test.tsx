import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Radio } from "@platform/Radio";

describe("Radio", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders a hidden input of type radio", () => {
    render(<Radio id="r1" name="group" />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("hidden");
  });

  it("renders a label wrapping the input", () => {
    render(<Radio id="r1" name="group" />);
    const label = document.querySelector("label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "r1");
  });

  it("renders the visual div inside the label", () => {
    render(<Radio id="r1" name="group" />);
    const label = document.querySelector("label");
    const div = label?.querySelector("div");
    expect(div).toBeInTheDocument();
  });

  // ── Checked state ─────────────────────────────────────────────────────────

  it("renders unchecked by default", () => {
    render(<Radio id="r1" name="group" />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it("renders checked when checked=true (controlled)", () => {
    render(<Radio id="r1" name="group" checked={true} />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("renders unchecked when checked=false (controlled)", () => {
    render(<Radio id="r1" name="group" checked={false} />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  it("input is not disabled by default", () => {
    render(<Radio id="r1" name="group" />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input).not.toBeDisabled();
  });

  it("input is disabled when disabled=true", () => {
    render(<Radio id="r1" name="group" disabled />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("applies cursor-not-allowed class on label when disabled", () => {
    render(<Radio id="r1" name="group" disabled />);
    const label = document.querySelector("label");
    expect(label).toHaveClass("cursor-not-allowed");
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Radio id="r1" name="group" disabled onChange={onChange} />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("applies error border class when hasError=true", () => {
    render(<Radio id="r1" name="group" hasError />);
    const label = document.querySelector("label");
    const div = label?.querySelector("div");
    expect(div).toHaveClass("border-status-failed-solid");
  });

  it("sets aria-invalid when hasError is true and checked is true", () => {
    render(<Radio id="r1" name="group" hasError checked />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  it("calls onChange with id and toggled checked state on click", () => {
    const onChange = vi.fn();
    render(<Radio id="r1" name="group" onChange={onChange} />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledWith("r1", true);
  });

  it("does not throw when no onChange is provided", () => {
    render(<Radio id="r1" name="group" />);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(() => fireEvent.click(input)).not.toThrow();
  });

  // ── Class logic for checked+disabled ──────────────────────────────────────

  it("applies checked+disabled border class when checked and disabled", () => {
    render(<Radio id="r1" name="group" checked disabled />);
    const label = document.querySelector("label");
    const div = label?.querySelector("div");
    expect(div).toHaveClass("border-form-fields-checkbox-radio-cbr-select-disable");
  });

  it("applies selected border class when checked and not disabled", () => {
    render(<Radio id="r1" name="group" checked />);
    const label = document.querySelector("label");
    const div = label?.querySelector("div");
    expect(div).toHaveClass("border-form-fields-checkbox-radio-cbr-bg-selected");
  });
});
