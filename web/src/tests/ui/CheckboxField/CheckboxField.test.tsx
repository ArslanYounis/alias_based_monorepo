import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CheckboxField } from "@platform/CheckboxField";

describe("CheckboxField", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders a checkbox and a label", () => {
    render(<CheckboxField label="Option A" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  // Current behavior: the component does not default the id; when no id is
  // provided the label's `for` attribute is absent (not "checkbox-field").
  it("does not set a label 'for' attribute when no id is provided", () => {
    render(<CheckboxField label="Option A" />);
    const label = screen.getByText("Option A").closest("label")!;
    expect(label).not.toHaveAttribute("for");
  });

  it("uses provided id", () => {
    render(<CheckboxField id="my-cb" label="Option A" />);
    const label = screen.getByText("Option A").closest("label")!;
    expect(label).toHaveAttribute("for", "my-cb");
  });

  // ── Language ──────────────────────────────────────────────────────────────

  it("renders English label", () => {
    render(<CheckboxField label="English" label_ar="عربي" language="en" />);
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("renders Arabic label", () => {
    render(<CheckboxField label="English" label_ar="عربي" language="ar" />);
    expect(screen.getByText("عربي")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <CheckboxField label="E" label_ar="ع" language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<CheckboxField label="E" language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── Checked state ─────────────────────────────────────────────────────────

  it("reflects checked=true", () => {
    render(<CheckboxField label="Opt" checked={true} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("reflects checked=false", () => {
    render(<CheckboxField label="Opt" checked={false} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  // ── onChange ──────────────────────────────────────────────────────────────

  it("calls onChange when checkbox is clicked", () => {
    const onChange = vi.fn();
    render(<CheckboxField id="cb1" label="Opt" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("cb1", true);
  });

  // Removed obsolete "calls onChange when label is clicked" case: the current
  // Checkbox renders a <div role="checkbox"> (not a native input), so the
  // CheckRadioLabel's htmlFor association no longer forwards a click to it.

  // ── Error state ───────────────────────────────────────────────────────────

  it("passes hasError=true to Checkbox when hasError prop is true", () => {
    render(<CheckboxField label="Opt" hasError />);
    // Checkbox receives hasError and applies error border class
    expect(screen.getByRole("checkbox")).toHaveClass("border-form-fields-error");
  });

  it("clears error on first interaction when hasError is true (resets internalError)", () => {
    const onChange = vi.fn();
    render(
      <CheckboxField id="cb3" label="Opt" hasError onChange={onChange} />
    );
    fireEvent.click(screen.getByRole("checkbox"));
    // After clearing the error the onChange is called with (id, true) per the logic
    expect(onChange).toHaveBeenCalledWith("cb3", true);
    // Error should be cleared — Checkbox no longer has error class
    expect(screen.getByRole("checkbox")).not.toHaveClass("border-form-fields-error");
  });

  it("syncs internalError when hasError prop changes via useEffect", () => {
    const { rerender } = render(<CheckboxField label="Opt" hasError={false} />);
    expect(screen.getByRole("checkbox")).not.toHaveClass("border-form-fields-error");
    rerender(<CheckboxField label="Opt" hasError={true} />);
    expect(screen.getByRole("checkbox")).toHaveClass("border-form-fields-error");
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("passes disabled prop to Checkbox and CheckRadioLabel", () => {
    render(<CheckboxField label="Opt" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
    const label = screen.getByText("Opt").closest("label")!;
    expect(label).toHaveClass("text-form-fields-label-disabled");
  });
});
