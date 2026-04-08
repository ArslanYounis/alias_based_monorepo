/**
 * Tests for the CheckRadioLabel UI component.
 *
 * Exercises: label rendering, Arabic language switching, onClick callback,
 * and disabled prop behaviour.
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

import { CheckRadioLabel } from "@platform/CheckRadioLabel";

describe("CheckRadioLabel", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<CheckRadioLabel label="Accept terms" onClick={jest.fn()} />);
  });

  it("renders the English label by default", () => {
    render(
      <CheckRadioLabel
        label="Accept terms"
        label_ar="قبول الشروط"
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText("Accept terms")).toBeTruthy();
  });

  it("renders the Arabic label when language='ar'", () => {
    render(
      <CheckRadioLabel
        label="Accept terms"
        label_ar="قبول الشروط"
        language="ar"
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText("قبول الشروط")).toBeTruthy();
  });

  it("falls back to English label when language='ar' but label_ar is not provided", () => {
    render(
      <CheckRadioLabel label="Accept terms" language="ar" onClick={jest.fn()} />
    );
    expect(screen.getByText("Accept terms")).toBeTruthy();
  });

  // ── onClick ───────────────────────────────────────────────────────────────

  it("calls onClick when pressed", () => {
    const onClick = jest.fn();
    render(<CheckRadioLabel label="Accept terms" onClick={onClick} />);
    fireEvent.press(screen.getByText("Accept terms"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onClick when disabled", () => {
    const onClick = jest.fn();
    render(
      <CheckRadioLabel label="Accept terms" onClick={onClick} disabled={true} />
    );
    fireEvent.press(screen.getByText("Accept terms"));
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── disabled prop ─────────────────────────────────────────────────────────

  it("applies disabled prop to TouchableOpacity", () => {
    const { UNSAFE_getByType } = render(
      <CheckRadioLabel label="Accept terms" onClick={jest.fn()} disabled={true} />
    );
    const { TouchableOpacity } = require("react-native");
    const touchable = UNSAFE_getByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
  });

  it("does not set disabled when disabled=false (default)", () => {
    const { UNSAFE_getByType } = render(
      <CheckRadioLabel label="Accept terms" onClick={jest.fn()} />
    );
    const { TouchableOpacity } = require("react-native");
    const touchable = UNSAFE_getByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(false);
  });
});
