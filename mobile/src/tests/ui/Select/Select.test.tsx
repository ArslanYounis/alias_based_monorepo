/**
 * Tests for the Select UI component.
 *
 * Select wraps: Label + Fields (type="select") + Caption
 * Heavy children are mocked to keep tests fast and isolated.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock: Label ───────────────────────────────────────────────────────────────
jest.mock("@platform/Label/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Label: ({ label }: any) =>
      React.createElement(Text, { testID: "label" }, label),
  };
});

// ── Mock: Fields ──────────────────────────────────────────────────────────────
jest.mock("@platform/Fields/Fields", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Fields: ({ onChange, value, placeholder }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: "fields", onPress: () => onChange?.("test") },
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

import { Select } from "@platform/Select/Select";

// ─────────────────────────────────────────────────────────────────────────────

describe("Select", () => {
  it("renders without crashing", () => {
    render(<Select onChange={jest.fn()} />);
  });

  it("renders the Label component", () => {
    render(<Select label="My label" onChange={jest.fn()} />);
    expect(screen.getByTestId("label")).toBeTruthy();
  });

  it("passes label text to Label", () => {
    render(<Select label="Pick one" onChange={jest.fn()} />);
    expect(screen.getByText("Pick one")).toBeTruthy();
  });

  it("renders the Fields component", () => {
    render(<Select onChange={jest.fn()} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("passes placeholder to Fields", () => {
    render(<Select placeholder="Select an item" onChange={jest.fn()} />);
    expect(screen.getByText("Select an item")).toBeTruthy();
  });

  it("propagates onChange from Fields to parent", () => {
    const onChange = jest.fn();
    render(<Select onChange={onChange} />);
    fireEvent.press(screen.getByTestId("fields"));
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("does NOT render Caption when no caption props are provided", () => {
    render(<Select onChange={jest.fn()} />);
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders Caption when captionLeft is provided", () => {
    render(
      <Select
        onChange={jest.fn()}
        captionLeft="Helper text"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when captionRight is provided", () => {
    render(
      <Select
        onChange={jest.fn()}
        captionRight="Right text"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when captionLeft_ar is provided", () => {
    render(
      <Select
        onChange={jest.fn()}
        captionLeft_ar="نص مساعد"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <Select
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Required field"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("passes errorMessage to Caption", () => {
    render(
      <Select
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Please select"
      />
    );
    expect(screen.getByText("Please select")).toBeTruthy();
  });

  it("does NOT render Caption when hasError=false and no caption props", () => {
    render(
      <Select
        onChange={jest.fn()}
        hasError={false}
        errorMessage="hidden"
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders with options passed through", () => {
    // Fields mock doesn't use options, but we verify no crash
    render(
      <Select
        onChange={jest.fn()}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
      />
    );
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("renders with disabled=true without crash", () => {
    render(<Select onChange={jest.fn()} disabled={true} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("renders with required=true without crash", () => {
    render(<Select onChange={jest.fn()} required={true} label="Label" />);
    expect(screen.getByTestId("label")).toBeTruthy();
  });
});
