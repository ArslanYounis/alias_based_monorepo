/**
 * Tests for the Label UI component.
 *
 * Exercises: label text rendering, required indicator (*), info icon visibility,
 * disabled styling, and Arabic language support.
 *
 * The Tooltip component (imported via relative path ../Tooltip inside Label.tsx)
 * resolves to mobile/src/ui/Tooltip/Tooltip.tsx which itself only depends on
 * SharedLanguageSwitchRenderer and @platform/Text — both mocked below — so no
 * additional mock for Tooltip is needed.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer ────────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "lang-switch" },
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock Info SVG icon ────────────────────────────────────────────────────────
jest.mock("~/assets/svg/icons/Info", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, { testID: "info-icon", ...p }),
  };
});

// ── Mock ~/components/ui/popover ──────────────────────────────────────────────
jest.mock("~/components/ui/popover", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Popover: ({ children }: any) => React.createElement(View, null, children),
    PopoverTrigger: ({ children }: any) => React.createElement(View, null, children),
    PopoverContent: ({ children }: any) => React.createElement(View, null, children),
  };
});

// ── Mock @platform/Text (used by Tooltip) ────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

import { Label } from "@platform/Label/Label";

describe("Label", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Label label="My Label" />);
  });

  // ── Label text ────────────────────────────────────────────────────────────

  it("renders the label text", () => {
    render(<Label label="First Name" />);
    expect(screen.getByText("First Name")).toBeTruthy();
  });

  it("renders Arabic label text when language='ar'", () => {
    render(<Label label="First Name" label_ar="الاسم الأول" language="ar" />);
    expect(screen.getByText("الاسم الأول")).toBeTruthy();
  });

  it("renders English label when language='ar' but label_ar is not provided", () => {
    render(<Label label="Fallback" language="ar" />);
    expect(screen.getByText("Fallback")).toBeTruthy();
  });

  // ── Required indicator ────────────────────────────────────────────────────

  it("shows * when required=true", () => {
    render(<Label label="Required Field" required={true} />);
    expect(screen.getByText("*")).toBeTruthy();
  });

  it("does not show * when required=false (default)", () => {
    render(<Label label="Optional Field" />);
    expect(screen.queryByText("*")).toBeNull();
  });

  // ── Info icon visibility ──────────────────────────────────────────────────

  it("shows info icon when showInfoIcon=true", () => {
    render(<Label label="With Info" showInfoIcon={true} />);
    expect(screen.getByTestId("info-icon")).toBeTruthy();
  });

  it("does not show info icon when showInfoIcon=false (default)", () => {
    render(<Label label="No Info" />);
    expect(screen.queryByTestId("info-icon")).toBeNull();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("renders correctly when disabled=true", () => {
    render(<Label label="Disabled Label" disabled={true} />);
    expect(screen.getByText("Disabled Label")).toBeTruthy();
  });

  it("renders info icon (dimmed) when showInfoIcon=true and disabled=true", () => {
    render(<Label label="Disabled Info" showInfoIcon={true} disabled={true} />);
    expect(screen.getByTestId("info-icon")).toBeTruthy();
  });

  // ── Both required and info icon ───────────────────────────────────────────

  it("shows both * and info icon when required=true and showInfoIcon=true", () => {
    render(<Label label="Full" required={true} showInfoIcon={true} />);
    expect(screen.getByText("*")).toBeTruthy();
    expect(screen.getByTestId("info-icon")).toBeTruthy();
  });

  // ── No label text ─────────────────────────────────────────────────────────

  it("renders without crashing when no label prop is provided", () => {
    render(<Label />);
    // Should render an empty text node via lang-switch without crashing
    expect(screen.getByTestId("lang-switch")).toBeTruthy();
  });

  // ── Language defaults ─────────────────────────────────────────────────────

  it("defaults to English (language='en') when not specified", () => {
    render(<Label label="Default lang" label_ar="عربي" />);
    expect(screen.getByText("Default lang")).toBeTruthy();
  });
});
