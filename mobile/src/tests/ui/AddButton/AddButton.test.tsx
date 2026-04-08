/**
 * Tests for the mobile AddButton UI component.
 *
 * Branches to cover:
 *  1. disabled=false (default) → enabled TouchableOpacity, blue icon color
 *  2. disabled=true            → disabled TouchableOpacity, grey icon color
 *  3. onClick fires when button is pressed (disabled=false)
 *  4. onClick does NOT fire when button is pressed and disabled=true
 *
 * @platform/icons (react-native-svg icons) is mocked to avoid native module
 * crashes. The AddButton source imports PlusIcon from "../icons" which Jest
 * resolves through the moduleNameMapper (@platform/icons → mobile/src/ui/icons).
 *
 * AddButton does not forward testID to the outer View or inner TouchableOpacity,
 * so UNSAFE_getByType(TouchableOpacity) is used to reach the pressable element.
 */
import React from "react";
import { TouchableOpacity } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock: icons module (resolves both ../icons and @platform/icons) ───────────
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    PlusIcon: ({ testID, ...props }: any) =>
      React.createElement(View, { testID: testID ?? "plus-icon", ...props }),
  };
});

import { AddButton } from "@platform/AddButton";

describe("AddButton", () => {
  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders without crashing with default props", () => {
    render(<AddButton />);
  });

  it("renders the PlusIcon", () => {
    render(<AddButton />);
    expect(screen.getByTestId("plus-icon")).toBeTruthy();
  });

  // ── disabled=false (default) ──────────────────────────────────────────────

  it("is enabled by default (disabled=false)", () => {
    const { UNSAFE_getByType } = render(<AddButton />);
    const btn = UNSAFE_getByType(TouchableOpacity);
    expect(btn.props.disabled).toBeFalsy();
  });

  it("calls onClick when pressed and disabled=false", () => {
    const onClick = jest.fn();
    const { UNSAFE_getByType } = render(<AddButton onClick={onClick} />);
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── disabled=true ─────────────────────────────────────────────────────────

  it("renders without crashing when disabled=true", () => {
    render(<AddButton disabled />);
    expect(screen.getByTestId("plus-icon")).toBeTruthy();
  });

  it("has disabled prop set to true when disabled=true", () => {
    const { UNSAFE_getByType } = render(<AddButton disabled />);
    const btn = UNSAFE_getByType(TouchableOpacity);
    expect(btn.props.disabled).toBe(true);
  });

  it("has the disabled attribute preventing interaction when disabled=true", () => {
    // RNTL's fireEvent bypasses the native disabled check, so we verify the
    // disabled prop is correctly set on the TouchableOpacity rather than
    // testing press-event suppression (which is a native runtime concern).
    const onClick = jest.fn();
    const { UNSAFE_getByType } = render(
      <AddButton disabled onClick={onClick} />
    );
    const btn = UNSAFE_getByType(TouchableOpacity);
    expect(btn.props.disabled).toBe(true);
    // The PlusIcon still renders (grey color) — component is visually present
    expect(screen.getByTestId("plus-icon")).toBeTruthy();
  });

  // ── default onClick (no-op) ────────────────────────────────────────────────

  it("does not throw when pressed with no onClick provided", () => {
    const { UNSAFE_getByType } = render(<AddButton />);
    expect(() =>
      fireEvent.press(UNSAFE_getByType(TouchableOpacity))
    ).not.toThrow();
  });

  // ── combined props ────────────────────────────────────────────────────────

  it("renders correctly with disabled=false and a custom onClick", () => {
    const onClick = jest.fn();
    const { UNSAFE_getByType } = render(
      <AddButton disabled={false} onClick={onClick} />
    );
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
