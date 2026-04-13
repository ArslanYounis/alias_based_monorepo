import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ModalSteps from "@shared/components/ModalSteps/ModalSteps";

describe("ModalSteps (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<ModalSteps />);
  });

  it("renders English title", () => {
    render(<ModalSteps title="Step 1" title_ar="الخطوة 1" language="en" />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(<ModalSteps title="Step 1" title_ar="الخطوة 1" language="ar" />);
    expect(screen.getByText("الخطوة 1")).toBeInTheDocument();
  });

  it("renders English subText", () => {
    render(<ModalSteps subText="1 of 3" subText_ar="١ من ٣" language="en" />);
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("renders Arabic subText when language is 'ar'", () => {
    render(<ModalSteps subText="1 of 3" subText_ar="١ من ٣" language="ar" />);
    expect(screen.getByText("١ من ٣")).toBeInTheDocument();
  });

  it("falls back to title when title_ar is not provided in 'ar' mode", () => {
    render(<ModalSteps title="Fallback Title" language="ar" />);
    expect(screen.getByText("Fallback Title")).toBeInTheDocument();
  });

  it("renders both title and subText together", () => {
    render(
      <ModalSteps
        title="Contract"
        title_ar="العقد"
        subText="Step 1 of 4"
        subText_ar="الخطوة ١ من ٤"
        language="en"
      />
    );
    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
  });

  it("uses ltr direction by default", () => {
    const { container } = render(<ModalSteps language="en" />);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveAttribute("dir", "rtl");
  });

  it("uses rtl direction when language is 'ar'", () => {
    const { container } = render(<ModalSteps language="ar" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });
});
