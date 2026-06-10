import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Select } from "@platform/Select";

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
    placeholder, value, hasError, disabled, type,
  }: {
    placeholder?: string; value?: string; onChange?: (v: string) => void;
    hasError?: boolean; disabled?: boolean; type?: string;
  }) => (
    <input
      data-testid="fields"
      data-type={type}
      placeholder={placeholder}
      defaultValue={value}
      disabled={disabled}
      aria-invalid={hasError ? "true" : undefined}
      readOnly
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

const noop = () => {};

const opts = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Select", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Select options={opts} onChange={noop} />);
    expect(screen.getByTestId("fields")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Select options={opts} onChange={noop} label="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("does not render label when empty", () => {
    render(<Select options={opts} onChange={noop} />);
    expect(screen.queryByTestId("label")).not.toBeInTheDocument();
  });

  it("passes type='select' to Fields", () => {
    render(<Select options={opts} onChange={noop} />);
    expect(screen.getByTestId("fields")).toHaveAttribute("data-type", "select");
  });

  // ── Direction ──────────────────────────────────────────────────────────────

  it("renders ltr direction by default", () => {
    const { container } = render(<Select options={opts} onChange={noop} />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "ltr");
  });

  it("renders rtl direction when language=ar", () => {
    const { container } = render(<Select options={opts} onChange={noop} language="ar" />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "rtl");
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it("passes disabled to Fields", () => {
    render(<Select options={opts} onChange={noop} disabled />);
    expect(screen.getByTestId("fields")).toBeDisabled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("passes hasError to Fields", () => {
    render(<Select options={opts} onChange={noop} hasError />);
    expect(screen.getByTestId("fields")).toHaveAttribute("aria-invalid", "true");
  });

  // ── Caption ────────────────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<Select options={opts} onChange={noop} captionLeft="Hint" />);
    expect(screen.getByTestId("caption-left")).toBeInTheDocument();
  });

  it("renders Caption when captionRight is provided", () => {
    render(<Select options={opts} onChange={noop} captionRight="0/50" />);
    expect(screen.getByTestId("caption-right")).toBeInTheDocument();
  });

  it("renders Caption error when hasError and errorMessage", () => {
    render(<Select options={opts} onChange={noop} hasError errorMessage="Required field" />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  it("does not render Caption when no caption data or error", () => {
    render(<Select options={opts} onChange={noop} />);
    expect(screen.queryByTestId("caption")).not.toBeInTheDocument();
  });

  // ── Placeholder language ───────────────────────────────────────────────────

  it("uses english placeholder when language=en", () => {
    render(<Select options={opts} onChange={noop} placeholder="Select..." language="en" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "Select...");
  });

  it("uses arabic placeholder when language=ar and placeholder_ar provided", () => {
    render(<Select options={opts} onChange={noop} placeholder="Select..." placeholder_ar="اختر..." language="ar" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "اختر...");
  });

  it("falls back to English placeholder when placeholder_ar is empty and language=ar", () => {
    render(<Select options={opts} onChange={noop} placeholder="Select..." placeholder_ar="" language="ar" />);
    expect(screen.getByTestId("fields")).toHaveAttribute("placeholder", "Select...");
  });

  // ── Value binding ─────────────────────────────────────────────────────────

  it("passes checked value to Fields", () => {
    render(<Select options={opts} onChange={noop} checked="a" />);
    expect(screen.getByTestId("fields")).toHaveValue("a");
  });

  // ── Required prop ─────────────────────────────────────────────────────────

  it("passes required to Label", () => {
    render(<Select options={opts} onChange={noop} label="Pick" required />);
    expect(screen.getByTestId("label")).toHaveAttribute("data-required", "true");
  });

  it("passes disabled to Label", () => {
    render(<Select options={opts} onChange={noop} label="Pick" disabled />);
    expect(screen.getByTestId("label")).toHaveAttribute("data-disabled", "true");
  });

  // ── Caption with Arabic ───────────────────────────────────────────────────

  it("renders Caption when captionLeft_ar is provided (Arabic caption triggers render)", () => {
    render(<Select options={opts} onChange={noop} captionLeft_ar="تلميح" language="ar" />);
    expect(screen.getByTestId("caption")).toBeInTheDocument();
  });

  it("renders Caption when captionRight_ar is provided", () => {
    render(<Select options={opts} onChange={noop} captionRight_ar="٠/٥٠" language="ar" />);
    expect(screen.getByTestId("caption")).toBeInTheDocument();
  });

  // ── Error with Arabic message ─────────────────────────────────────────────

  it("renders Caption when hasError and errorMessage_ar is provided", () => {
    render(<Select options={opts} onChange={noop} hasError errorMessage_ar="حقل مطلوب" language="ar" />);
    expect(screen.getByTestId("caption")).toBeInTheDocument();
  });

  // ── No caption conditions ─────────────────────────────────────────────────

  it("does not render Caption when hasError but no errorMessage", () => {
    render(<Select options={opts} onChange={noop} hasError />);
    expect(screen.queryByTestId("caption")).not.toBeInTheDocument();
  });

  it("renders without explicit onChange (uses default no-op)", () => {
    expect(() => render(<Select options={opts} />)).not.toThrow();
    expect(screen.getByTestId("fields")).toBeInTheDocument();
  });
});
