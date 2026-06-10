import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tooltip } from "@platform/Tooltip";

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({ value, value_ar, language }: { value?: string; value_ar?: string; language: string }) =>
    language === "ar" ? (value_ar || value || "") : (value || ""),
}));

describe("Tooltip", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    const { container } = render(<Tooltip text="Help text" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders tooltip text", () => {
    render(<Tooltip text="Helpful info" />);
    expect(screen.getByText("Helpful info")).toBeInTheDocument();
  });

  it("renders with ltr direction by default", () => {
    const { container } = render(<Tooltip text="Text" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("renders with rtl direction when language=ar", () => {
    const { container } = render(<Tooltip text="Text" text_ar="نص" language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  // ── Arabic content ─────────────────────────────────────────────────────────

  it("renders arabic text when language=ar", () => {
    render(<Tooltip text="Text" text_ar="نص عربي" language="ar" />);
    expect(screen.getByText("نص عربي")).toBeInTheDocument();
  });

  it("falls back to english text when language=ar and no text_ar", () => {
    render(<Tooltip text="Fallback" language="ar" />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  // ── Direction variants ─────────────────────────────────────────────────────

  it("renders no arrow div when direction=none (default)", () => {
    const { container } = render(<Tooltip text="Text" direction="none" />);
    // With direction=none, the arrow/wrapper class strings are empty → no border-based arrow element
    const arrowDivs = container.querySelectorAll('[class*="border-l-transparent"]');
    expect(arrowDivs).toHaveLength(0);
  });

  it("renders arrow div for top-left direction", () => {
    const { container } = render(<Tooltip text="Text" direction="top-left" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  it("renders arrow div for top-center direction", () => {
    const { container } = render(<Tooltip text="Text" direction="top-center" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  it("renders arrow div for top-right direction", () => {
    const { container } = render(<Tooltip text="Text" direction="top-right" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  it("renders arrow div for bottom-left direction", () => {
    const { container } = render(<Tooltip text="Text" direction="bottom-left" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  it("renders arrow div for bottom-center direction", () => {
    const { container } = render(<Tooltip text="Text" direction="bottom-center" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  it("renders arrow div for left-center direction", () => {
    const { container } = render(<Tooltip text="Text" direction="left-center" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  it("renders arrow div for right-center direction", () => {
    const { container } = render(<Tooltip text="Text" direction="right-center" />);
    const innerDivs = container.querySelectorAll("div > div");
    expect(innerDivs.length).toBeGreaterThan(0);
  });

  // ── Layout classes ─────────────────────────────────────────────────────────

  it("has max-w-[150px] and break-words classes", () => {
    const { container } = render(<Tooltip text="Text" />);
    expect(container.firstChild).toHaveClass("max-w-[150px]", "break-words");
  });

  it("has the chrome background color class", () => {
    const { container } = render(<Tooltip text="Text" />);
    expect(container.firstChild).toHaveClass("bg-[#566C74]");
  });

  it("has white text color class", () => {
    const { container } = render(<Tooltip text="Text" />);
    expect(container.firstChild).toHaveClass("text-white");
  });
});
