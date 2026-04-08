/**
 * Tests for the PhoneInput UI component.
 *
 * PhoneInput wraps: Label + Fields (type="phone") + Caption
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock: Label ───────────────────────────────────────────────────────────────
jest.mock("@platform/Label/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Label: ({ label, disabled }: any) =>
      React.createElement(
        Text,
        { testID: "label", accessibilityState: { disabled } },
        label
      ),
  };
});

// ── Mock: Fields ──────────────────────────────────────────────────────────────
jest.mock("@platform/Fields", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Fields: ({ onChange, value, placeholder, disabled, phoneCode }: any) =>
      React.createElement(
        View,
        {
          testID: "fields",
          disabled,
          onPress: () => onChange?.("0501234567"),
        },
        React.createElement(Text, null, phoneCode ? phoneCode : value || placeholder)
      ),
  };
});

// ── Mock: Caption ─────────────────────────────────────────────────────────────
jest.mock("@platform/Caption/Caption", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Caption: ({ errorMessage }: any) =>
      React.createElement(Text, { testID: "caption" }, errorMessage),
  };
});

import { PhoneInput } from "@platform/PhoneInput/PhoneInput";

// ─────────────────────────────────────────────────────────────────────────────

describe("PhoneInput", () => {
  it("renders without crashing", () => {
    render(<PhoneInput onChange={jest.fn()} />);
  });

  it("renders the Label", () => {
    render(<PhoneInput label="Phone" onChange={jest.fn()} />);
    expect(screen.getByTestId("label")).toBeTruthy();
    expect(screen.getByText("Phone")).toBeTruthy();
  });

  it("renders the Fields component", () => {
    render(<PhoneInput onChange={jest.fn()} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("passes phoneCode to Fields", () => {
    render(<PhoneInput onChange={jest.fn()} phoneCode="+971" />);
    expect(screen.getByText("+971")).toBeTruthy();
  });

  it("passes custom phone code to Fields", () => {
    render(<PhoneInput onChange={jest.fn()} phoneCode="+1" />);
    expect(screen.getByText("+1")).toBeTruthy();
  });

  it("propagates onChange from Fields", () => {
    const onChange = jest.fn();
    render(<PhoneInput onChange={onChange} />);
    fireEvent.press(screen.getByTestId("fields"));
    expect(onChange).toHaveBeenCalledWith("0501234567");
  });

  it("renders Caption when captionLeft is provided", () => {
    render(<PhoneInput onChange={jest.fn()} captionLeft="UAE only" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <PhoneInput
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Invalid phone"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("Invalid phone")).toBeTruthy();
  });

  it("does NOT render Caption when no caption/error props", () => {
    render(<PhoneInput onChange={jest.fn()} />);
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("passes disabled prop to Fields", () => {
    render(<PhoneInput onChange={jest.fn()} disabled={true} />);
    const fields = screen.getByTestId("fields");
    expect(fields.props.disabled).toBe(true);
  });

  it("renders Caption when captionRight is provided", () => {
    render(<PhoneInput onChange={jest.fn()} captionRight="Mobile only" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("uses Arabic placeholder when language=ar", () => {
    render(
      <PhoneInput
        onChange={jest.fn()}
        placeholder="Enter phone"
        placeholder_ar="أدخل الهاتف"
        language="ar"
        phoneCode=""
      />
    );
    expect(screen.getByText("أدخل الهاتف")).toBeTruthy();
  });
});
