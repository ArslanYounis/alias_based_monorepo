import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DateSelect } from "@platform/DateSelect";

// ── Mocks ────────────────────────────────────────────────────────────────────
//
// DateSelect now renders:  Label  +  Fields(type="date" → DateInput)  +  Caption.
// DateInput uses the shadcn Popover / Calendar / Button primitives and the
// lucide Calendar icon, so we mock those to render inline (no portals in jsdom)
// and to drive date selection deterministically.

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

// Mock shadcn Calendar to a simple date picker with deterministic buttons
vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }: { onSelect: (d: Date | undefined) => void }) => (
    <div data-testid="calendar">
      <button data-testid="pick-date" onClick={() => onSelect(new Date("2024-06-15"))}>
        Pick June 15
      </button>
      <button data-testid="clear-date" onClick={() => onSelect(undefined)}>
        Clear
      </button>
    </div>
  ),
}));

// Mock lucide Calendar icon
vi.mock("lucide-react", async (importOriginal) => {
  const original = await importOriginal<typeof import("lucide-react")>();
  return {
    ...original,
    Calendar: (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="calendar-icon" {...props} />
    ),
  };
});

// Label renders its info icon via InfoSVG when showInfoIcon is true
vi.mock("@/assets/svg/InfoSVG", () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="info-icon" {...props} />
  ),
}));

