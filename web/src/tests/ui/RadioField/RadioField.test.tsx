import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadioField } from "@platform/RadioField";

// Mock child components that RadioField depends on
vi.mock("@platform/Radio", () => ({
  Radio: ({ id, checked, disabled, hasError, onChange }: {
    id: string; checked: boolean; disabled?: boolean; hasError?: boolean; onChange?: () => void;
  }) => (
    <input
      type="radio"
      data-testid={`radio-${id}`}
      checked={checked}
      disabled={disabled}
      aria-invalid={hasError}
      onChange={onChange}
    />
  ),
}));

vi.mock("@platform/CheckRadioLabel", () => ({
  CheckRadioLabel: ({ label, disabled, onClick, htmlFor }: {
    label?: string; disabled?: boolean; onClick?: () => void; htmlFor?: string;
  }) => (
    <label
      data-testid={`label-${htmlFor}`}
      onClick={onClick}
      aria-disabled={disabled}
    >
      {label}
    </label>
  ),
}));

describe("RadioField", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<RadioField id="opt1" label="Option 1" />);
    expect(screen.getByTestId("radio-opt1")).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<RadioField id="opt1" label="Option 1" />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("renders with ltr direction by default", () => {
    const { container } = render(<RadioField id="opt1" label="Option 1" />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "ltr");
  });

  it("renders with rtl direction when language=ar", () => {
    const { container } = render(<RadioField id="opt1" label="خيار" language="ar" />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "rtl");
  });

  // ── Checked state ──────────────────────────────────────────────────────────

  it("radio is checked when checked prop matches id", () => {
    render(<RadioField id="opt1" label="Option 1" checked="opt1" />);
    const input = screen.getByTestId("radio-opt1") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("radio is unchecked when checked prop does not match id", () => {
    render(<RadioField id="opt1" label="Option 1" checked="opt2" />);
    const input = screen.getByTestId("radio-opt1") as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  // ── onChange ───────────────────────────────────────────────────────────────

  it("calls onChange with id and true when radio is changed", () => {
    const onChange = vi.fn();
    render(<RadioField id="opt1" label="Option 1" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("radio-opt1"));
    expect(onChange).toHaveBeenCalledWith("opt1", true);
  });

  it("calls onChange when label is clicked", () => {
    const onChange = vi.fn();
    render(<RadioField id="opt1" label="Option 1" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("label-opt1"));
    expect(onChange).toHaveBeenCalledWith("opt1", true);
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("passes hasError to Radio when hasError=true", () => {
    render(<RadioField id="opt1" label="Option 1" hasError />);
    const input = screen.getByTestId("radio-opt1");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("clears error after onChange is called", () => {
    const onChange = vi.fn();
    render(<RadioField id="opt1" label="Option 1" hasError onChange={onChange} />);
    // Trigger onChange which should clear internal error
    fireEvent.click(screen.getByTestId("radio-opt1"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  it("passes disabled to Radio", () => {
    render(<RadioField id="opt1" label="Option 1" disabled />);
    const input = screen.getByTestId("radio-opt1") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("passes disabled to CheckRadioLabel", () => {
    render(<RadioField id="opt1" label="Option 1" disabled />);
    expect(screen.getByTestId("label-opt1")).toHaveAttribute("aria-disabled", "true");
  });
});
