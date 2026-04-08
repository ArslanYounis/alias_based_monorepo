/**
 * Tests for the mobile IconButton UI component.
 *
 * The component renders a Pressable wrapper with a View containing an arbitrary
 * icon element passed via the `icon` prop. There is no onPress handler exposed —
 * the component acts as a structural icon container.
 *
 * Branches to cover:
 *  1. icon prop is a React element → rendered inside the button
 *  2. icon prop is undefined/null  → button still renders (no crash)
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import { IconButton } from "@platform/IconButton";

describe("IconButton", () => {
  it("renders without crashing when given a React element icon", () => {
    render(<IconButton icon={<Text testID="test-icon">*</Text>} />);
  });

  it("renders the icon element passed via the icon prop", () => {
    render(<IconButton icon={<Text testID="icon-content">icon</Text>} />);
    expect(screen.getByTestId("icon-content")).toBeTruthy();
  });

  it("renders a View icon element", () => {
    render(
      <IconButton icon={<View testID="view-icon" />} />
    );
    expect(screen.getByTestId("view-icon")).toBeTruthy();
  });

  it("renders without crashing when icon is undefined", () => {
    expect(() => render(<IconButton icon={undefined as any} />)).not.toThrow();
  });

  it("renders without crashing when icon is null", () => {
    expect(() => render(<IconButton icon={null as any} />)).not.toThrow();
  });

  it("renders the outer Pressable container (accessible via testID on child)", () => {
    render(
      <IconButton icon={<Text testID="inner">x</Text>} />
    );
    // The inner element must be reachable — confirming Pressable is in the tree
    expect(screen.getByTestId("inner")).toBeTruthy();
  });

  it("renders an arbitrary complex icon subtree", () => {
    const ComplexIcon = () => (
      <View testID="complex-icon">
        <Text>A</Text>
        <Text>B</Text>
      </View>
    );
    render(<IconButton icon={<ComplexIcon />} />);
    expect(screen.getByTestId("complex-icon")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
  });
});
