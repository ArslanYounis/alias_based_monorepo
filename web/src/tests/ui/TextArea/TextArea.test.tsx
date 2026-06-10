import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TextArea } from "@platform/TextArea";

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
    placeholder, value, onChange, hasError, disabled,
  }: {
    placeholder?: string; value?: string; onChange?: (v: string) => void;
    hasError?: boolean; disabled?: boolean;
  }) => (
    <textarea
      data-testid="fields"
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      aria-invalid={hasError}
      onChange={(e) => onChange?.(e.target.value)}
    />
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

describe("TextArea", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<TextArea />);
    expect(screen.getByTestId("fields")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<TextArea label="Description" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("does not render label when empty", () => {
    render(<TextArea />);
    expect(screen.queryByTestId("label")).not.toBeInTheDocument();
  });

  // ── Placeholder ────────────────────────────────────────────────────────────

  it("uses English placeholder when language=en", () => {
    render(<TextArea placeholder="Enter text" language="en" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "Enter text");
  });

  it("uses Arabic placeholder when language=ar and placeholder_ar provided", () => {
    render(<TextArea placeholder="Enter text" placeholder_ar="أدخل النص" language="ar" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "أدخل النص");
  });

  it("falls back to English placeholder when language=ar but no placeholder_ar", () => {
    render(<TextArea placeholder="Enter text" language="ar" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "Enter text");
  });

  // ── onChange ───────────────────────────────────────────────────────────────

  it("calls onChange when value changes", () => {
    const onChange = vi.fn();
    render(<TextArea onChange={onChange} />);
    fireEvent.change(screen.getByTestId("fields"), { target: { value: "new text" } });
    expect(onChange).toHaveBeenCalledWith("new text");
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it("passes disabled to Fields", () => {
    render(<TextArea disabled />);
    expect(screen.getByTestId("fields")).toBeDisabled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("passes hasError to Fields", () => {
    render(<TextArea hasError />);
    expect(screen.getByTestId("fields")).toHaveAttribute("aria-invalid", "true");
  });

  // ── Caption ────────────────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<TextArea captionLeft="Hint" />);
    expect(screen.getByTestId("caption-left")).toBeInTheDocument();
  });

  it("renders Caption when captionRight is provided", () => {
    render(<TextArea captionRight="0/500" />);
    expect(screen.getByTestId("caption-right")).toBeInTheDocument();
  });

  it("renders Caption error when hasError and errorMessage", () => {
    render(<TextArea hasError errorMessage="Field required" />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  it("renders Caption when captionLeft_ar is provided (ar language)", () => {
    render(<TextArea captionLeft_ar="تلميح" language="ar" />);
    expect(screen.getByTestId("caption")).toBeInTheDocument();
  });

  it("does not render Caption when no caption data or error", () => {
    render(<TextArea />);
    expect(screen.queryByTestId("caption")).not.toBeInTheDocument();
  });

  // ── Value ──────────────────────────────────────────────────────────────────

  it("renders with provided value", () => {
    render(<TextArea value="Initial text" />);
    expect(screen.getByTestId("fields")).toHaveValue("Initial text");
  });

  it("does not throw when typing with default onChange (no-op)", () => {
    render(<TextArea />);
    const input = screen.getByTestId("fields");
    expect(() => fireEvent.change(input, { target: { value: "abc" } })).not.toThrow();
  });
});
