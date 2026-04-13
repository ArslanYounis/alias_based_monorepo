import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PhoneInput } from "@platform/PhoneInput";

vi.mock("@platform/Fields", () => ({
  Fields: ({
    value,
    onChange,
    placeholder,
    hasError,
    disabled,
    phoneCode,
    type,
  }: {
    type?: string;
    phoneCode?: string;
    placeholder?: string;
    value?: string;
    onChange?: (v: string) => void;
    hasError?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    language?: string;
  }) => (
    <div data-testid="fields-mock">
      {phoneCode && <span data-testid="phone-code">{phoneCode}</span>}
      <input
        data-testid="phone-input"
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        data-has-error={hasError}
      />
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

describe("PhoneInput (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<PhoneInput />);
    expect(screen.getByTestId("fields-mock")).toBeInTheDocument();
  });

  it("renders Label component", () => {
    render(<PhoneInput label="Phone" />);
    expect(screen.getByTestId("label-mock")).toBeInTheDocument();
  });

  // ── Label language ────────────────────────────────────────────────────────

  it("renders English label by default", () => {
    render(<PhoneInput label="Phone Number" label_ar="رقم الهاتف" />);
    expect(screen.getByTestId("label-mock")).toHaveTextContent("Phone Number");
  });

  it("renders Arabic label when language=ar", () => {
    render(
      <PhoneInput label="Phone Number" label_ar="رقم الهاتف" language="ar" />
    );
    expect(screen.getByTestId("label-mock")).toHaveTextContent("رقم الهاتف");
  });

  // ── Phone code ────────────────────────────────────────────────────────────

  it("uses default phoneCode +971", () => {
    render(<PhoneInput />);
    expect(screen.getByTestId("phone-code")).toHaveTextContent("+971");
  });

  it("uses provided phoneCode", () => {
    render(<PhoneInput phoneCode="+1" />);
    expect(screen.getByTestId("phone-code")).toHaveTextContent("+1");
  });

  // ── Placeholder ───────────────────────────────────────────────────────────

  it("uses English placeholder when language=en", () => {
    render(
      <PhoneInput placeholder="Enter phone" placeholder_ar="أدخل الهاتف" />
    );
    expect(screen.getByTestId("phone-input")).toHaveAttribute(
      "placeholder",
      "Enter phone"
    );
  });

  it("uses Arabic placeholder when language=ar", () => {
    render(
      <PhoneInput
        placeholder="Enter phone"
        placeholder_ar="أدخل الهاتف"
        language="ar"
      />
    );
    expect(screen.getByTestId("phone-input")).toHaveAttribute(
      "placeholder",
      "أدخل الهاتف"
    );
  });

  // ── Value ─────────────────────────────────────────────────────────────────

  it("passes value to input", () => {
    render(<PhoneInput value="501234567" />);
    expect(screen.getByTestId("phone-input")).toHaveValue("501234567");
  });

  // ── onChange ──────────────────────────────────────────────────────────────

  it("calls onChange when input changes", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} />);
    fireEvent.change(screen.getByTestId("phone-input"), {
      target: { value: "555" },
    });
    expect(onChange).toHaveBeenCalledWith("555");
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("disables input when disabled=true", () => {
    render(<PhoneInput disabled />);
    expect(screen.getByTestId("phone-input")).toBeDisabled();
  });

  it("passes disabled=true to Label", () => {
    render(<PhoneInput disabled />);
    expect(screen.getByTestId("label-mock")).toHaveAttribute(
      "data-disabled",
      "true"
    );
  });

  // ── Required ──────────────────────────────────────────────────────────────

  it("passes required=true to Label", () => {
    render(<PhoneInput required />);
    expect(screen.getByTestId("label-mock")).toHaveAttribute(
      "data-required",
      "true"
    );
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("passes hasError=true to Fields", () => {
    render(<PhoneInput hasError />);
    expect(screen.getByTestId("phone-input")).toHaveAttribute(
      "data-has-error",
      "true"
    );
  });

  it("renders Caption with error message when hasError and errorMessage provided", () => {
    render(<PhoneInput hasError errorMessage="Invalid phone number" />);
    expect(screen.getByTestId("caption-error")).toHaveTextContent(
      "Invalid phone number"
    );
  });

  it("does not render Caption when no captions and no error", () => {
    render(<PhoneInput />);
    expect(screen.queryByTestId("caption-mock")).not.toBeInTheDocument();
  });

  // ── Captions ─────────────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<PhoneInput captionLeft="Include country code" />);
    expect(screen.getByTestId("caption-left")).toHaveTextContent(
      "Include country code"
    );
  });

  it("renders Caption when captionRight is provided", () => {
    render(<PhoneInput captionRight="9 digits" />);
    expect(screen.getByTestId("caption-right")).toHaveTextContent("9 digits");
  });

  // ── showInfoIcon / tooltipText ────────────────────────────────────────────

  it("passes showInfoIcon and tooltipText to Label", () => {
    render(
      <PhoneInput showInfoIcon tooltipText="UAE phone format" />
    );
    expect(screen.getByTestId("label-info")).toHaveTextContent("UAE phone format");
  });

  it("does not throw when typing with default onChange (no-op)", () => {
    render(<PhoneInput />);
    const input = screen.getByTestId("phone-input");
    expect(() => fireEvent.change(input, { target: { value: "+971" } })).not.toThrow();
  });
});
