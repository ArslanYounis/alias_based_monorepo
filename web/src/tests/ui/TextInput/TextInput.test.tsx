import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TextInput } from "@platform/TextInput";

vi.mock("@platform/Label", () => ({
  Label: ({ label, required, disabled }: { label?: string; required?: boolean; disabled?: boolean }) =>
    label ? (
      <label data-testid="label" data-required={String(required)} data-disabled={String(disabled)}>
        {label}
      </label>
    ) : null,
}));

vi.mock("@platform/Fields", () => ({
  Fields: ({
    placeholder, value, onChange, hasError, disabled, type, icon,
  }: {
    placeholder?: string; value?: string; onChange?: (v: string) => void;
    hasError?: boolean; disabled?: boolean; type?: string; icon?: React.ReactNode;
  }) => (
    <div data-testid="fields-wrapper">
      {icon && <span data-testid="field-icon">{icon}</span>}
      <input
        data-testid="fields"
        data-type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-invalid={hasError}
        onChange={(e) => onChange?.(e.target.value)}
      />
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

describe("TextInput", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<TextInput />);
    expect(screen.getByTestId("fields")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<TextInput label="Full Name" />);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("does not render label when empty", () => {
    render(<TextInput />);
    expect(screen.queryByTestId("label")).not.toBeInTheDocument();
  });

  // ── Field type ─────────────────────────────────────────────────────────────

  it("defaults to text fieldType", () => {
    render(<TextInput />);
    expect(screen.getByTestId("fields")).toHaveAttribute("data-type", "text");
  });

  it("uses provided fieldType", () => {
    render(<TextInput fieldType="number" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("data-type", "number");
  });

  // ── Placeholder ────────────────────────────────────────────────────────────

  it("uses English placeholder by default", () => {
    render(<TextInput placeholder="Type here" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "Type here");
  });

  it("uses Arabic placeholder when language=ar and placeholder_ar set", () => {
    render(<TextInput placeholder="Type here" placeholder_ar="اكتب هنا" language="ar" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "اكتب هنا");
  });

  it("falls back to English placeholder when no Arabic placeholder", () => {
    render(<TextInput placeholder="Type here" language="ar" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "Type here");
  });

  // ── Value & onChange ───────────────────────────────────────────────────────

  it("renders with provided value", () => {
    render(<TextInput value="Hello" />);
    expect(screen.getByTestId("fields")).toHaveValue("Hello");
  });

  it("calls onChange when input value changes", () => {
    const onChange = vi.fn();
    render(<TextInput onChange={onChange} />);
    fireEvent.change(screen.getByTestId("fields"), { target: { value: "new" } });
    expect(onChange).toHaveBeenCalledWith("new");
  });

  // ── Icon ───────────────────────────────────────────────────────────────────

  it("renders icon when provided", () => {
    render(<TextInput icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render field-icon when no icon", () => {
    render(<TextInput />);
    expect(screen.queryByTestId("field-icon")).not.toBeInTheDocument();
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it("passes disabled to Fields", () => {
    render(<TextInput disabled />);
    expect(screen.getByTestId("fields")).toBeDisabled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("passes hasError to Fields", () => {
    render(<TextInput hasError />);
    expect(screen.getByTestId("fields")).toHaveAttribute("aria-invalid", "true");
  });

  // ── Caption ────────────────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<TextInput captionLeft="Hint" />);
    expect(screen.getByTestId("caption-left")).toBeInTheDocument();
  });

  it("renders Caption when captionRight is provided", () => {
    render(<TextInput captionRight="0/100" />);
    expect(screen.getByTestId("caption-right")).toBeInTheDocument();
  });

  it("renders Caption error when hasError and errorMessage", () => {
    render(<TextInput hasError errorMessage="Required" />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  it("does not render Caption when no caption data or error", () => {
    render(<TextInput />);
    expect(screen.queryByTestId("caption")).not.toBeInTheDocument();
  });

  // ── Required label ─────────────────────────────────────────────────────────

  it("passes required to Label", () => {
    render(<TextInput label="Name" required />);
    expect(screen.getByTestId("label")).toHaveAttribute("data-required", "true");
  });

  it("does not throw when typing with default onChange (no-op)", () => {
    render(<TextInput />);
    const input = screen.getByTestId("fields");
    expect(() => fireEvent.change(input, { target: { value: "abc" } })).not.toThrow();
  });
});
