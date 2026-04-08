/**
 * Tests for the Bot UI component.
 *
 * Exercises: render without crashing, message visibility when open/close,
 * click-to-toggle status, onClick callback with new status, and Arabic message.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock react-native-svg ─────────────────────────────────────────────────
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, p),
    SvgUri: (p: any) =>
      React.createElement(View, { testID: "svg-uri", ...p }),
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
        { testID: "bot-message-text" },
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
        { testID: "bot-message-text" },
        language === "ar" && value_ar ? value_ar : value
      ),
  };
});

import { Bot } from "@platform/Bot";

describe("Bot", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Bot />);
  });

  it("renders the SVG bot icon always", () => {
    render(<Bot status="close" />);
    expect(screen.getByTestId("svg-uri")).toBeTruthy();
  });

  // ── Message visibility ────────────────────────────────────────────────────

  it("shows message bubble when status='open' and message is non-empty", () => {
    render(
      <Bot
        status="open"
        message="Hello! How can I help you today?"
      />
    );
    expect(screen.getByText("Hello! How can I help you today?")).toBeTruthy();
  });

  it("hides message bubble when status='close'", () => {
    render(
      <Bot
        status="close"
        message="Hello! How can I help you today?"
      />
    );
    expect(
      screen.queryByText("Hello! How can I help you today?")
    ).toBeNull();
  });

  it("hides message bubble when message is empty string even if status='open'", () => {
    render(<Bot status="open" message="" />);
    expect(screen.queryByTestId("bot-message-text")).toBeNull();
  });

  // ── Toggle status ─────────────────────────────────────────────────────────

  it("toggles from close to open when clicked", () => {
    const { UNSAFE_getByType, queryByText, getByText } = render(
      <Bot status="close" message="Hello!" />
    );
    // Message hidden initially
    expect(queryByText("Hello!")).toBeNull();

    // Click to open
    const { TouchableOpacity } = require("react-native");
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(getByText("Hello!")).toBeTruthy();
  });

  it("shows message after pressing when starting closed", () => {
    const { UNSAFE_getByType, queryByText, getByText } = render(
      <Bot status="close" message="Hello there!" />
    );
    expect(queryByText("Hello there!")).toBeNull();

    const { TouchableOpacity } = require("react-native");
    const touchable = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(touchable);
    expect(getByText("Hello there!")).toBeTruthy();
  });

  it("hides message after pressing when starting open", () => {
    const { UNSAFE_getByType, queryByText } = render(
      <Bot status="open" message="Hello there!" />
    );
    const { TouchableOpacity } = require("react-native");
    const touchable = UNSAFE_getByType(TouchableOpacity);

    // Message is visible initially
    expect(queryByText("Hello there!")).toBeTruthy();

    // Press to close
    fireEvent.press(touchable);
    expect(queryByText("Hello there!")).toBeNull();
  });

  // ── onClick callback ──────────────────────────────────────────────────────

  it("calls onClick with 'open' when toggled from close", () => {
    const onClick = jest.fn();
    const { UNSAFE_getByType } = render(
      <Bot status="close" message="Hi" onClick={onClick} />
    );
    const { TouchableOpacity } = require("react-native");
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("open");
  });

  it("calls onClick with 'close' when toggled from open", () => {
    const onClick = jest.fn();
    const { UNSAFE_getByType } = render(
      <Bot status="open" message="Hi" onClick={onClick} />
    );
    const { TouchableOpacity } = require("react-native");
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("close");
  });

  it("does not throw when onClick is not provided", () => {
    const { UNSAFE_getByType } = render(
      <Bot status="close" message="Hi" />
    );
    const { TouchableOpacity } = require("react-native");
    expect(() => fireEvent.press(UNSAFE_getByType(TouchableOpacity))).not.toThrow();
  });

  // ── Arabic message ────────────────────────────────────────────────────────

  it("shows Arabic message when language='ar' and status='open'", () => {
    render(
      <Bot
        status="open"
        message="Hello!"
        message_ar="مرحبا!"
        language="ar"
      />
    );
    expect(screen.getByText("مرحبا!")).toBeTruthy();
  });

  it("falls back to English message when language='ar' but message_ar is not provided", () => {
    render(
      <Bot status="open" message="Hello!" language="ar" message_ar="" />
    );
    expect(screen.getByText("Hello!")).toBeTruthy();
  });

  // ── Status prop sync ──────────────────────────────────────────────────────

  it("syncs currentStatus when status prop changes via rerender", () => {
    const { rerender, queryByText } = render(
      <Bot status="close" message="Hi there" />
    );
    expect(queryByText("Hi there")).toBeNull();

    rerender(<Bot status="open" message="Hi there" />);
    expect(queryByText("Hi there")).toBeTruthy();
  });

  it("hides message when status prop changes from open to close", () => {
    const { rerender, queryByText } = render(
      <Bot status="open" message="Hi there" />
    );
    expect(queryByText("Hi there")).toBeTruthy();

    rerender(<Bot status="close" message="Hi there" />);
    expect(queryByText("Hi there")).toBeNull();
  });
});
