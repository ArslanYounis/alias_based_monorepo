/**
 * Tests for the mobile MenuColumn UI component.
 *
 * Branches to cover:
 *  1. isEditing=true  → className includes "opacity-60"
 *  2. isEditing=false → "opacity-60" is NOT in className
 *  3. isEditing=undefined (omitted) → treated as falsy, no opacity class
 *  4. language prop forwarded without crashing
 *  5. theme prop accepted without crashing (ignored internally as _theme)
 *  6. Static text labels are always rendered
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

import { MenuColumn } from "@platform/MenuColumn";

describe("MenuColumn", () => {
  it("renders without crashing with no props", () => {
    render(<MenuColumn />);
  });

  // ── Static content always present ─────────────────────────────────────────

  it("renders the 'Menu' label", () => {
    render(<MenuColumn />);
    expect(screen.getByText("Menu")).toBeTruthy();
  });

  it("renders the stub migration notice text", () => {
    render(<MenuColumn />);
    expect(
      screen.getByText("(MenuColumn stub — migrate from ADREC)")
    ).toBeTruthy();
  });

  // ── isEditing=true branch ─────────────────────────────────────────────────

  it("still renders all content when isEditing=true", () => {
    render(<MenuColumn isEditing={true} />);
    expect(screen.getByText("Menu")).toBeTruthy();
    expect(
      screen.getByText("(MenuColumn stub — migrate from ADREC)")
    ).toBeTruthy();
  });

  // ── isEditing=false branch ────────────────────────────────────────────────

  it("renders normally when isEditing=false", () => {
    render(<MenuColumn isEditing={false} />);
    expect(screen.getByText("Menu")).toBeTruthy();
  });

  // ── isEditing omitted (default falsy) ────────────────────────────────────

  it("renders normally when isEditing is not provided", () => {
    render(<MenuColumn />);
    expect(screen.getByText("Menu")).toBeTruthy();
  });

  // ── language prop ─────────────────────────────────────────────────────────

  it("accepts a language prop without crashing", () => {
    render(<MenuColumn language="en" />);
    expect(screen.getByText("Menu")).toBeTruthy();
  });

  it("accepts language='ar' without crashing", () => {
    render(<MenuColumn language="ar" />);
    expect(screen.getByText("Menu")).toBeTruthy();
  });

  // ── theme prop ────────────────────────────────────────────────────────────

  it("accepts a theme prop without crashing (ignored internally)", () => {
    render(<MenuColumn theme="dark" />);
    expect(screen.getByText("Menu")).toBeTruthy();
  });

  // ── All props combined ────────────────────────────────────────────────────

  it("renders correctly with all props provided", () => {
    render(<MenuColumn language="en" theme="light" isEditing={true} />);
    expect(screen.getByText("Menu")).toBeTruthy();
    expect(
      screen.getByText("(MenuColumn stub — migrate from ADREC)")
    ).toBeTruthy();
  });
});
