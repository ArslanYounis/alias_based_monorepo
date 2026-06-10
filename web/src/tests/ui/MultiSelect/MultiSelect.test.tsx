import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MultiSelect } from "@platform/MultiSelect";

// Mock Fields to isolate MultiSelect logic
vi.mock("@platform/Fields", () => ({
  Fields: ({
    value,
    onChange,
    placeholder,
    hasError,
    disabled,
    options,
    showAddButton,
    title,
  }: {
    type?: string;
    selectType?: string;
    placeholder?: string;
    value?: string;
    onChange?: (v: string) => void;
    hasError?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    language?: string;
    options?: Array<{ label: string; value: string; label_ar?: string }>;
    showAddButton?: boolean;
    title?: string;
    title_ar?: string;
  }) => (
    <div data-testid="fields-mock">
      <input
        data-testid="fields-input"
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        data-has-error={hasError}
      />
      {options?.map((opt) => (
        <button
          key={opt.value}
          data-testid={`opt-${opt.value}`}
          onClick={() => onChange?.(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      {showAddButton && <button data-testid="fields-add-btn">Add</button>}
      {title && <span data-testid="fields-title">{title}</span>}
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
      {required && <span>*</span>}
      {showInfoIcon && <span data-testid="label-info">{tooltipText}</span>}
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

describe("MultiSelect (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ];

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<MultiSelect />);
    expect(screen.getByTestId("fields-mock")).toBeInTheDocument();
  });

  it("renders Label component", () => {
    render(<MultiSelect label="Department" />);
    expect(screen.getByTestId("label-mock")).toBeInTheDocument();
  });

  it("renders English label by default", () => {
    render(<MultiSelect label="Department" label_ar="القسم" />);
    expect(screen.getByTestId("label-mock")).toHaveTextContent("Department");
  });

  it("renders Arabic label when language=ar", () => {
    render(<MultiSelect label="Department" label_ar="القسم" language="ar" />);
    expect(screen.getByTestId("label-mock")).toHaveTextContent("القسم");
  });

  // ── Required ──────────────────────────────────────────────────────────────

  it("passes required=true to Label", () => {
    render(<MultiSelect required />);
    expect(screen.getByTestId("label-mock")).toHaveAttribute(
      "data-required",
      "true"
    );
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("passes disabled=true to Label", () => {
    render(<MultiSelect disabled />);
    expect(screen.getByTestId("label-mock")).toHaveAttribute(
      "data-disabled",
      "true"
    );
  });

  it("passes disabled=true to Fields input", () => {
    render(<MultiSelect disabled />);
    expect(screen.getByTestId("fields-input")).toBeDisabled();
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("passes hasError=true to Fields", () => {
    render(<MultiSelect hasError />);
    expect(screen.getByTestId("fields-input")).toHaveAttribute(
      "data-has-error",
      "true"
    );
  });

  it("renders Caption with error message when hasError and errorMessage provided", () => {
    render(<MultiSelect hasError errorMessage="Please select at least one" />);
    expect(screen.getByTestId("caption-mock")).toBeInTheDocument();
    expect(screen.getByTestId("caption-error")).toHaveTextContent(
      "Please select at least one"
    );
  });

  it("does not render Caption when no captions and no error", () => {
    render(<MultiSelect />);
    expect(screen.queryByTestId("caption-mock")).not.toBeInTheDocument();
  });

  // ── Caption captions ──────────────────────────────────────────────────────

  it("renders Caption when captionLeft is provided", () => {
    render(<MultiSelect captionLeft="At least 1 required" />);
    expect(screen.getByTestId("caption-left")).toHaveTextContent(
      "At least 1 required"
    );
  });

  it("renders Caption when captionRight is provided", () => {
    render(<MultiSelect captionRight="Max 5" />);
    expect(screen.getByTestId("caption-right")).toHaveTextContent("Max 5");
  });

  // ── Value handling ────────────────────────────────────────────────────────

  // `value` is now strictly string[]; MultiSelect joins it with ", " before
  // passing to Fields. (A raw string value is no longer a supported input.)
  it("joins array value with ', ' when value is an array", () => {
    render(<MultiSelect value={["a", "b"]} options={options} />);
    expect(screen.getByTestId("fields-input")).toHaveValue("a, b");
  });

  it("uses empty string when value is undefined", () => {
    render(<MultiSelect options={options} />);
    expect(screen.getByTestId("fields-input")).toHaveValue("");
  });

  // ── onChange ──────────────────────────────────────────────────────────────

  it("calls onChange with array when Fields reports comma-separated string", () => {
    const onChange = vi.fn();
    render(<MultiSelect onChange={onChange} options={options} />);
    // Simulate Fields onChange with comma-separated string
    const input = screen.getByTestId("fields-input");
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )!.set;
    nativeInputValueSetter!.call(input, "a, b");
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  // ── Options ───────────────────────────────────────────────────────────────

  it("passes options to Fields", () => {
    render(<MultiSelect options={options} />);
    expect(screen.getByTestId("opt-a")).toBeInTheDocument();
    expect(screen.getByTestId("opt-b")).toBeInTheDocument();
    expect(screen.getByTestId("opt-c")).toBeInTheDocument();
  });

  // ── showAddButton ─────────────────────────────────────────────────────────

  it("passes showAddButton=true to Fields", () => {
    render(<MultiSelect showAddButton />);
    expect(screen.getByTestId("fields-add-btn")).toBeInTheDocument();
  });

  // ── title ─────────────────────────────────────────────────────────────────

  it("passes title to Fields", () => {
    render(<MultiSelect title="Choose Skills" />);
    expect(screen.getByTestId("fields-title")).toHaveTextContent("Choose Skills");
  });

  // ── Info icon ─────────────────────────────────────────────────────────────

  it("passes showInfoIcon and tooltipText to Label", () => {
    render(
      <MultiSelect showInfoIcon tooltipText="Choose multiple values" />
    );
    expect(screen.getByTestId("label-info")).toHaveTextContent(
      "Choose multiple values"
    );
  });

  // ── Direction ─────────────────────────────────────────────────────────────

  it("sets dir=rtl on root div when language=ar", () => {
    const { container } = render(<MultiSelect language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("sets dir=ltr on root div when language=en", () => {
    const { container } = render(<MultiSelect language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });
});
