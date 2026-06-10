import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CheckRadioLabel } from "@platform/CheckRadioLabel";

describe("CheckRadioLabel", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders a label element", () => {
    render(<CheckRadioLabel label="Accept" />);
    expect(screen.getByText("Accept")).toBeInTheDocument();
  });

  // ── Language ──────────────────────────────────────────────────────────────

  it("renders English label when language is 'en'", () => {
    render(<CheckRadioLabel label="Accept" label_ar="قبول" language="en" />);
    expect(screen.getByText("Accept")).toBeInTheDocument();
  });

  it("renders Arabic label when language is 'ar'", () => {
    render(<CheckRadioLabel label="Accept" label_ar="قبول" language="ar" />);
    expect(screen.getByText("قبول")).toBeInTheDocument();
  });

  it("applies ltr direction for English", () => {
    render(<CheckRadioLabel label="Accept" language="en" />);
    const label = screen.getByText("Accept").closest("label")!;
    expect(label).toHaveStyle({ direction: "ltr" });
  });

  it("applies rtl direction for Arabic", () => {
    render(<CheckRadioLabel label="Accept" label_ar="قبول" language="ar" />);
    const label = screen.getByText("قبول").closest("label")!;
    expect(label).toHaveStyle({ direction: "rtl" });
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("applies disabled color class when disabled is true", () => {
    render(<CheckRadioLabel label="Accept" disabled />);
    const label = screen.getByText("Accept").closest("label")!;
    expect(label).toHaveClass("text-form-fields-label-disabled");
  });

  it("applies active color class when disabled is false", () => {
    render(<CheckRadioLabel label="Accept" disabled={false} />);
    const label = screen.getByText("Accept").closest("label")!;
    expect(label).toHaveClass("text-form-fields-label-text");
  });

  // ── htmlFor ───────────────────────────────────────────────────────────────

  it("sets htmlFor attribute on label", () => {
    render(<CheckRadioLabel label="Accept" htmlFor="my-checkbox" />);
    const label = screen.getByText("Accept").closest("label")!;
    expect(label).toHaveAttribute("for", "my-checkbox");
  });

  // ── onClick ───────────────────────────────────────────────────────────────

  it("calls onClick when label is clicked", () => {
    const onClick = vi.fn();
    render(<CheckRadioLabel label="Accept" onClick={onClick} />);
    fireEvent.click(screen.getByText("Accept"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onClick is not provided", () => {
    render(<CheckRadioLabel label="Accept" />);
    expect(() => fireEvent.click(screen.getByText("Accept"))).not.toThrow();
  });

  // ── Typography class ──────────────────────────────────────────────────────

  it("applies text-bold-m class to the label", () => {
    render(<CheckRadioLabel label="Accept" />);
    const label = screen.getByText("Accept").closest("label")!;
    expect(label).toHaveClass("text-bold-m");
  });
});
