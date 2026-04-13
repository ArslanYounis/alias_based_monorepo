import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CurrencyInput } from "@platform/CurrencyInput";

// Fields (currency type) renders an input; DateSelect uses Radix popover
// which may require a portal — keep all in jsdom.

describe("CurrencyInput", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    const { container } = render(<CurrencyInput />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    render(<CurrencyInput label="Amount" />);
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("renders the Arabic label when language is 'ar'", () => {
    render(<CurrencyInput label="Amount" label_ar="المبلغ" language="ar" />);
    expect(screen.getByText("المبلغ")).toBeInTheDocument();
  });

  // ── Currency symbol ───────────────────────────────────────────────────────

  it("renders the default 'AED' currency symbol", () => {
    render(<CurrencyInput />);
    expect(screen.getByText("AED")).toBeInTheDocument();
  });

  it("renders a custom currency symbol", () => {
    render(<CurrencyInput currencySymbol="USD" />);
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  // ── Input value ───────────────────────────────────────────────────────────
  // Fields renders a type="number" input for the currency type — role is "spinbutton"

  it("renders the input with the provided value", () => {
    render(<CurrencyInput value="1000" />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("1000");
  });

  it("calls onChange when user types in the input", () => {
    const onChange = vi.fn();
    render(<CurrencyInput value="" onChange={onChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "500" } });
    expect(onChange).toHaveBeenCalledWith("500");
  });

  // ── Placeholder ───────────────────────────────────────────────────────────

  it("uses English placeholder when language is 'en'", () => {
    render(
      <CurrencyInput
        placeholder="Enter amount"
        placeholder_ar="أدخل المبلغ"
        language="en"
      />
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.placeholder).toBe("Enter amount");
  });

  it("uses Arabic placeholder when language is 'ar'", () => {
    render(
      <CurrencyInput
        placeholder="Enter amount"
        placeholder_ar="أدخل المبلغ"
        language="ar"
      />
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.placeholder).toBe("أدخل المبلغ");
  });

  it("falls back to English placeholder when placeholder_ar is empty and language is 'ar'", () => {
    render(
      <CurrencyInput
        placeholder="Enter amount"
        placeholder_ar=""
        language="ar"
      />
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.placeholder).toBe("Enter amount");
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("renders error message via Caption when hasError and errorMessage provided", () => {
    render(
      <CurrencyInput hasError errorMessage="Invalid amount" />
    );
    expect(screen.getByText("Invalid amount")).toBeInTheDocument();
  });

  it("does not render Caption when no captions or errors", () => {
    render(<CurrencyInput />);
    expect(document.querySelector(".justify-between")).not.toBeInTheDocument();
  });

  // ── Caption ───────────────────────────────────────────────────────────────

  it("renders caption left text when provided", () => {
    render(<CurrencyInput captionLeft="Min: 0" />);
    expect(screen.getByText("Min: 0")).toBeInTheDocument();
  });

  it("renders caption right text when provided", () => {
    render(<CurrencyInput captionRight="Max: 10000" />);
    expect(screen.getByText("Max: 10000")).toBeInTheDocument();
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("disables the input when disabled is true", () => {
    render(<CurrencyInput disabled />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  // ── required / label ─────────────────────────────────────────────────────

  it("renders required asterisk when required is true", () => {
    render(<CurrencyInput label="Amt" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not throw when typing with default onChange (no-op)", () => {
    render(<CurrencyInput />);
    const input = screen.getByRole("spinbutton");
    expect(() => fireEvent.change(input, { target: { value: "100" } })).not.toThrow();
  });
});