// Mock shadcn Button to a plain button
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    disabled,
    className,
    onClick,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      data-testid="date-trigger-button"
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe("DateSelect", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders the trigger button", () => {
    render(<DateSelect />);
    expect(screen.getByTestId("date-trigger-button")).toBeInTheDocument();
  });

  it("renders placeholder text when no date is selected", () => {
    render(<DateSelect placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("renders Arabic placeholder when language is 'ar' and no date selected", () => {
    render(
      <DateSelect
        placeholder="Select date"
        placeholder_ar="اختر التاريخ"
        language="ar"
      />
    );
    expect(screen.getByText("اختر التاريخ")).toBeInTheDocument();
  });

  // Current behavior: DateSelect forwards the resolved placeholder to Fields,
  // which forwards to DateInput. DateInput has its own Arabic default
  // ("اختر التاريخ") that is used when placeholder_ar resolves empty in 'ar'
  // mode, so it does NOT fall back to the English string here.
  it("uses the Arabic default placeholder when placeholder_ar is empty and language is 'ar'", () => {
    render(
      <DateSelect placeholder="Select date" placeholder_ar="" language="ar" />
    );
    expect(screen.getByText("اختر التاريخ")).toBeInTheDocument();
  });

  it("renders the calendar icon", () => {
    render(<DateSelect />);
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  // ── Label ─────────────────────────────────────────────────────────────────

  it("renders label when provided", () => {
    render(<DateSelect label="Date of Birth" />);
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
  });

  it("renders Arabic label when language is 'ar'", () => {
    render(<DateSelect label="Date of Birth" label_ar="تاريخ الميلاد" language="ar" />);
    expect(screen.getByText("تاريخ الميلاد")).toBeInTheDocument();
  });

  it("renders required asterisk when required is true", () => {
    render(<DateSelect label="DOB" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  // ── Info icon (now driven by showInfoIcon on the Label) ────────────────────

  it("renders info icon when showInfoIcon is true", () => {
    render(<DateSelect label="DOB" showInfoIcon tooltipText="Some info" />);
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("does not render info icon when showInfoIcon is not provided", () => {
    render(<DateSelect label="DOB" />);
    expect(screen.queryByTestId("info-icon")).not.toBeInTheDocument();
  });

  // ── Controlled value ──────────────────────────────────────────────────────

  it("shows formatted date when a valid value is provided", () => {
    render(<DateSelect value="2024-01-15" language="en" />);
    // date-fns PPP formats as 'January 15th, 2024'
    expect(screen.getByText(/January 15th, 2024/)).toBeInTheDocument();
  });

  it("shows Arabic locale date format when language is 'ar' and value is provided", () => {
    render(<DateSelect value="2024-01-15" language="ar" />);
    const button = screen.getByTestId("date-trigger-button");
    expect(button.textContent).not.toBe("");
  });

  it("syncs date when value prop changes", async () => {
    const { rerender } = render(
      <DateSelect value="" placeholder="Select date" language="en" />
    );
    expect(screen.getByText("Select date")).toBeInTheDocument();
    rerender(<DateSelect value="2024-03-20" placeholder="Select date" language="en" />);
    await waitFor(() => {
      expect(screen.getByText(/March 20th, 2024/)).toBeInTheDocument();
    });
  });

  it("clears date when value prop becomes empty", async () => {
    const { rerender } = render(
      <DateSelect value="2024-03-20" placeholder="Select date" language="en" />
    );
    rerender(<DateSelect value="" placeholder="Select date" language="en" />);
    await waitFor(() => {
      expect(screen.getByText("Select date")).toBeInTheDocument();
    });
  });

  // ── Date selection via Calendar (onChange now receives a YYYY-MM-DD string) ─

  it("calls onChange with formatted date string when a date is picked", () => {
    const onChange = vi.fn();
    render(<DateSelect onChange={onChange} />);
    fireEvent.click(screen.getByTestId("pick-date"));
    expect(onChange).toHaveBeenCalledWith("2024-06-15");
  });

  it("calls onChange with empty string when date is cleared", () => {
    const onChange = vi.fn();
    render(<DateSelect value="2024-06-15" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("clear-date"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("applies error border class to the trigger button when hasError is true", () => {
    render(<DateSelect hasError />);
    const btn = screen.getByTestId("date-trigger-button");
    expect(btn.className).toContain("border-form-fields-error");
  });

  it("renders error message via Caption when hasError and errorMessage provided", () => {
    render(<DateSelect hasError errorMessage="Please select a date" />);
    expect(screen.getByText("Please select a date")).toBeInTheDocument();
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("disables the trigger button when disabled is true", () => {
    render(<DateSelect disabled />);
    expect(screen.getByTestId("date-trigger-button")).toBeDisabled();
  });

  // ── Direction ─────────────────────────────────────────────────────────────

  it("applies rtl direction for Arabic", () => {
    const { container } = render(<DateSelect language="ar" />);
    expect(container.querySelector("[dir]")).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<DateSelect language="en" />);
    expect(container.querySelector("[dir]")).toHaveAttribute("dir", "ltr");
  });

  // ── Caption ───────────────────────────────────────────────────────────────

  it("renders captionLeft when provided", () => {
    render(<DateSelect captionLeft="From today" />);
    expect(screen.getByText("From today")).toBeInTheDocument();
  });

  it("renders caption when captionLeft_ar is provided", () => {
    render(<DateSelect captionLeft_ar="من اليوم" language="ar" />);
    expect(screen.getByText("من اليوم")).toBeInTheDocument();
  });

  it("renders caption when captionRight is provided", () => {
    render(<DateSelect captionRight="Until today" />);
    expect(screen.getByText("Until today")).toBeInTheDocument();
  });

  it("renders error message via Caption when hasError and errorMessage_ar provided in Arabic", () => {
    render(
      <DateSelect
        hasError
        errorMessage="Please select"
        errorMessage_ar="يرجى الاختيار"
        language="ar"
      />
    );
    expect(screen.getByText("يرجى الاختيار")).toBeInTheDocument();
  });

  // ── No caption when no data ───────────────────────────────────────────────

  it("does not render Caption when no caption data and no error", () => {
    render(<DateSelect captionLeft="" />);
    // The DateSelect-level Caption is not rendered, so its known caption text
    // ("From today" etc.) is absent.
    expect(screen.queryByText("From today")).not.toBeInTheDocument();
  });

  // ── Date pick without onChange handler ────────────────────────────────────

  it("does not crash when a date is selected without onChange handler", () => {
    render(<DateSelect />);
    expect(() => fireEvent.click(screen.getByTestId("pick-date"))).not.toThrow();
  });

  // ── No required asterisk when required=false ──────────────────────────────

  it("does not render asterisk when required is false", () => {
    render(<DateSelect label="DOB" required={false} />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  // ── Error styling on placeholder ──────────────────────────────────────────

  it("applies error text class to placeholder when hasError and no date", () => {
    render(<DateSelect hasError placeholder="Select date" />);
    const span = screen.getByText("Select date");
    expect(span.className).toContain("text-form-fields-error");
  });
});
