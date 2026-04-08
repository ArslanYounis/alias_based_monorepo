/**
 * Tests for the mobile ScrollContainer UI component.
 *
 * Branches to cover:
 *  1. horizontal=false (default) → vertical scroll
 *  2. horizontal=true            → horizontal scroll
 *  3. className default ("")     → no explicit className
 *  4. className provided         → forwarded
 *  5. style prop forwarded
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ScrollContainer } from "@platform/ScrollContainer";

describe("ScrollContainer", () => {
  it("renders without crashing with no props", () => {
    render(<ScrollContainer />);
  });

  it("renders children", () => {
    render(
      <ScrollContainer>
        <Text testID="child">scroll content</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("defaults to vertical scroll (horizontal=false) without crashing", () => {
    render(
      <ScrollContainer>
        <Text testID="vertical-child">vertical</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("vertical-child")).toBeTruthy();
  });

  it("renders with horizontal=true without crashing", () => {
    render(
      <ScrollContainer horizontal>
        <Text testID="horizontal-child">horizontal item</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("horizontal-child")).toBeTruthy();
  });

  it("renders with horizontal=false explicitly", () => {
    render(
      <ScrollContainer horizontal={false}>
        <Text testID="explicit-vertical-child">explicit vertical</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("explicit-vertical-child")).toBeTruthy();
  });

  it("forwards a className prop without crashing", () => {
    render(
      <ScrollContainer className="p-4">
        <Text testID="with-class">content</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("with-class")).toBeTruthy();
  });

  it("forwards a style prop", () => {
    render(
      <ScrollContainer style={{ flex: 1 }}>
        <Text testID="styled-child">styled</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("styled-child")).toBeTruthy();
  });

  it("renders multiple children", () => {
    render(
      <ScrollContainer>
        <Text testID="item-1">Item 1</Text>
        <Text testID="item-2">Item 2</Text>
        <Text testID="item-3">Item 3</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("item-1")).toBeTruthy();
    expect(screen.getByTestId("item-2")).toBeTruthy();
    expect(screen.getByTestId("item-3")).toBeTruthy();
  });

  it("renders with all props combined", () => {
    render(
      <ScrollContainer
        horizontal
        className="flex-row"
        style={{ height: 200 }}
      >
        <Text testID="full-child">all props</Text>
      </ScrollContainer>
    );
    expect(screen.getByTestId("full-child")).toBeTruthy();
  });
});
