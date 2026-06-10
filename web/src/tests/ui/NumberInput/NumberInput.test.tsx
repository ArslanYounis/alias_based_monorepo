import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NumberInput } from "@platform/NumberInput";

vi.mock("@platform/Fields", () => ({
  Fields: ({
    value,
    onChange,
    placeholder,
    hasError,
    disabled,
    icon,
    type,
  }: {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (v: string) => void;
    hasError?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    language?: string;
    icon?: React.ReactNode;
  }) => (
    <div data-testid="fields-mock">
      <input
        type={type === "number" ? "number" : "text"}
        data-testid="number-input"
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        data-has-error={hasError}
      />
      {icon && <span data-testid="icon-slot">{icon}</span>}
    </div>
  ),
}));

vi.mock("@platform/Label", () => ({
  Label: ({
    label,
    label_ar,
    required,
    disabled,
    language,
    showInfoIcon,
    tooltipText,
  }: {
    label?: string;
    label_ar?: string;
    required?: boolean;
    disabled?: boolean;
    language?: string;
    showInfoIcon?: boolean;
    tooltipText?: string;
    tooltipText_ar?: string;
    tooltipDirection?: string;
    htmlFor?: string;
  }) => (
    <label
      data-testid="label-mock"
      data-required={required}
      data-disabled={disabled}
      data-lang={language}
    >
      {language === "ar" ? label_ar ?? label : label}
      {showInfoIcon && (
        <span data-testid="label-info">{tooltipText}</span>
      )}
    </label>
  ),
}));

vi.mock("@platform/Caption", () => ({
  Caption: ({
    captionLeft,
    captionRight,
    hasError,
    errorMessage,
  }: {
    language?: string;
    captionLeft?: string;
    captionLeft_ar?: string;
    captionRight?: string;
    captionRight_ar?: string;
    hasError?: boolean;
    errorMessage?: string;
    errorMessage_ar?: string;
    disabled?: boolean;
  }) => (
    <div data-testid="caption-mock" data-has-error={hasError}>
      {captionLeft && <span data-testid="caption-left">{captionLeft}</span>}
      {captionRight && <span data-testid="caption-right">{captionRight}</span>}
      {hasError && errorMessage && (
        <span data-testid="caption-error">{errorMessage}</span>
      )}
    </div>
  ),
}));

describe("NumberInput (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<NumberInput />);
    expect(screen.getByTestId("fields-mock")).toBeInTheDocument();
  });

  it("renders Label component", () => {
    render(<NumberInput label="Age" />);
    expect(screen.getByTestId("label-mock")).toBeInTheDocument();
  });

  // ── Label language ────────────────────────────────────────────────────────

  it("renders English label by default", () => {
    render(<NumberInput label="Age" label_ar="العمر" />);
    expect(screen.getByTestId("label-mock")).toHaveTextContent("Age");
  });

  it("renders Arabic label when language=ar", () => {
    render(<NumberInput label="Age" label_ar="العمر" language="ar" />);
    expect(screen.getByTestId("label-mock")).toHaveTextContent("العمر");
  });

  // ── Value conversion ──────────────────────────────────────────────────────

  it("passes string value to Fields", () => {
    render(<NumberInput value="42" />);
    expect(screen.getByTestId("number-input")).toHaveValue(42);
  });

  it("converts numeric value to string for Fields", () => {
    render(<NumberInput value={99} />);
    expect(screen.getByTestId("number-input")).toHaveValue(99);
  });

  it("uses empty string when value is undefined", () => {
    render(<NumberInput />);
    expect(screen.getByTestId("number-input")).toHaveValue(null);
  });

  // ── Placeholder ───────────────────────────────────────────────────────────

  it("uses English placeholder when language=en", () => {
    render(<NumberInput placeholder="Enter number" placeholder_ar="أدخل الرقم" />);
    expect(screen.getByTestId("number-input")).toHaveAttribute(
      "placeholder",
      "Enter number"
    );
  });

  it("uses Arabic placeholder when language=ar", () => {
    render(
      <NumberInput
        placeholder="Enter number"
        placeholder_ar="أدخل الرقم"
        language="ar"
      />
    );
    expect(screen.getByTestId("number-input")).toHaveAttribute(
      "placeholder",
      "أدخل الرقم"
    );
  });

  // ── onChange ──────────────────────────────────────────────────────────────

  it("calls onChange when input changes", () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} />);
    fireEvent.change(screen.getByTestId("number-input"), {
      target: { value: "10" },
    });
    expect(onChange).toHaveBeenCalledWith("10");
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("passes disabled=true to Fields", () => {
    render(<NumberInput disabled />);
    expect(screen.getByTestId("number-input")).toBeDisabled();
  });

  it("passes disabled=true to Label", () => {
    render(<NumberInput disabled />);
    expect(screen.getByTestId("label-mock")).toHaveAttribute(
      "data-disabled",
      "true"
    );
  });

  // ── Required ──────────────────────────────────────────────────────────────

  it("passes required=true to Label", () => {
    render(<NumberInput required />);
    expect(screen.getByTestId("label-mock")).toHaveAttribute(
      "data-required",
      "true"
    );
  });

  // ── Error ─────────────────────────────────────────────────────────────────

  it("passes hasError=true to Fields", () => {
    render(<NumberInput hasError />);
    expect(screen.getByTestId("number-input")).toHaveAttribute(
      "data-has-error",
      "true"
    );
  });

  it("renders Caption with error when hasError and errorMessage provided", () => {
    render(<NumberInput hasError errorMessage="Must be positive" />);
    expect(screen.getByTestId("caption-error")).toHaveTextContent(
      "Must be positive"
    );
  });

  it("does not render Caption when no captions and no error", () => {
    render(<NumberInput />);
    expect(screen.queryByTestId("caption-mock")).not.toBeInTheDocument();
  });

  // ── Captions ─────────────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<NumberInput captionLeft="Min: 0" />);
    expect(screen.getByTestId("caption-left")).toHaveTextContent("Min: 0");
  });

  it("renders Caption when captionRight is provided", () => {
    render(<NumberInput captionRight="Max: 100" />);
    expect(screen.getByTestId("caption-right")).toHaveTextContent("Max: 100");
  });

  // ── Icon ──────────────────────────────────────────────────────────────────

  it("passes icon prop to Fields", () => {
    render(<NumberInput icon={<svg data-testid="num-icon" />} />);
    expect(screen.getByTestId("icon-slot")).toBeInTheDocument();
  });

  it("passes null icon by default", () => {
    render(<NumberInput />);
    expect(screen.queryByTestId("icon-slot")).not.toBeInTheDocument();
  });

  // ── Info icon ─────────────────────────────────────────────────────────────

  it("passes showInfoIcon and tooltipText to Label", () => {
    render(
      <NumberInput showInfoIcon tooltipText="Numeric value only" />
    );
    expect(screen.getByTestId("label-info")).toHaveTextContent(
      "Numeric value only"
    );
  });

  it("does not throw when typing with default onChange (no-op)", () => {
    render(<NumberInput />);
    const input = screen.getByTestId("number-input");
    expect(() => fireEvent.change(input, { target: { value: "123" } })).not.toThrow();
  });
});
