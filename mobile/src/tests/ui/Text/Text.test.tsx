/**
 * Tests for the mobile Text UI component.
 *
 * The Text component is a thin wrapper around React Native's <Text> that
 * forwards all RNTextProps to the underlying element.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

import { Text } from "@platform/Text";

describe("Text", () => {
  it("renders without crashing", () => {
    render(<Text>Hello</Text>);
  });

  it("renders a string child", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeTruthy();
  });

  it("renders numeric children", () => {
    render(<Text>{42}</Text>);
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renders nested Text nodes", () => {
    render(
      <Text>
        <Text>nested</Text>
      </Text>
    );
    expect(screen.getByText("nested")).toBeTruthy();
  });

  it("forwards testID to the underlying RNText", () => {
    render(<Text testID="my-text">content</Text>);
    expect(screen.getByTestId("my-text")).toBeTruthy();
  });

  it("forwards accessibilityLabel prop", () => {
    render(<Text accessibilityLabel="label-text">content</Text>);
    expect(screen.getByLabelText("label-text")).toBeTruthy();
  });

  it("forwards numberOfLines prop without crashing", () => {
    render(<Text numberOfLines={2}>long text that might be truncated</Text>);
    expect(screen.getByText("long text that might be truncated")).toBeTruthy();
  });

  it("renders with no children (empty component)", () => {
    // Should not throw even with no children
    expect(() => render(<Text />)).not.toThrow();
  });

  it("renders with a style prop applied", () => {
    render(
      <Text testID="styled-text" style={{ color: "red", fontSize: 16 }}>
        styled
      </Text>
    );
    expect(screen.getByTestId("styled-text")).toBeTruthy();
  });

  it("forwards selectable prop without crashing", () => {
    render(<Text selectable>selectable text</Text>);
    expect(screen.getByText("selectable text")).toBeTruthy();
  });
});
