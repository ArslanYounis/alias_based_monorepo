/**
 * Tests for the CurrencyInput UI component.
 *
 * CurrencyInput wraps: Label + Fields (type="currency") + Caption
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
    Fields: ({ onChange, value, placeholder, disabled, currencySymbol }: any) =>
      React.createElement(
        View,
        {
          testID: "fields",
          disabled,
          onPress: () => onChange?.("100.50"),
        },
        React.createElement(Text, null, currencySymbol ? currencySymbol : value || placeholder)
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

import { CurrencyInput } from "@platform/CurrencyInput/CurrencyInput";

// ─────────────────────────────────────────────────────────────────────────────

describe("CurrencyInput", () => {
  it("renders without crashing", () => {
    render(<CurrencyInput onChange={jest.fn()} />);
  });

  it("renders the Label", () => {
    render(<CurrencyInput label="Fee" onChange={jest.fn()} />);
    expect(screen.getByTestId("label")).toBeTruthy();
    expect(screen.getByText("Fee")).toBeTruthy();
  });

  it("renders the Fields component", () => {
    render(<CurrencyInput onChange={jest.fn()} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("passes the currency symbol to Fields", () => {
    render(<CurrencyInput onChange={jest.fn()} currencySymbol="AED" />);
    expect(screen.getByText("AED")).toBeTruthy();
  });

  it("passes custom currency symbol to Fields", () => {
    render(<CurrencyInput onChange={jest.fn()} currencySymbol="EUR" />);
    expect(screen.getByText("EUR")).toBeTruthy();
  });

  it("propagates onChange from Fields", () => {
    const onChange = jest.fn();
    render(<CurrencyInput onChange={onChange} />);
    fireEvent.press(screen.getByTestId("fields"));
    expect(onChange).toHaveBeenCalledWith("100.50");
  });

  it("renders Caption when captionLeft is provided", () => {
    render(<CurrencyInput onChange={jest.fn()} captionLeft="Optional" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <CurrencyInput
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Invalid amount"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("Invalid amount")).toBeTruthy();
  });

  it("does NOT render Caption when no caption/error props", () => {
    render(<CurrencyInput onChange={jest.fn()} />);
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("passes disabled prop to Fields", () => {
    render(<CurrencyInput onChange={jest.fn()} disabled={true} />);
    const fields = screen.getByTestId("fields");
    expect(fields.props.disabled).toBe(true);
  });

  it("renders Caption when captionRight_ar is provided", () => {
    render(<CurrencyInput onChange={jest.fn()} captionRight_ar="درهم" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("uses Arabic placeholder when language=ar", () => {
    // Fields mock shows currencySymbol; testing with no symbol to show placeholder
    render(
      <CurrencyInput
        onChange={jest.fn()}
        placeholder="Enter amount"
        placeholder_ar="أدخل المبلغ"
        language="ar"
        currencySymbol=""
      />
    );
    expect(screen.getByText("أدخل المبلغ")).toBeTruthy();
  });
});
