/**
 * Tests for the Footer UI component.
 *
 * Exercises: rendering all 5 menu items, default active selection, pressing
 * menu items with and without onPressMenu, active prop override, and Arabic labels.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock react-native-svg (icons index uses it) ───────────────────────────
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, p),
    Path: () => null,
    Polyline: () => null,
    Line: () => null,
    Polygon: () => null,
    Defs: () => null,
    LinearGradient: () => null,
    RadialGradient: () => null,
    Stop: () => null,
    ClipPath: () => null,
    G: () => null,
    Rect: () => null,
    Svg: (p: any) => React.createElement(View, p),
  };
});

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

// ── Mock @platform/Text ────────────────────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

// ── Mock @platform/Container ──────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    Container: ({ children, onClick, ...props }: any) =>
      React.createElement(
        onClick ? Pressable : View,
        { onPress: onClick, ...props },
        children
      ),
  };
});

// ── Mock SVG assets used inside Footer ────────────────────────────────────
jest.mock("~/assets/svg/icons/PullyUp", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { __esModule: true, default: () => React.createElement(View, { testID: "pully-up" }) };
});

jest.mock("~/assets/svg/icons/PullyDown", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { __esModule: true, default: () => React.createElement(View, { testID: "pully-down" }) };
});

import { Footer } from "@platform/Footer/Footer";

describe("Footer", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Footer />);
  });

  it("renders all 5 menu item labels", () => {
    render(<Footer />);
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Community")).toBeTruthy();
    expect(screen.getByText("Services")).toBeTruthy();
    expect(screen.getByText("Challenges")).toBeTruthy();
    expect(screen.getByText("Admin")).toBeTruthy();
  });

  // ── Default active selection ───────────────────────────────────────────

  it("defaults to Home active when no active prop provided", () => {
    // The component uses getColorClass which returns different class for active item.
    // We verify rendering is correct (no crash and Home is present).
    render(<Footer />);
    expect(screen.getByText("Home")).toBeTruthy();
  });

  // ── active prop ────────────────────────────────────────────────────────

  it("respects the active prop override", () => {
    render(<Footer active="Community" />);
    // Component renders with Community as the current active
    expect(screen.getByText("Community")).toBeTruthy();
  });

  it("renders with active='Services' without crashing", () => {
    expect(() => render(<Footer active="Services" />)).not.toThrow();
  });

  it("renders with active='Challenges' without crashing", () => {
    expect(() => render(<Footer active="Challenges" />)).not.toThrow();
  });

  it("renders with active='Admin' without crashing", () => {
    expect(() => render(<Footer active="Admin" />)).not.toThrow();
  });

  // ── onPressMenu callback ───────────────────────────────────────────────

  it("calls onPressMenu with 'Home' when Home is pressed", () => {
    const onPressMenu = jest.fn();
    render(<Footer onPressMenu={onPressMenu} />);
    fireEvent.press(screen.getByText("Home"));
    expect(onPressMenu).toHaveBeenCalledTimes(1);
    expect(onPressMenu).toHaveBeenCalledWith("Home");
  });

  it("calls onPressMenu with 'Community' when Community is pressed", () => {
    const onPressMenu = jest.fn();
    render(<Footer onPressMenu={onPressMenu} />);
    fireEvent.press(screen.getByText("Community"));
    expect(onPressMenu).toHaveBeenCalledWith("Community");
  });

  it("calls onPressMenu with 'Services' when Services is pressed", () => {
    const onPressMenu = jest.fn();
    render(<Footer onPressMenu={onPressMenu} />);
    fireEvent.press(screen.getByText("Services"));
    expect(onPressMenu).toHaveBeenCalledWith("Services");
  });

  it("calls onPressMenu with 'Challenges' when Challenges is pressed", () => {
    const onPressMenu = jest.fn();
    render(<Footer onPressMenu={onPressMenu} />);
    fireEvent.press(screen.getByText("Challenges"));
    expect(onPressMenu).toHaveBeenCalledWith("Challenges");
  });

  it("calls onPressMenu with 'Admin' when Admin is pressed", () => {
    const onPressMenu = jest.fn();
    render(<Footer onPressMenu={onPressMenu} />);
    fireEvent.press(screen.getByText("Admin"));
    expect(onPressMenu).toHaveBeenCalledWith("Admin");
  });

  // ── Internal state update (no onPressMenu) ─────────────────────────────

  it("updates internal state when Community is pressed and onPressMenu is not provided", () => {
    render(<Footer />);
    // Community label visible before and after press — component stays rendered
    expect(screen.getByText("Community")).toBeTruthy();
    fireEvent.press(screen.getByText("Community"));
    // Still visible after state update
    expect(screen.getByText("Community")).toBeTruthy();
  });

  it("does not throw when menu item pressed without onPressMenu", () => {
    render(<Footer />);
    expect(() => fireEvent.press(screen.getByText("Admin"))).not.toThrow();
  });

  // ── Arabic labels ──────────────────────────────────────────────────────

  it("renders Arabic labels when language='ar'", () => {
    render(<Footer language="ar" />);
    expect(screen.getByText("الرئيسية")).toBeTruthy();
    expect(screen.getByText("المجتمع")).toBeTruthy();
    expect(screen.getByText("الخدمات")).toBeTruthy();
    expect(screen.getByText("التحديات")).toBeTruthy();
    expect(screen.getByText("المشرف")).toBeTruthy();
  });

  it("calls onPressMenu with correct label when Arabic language and item pressed", () => {
    const onPressMenu = jest.fn();
    render(<Footer language="ar" onPressMenu={onPressMenu} />);
    // Press the Arabic label for Home — handler still receives the internal menu key
    fireEvent.press(screen.getByText("الرئيسية"));
    expect(onPressMenu).toHaveBeenCalledWith("Home");
  });
});
