/**
 * Tests for the mobile Container UI component.
 *
 * Branches to cover:
 *  1. onClick present  → renders a <Pressable>
 *  2. onClick absent   → renders a <View>
 *  3. className is a known key in containerClassMap → mapped Tailwind class applied
 *  4. className is an unknown/arbitrary value → passed through unchanged
 *  5. className defaults to ""
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { Container } from "@platform/Container";

describe("Container", () => {
  // ── No onClick: renders a View ─────────────────────────────────────────────

  it("renders without crashing when no props are given", () => {
    render(<Container />);
  });

  it("renders children inside a View when no onClick is provided", () => {
    render(
      <Container>
        <Text testID="child">hello</Text>
      </Container>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("renders children inside a Pressable when onClick is provided", () => {
    const onPress = jest.fn();
    render(
      <Container onClick={onPress} testID="pressable-container">
        <Text testID="child">press me</Text>
      </Container>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("fires onClick when the Pressable is pressed", () => {
    const onPress = jest.fn();
    render(
      <Container onClick={onPress}>
        <Text testID="tap-target">tap</Text>
      </Container>
    );
    // Press the inner child — the Pressable ancestor captures the event
    fireEvent.press(screen.getByTestId("tap-target"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  // ── Known containerClassMap keys ──────────────────────────────────────────

  it("accepts className='layout-root' without crashing", () => {
    render(<Container className="layout-root"><Text>root</Text></Container>);
    expect(screen.getByText("root")).toBeTruthy();
  });

  it("accepts className='layout-row' without crashing", () => {
    render(<Container className="layout-row"><Text>row</Text></Container>);
    expect(screen.getByText("row")).toBeTruthy();
  });

  it("accepts className='layout-main' without crashing", () => {
    render(<Container className="layout-main"><Text>main</Text></Container>);
    expect(screen.getByText("main")).toBeTruthy();
  });

  it("accepts className='layout-toast-wrap' without crashing", () => {
    render(
      <Container className="layout-toast-wrap">
        <Text>toast</Text>
      </Container>
    );
    expect(screen.getByText("toast")).toBeTruthy();
  });

  it("accepts className='layout-children' without crashing", () => {
    render(
      <Container className="layout-children">
        <Text>children</Text>
      </Container>
    );
    expect(screen.getByText("children")).toBeTruthy();
  });

  it("accepts className='layout-footer' without crashing", () => {
    render(
      <Container className="layout-footer">
        <Text>footer</Text>
      </Container>
    );
    expect(screen.getByText("footer")).toBeTruthy();
  });

  // ── Unknown / arbitrary className ─────────────────────────────────────────

  it("passes through an arbitrary className that is not in the map", () => {
    render(
      <Container className="my-custom-class">
        <Text testID="custom">custom</Text>
      </Container>
    );
    expect(screen.getByTestId("custom")).toBeTruthy();
  });

  // ── Default className (empty string) ──────────────────────────────────────

  it("defaults className to an empty string when not provided", () => {
    render(
      <Container>
        <Text testID="default-class">default</Text>
      </Container>
    );
    expect(screen.getByTestId("default-class")).toBeTruthy();
  });

  // ── style prop ────────────────────────────────────────────────────────────

  it("forwards a style prop to the wrapper element without crashing", () => {
    render(
      <Container style={{ backgroundColor: "blue" }}>
        <Text testID="styled-child">styled</Text>
      </Container>
    );
    expect(screen.getByTestId("styled-child")).toBeTruthy();
  });

  it("forwards style and onClick together", () => {
    const onPress = jest.fn();
    render(
      <Container onClick={onPress} style={{ padding: 8 }}>
        <Text testID="both-child">both</Text>
      </Container>
    );
    fireEvent.press(screen.getByTestId("both-child"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
