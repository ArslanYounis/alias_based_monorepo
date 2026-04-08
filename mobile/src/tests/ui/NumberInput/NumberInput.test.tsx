/**
 * Tests for the NumberInput UI component.
 *
 * NumberInput wraps: Label + Fields (type="number") + Caption
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
    Fields: ({ onChange, value, placeholder, disabled }: any) =>
      React.createElement(
        View,
        {
          testID: "fields",
          disabled,
          onPress: () => onChange?.("42"),
        },
        React.createElement(Text, null, value || placeholder)
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

import { NumberInput } from "@platform/NumberInput/NumberInput";

// ─────────────────────────────────────────────────────────────────────────────

describe("NumberInput", () => {
  it("renders without crashing", () => {
    render(<NumberInput onChange={jest.fn()} />);
  });

  it("renders the Label", () => {
    render(<NumberInput label="Amount" onChange={jest.fn()} />);
    expect(screen.getByTestId("label")).toBeTruthy();
    expect(screen.getByText("Amount")).toBeTruthy();
  });

  it("renders the Fields component", () => {
    render(<NumberInput onChange={jest.fn()} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("passes placeholder to Fields", () => {
    render(<NumberInput placeholder="0" onChange={jest.fn()} />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("passes numeric value to Fields as string", () => {
    render(<NumberInput value={123} onChange={jest.fn()} />);
    expect(screen.getByText("123")).toBeTruthy();
  });

  it("propagates onChange from Fields", () => {
    const onChange = jest.fn();
    render(<NumberInput onChange={onChange} />);
    fireEvent.press(screen.getByTestId("fields"));
    expect(onChange).toHaveBeenCalledWith("42");
  });

  it("renders Caption when captionLeft is provided", () => {
    render(<NumberInput onChange={jest.fn()} captionLeft="Max 100" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <NumberInput
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Invalid number"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("Invalid number")).toBeTruthy();
  });

  it("does NOT render Caption when no caption/error props", () => {
    render(<NumberInput onChange={jest.fn()} />);
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("passes disabled prop to Fields", () => {
    render(<NumberInput onChange={jest.fn()} disabled={true} />);
    const fields = screen.getByTestId("fields");
    expect(fields.props.disabled).toBe(true);
  });

  it("renders Caption when captionRight is provided", () => {
    render(<NumberInput onChange={jest.fn()} captionRight="units" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("uses Arabic placeholder when language=ar", () => {
    render(
      <NumberInput
        onChange={jest.fn()}
        placeholder="Enter"
        placeholder_ar="أدخل"
        language="ar"
      />
    );
    expect(screen.getByText("أدخل")).toBeTruthy();
  });
});
