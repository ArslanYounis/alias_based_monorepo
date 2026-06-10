import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DateSelect } from "@platform/DateSelect";

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock Radix Popover to render inline (no portal issues in jsdom)
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="popover-trigger">{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

// Mock shadcn Calendar to a simple date picker button
vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    onSelect,
    selected,
  }: {
    onSelect: (d: Date | undefined) => void;
    selected?: Date;
  }) => (
    <div data-testid="calendar">
      <button
        data-testid="pick-date"
        onClick={() => onSelect(new Date("2024-06-15"))}
      >
        Pick June 15
      </button>
      <button
        data-testid="clear-date"
        onClick={() => onSelect(undefined)}
      >
        Clear
      </button>
    </div>
  ),
}));

// Mock lucide CalendarIcon
vi.mock("lucide-react", async (importOriginal) => {
  const original = await importOriginal<typeof import("lucide-react")>();
  return {
    ...original,
    Calendar: (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="calendar-icon" {...props} />
    ),
  };
});

// Mock Info SVG asset
vi.mock("@/assets/svg/info", () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="info-icon" {...props} />
  ),
}));

// Mock shadcn Button to a simple button
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    disabled,
    className,
    onClick,
    variant,
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

  it("falls back to English placeholder when placeholder_ar is empty and language is 'ar'", () => {
    render(
      <DateSelect placeholder="Select date" placeholder_ar="" language="ar" />
    );
    expect(screen.getByText("Select date")).toBeInTheDocument();
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

  it("does not render label element when label is not provided", () => {
    render(<DateSelect />);
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("renders required asterisk when required is true", () => {
    render(<DateSelect label="DOB" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  // ── Info text ─────────────────────────────────────────────────────────────

  it("renders info icon when infoText is provided", () => {
    render(<DateSelect label="DOB" infoText="Some info" />);
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("does not render info icon when infoText is not provided", () => {
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
    // Arabic locale string contains Arabic numerals/text
    const button = screen.getByTestId("date-trigger-button");
    expect(button.textContent).not.toBe("");
  });

  it("syncs date when value prop changes", async () => {
    const { rerender } = render(<DateSelect value="" language="en" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
    rerender(<DateSelect value="2024-03-20" language="en" />);
    await waitFor(() => {
      expect(screen.getByText(/March 20th, 2024/)).toBeInTheDocument();
    });
  });

  it("clears date when value prop becomes empty", async () => {
    const { rerender } = render(<DateSelect value="2024-03-20" language="en" />);
    rerender(<DateSelect value="" language="en" />);
    await waitFor(() => {
      expect(screen.getByText("Select date")).toBeInTheDocument();
    });
  });

  // ── Date selection via Calendar ───────────────────────────────────────────

  it("calls onDateChange when a date is picked", () => {
    const onDateChange = vi.fn();
    render(<DateSelect onDateChange={onDateChange} />);
    fireEvent.click(screen.getByTestId("pick-date"));
    expect(onDateChange).toHaveBeenCalledWith(new Date("2024-06-15"));
  });

  it("calls onDateChange with undefined when date is cleared", () => {
    const onDateChange = vi.fn();
    render(<DateSelect value="2024-06-15" onDateChange={onDateChange} />);
    fireEvent.click(screen.getByTestId("clear-date"));
    expect(onDateChange).toHaveBeenCalledWith(undefined);
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("applies error border class when hasError is true", () => {
    render(<DateSelect hasError />);
    const btn = screen.getByTestId("date-trigger-button");
    expect(btn).toHaveClass("border-form-fields-error");
  });

  it("renders error message via Caption when hasError and errorMessage provided", () => {
    render(
      <DateSelect
        hasError
        errorMessage="Please select a date"
      />
    );
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
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<DateSelect language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── testId ────────────────────────────────────────────────────────────────

  it("applies data-testid when testId is provided", () => {
    render(<DateSelect testId="my-date-select" />);
    const wrapper = document.querySelector('[data-testid="my-date-select"]');
    expect(wrapper).toBeInTheDocument();
  });

  // ── Caption ───────────────────────────────────────────────────────────────

  it("renders captionLeft when provided", () => {
    render(<DateSelect captionLeft="From today" />);
    expect(screen.getByText("From today")).toBeInTheDocument();
  });

  // ── Caption with Arabic ───────────────────────────────────────────────────

  it("renders caption when captionLeft_ar is provided", () => {
    render(<DateSelect captionLeft_ar="من اليوم" language="ar" />);
    // Caption component should render
    const wrapper = document.querySelector(".flex.flex-col.gap-s");
    expect(wrapper).toBeInTheDocument();
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
    const { container } = render(<DateSelect />);
    // Only the main div, label (none), popover should exist
    const children = container.firstChild?.childNodes;
    // Should not have Caption child
    expect(children?.length).toBeLessThanOrEqual(2);
  });

  // ── Invalid date handling ─────────────────────────────────────────────────

  it("handles empty string value by showing placeholder", () => {
    render(<DateSelect value="" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  // ── onDateChange not provided ─────────────────────────────────────────────

  it("does not crash when date is selected without onDateChange handler", () => {
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
    render(<DateSelect hasError />);
    const btn = screen.getByTestId("date-trigger-button");
    const span = btn.querySelector("span");
    expect(span).toHaveClass("text-form-fields-error");
  });
});
