/**
 * Tests for the CheckboxField UI component.
 *
 * Exercises: rendering, onChange propagation, and the internal error reset
 * logic where the first press while hasError=true clears the error and
 * always reports true to the parent.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock Checkbox ─────────────────────────────────────────────────────────
jest.mock("@platform/Checkbox", () => {
  const React = require("react");
  const { TouchableOpacity } = require("react-native");
  return {
    Checkbox: ({ id, onChange, disabled }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: `checkbox-${id}`,
          onPress: () => onChange?.(id, true),
          disabled,
        },
        null
      ),
  };
});

// ── Mock CheckRadioLabel ──────────────────────────────────────────────────
jest.mock("@platform/CheckRadioLabel", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    CheckRadioLabel: ({ label }: any) =>
      React.createElement(Text, null, label),
  };
});

import { CheckboxField } from "@platform/CheckboxField";

describe("CheckboxField", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(
      <CheckboxField id="cf1" label="Agree" checked={false} onChange={jest.fn()} />
    );
  });

  it("renders the label text", () => {
    render(
      <CheckboxField id="cf1" label="Agree to terms" checked={false} onChange={jest.fn()} />
    );
    expect(screen.getByText("Agree to terms")).toBeTruthy();
  });

  it("renders the Checkbox with the correct testID", () => {
    render(
      <CheckboxField id="cf1" label="Agree" checked={false} onChange={jest.fn()} />
    );
    expect(screen.getByTestId("checkbox-cf1")).toBeTruthy();
  });

  // ── onChange ──────────────────────────────────────────────────────────────

  it("fires onChange with id and newChecked on normal press", () => {
    const onChange = jest.fn();
    render(
      <CheckboxField id="cf1" label="Agree" checked={false} onChange={onChange} />
    );
    fireEvent.press(screen.getByTestId("checkbox-cf1"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("cf1", true);
  });

  it("fires onChange with correct id when custom id provided", () => {
    const onChange = jest.fn();
    render(
      <CheckboxField id="myId" label="Agree" checked={false} onChange={onChange} />
    );
    fireEvent.press(screen.getByTestId("checkbox-myId"));
    expect(onChange).toHaveBeenCalledWith("myId", true);
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it("passes disabled to Checkbox so it cannot be pressed", () => {
    // The mock Checkbox renders a TouchableOpacity with the disabled prop.
    // In RNTL the native element is the inner host component — access props
    // directly from the mock's rendered TouchableOpacity via UNSAFE_getByType.
    const onChange = jest.fn();
    const { UNSAFE_getByType } = render(
      <CheckboxField
        id="cf1"
        label="Agree"
        checked={false}
        onChange={onChange}
        disabled={true}
      />
    );
    const { TouchableOpacity } = require("react-native");
    const checkbox = UNSAFE_getByType(TouchableOpacity);
    expect(checkbox.props.disabled).toBe(true);
  });

  // ── internalError reset ───────────────────────────────────────────────────

  it("resets internalError on first press and calls onChange with true when hasError=true", () => {
    const onChange = jest.fn();
    render(
      <CheckboxField
        id="cf1"
        label="Agree"
        checked={false}
        onChange={onChange}
        hasError={true}
      />
    );
    // First press: internalError is true — should reset and always send true
    fireEvent.press(screen.getByTestId("checkbox-cf1"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("cf1", true);
  });

  it("calls onChange normally on subsequent presses after internalError reset", () => {
    const onChange = jest.fn();
    render(
      <CheckboxField
        id="cf1"
        label="Agree"
        checked={false}
        onChange={onChange}
        hasError={true}
      />
    );
    // First press resets the error
    fireEvent.press(screen.getByTestId("checkbox-cf1"));
    expect(onChange).toHaveBeenCalledWith("cf1", true);

    // Second press: internalError is now false, behaves normally
    fireEvent.press(screen.getByTestId("checkbox-cf1"));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(2, "cf1", true);
  });

  it("syncs internalError when hasError prop changes", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <CheckboxField
        id="cf1"
        label="Agree"
        checked={false}
        onChange={onChange}
        hasError={false}
      />
    );
    // Update hasError to true via re-render
    rerender(
      <CheckboxField
        id="cf1"
        label="Agree"
        checked={false}
        onChange={onChange}
        hasError={true}
      />
    );
    // Now pressing should trigger the error-reset path
    fireEvent.press(screen.getByTestId("checkbox-cf1"));
    expect(onChange).toHaveBeenCalledWith("cf1", true);
  });

  // ── Default id ────────────────────────────────────────────────────────────

  it("falls back to 'checkbox-field' id when no id is provided", () => {
    render(<CheckboxField label="Agree" checked={false} onChange={jest.fn()} />);
    expect(screen.getByTestId("checkbox-checkbox-field")).toBeTruthy();
  });
});
