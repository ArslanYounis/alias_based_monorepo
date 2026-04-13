import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MenuColumn } from "@platform/MenuColumn";

describe("MenuColumn (web)", () => {
  // ── Default rendering ─────────────────────────────────────────────────────

  it("renders an aside element", () => {
    render(<MenuColumn />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders 'Menu' text", () => {
    render(<MenuColumn />);
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("renders the stub migration note", () => {
    render(<MenuColumn />);
    expect(
      screen.getByText(/MenuColumn stub/)
    ).toBeInTheDocument();
  });

  // ── Direction ─────────────────────────────────────────────────────────────

  it("sets dir=ltr when language=en", () => {
    render(<MenuColumn language="en" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("dir", "ltr");
  });

  it("sets dir=rtl when language=ar", () => {
    render(<MenuColumn language="ar" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("dir", "rtl");
  });

  it("defaults to ltr direction when no language provided", () => {
    render(<MenuColumn />);
    // undefined language → language === "ar" is false → ltr
    expect(screen.getByRole("complementary")).toHaveAttribute("dir", "ltr");
  });

  // ── isEditing blur ────────────────────────────────────────────────────────

  it("applies blur-sm and pointer-events-none when isEditing=true", () => {
    render(<MenuColumn isEditing />);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveClass("blur-sm");
    expect(aside).toHaveClass("pointer-events-none");
  });

  it("does not apply blur-sm when isEditing=false", () => {
    render(<MenuColumn isEditing={false} />);
    expect(screen.getByRole("complementary")).not.toHaveClass("blur-sm");
  });

  it("does not apply blur-sm when isEditing is not provided", () => {
    render(<MenuColumn />);
    expect(screen.getByRole("complementary")).not.toHaveClass("blur-sm");
  });

  // ── Layout classes ────────────────────────────────────────────────────────

  it("has hidden md:flex class for responsive layout", () => {
    render(<MenuColumn />);
    expect(screen.getByRole("complementary")).toHaveClass("hidden");
    expect(screen.getByRole("complementary")).toHaveClass("md:flex");
  });

  it("has bg-structure-menu-background class", () => {
    render(<MenuColumn />);
    expect(screen.getByRole("complementary")).toHaveClass(
      "bg-structure-menu-background"
    );
  });
});
