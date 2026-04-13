import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Typography } from "@platform/Typography";

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({ value, value_ar, language }: { value?: string; value_ar?: string; language: string }) =>
    language === "ar" ? (value_ar || value || "") : (value || ""),
}));

describe("Typography", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    const { container } = render(<Typography variant="h1" text="Hello" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the text content", () => {
    render(<Typography variant="h2" text="Page Title" />);
    expect(screen.getByText("Page Title")).toBeInTheDocument();
  });

  // ── Variant classes ────────────────────────────────────────────────────────

  it.each([
    ["h1-shouting", "text-heading-h1-shouting", "font-bold"],
    ["h1-hero", "text-heading-h1-hero", "font-bold"],
    ["h1", "text-heading-h1", "font-bold"],
    ["h2", "text-heading-h2", "font-bold"],
    ["h3", "text-heading-h3", "font-bold"],
    ["h4", "text-heading-h4", "font-bold"],
    ["text-lg", "text-l", "font-normal"],
    ["text-md", "text-m", "font-normal"],
    ["text-sm", "text-s", "font-normal"],
    ["text-xs", "text-xs", "font-normal"],
    ["text-bold-lg", "text-bold-l", undefined],
    ["text-bold-md", "text-bold-m", undefined],
    ["text-bold-sm", "text-bold-s", undefined],
    ["text-bold-xs", "text-bold-xs", undefined],
    ["text-bold-xxs", "text-bold-xxs", undefined],
  ] as [string, string, string | undefined][])(
    "applies correct classes for variant '%s'",
    (variant, expectedClass, extraClass) => {
      const { container } = render(
        <Typography variant={variant as never} text="Test" />
      );
      expect(container.firstChild).toHaveClass(expectedClass);
      if (extraClass) {
        expect(container.firstChild).toHaveClass(extraClass);
      }
    }
  );

  // ── Color variants ─────────────────────────────────────────────────────────

  it("applies text-text-default for color='default'", () => {
    const { container } = render(<Typography variant="h1" text="T" color="default" />);
    expect(container.firstChild).toHaveClass("text-text-default");
  });

  it("applies text-text-dimmed for color='dimmed'", () => {
    const { container } = render(<Typography variant="h1" text="T" color="dimmed" />);
    expect(container.firstChild).toHaveClass("text-text-dimmed");
  });

  it("applies text-text-primary for color='primary'", () => {
    const { container } = render(<Typography variant="h1" text="T" color="primary" />);
    expect(container.firstChild).toHaveClass("text-text-primary");
  });

  it("applies text-text-link for color='link'", () => {
    const { container } = render(<Typography variant="h1" text="T" color="link" />);
    expect(container.firstChild).toHaveClass("text-text-link");
  });

  it("applies text-text-link-hover for any other color value", () => {
    const { container } = render(
      // @ts-expect-error testing unknown color
      <Typography variant="h1" text="T" color="hover" />
    );
    expect(container.firstChild).toHaveClass("text-text-link-hover");
  });

  // ── Direction ──────────────────────────────────────────────────────────────

  it("renders ltr by default", () => {
    const { container } = render(<Typography variant="h1" text="T" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("renders rtl when language=ar", () => {
    const { container } = render(<Typography variant="h1" text="T" language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  // ── Arabic text ────────────────────────────────────────────────────────────

  it("renders arabic text when language=ar and text_ar provided", () => {
    render(<Typography variant="h1" text="Hello" text_ar="مرحبا" language="ar" />);
    expect(screen.getByText("مرحبا")).toBeInTheDocument();
  });

  it("falls back to english text when language=ar and no text_ar", () => {
    render(<Typography variant="h1" text="Fallback" language="ar" />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });
});
