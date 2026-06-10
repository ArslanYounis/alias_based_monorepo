import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ModalTitle from "@shared/components/ModalTitle/ModalTitle";

describe("ModalTitle (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<ModalTitle />);
  });

  it("renders English label", () => {
    render(<ModalTitle label="Add Owner" label_ar="إضافة مالك" language="en" />);
    expect(screen.getByText("Add Owner")).toBeInTheDocument();
  });

  it("renders Arabic label when language is 'ar'", () => {
    render(<ModalTitle label="Add Owner" label_ar="إضافة مالك" language="ar" />);
    expect(screen.getByText("إضافة مالك")).toBeInTheDocument();
  });

  it("falls back to label when label_ar is empty in 'ar' mode", () => {
    render(<ModalTitle label="Fallback" label_ar="" language="ar" />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("uses text-heading-h1 class on web platform", () => {
    const { container } = render(
      <ModalTitle label="Title" platform="web" />
    );
    const textEl = container.querySelector(".text-heading-h1");
    expect(textEl).toBeInTheDocument();
  });

  it("uses text-heading-h3 class on mobile platform", () => {
    const { container } = render(
      <ModalTitle label="Title" platform="mobile" />
    );
    const textEl = container.querySelector(".text-heading-h3");
    expect(textEl).toBeInTheDocument();
  });

  it("sets ltr direction for English", () => {
    const { container } = render(<ModalTitle label="Title" language="en" />);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveAttribute("dir", "rtl");
  });

  it("sets rtl direction for Arabic", () => {
    const { container } = render(<ModalTitle label="عنوان" language="ar" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });
});
