import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadioInput } from "@platform/RadioInput";

vi.mock("@platform/Label", () => ({
  Label: ({ label, required, disabled }: { label?: string; required?: boolean; disabled?: boolean }) =>
    label ? (
      <label data-testid="label" data-required={required} data-disabled={disabled}>
        {label}
      </label>
    ) : null,
}));

vi.mock("@platform/RadioField", () => ({
  RadioField: ({ id, label, checked, disabled, hasError, onChange }: {
    id: string; label?: string; checked?: string; disabled?: boolean; hasError?: boolean;
    onChange?: (id: string, checked: boolean) => void;
  }) => (
    <div data-testid={`radiofield-${id}`}>
      <input
        type="radio"
        data-testid={`radio-${id}`}
        checked={checked === id}
        disabled={disabled}
        aria-invalid={hasError}
        onChange={() => onChange?.(id, true)}
      />
      <span>{label}</span>
    </div>
  ),
}));

vi.mock("@platform/Caption", () => ({
  Caption: ({ errorMessage, captionLeft, captionRight }: {
    errorMessage?: string; captionLeft?: string; captionRight?: string;
  }) => (
    <div data-testid="caption">
      {errorMessage && <span data-testid="error">{errorMessage}</span>}
      {captionLeft && <span data-testid="caption-left">{captionLeft}</span>}
      {captionRight && <span data-testid="caption-right">{captionRight}</span>}
    </div>
  ),
}));

const defaultOptions = [
  { value: "opt1", label: "Option 1", label_ar: "خيار 1" },
  { value: "opt2", label: "Option 2", label_ar: "خيار 2" },
];

describe("RadioInput", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<RadioInput options={defaultOptions} />);
    expect(screen.getByTestId("radiofield-opt1")).toBeInTheDocument();
    expect(screen.getByTestId("radiofield-opt2")).toBeInTheDocument();
  });

  it("renders all option fields", () => {
    render(<RadioInput options={defaultOptions} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("renders label when provided", () => {
    render(<RadioInput options={defaultOptions} label="Choose an option" />);
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("renders empty state with no options", () => {
    render(<RadioInput options={[]} />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  // ── Checked state ──────────────────────────────────────────────────────────

  it("marks the matching option as checked", () => {
    render(<RadioInput options={defaultOptions} checked="opt1" />);
    const radio1 = screen.getByTestId("radio-opt1") as HTMLInputElement;
    const radio2 = screen.getByTestId("radio-opt2") as HTMLInputElement;
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
  });

  // ── onChange ───────────────────────────────────────────────────────────────

  it("calls onChange with selected option id when radio changes", () => {
    const onChange = vi.fn();
    render(<RadioInput options={defaultOptions} onChange={onChange} />);
    fireEvent.click(screen.getByTestId("radio-opt2"));
    expect(onChange).toHaveBeenCalledWith("opt2");
  });

  // ── Caption ────────────────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<RadioInput options={defaultOptions} captionLeft="Help text" />);
    expect(screen.getByTestId("caption-left")).toBeInTheDocument();
  });

  it("renders Caption when captionRight is provided", () => {
    render(<RadioInput options={defaultOptions} captionRight="0/100" />);
    expect(screen.getByTestId("caption-right")).toBeInTheDocument();
  });

  it("renders Caption with error when hasError and errorMessage", () => {
    render(<RadioInput options={defaultOptions} hasError errorMessage="Required" />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("does not render Caption when no caption props or error provided", () => {
    render(<RadioInput options={defaultOptions} />);
    expect(screen.queryByTestId("caption")).not.toBeInTheDocument();
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it("passes disabled to all radio fields", () => {
    render(<RadioInput options={defaultOptions} disabled />);
    expect(screen.getByTestId("radio-opt1")).toBeDisabled();
    expect(screen.getByTestId("radio-opt2")).toBeDisabled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("passes hasError to all radio fields", () => {
    render(<RadioInput options={defaultOptions} hasError />);
    expect(screen.getByTestId("radio-opt1")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not throw when clicking radio with default onChange (no-op)", () => {
    render(<RadioInput options={defaultOptions} />);
    expect(() => fireEvent.click(screen.getByTestId("radio-opt1"))).not.toThrow();
  });
});
