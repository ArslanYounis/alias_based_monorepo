/**
 * Tests for the TextInput UI component.
 *
 * TextInput wraps: Label + Fields (type=fieldType, default "text") + Caption
 * Note: This is the ADREC custom TextInput, not React Native's built-in.
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
    Fields: ({ onChange, value, placeholder, disabled, type }: any) =>
      React.createElement(
        View,
        {
          testID: "fields",
          disabled,
          accessibilityLabel: type,
          onPress: () => onChange?.("new value"),
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

import { TextInput } from "@platform/TextInput/TextInput";

// ─────────────────────────────────────────────────────────────────────────────

describe("TextInput", () => {
  it("renders without crashing", () => {
    render(<TextInput onChange={jest.fn()} />);
  });

  it("renders the Label", () => {
    render(<TextInput label="Full Name" onChange={jest.fn()} />);
    expect(screen.getByTestId("label")).toBeTruthy();
    expect(screen.getByText("Full Name")).toBeTruthy();
  });

  it("renders the Fields component", () => {
    render(<TextInput onChange={jest.fn()} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("passes placeholder to Fields", () => {
    render(<TextInput placeholder="Type here" onChange={jest.fn()} />);
    expect(screen.getByText("Type here")).toBeTruthy();
  });

  it("passes value to Fields", () => {
    render(<TextInput value="existing text" onChange={jest.fn()} />);
    expect(screen.getByText("existing text")).toBeTruthy();
  });

  it("propagates onChange from Fields", () => {
    const onChange = jest.fn();
    render(<TextInput onChange={onChange} />);
    fireEvent.press(screen.getByTestId("fields"));
    expect(onChange).toHaveBeenCalledWith("new value");
  });

  it("passes fieldType to Fields as type", () => {
    render(<TextInput onChange={jest.fn()} fieldType="textarea" />);
    const fields = screen.getByTestId("fields");
    expect(fields.props.accessibilityLabel).toBe("textarea");
  });

  it("defaults fieldType to text", () => {
    render(<TextInput onChange={jest.fn()} />);
    const fields = screen.getByTestId("fields");
    expect(fields.props.accessibilityLabel).toBe("text");
  });

  it("renders Caption when captionLeft is provided", () => {
    render(<TextInput onChange={jest.fn()} captionLeft="Hint text" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <TextInput
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Field required"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("Field required")).toBeTruthy();
  });

  it("does NOT render Caption when no caption/error props", () => {
    render(<TextInput onChange={jest.fn()} />);
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("passes disabled prop to Fields", () => {
    render(<TextInput onChange={jest.fn()} disabled={true} />);
    const fields = screen.getByTestId("fields");
    expect(fields.props.disabled).toBe(true);
  });

  it("renders Caption when captionRight is provided", () => {
    render(<TextInput onChange={jest.fn()} captionRight="Max 200 chars" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when captionLeft_ar is provided", () => {
    render(<TextInput onChange={jest.fn()} captionLeft_ar="تلميح" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("uses Arabic placeholder when language=ar", () => {
    render(
      <TextInput
        onChange={jest.fn()}
        placeholder="Type here"
        placeholder_ar="اكتب هنا"
        language="ar"
      />
    );
    expect(screen.getByText("اكتب هنا")).toBeTruthy();
  });

  it("does NOT render Caption when hasError=false and no caption props", () => {
    render(
      <TextInput
        onChange={jest.fn()}
        hasError={false}
        errorMessage="hidden"
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });
});
