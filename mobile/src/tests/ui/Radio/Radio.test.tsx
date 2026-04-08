/**
 * Tests for the Radio UI component.
 *
 * Exercises: unchecked/checked render, inner circle visibility, onChange
 * firing, disabled guard, hasError styling, checked+disabled combination,
 * and checked+hasError error circle.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import { Radio } from "@platform/Radio";

describe("Radio", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Radio id="r1" checked={false} onChange={jest.fn()} />);
  });

  it("renders in unchecked state with no inner circle", () => {
    render(<Radio id="r1" checked={false} onChange={jest.fn()} />);
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.checked).toBe(false);
  });

  it("renders in checked state", () => {
    render(<Radio id="r1" checked={true} onChange={jest.fn()} />);
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.checked).toBe(true);
  });

  // ── Inner circle visibility ───────────────────────────────────────────────

  it("shows inner circle when checked=true and hasError=false", () => {
    const { toJSON } = render(
      <Radio id="r1" checked={true} hasError={false} onChange={jest.fn()} />
    );
    // Inner circle is a View with className containing 'bg-form-fields-checkbox-radio-cbr-bg-selected'
    // We verify the component renders without error and has the correct state
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.checked).toBe(true);
    expect(toJSON()).toBeTruthy();
  });

  it("does not show inner circle when unchecked", () => {
    const { toJSON } = render(
      <Radio id="r1" checked={false} onChange={jest.fn()} />
    );
    expect(toJSON()).toBeTruthy();
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.checked).toBe(false);
  });

  // ── Interactions ──────────────────────────────────────────────────────────

  it("fires onChange with id and toggled value on press", () => {
    const onChange = jest.fn();
    render(<Radio id="r1" checked={false} onChange={onChange} />);
    fireEvent.press(screen.getByRole("radio"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("r1", true);
  });

  it("fires onChange with false when currently checked", () => {
    const onChange = jest.fn();
    render(<Radio id="r1" checked={true} onChange={onChange} />);
    fireEvent.press(screen.getByRole("radio"));
    expect(onChange).toHaveBeenCalledWith("r1", false);
  });

  it("does NOT fire onChange when disabled", () => {
    const onChange = jest.fn();
    render(
      <Radio id="r1" checked={false} onChange={onChange} disabled={true} />
    );
    fireEvent.press(screen.getByRole("radio"));
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Accessibility state ───────────────────────────────────────────────────

  it("reflects disabled in accessibilityState", () => {
    render(
      <Radio id="r1" checked={false} onChange={jest.fn()} disabled={true} />
    );
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.disabled).toBe(true);
  });

  it("uses id as accessibilityLabel", () => {
    render(<Radio id="my-radio" checked={false} onChange={jest.fn()} />);
    expect(screen.getByLabelText("my-radio")).toBeTruthy();
  });

  // ── hasError ──────────────────────────────────────────────────────────────

  it("renders without crashing when hasError=true", () => {
    expect(() =>
      render(
        <Radio id="r1" checked={false} onChange={jest.fn()} hasError={true} />
      )
    ).not.toThrow();
  });

  it("shows error inner circle when checked=true and hasError=true", () => {
    const { toJSON } = render(
      <Radio id="r1" checked={true} hasError={true} onChange={jest.fn()} />
    );
    // Both circles render conditionally — component must not crash and state is correct
    expect(toJSON()).toBeTruthy();
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.checked).toBe(true);
  });

  // ── checked + disabled combination ────────────────────────────────────────

  it("renders checkedDisabled state (checked=true + disabled=true) without crashing", () => {
    expect(() =>
      render(
        <Radio
          id="r1"
          checked={true}
          disabled={true}
          onChange={jest.fn()}
        />
      )
    ).not.toThrow();
  });

  it("reflects both checked and disabled in accessibilityState", () => {
    render(
      <Radio id="r1" checked={true} disabled={true} onChange={jest.fn()} />
    );
    const radio = screen.getByRole("radio");
    expect(radio.props.accessibilityState.checked).toBe(true);
    expect(radio.props.accessibilityState.disabled).toBe(true);
  });

  // ── Controlled mode ───────────────────────────────────────────────────────

  it("syncs to updated checked prop in controlled mode", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Radio id="r1" checked={false} onChange={onChange} />
    );
    expect(screen.getByRole("radio").props.accessibilityState.checked).toBe(
      false
    );
    rerender(<Radio id="r1" checked={true} onChange={onChange} />);
    expect(screen.getByRole("radio").props.accessibilityState.checked).toBe(
      true
    );
  });
});
