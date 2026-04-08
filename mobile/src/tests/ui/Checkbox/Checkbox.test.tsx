/**
 * Tests for the Checkbox UI component.
 *
 * Exercises: unchecked/checked render, onChange firing, disabled guard,
 * hasError styles, and controlled-mode prop syncing.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock react-native-svg ─────────────────────────────────────────────────
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, p),
    Polyline: (p: any) => React.createElement(View, p),
  };
});

import { Checkbox } from "@platform/Checkbox";

describe("Checkbox", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Checkbox id="cb1" checked={false} onChange={jest.fn()} />);
  });

  it("renders in unchecked state", () => {
    render(<Checkbox id="cb1" checked={false} onChange={jest.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeTruthy();
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it("renders in checked state", () => {
    render(<Checkbox id="cb1" checked={true} onChange={jest.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  // ── Interactions ──────────────────────────────────────────────────────────

  it("fires onChange with correct id and next checked value on press", () => {
    const onChange = jest.fn();
    render(<Checkbox id="cb1" checked={false} onChange={onChange} />);
    fireEvent.press(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("cb1", true);
  });

  it("fires onChange toggling to false when currently checked", () => {
    const onChange = jest.fn();
    render(<Checkbox id="cb2" checked={true} onChange={onChange} />);
    fireEvent.press(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("cb2", false);
  });

  it("does NOT fire onChange when disabled", () => {
    const onChange = jest.fn();
    render(
      <Checkbox id="cb1" checked={false} onChange={onChange} disabled={true} />
    );
    fireEvent.press(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Accessibility state ───────────────────────────────────────────────────

  it("reflects disabled in accessibilityState", () => {
    render(
      <Checkbox id="cb1" checked={false} onChange={jest.fn()} disabled={true} />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.props.accessibilityState.disabled).toBe(true);
  });

  // ── hasError ──────────────────────────────────────────────────────────────

  it("renders without crashing when hasError=true", () => {
    expect(() =>
      render(
        <Checkbox
          id="cb1"
          checked={false}
          onChange={jest.fn()}
          hasError={true}
        />
      )
    ).not.toThrow();
  });

  it("still fires onChange when hasError=true and not disabled", () => {
    const onChange = jest.fn();
    render(
      <Checkbox
        id="cb1"
        checked={false}
        onChange={onChange}
        hasError={true}
      />
    );
    fireEvent.press(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("cb1", true);
  });

  // ── Controlled mode ───────────────────────────────────────────────────────

  it("syncs to updated checked prop in controlled mode", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Checkbox id="cb1" checked={false} onChange={onChange} />
    );
    expect(screen.getByRole("checkbox").props.accessibilityState.checked).toBe(
      false
    );

    rerender(<Checkbox id="cb1" checked={true} onChange={onChange} />);
    expect(screen.getByRole("checkbox").props.accessibilityState.checked).toBe(
      true
    );
  });

  it("syncs back to false when controlled checked prop goes false", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Checkbox id="cb1" checked={true} onChange={onChange} />
    );
    rerender(<Checkbox id="cb1" checked={false} onChange={onChange} />);
    expect(screen.getByRole("checkbox").props.accessibilityState.checked).toBe(
      false
    );
  });
});
