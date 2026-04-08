/**
 * Tests for the mobile SwitchButton UI component.
 *
 * Branches to cover:
 *  1. type="Standard"  → Switch value=true  (switch is ON)
 *  2. type=<other>     → Switch value=false (switch is OFF)
 *  3. onToggle fires when the Switch value changes
 *
 * @platform/Container is mocked to a plain View wrapper to decouple this test
 * from NativeWind's className processing.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock: @platform/Container → lightweight View wrapper ─────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    Container: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
  };
});

import { SwitchButton } from "@platform/SwitchButton";

describe("SwitchButton", () => {
  // ── type="Standard" → Switch ON ───────────────────────────────────────────

  it("renders without crashing with type='Standard'", () => {
    render(<SwitchButton type="Standard" onToggle={jest.fn()} />);
  });

  it("renders the Switch with value=true when type='Standard'", () => {
    render(
      <SwitchButton
        type="Standard"
        onToggle={jest.fn()}
        testID="switch-btn"
      />
    );
    // The Switch component from RN is rendered; confirm no crash + presence
    expect(screen.getByRole("switch")).toBeTruthy();
  });

  it("Switch is checked (value=true) when type='Standard'", () => {
    render(<SwitchButton type="Standard" onToggle={jest.fn()} />);
    const switchEl = screen.getByRole("switch");
    // accessibilityValue checked reflects the value prop
    expect(switchEl.props.value).toBe(true);
  });

  // ── type != "Standard" → Switch OFF ──────────────────────────────────────

  it("renders the Switch with value=false when type is not 'Standard'", () => {
    render(<SwitchButton type="Premium" onToggle={jest.fn()} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.props.value).toBe(false);
  });

  it("renders correctly when type is an empty string", () => {
    render(<SwitchButton type="" onToggle={jest.fn()} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.props.value).toBe(false);
  });

  it("renders correctly when type is undefined", () => {
    render(<SwitchButton type={undefined as any} onToggle={jest.fn()} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.props.value).toBe(false);
  });

  // ── onToggle fires ────────────────────────────────────────────────────────

  it("calls onToggle when the switch is toggled", () => {
    const onToggle = jest.fn();
    render(<SwitchButton type="Standard" onToggle={onToggle} />);
    fireEvent(screen.getByRole("switch"), "valueChange", false);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("calls onToggle with true when toggling from OFF to ON", () => {
    const onToggle = jest.fn();
    render(<SwitchButton type="Other" onToggle={onToggle} />);
    fireEvent(screen.getByRole("switch"), "valueChange", true);
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
