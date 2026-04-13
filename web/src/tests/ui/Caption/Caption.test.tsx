import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Caption } from "@platform/Caption";

describe("Caption", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders without crashing with default props", () => {
    const { container } = render(<Caption />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders captionLeft text", () => {
    render(<Caption captionLeft="Left text" />);
    expect(screen.getByText("Left text")).toBeInTheDocument();
  });

  it("renders captionRight text", () => {
    render(<Caption captionRight="Right text" />);
    expect(screen.getByText("Right text")).toBeInTheDocument();
  });

  // ── Language switching ────────────────────────────────────────────────────

  it("renders Arabic captionLeft when language is 'ar'", () => {
    render(
      <Caption
        captionLeft="Left"
        captionLeft_ar="يسار"
        language="ar"
      />
    );
    expect(screen.getByText("يسار")).toBeInTheDocument();
  });

  it("renders Arabic captionRight when language is 'ar'", () => {
    render(
      <Caption
        captionRight="Right"
        captionRight_ar="يمين"
        language="ar"
      />
    );
    expect(screen.getByText("يمين")).toBeInTheDocument();
  });

  it("uses ltr direction for English", () => {
    const { container } = render(<Caption captionLeft="L" language="en" />);
    const row = container.querySelector('[style*="direction: ltr"]');
    expect(row).toBeInTheDocument();
  });

  it("uses rtl direction for Arabic", () => {
    const { container } = render(<Caption captionLeft_ar="ي" language="ar" />);
    const row = container.querySelector('[style*="direction: rtl"]');
    expect(row).toBeInTheDocument();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("applies text-text-dimmed class when disabled", () => {
    render(<Caption captionLeft="L" disabled />);
    const row = document.querySelector(".text-text-dimmed");
    expect(row).toBeInTheDocument();
  });

  it("applies form-fields caption color class when not disabled", () => {
    render(<Caption captionLeft="L" disabled={false} />);
    const row = document.querySelector(".text-form-fields-captions-text-color");
    expect(row).toBeInTheDocument();
  });

  // ── Error message ─────────────────────────────────────────────────────────

  it("renders error message when hasError is true and errorMessage is provided", () => {
    render(
      <Caption
        hasError
        errorMessage="This is required"
        disabled={false}
      />
    );
    expect(screen.getByText("This is required")).toBeInTheDocument();
  });

  it("renders Arabic error message when language is 'ar'", () => {
    render(
      <Caption
        hasError
        errorMessage="Required"
        errorMessage_ar="مطلوب"
        language="ar"
        disabled={false}
      />
    );
    expect(screen.getByText("مطلوب")).toBeInTheDocument();
  });

  it("does not render error message when disabled is true even if hasError", () => {
    render(
      <Caption
        hasError
        errorMessage="This is required"
        disabled
      />
    );
    expect(screen.queryByText("This is required")).not.toBeInTheDocument();
  });

  it("does not render error message when hasError is false", () => {
    render(<Caption hasError={false} errorMessage="Should not show" />);
    expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
  });

  it("does not render error message when errorMessage is empty", () => {
    render(<Caption hasError errorMessage="" errorMessage_ar="" />);
    const span = document.querySelector(".text-form-fields-error");
    expect(span).not.toBeInTheDocument();
  });

  // ── Caption row visibility ────────────────────────────────────────────────

  it("does not render caption row when all caption values are empty", () => {
    render(
      <Caption
        captionLeft=""
        captionLeft_ar=""
        captionRight=""
        captionRight_ar=""
      />
    );
    const row = document.querySelector(".justify-between");
    expect(row).not.toBeInTheDocument();
  });

  // ── Layout for English ────────────────────────────────────────────────────

  it("applies flex-row for English", () => {
    render(<Caption captionLeft="L" language="en" />);
    expect(document.querySelector(".flex-row")).toBeInTheDocument();
  });

  it("applies flex-row-reverse for Arabic", () => {
    render(<Caption captionLeft_ar="ي" language="ar" />);
    expect(document.querySelector(".flex-row-reverse")).toBeInTheDocument();
  });
});
