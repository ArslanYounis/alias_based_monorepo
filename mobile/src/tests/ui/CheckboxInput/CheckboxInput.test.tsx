/**
 * Tests for the CheckboxInput UI component.
 *
 * CheckboxInput wraps: Label + CheckboxField (one per option) + Caption
 * Key logic:
 *   - handleCheckboxChange: isChecked → add to value array; !isChecked → remove
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

// ── Mock: CheckboxField ───────────────────────────────────────────────────────
// onChange signature from source: (_id, checked) => handleCheckboxChange(option.value, checked)
// The mock fires onChange(id, !checked) on press so we can test both add/remove.
jest.mock("@platform/CheckboxField/CheckboxField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    CheckboxField: ({ id, label, onChange, checked }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: `checkbox-field-${id}`,
          onPress: () => onChange?.(id, !checked),
        },
        React.createElement(Text, null, label)
      ),
  };
});

import { CheckboxInput } from "@platform/CheckboxInput/CheckboxInput";

const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

// ─────────────────────────────────────────────────────────────────────────────

describe("CheckboxInput", () => {
  it("renders without crashing", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
      />
    );
  });

  it("renders the Label component", () => {
    render(
      <CheckboxInput
        label="Choose options"
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("label")).toBeTruthy();
  });

  it("passes label text to Label", () => {
    render(
      <CheckboxInput
        label="Interests"
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText("Interests")).toBeTruthy();
  });

  it("renders a CheckboxField for each option", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("checkbox-field-a")).toBeTruthy();
    expect(screen.getByTestId("checkbox-field-b")).toBeTruthy();
    expect(screen.getByTestId("checkbox-field-c")).toBeTruthy();
  });

  it("renders option labels", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText("Option A")).toBeTruthy();
    expect(screen.getByText("Option B")).toBeTruthy();
    expect(screen.getByText("Option C")).toBeTruthy();
  });

  it("renders no CheckboxFields when options=[]", () => {
    render(
      <CheckboxInput
        options={[]}
        value={[]}
        onChange={jest.fn()}
      />
    );
    expect(screen.queryByTestId(/checkbox-field-/)).toBeNull();
  });

  it("adds option value to array when checking", () => {
    const onChange = jest.fn();
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={onChange}
      />
    );
    // Mock fires onChange(id, !checked); checked=false so !checked=true → add
    fireEvent.press(screen.getByTestId("checkbox-field-a"));
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("removes option value from array when unchecking", () => {
    const onChange = jest.fn();
    render(
      <CheckboxInput
        options={OPTIONS}
        value={["a", "b"]}
        onChange={onChange}
      />
    );
    // Mock fires onChange(id, !checked); checked=true so !checked=false → remove
    fireEvent.press(screen.getByTestId("checkbox-field-a"));
    expect(onChange).toHaveBeenCalledWith(["b"]);
  });

  it("keeps other selections intact when adding one", () => {
    const onChange = jest.fn();
    render(
      <CheckboxInput
        options={OPTIONS}
        value={["b"]}
        onChange={onChange}
      />
    );
    fireEvent.press(screen.getByTestId("checkbox-field-a"));
    expect(onChange).toHaveBeenCalledWith(["b", "a"]);
  });

  it("does NOT render Caption when no caption/error props", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
        hasError={true}
        errorMessage="Please select at least one"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("Please select at least one")).toBeTruthy();
  });

  it("renders Caption when captionLeft is provided", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
        captionLeft="Helper"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("does NOT render Caption when hasError=false and no caption props", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
        hasError={false}
        errorMessage="hidden"
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders with disabled=true without crash", () => {
    render(
      <CheckboxInput
        options={OPTIONS}
        value={[]}
        onChange={jest.fn()}
        disabled={true}
      />
    );
    expect(screen.getByTestId("checkbox-field-a")).toBeTruthy();
  });
});
