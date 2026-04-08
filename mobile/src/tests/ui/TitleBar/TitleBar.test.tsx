/**
 * Tests for the TitleBar UI component.
 *
 * Exercises: title text, acronym computation, showTitle/showAcronym flags,
 * button rendering and click callback, and Arabic title rendering.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Stub useWindowDimensions via spyOn ────────────────────────────────────
// jest-expo already sets up a working react-native mock; we just need to
// override the single hook so TitleBar sees a wide viewport.
const RN = require("react-native");
jest.spyOn(RN, "useWindowDimensions").mockReturnValue({ width: 1024, height: 768 });

// ── Mock SharedLanguageSwitchRenderer ─────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
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
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock ~/src/ui/Buttons ─────────────────────────────────────────────────
jest.mock("~/src/ui/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, onClick }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: "titlebar-button", onPress: onClick },
        React.createElement(Text, null, title)
      ),
  };
});

import TitleBar from "@platform/TitleBar/TitleBar";

describe("TitleBar", () => {
  // ── Title rendering ────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<TitleBar title="Dashboard" />);
  });

  it("renders the title text", () => {
    render(<TitleBar title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("does not render title when showTitle=false", () => {
    render(<TitleBar title="Dashboard" showTitle={false} />);
    expect(screen.queryByText("Dashboard")).toBeNull();
  });

  it("does not render title when title is not provided", () => {
    render(<TitleBar showTitle />);
    // No title text node
    expect(screen.queryByText("Dashboard")).toBeNull();
  });

  it("renders Arabic title when language='ar' and title_ar provided", () => {
    render(<TitleBar title="Dashboard" title_ar="لوحة القيادة" language="ar" />);
    expect(screen.getByText("لوحة القيادة")).toBeTruthy();
  });

  it("falls back to English title when language='ar' but title_ar not provided", () => {
    render(<TitleBar title="Dashboard" language="ar" />);
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  // ── Acronym ────────────────────────────────────────────────────────────

  it("renders 3-letter uppercased acronym derived from title", () => {
    render(<TitleBar title="dashboard" />);
    expect(screen.getByText("DAS")).toBeTruthy();
  });

  it("renders custom acronym (up to 3 chars, uppercased)", () => {
    render(<TitleBar title="Dashboard" acronym="db" />);
    expect(screen.getByText("DB")).toBeTruthy();
  });

  it("renders custom acronym sliced to 3 chars max", () => {
    render(<TitleBar title="Dashboard" acronym="abcdef" />);
    expect(screen.getByText("ABC")).toBeTruthy();
  });

  it("renders 'XXX' when neither title nor acronym provided", () => {
    render(<TitleBar />);
    expect(screen.getByText("XXX")).toBeTruthy();
  });

  it("does not render acronym when showAcronym=false", () => {
    render(<TitleBar title="Dashboard" showAcronym={false} />);
    expect(screen.queryByText("DAS")).toBeNull();
  });

  it("renders acronym from title when acronym prop is not provided", () => {
    render(<TitleBar title="Projects" />);
    expect(screen.getByText("PRO")).toBeTruthy();
  });

  // ── Button ─────────────────────────────────────────────────────────────

  it("does not render Buttons when showButton=false (default)", () => {
    render(<TitleBar title="Dashboard" />);
    expect(screen.queryByTestId("titlebar-button")).toBeNull();
  });

  it("renders Buttons when showButton=true", () => {
    render(<TitleBar title="Dashboard" showButton />);
    expect(screen.getByTestId("titlebar-button")).toBeTruthy();
  });

  it("renders button with default buttonLabel 'Primary CTA'", () => {
    render(<TitleBar title="Dashboard" showButton />);
    expect(screen.getByText("Primary CTA")).toBeTruthy();
  });

  it("renders button with custom buttonLabel", () => {
    render(
      <TitleBar title="Dashboard" showButton buttonLabel="Create New" />
    );
    expect(screen.getByText("Create New")).toBeTruthy();
  });

  it("calls onClick when button is pressed", () => {
    const onClick = jest.fn();
    render(<TitleBar title="Dashboard" showButton onClick={onClick} />);
    fireEvent.press(screen.getByTestId("titlebar-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when button pressed without onClick prop", () => {
    render(<TitleBar title="Dashboard" showButton />);
    expect(() =>
      fireEvent.press(screen.getByTestId("titlebar-button"))
    ).not.toThrow();
  });

  // ── isWide layout ──────────────────────────────────────────────────────

  it("renders with wide viewport without crashing (width=1024)", () => {
    expect(() => render(<TitleBar title="Dashboard" />)).not.toThrow();
  });
});
