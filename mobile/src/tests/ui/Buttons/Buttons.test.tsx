/**
 * Tests for the Buttons UI component.
 *
 * Exercises: default rendering, title text (English & Arabic), icon props,
 * showIconOnMobile, disabled state, onClick callback, all 5 button types,
 * all 3 sizes, tooltip toggle, and iconColor cloneElement behaviour.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";

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

// ── Mock useRenderIcon ────────────────────────────────────────────────────
jest.mock("~/src/hooks/useRenderIcon", () => ({
  useRenderIcon: jest.fn(() => null),
}));

// ── Mock @platform/Text (used by Tooltip) ─────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

import { Buttons } from "@platform/Buttons/Buttons";
import { useRenderIcon } from "~/src/hooks/useRenderIcon";

const mockUseRenderIcon = useRenderIcon as jest.Mock;

describe("Buttons", () => {
  beforeEach(() => {
    mockUseRenderIcon.mockReturnValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── Default rendering ──────────────────────────────────────────────────

  it("renders without crashing with default props", () => {
    render(<Buttons />);
  });

  it("renders title text", () => {
    render(<Buttons title="Submit" />);
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  it("renders Arabic title when language='ar' and title_ar is provided", () => {
    render(<Buttons title="Submit" title_ar="إرسال" language="ar" />);
    expect(screen.getByText("إرسال")).toBeTruthy();
  });

  it("falls back to English title when language='ar' but title_ar is not provided", () => {
    render(<Buttons title="Submit" language="ar" />);
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  // ── Icons ──────────────────────────────────────────────────────────────

  it("renders leftIcon when provided", () => {
    const LeftIcon = <View testID="left-icon" />;
    render(<Buttons title="Save" leftIcon={LeftIcon} />);
    expect(screen.getByTestId("left-icon")).toBeTruthy();
  });

  it("renders rightIcon when provided", () => {
    const RightIcon = <View testID="right-icon" />;
    render(<Buttons title="Save" rightIcon={RightIcon} />);
    expect(screen.getByTestId("right-icon")).toBeTruthy();
  });

  it("does not render leftIcon area when leftIcon is not provided", () => {
    render(<Buttons title="Save" />);
    expect(screen.queryByTestId("left-icon")).toBeNull();
  });

  // ── showIconOnMobile ───────────────────────────────────────────────────

  it("calls useRenderIcon when showIconOnMobile=true", () => {
    const MockMobileIcon = <View testID="mobile-icon" />;
    mockUseRenderIcon.mockReturnValue(
      React.createElement(View, { testID: "mobile-icon" })
    );
    render(<Buttons showIconOnMobile mobileIcon={MockMobileIcon} />);
    expect(mockUseRenderIcon).toHaveBeenCalled();
  });

  it("renders mobileIcon result when showIconOnMobile=true", () => {
    mockUseRenderIcon.mockReturnValue(
      React.createElement(View, { testID: "mobile-icon-rendered" })
    );
    render(<Buttons showIconOnMobile />);
    expect(screen.getByTestId("mobile-icon-rendered")).toBeTruthy();
  });

  it("does not render title text when showIconOnMobile=true", () => {
    mockUseRenderIcon.mockReturnValue(
      React.createElement(View, { testID: "mobile-icon-rendered" })
    );
    render(<Buttons title="Hidden" showIconOnMobile />);
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  // ── Disabled ───────────────────────────────────────────────────────────

  it("passes disabled=true to TouchableOpacity", () => {
    const { UNSAFE_getByType } = render(<Buttons disabled />);
    const { TouchableOpacity } = require("react-native");
    const btn = UNSAFE_getByType(TouchableOpacity);
    expect(btn.props.disabled).toBe(true);
  });

  it("does not disable TouchableOpacity by default", () => {
    const { UNSAFE_getByType } = render(<Buttons />);
    const { TouchableOpacity } = require("react-native");
    const btn = UNSAFE_getByType(TouchableOpacity);
    expect(btn.props.disabled).toBe(false);
  });

  // ── onClick ────────────────────────────────────────────────────────────

  it("fires onClick when pressed", () => {
    const onClick = jest.fn();
    render(<Buttons title="Press" onClick={onClick} />);
    fireEvent.press(screen.getByText("Press"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when no onClick provided and pressed", () => {
    render(<Buttons title="Press" />);
    expect(() => fireEvent.press(screen.getByText("Press"))).not.toThrow();
  });

  // ── Button types ───────────────────────────────────────────────────────

  it("renders type='primary' without crashing", () => {
    expect(() => render(<Buttons type="primary" title="Primary" />)).not.toThrow();
  });

  it("renders type='secondary' without crashing", () => {
    expect(() =>
      render(<Buttons type="secondary" title="Secondary" />)
    ).not.toThrow();
  });

  it("renders type='tertiary' without crashing", () => {
    expect(() =>
      render(<Buttons type="tertiary" title="Tertiary" />)
    ).not.toThrow();
  });

  it("renders type='text-link' without crashing", () => {
    expect(() =>
      render(<Buttons type="text-link" title="Link" />)
    ).not.toThrow();
  });

  it("renders type='delete' without crashing", () => {
    expect(() => render(<Buttons type="delete" title="Delete" />)).not.toThrow();
  });

  // ── Disabled variants per type ─────────────────────────────────────────

  it("renders disabled primary without crashing", () => {
    expect(() =>
      render(<Buttons type="primary" title="Primary" disabled />)
    ).not.toThrow();
  });

  it("renders disabled secondary without crashing", () => {
    expect(() =>
      render(<Buttons type="secondary" title="Secondary" disabled />)
    ).not.toThrow();
  });

  it("renders disabled delete without crashing", () => {
    expect(() =>
      render(<Buttons type="delete" title="Delete" disabled />)
    ).not.toThrow();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────

  it("renders size='s' without crashing", () => {
    expect(() => render(<Buttons size="s" title="Small" />)).not.toThrow();
  });

  it("renders size='m' without crashing", () => {
    expect(() => render(<Buttons size="m" title="Medium" />)).not.toThrow();
  });

  it("renders size='l' without crashing", () => {
    expect(() => render(<Buttons size="l" title="Large" />)).not.toThrow();
  });

  // ── Tooltip toggle ─────────────────────────────────────────────────────

  it("shows tooltip after pressing when tooltip prop provided", () => {
    render(
      <Buttons
        title="Tip"
        tooltip={{ text: "Helpful hint", text_ar: "", direction: "none" }}
      />
    );
    // Before press: tooltip text not visible
    expect(screen.queryByText("Helpful hint")).toBeNull();

    fireEvent.press(screen.getByText("Tip"));

    // After press: tooltip text visible
    expect(screen.getByText("Helpful hint")).toBeTruthy();
  });

  it("hides tooltip on second press (toggle off)", () => {
    render(
      <Buttons
        title="Tip"
        tooltip={{ text: "Helpful hint", text_ar: "", direction: "none" }}
      />
    );
    fireEvent.press(screen.getByText("Tip"));
    expect(screen.getByText("Helpful hint")).toBeTruthy();

    fireEvent.press(screen.getByText("Tip"));
    expect(screen.queryByText("Helpful hint")).toBeNull();
  });

  it("does not show tooltip when tooltip prop is not provided", () => {
    render(<Buttons title="No Tip" />);
    fireEvent.press(screen.getByText("No Tip"));
    // No tooltip text should appear
    expect(screen.queryByText("Helpful hint")).toBeNull();
  });

  // ── iconColor ──────────────────────────────────────────────────────────

  it("renders with iconColor applied to leftIcon via cloneElement", () => {
    // The icon receives fill=iconColor via cloneElement; we verify it renders
    // without crashing and the icon is present.
    const LeftIcon = <View testID="colored-icon" />;
    expect(() =>
      render(<Buttons title="Go" leftIcon={LeftIcon} iconColor="#ff0000" />)
    ).not.toThrow();
    expect(screen.getByTestId("colored-icon")).toBeTruthy();
  });

  it("renders icon without modification when iconColor is not provided", () => {
    const LeftIcon = <View testID="plain-icon" />;
    render(<Buttons title="Go" leftIcon={LeftIcon} />);
    expect(screen.getByTestId("plain-icon")).toBeTruthy();
  });

  // ── fullWidth ──────────────────────────────────────────────────────────

  it("renders with fullWidth=true without crashing", () => {
    expect(() =>
      render(<Buttons title="Full" fullWidth />)
    ).not.toThrow();
  });
});
