import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CheckboxInput } from "@platform/CheckboxInput";

const options = [
  { value: "opt1", label: "Option 1", label_ar: "الخيار 1" },
  { value: "opt2", label: "Option 2", label_ar: "الخيار 2" },
  { value: "opt3", label: "Option 3", label_ar: "الخيار 3" },
];

describe("CheckboxInput", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders without crashing with no options", () => {
    const { container } = render(<CheckboxInput />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders all option labels", () => {
    render(<CheckboxInput options={options} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("renders Arabic option labels when language is 'ar'", () => {
    render(<CheckboxInput options={options} language="ar" />);
    expect(screen.getByText("الخيار 1")).toBeInTheDocument();
  });

  // ── Label ─────────────────────────────────────────────────────────────────

  it("renders the label text", () => {
    render(<CheckboxInput label="Choose options" options={options} />);
    expect(screen.getByText("Choose options")).toBeInTheDocument();
  });

  // ── Checked state ─────────────────────────────────────────────────────────

  it("marks options that are in the value array as checked", () => {
    render(<CheckboxInput options={options} value={["opt1", "opt3"]} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "true");  // opt1
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "false"); // opt2
    expect(checkboxes[2]).toHaveAttribute("aria-checked", "true");  // opt3
  });

  // ── onChange ──────────────────────────────────────────────────────────────

  it("calls onChange with added value when an unchecked option is clicked", () => {
    const onChange = vi.fn();
    render(
      <CheckboxInput options={options} value={["opt1"]} onChange={onChange} />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // opt2 (unchecked → checked)
    expect(onChange).toHaveBeenCalledWith(["opt1", "opt2"]);
  });

  it("calls onChange with removed value when a checked option is clicked", () => {
    const onChange = vi.fn();
    render(
      <CheckboxInput
        options={options}
        value={["opt1", "opt2"]}
        onChange={onChange}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]); // opt1 (checked → unchecked)
    expect(onChange).toHaveBeenCalledWith(["opt2"]);
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("disables all checkboxes when disabled is true", () => {
    render(<CheckboxInput options={options} disabled />);
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) =>
      expect(cb).toHaveAttribute("aria-disabled", "true")
    );
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it("passes hasError to checkboxes when hasError is true and value is empty", () => {
    render(<CheckboxInput options={options} hasError value={[]} />);
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) =>
      expect(cb).toHaveClass("border-form-fields-error")
    );
  });

  it("does not pass hasError to checkboxes when value is non-empty", () => {
    render(
      <CheckboxInput options={options} hasError value={["opt1"]} />
    );
    // opt1 is checked — its style is checked, not error
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toHaveClass("border-form-fields-error");
  });

  // ── Caption ───────────────────────────────────────────────────────────────

  it("renders caption when captionLeft is provided", () => {
    render(<CheckboxInput options={options} captionLeft="Left caption" />);
    expect(screen.getByText("Left caption")).toBeInTheDocument();
  });

  it("renders error message via Caption when hasError and errorMessage are provided", () => {
    render(
      <CheckboxInput
        options={options}
        hasError
        errorMessage="Please select one"
      />
    );
    expect(screen.getByText("Please select one")).toBeInTheDocument();
  });

  it("does not render Caption when no caption props or errors", () => {
    render(<CheckboxInput options={options} />);
    // Caption renders a min-h-[16px] span row; no error span should exist
    expect(document.querySelector(".text-form-fields-error")).not.toBeInTheDocument();
    expect(document.querySelector(".min-h-\\[16px\\]")).not.toBeInTheDocument();
  });

  // ── required / showInfoIcon passed to Label ───────────────────────────────

  it("renders required asterisk via Label when required is true", () => {
    render(<CheckboxInput label="Pick one" options={options} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  // NOTE: the previous "default onChange (no-op)" case was removed — the current
  // CheckboxInput has no default onChange and invokes it unconditionally, so
  // rendering without an onChange handler is not a supported usage.
});
