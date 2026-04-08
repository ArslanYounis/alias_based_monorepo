/**
 * Tests for the RadioCard UI component.
 *
 * Exercises: label rendering, onClick callback, disabled guard, all
 * iconLocation direction values, and clicked=true background state.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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
        null,
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

import { RadioCard } from "@platform/RadioCard";

describe("RadioCard", () => {
  const defaultProps = {
    id: "card1",
    label: "Card Label",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<RadioCard {...defaultProps} />);
  });

  it("renders the label text", () => {
    render(<RadioCard {...defaultProps} />);
    expect(screen.getByText("Card Label")).toBeTruthy();
  });

  it("renders the Arabic label when language='ar'", () => {
    render(
      <RadioCard
        {...defaultProps}
        label="Card Label"
        label_ar="تسمية البطاقة"
        language="ar"
      />
    );
    expect(screen.getByText("تسمية البطاقة")).toBeTruthy();
  });

  it("falls back to English label when language='ar' but label_ar not provided", () => {
    render(<RadioCard {...defaultProps} language="ar" />);
    expect(screen.getByText("Card Label")).toBeTruthy();
  });

  // ── onClick ───────────────────────────────────────────────────────────────

  it("calls onClick with id when pressed and not disabled", () => {
    const onClick = jest.fn();
    render(<RadioCard {...defaultProps} onClick={onClick} />);
    fireEvent.press(screen.getByText("Card Label"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("card1");
  });

  it("does NOT call onClick when disabled", () => {
    const onClick = jest.fn();
    render(<RadioCard {...defaultProps} onClick={onClick} disabled={true} />);
    fireEvent.press(screen.getByText("Card Label"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does NOT call onClick when onClick is not provided", () => {
    expect(() => {
      render(<RadioCard id="card1" label="Card Label" />);
      fireEvent.press(screen.getByText("Card Label"));
    }).not.toThrow();
  });

  // ── iconLocation directions ───────────────────────────────────────────────

  it("renders with iconLocation='left' (default flex-row) without crashing", () => {
    expect(() =>
      render(<RadioCard {...defaultProps} iconLocation="left" />)
    ).not.toThrow();
  });

  it("renders with iconLocation='right' (flex-row-reverse) without crashing", () => {
    expect(() =>
      render(<RadioCard {...defaultProps} iconLocation="right" />)
    ).not.toThrow();
  });

  it("renders with iconLocation='top' (flex-col) without crashing", () => {
    expect(() =>
      render(<RadioCard {...defaultProps} iconLocation="top" />)
    ).not.toThrow();
  });

  it("renders with iconLocation='bottom' (flex-col-reverse) without crashing", () => {
    expect(() =>
      render(<RadioCard {...defaultProps} iconLocation="bottom" />)
    ).not.toThrow();
  });

  // ── clicked state ─────────────────────────────────────────────────────────

  it("renders without crashing when clicked=true", () => {
    expect(() =>
      render(<RadioCard {...defaultProps} clicked={true} />)
    ).not.toThrow();
  });

  it("still fires onClick when clicked=true and not disabled", () => {
    const onClick = jest.fn();
    render(<RadioCard {...defaultProps} onClick={onClick} clicked={true} />);
    fireEvent.press(screen.getByText("Card Label"));
    expect(onClick).toHaveBeenCalledWith("card1");
  });

  // ── icon prop ─────────────────────────────────────────────────────────────

  it("renders an icon element when icon prop is provided", () => {
    const { View } = require("react-native");
    render(
      <RadioCard
        {...defaultProps}
        icon={<View testID="card-icon" />}
      />
    );
    expect(screen.getByTestId("card-icon")).toBeTruthy();
  });

  it("renders without icon when icon prop is not provided", () => {
    expect(() =>
      render(<RadioCard {...defaultProps} />)
    ).not.toThrow();
  });
});
