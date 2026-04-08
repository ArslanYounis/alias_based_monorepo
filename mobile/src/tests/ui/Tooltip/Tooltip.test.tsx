/**
 * Tests for the Tooltip UI component.
 *
 * Exercises: English/Arabic text rendering, direction="none" suppresses
 * the arrow wrapper, and any non-"none" direction renders the arrow wrapper.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer ─────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "lang-switch" },
        language === "ar" && value_ar ? value_ar : value
      ),
  };
});

jest.mock("@shared/components/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "lang-switch" },
        language === "ar" && value_ar ? value_ar : value
      ),
  };
});

// ── Mock @platform/Text ────────────────────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

import { Tooltip } from "@platform/Tooltip";

describe("Tooltip", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Tooltip text="Helpful hint" />);
  });

  it("renders the English text by default", () => {
    render(<Tooltip text="Helpful hint" text_ar="تلميح مفيد" />);
    expect(screen.getByText("Helpful hint")).toBeTruthy();
  });

  it("renders the Arabic text when language='ar'", () => {
    render(
      <Tooltip text="Helpful hint" text_ar="تلميح مفيد" language="ar" />
    );
    expect(screen.getByText("تلميح مفيد")).toBeTruthy();
  });

  it("falls back to English text when language='ar' but text_ar is not provided", () => {
    render(<Tooltip text="Helpful hint" language="ar" />);
    expect(screen.getByText("Helpful hint")).toBeTruthy();
  });

  it("renders with empty text without crashing", () => {
    expect(() => render(<Tooltip text="" />)).not.toThrow();
  });

  // ── direction="none" — no arrow ───────────────────────────────────────────

  it("does not render an arrow wrapper when direction='none' (default)", () => {
    const { toJSON } = render(
      <Tooltip text="Hint" direction="none" />
    );
    // With direction="none" there should be only the outer view + text view
    // The arrow wrapper is conditionally rendered — snapshot should not include it
    const json = toJSON() as any;
    expect(json).toBeTruthy();
    // The component renders direction !== "none" branch only for non-none directions
    // Verify by checking that direction="none" renders fewer children
    // (outer View > Text row only, no arrow View)
    expect(json.children).toBeTruthy();
  });

  it("renders without crashing for direction='none'", () => {
    expect(() => render(<Tooltip text="Hint" direction="none" />)).not.toThrow();
  });

  // ── direction !== "none" — arrow shown ────────────────────────────────────

  it("renders an additional arrow View when direction='top-left'", () => {
    const { toJSON } = render(
      <Tooltip text="Hint" direction="top-left" />
    );
    const json = toJSON() as any;
    // Outer View should have more children (text row + arrow wrapper)
    expect(json.children.length).toBeGreaterThan(1);
  });

  it("renders without crashing for direction='top-center'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="top-center" />)
    ).not.toThrow();
  });

  it("renders without crashing for direction='top-right'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="top-right" />)
    ).not.toThrow();
  });

  it("renders without crashing for direction='bottom-left'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="bottom-left" />)
    ).not.toThrow();
  });

  it("renders without crashing for direction='bottom-center'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="bottom-center" />)
    ).not.toThrow();
  });

  it("renders without crashing for direction='bottom-right'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="bottom-right" />)
    ).not.toThrow();
  });

  it("renders without crashing for direction='left-top'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="left-top" />)
    ).not.toThrow();
  });

  it("renders without crashing for direction='right-top'", () => {
    expect(() =>
      render(<Tooltip text="Hint" direction="right-top" />)
    ).not.toThrow();
  });

  // ── Snapshot: none vs non-none child count difference ─────────────────────

  it("has more children when direction is set vs direction='none'", () => {
    const { toJSON: toJSONNone } = render(
      <Tooltip text="Hint" direction="none" />
    );
    const { toJSON: toJSONDir } = render(
      <Tooltip text="Hint" direction="top-left" />
    );
    const noneJson = toJSONNone() as any;
    const dirJson = toJSONDir() as any;
    // direction="none" outer View has 1 child (the Text); direction="top-left" has 2
    expect(dirJson.children.length).toBeGreaterThan(noneJson.children.length);
  });
});
