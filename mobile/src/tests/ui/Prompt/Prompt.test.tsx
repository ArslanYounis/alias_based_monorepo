/**
 * Tests for the mobile Prompt component.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(Text, { testID: "lang-switch" }, language === "ar" ? value_ar : value),
  };
});

jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, onClick }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `btn-${title}`, onPress: onClick },
        React.createElement(Text, null, title)
      ),
  };
});

import { Prompt } from "@platform/Prompt";

describe("Prompt", () => {
  const defaultProps = {
    title: "Are you sure?",
    title_ar: "هل أنت متأكد؟",
    subtitle: "This cannot be undone.",
    subtitle_ar: "لا يمكن التراجع.",
    language: "en" as const,
    onYesClick: jest.fn(),
    onNoClick: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<Prompt {...defaultProps} />);
  });

  it("renders title and subtitle via SharedLanguageSwitchRenderer", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getAllByTestId("lang-switch").length).toBeGreaterThan(0);
  });

  it("renders Yes and No buttons with default text", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByTestId("btn-Yes")).toBeTruthy();
    expect(screen.getByTestId("btn-No")).toBeTruthy();
  });

  it("calls onYesClick when Yes is pressed", () => {
    render(<Prompt {...defaultProps} />);
    fireEvent.press(screen.getByTestId("btn-Yes"));
    expect(defaultProps.onYesClick).toHaveBeenCalledTimes(1);
  });

  it("calls onNoClick when No is pressed", () => {
    render(<Prompt {...defaultProps} />);
    fireEvent.press(screen.getByTestId("btn-No"));
    expect(defaultProps.onNoClick).toHaveBeenCalledTimes(1);
  });

  it("uses custom button text when provided", () => {
    render(<Prompt {...defaultProps} yesText="Confirm" noText="Cancel" />);
    expect(screen.getByTestId("btn-Confirm")).toBeTruthy();
    expect(screen.getByTestId("btn-Cancel")).toBeTruthy();
  });
});
