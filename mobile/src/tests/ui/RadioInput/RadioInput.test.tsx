/**
 * Tests for the RadioInput UI component.
 *
 * RadioInput wraps: Label + RadioField (one per option) + Caption
 * Key logic:
 *   - handleRadioChange: only calls onChange(id) when `checked` prop is truthy
 *   - options mapped to RadioField components
 *
 * NOTE: The source's handleRadioChange only fires onChange when `checked` is
 * truthy — meaning the component guards against calling onChange when nothing
 * is currently selected (empty string).
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

// ── Mock: Caption ─────────────────────────────────────────────────────────────
jest.mock("@platform/Caption/Caption", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Caption: ({ errorMessage }: any) =>
      React.createElement(Text, { testID: "caption" }, errorMessage),
  };
});

// ── Mock: RadioField ──────────────────────────────────────────────────────────
// onChange on RadioField fires with `id` — matches source's `handleRadioChange(id)`
jest.mock("@platform/RadioField/RadioField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioField: ({ id, label, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: `radio-field-${id}`,
          onPress: () => onChange?.(id),
        },
        React.createElement(Text, null, label)
      ),
  };
});

import { RadioInput } from "@platform/RadioInput/RadioInput";

const OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Maybe", value: "maybe" },
];

// ─────────────────────────────────────────────────────────────────────────────

describe("RadioInput", () => {
  it("renders without crashing", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
      />
    );
  });

  it("renders the Label component", () => {
    render(
      <RadioInput
        label="Select answer"
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("label")).toBeTruthy();
  });

  it("passes label text to Label", () => {
    render(
      <RadioInput
        label="Gender"
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText("Gender")).toBeTruthy();
  });

  it("renders a RadioField for each option", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("radio-field-yes")).toBeTruthy();
    expect(screen.getByTestId("radio-field-no")).toBeTruthy();
    expect(screen.getByTestId("radio-field-maybe")).toBeTruthy();
  });

  it("renders option labels", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText("Yes")).toBeTruthy();
    expect(screen.getByText("No")).toBeTruthy();
    expect(screen.getByText("Maybe")).toBeTruthy();
  });

  it("renders no RadioFields when options=[]", () => {
    render(
      <RadioInput
        options={[]}
        checked=""
        onChange={jest.fn()}
      />
    );
    expect(screen.queryByTestId(/radio-field-/)).toBeNull();
  });

  it("calls onChange with option id when checked is truthy", () => {
    const onChange = jest.fn();
    render(
      <RadioInput
        options={OPTIONS}
        checked="yes"   // truthy — handleRadioChange will call onChange
        onChange={onChange}
      />
    );
    fireEvent.press(screen.getByTestId("radio-field-no"));
    expect(onChange).toHaveBeenCalledWith("no");
  });

  it("does NOT call onChange when checked is empty string (falsy)", () => {
    const onChange = jest.fn();
    render(
      <RadioInput
        options={OPTIONS}
        checked=""   // falsy — handleRadioChange guards and returns without calling
        onChange={onChange}
      />
    );
    fireEvent.press(screen.getByTestId("radio-field-yes"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange with the correct id when multiple options exist", () => {
    const onChange = jest.fn();
    render(
      <RadioInput
        options={OPTIONS}
        checked="yes"
        onChange={onChange}
      />
    );
    fireEvent.press(screen.getByTestId("radio-field-maybe"));
    expect(onChange).toHaveBeenCalledWith("maybe");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does NOT render Caption when no caption/error props", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Please select an option"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("Please select an option")).toBeTruthy();
  });

  it("renders Caption when captionLeft is provided", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
        captionLeft="Hint"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("does NOT render Caption when hasError=false and no caption props", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
        hasError={false}
        errorMessage="hidden"
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders with disabled=true without crash", () => {
    render(
      <RadioInput
        options={OPTIONS}
        checked=""
        onChange={jest.fn()}
        disabled={true}
      />
    );
    expect(screen.getByTestId("radio-field-yes")).toBeTruthy();
  });
});
