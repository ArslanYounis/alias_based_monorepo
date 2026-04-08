/**
 * Tests for the MultiSelect UI component.
 *
 * MultiSelect wraps: Label + Fields (type="select", selectType="multi") + Caption
 * Key logic under test:
 *   - string value from Fields → split by comma → array passed to onChange
 *   - array value from Fields → passed directly to onChange
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

// ── Mock: Fields — controllable onChange payload ───────────────────────────────
// We expose a ref-like mechanism via module-level state so individual tests
// can decide what value Fields fires.
let fieldsOnChangeCb: ((val: any) => void) | undefined;

jest.mock("@platform/Fields/Fields", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Fields: ({ onChange, value, placeholder }: any) => {
      // Store the handler so tests can invoke it directly
      fieldsOnChangeCb = onChange;
      return React.createElement(
        TouchableOpacity,
        {
          testID: "fields",
          onPress: () => onChange?.("opt1, opt2"),
        },
        React.createElement(Text, null, value || placeholder)
      );
    },
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

import { MultiSelect } from "@platform/MultiSelect/MultiSelect";

// ─────────────────────────────────────────────────────────────────────────────

describe("MultiSelect", () => {
  beforeEach(() => {
    fieldsOnChangeCb = undefined;
  });

  it("renders without crashing", () => {
    render(<MultiSelect onChange={jest.fn()} />);
  });

  it("renders Label", () => {
    render(<MultiSelect label="Select items" onChange={jest.fn()} />);
    expect(screen.getByTestId("label")).toBeTruthy();
  });

  it("passes label text to Label", () => {
    render(<MultiSelect label="Tags" onChange={jest.fn()} />);
    expect(screen.getByText("Tags")).toBeTruthy();
  });

  it("renders Fields", () => {
    render(<MultiSelect onChange={jest.fn()} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("converts string value from Fields to array via split", () => {
    const onChange = jest.fn();
    render(<MultiSelect onChange={onChange} />);
    // Fields mock fires "opt1, opt2" on press
    fireEvent.press(screen.getByTestId("fields"));
    expect(onChange).toHaveBeenCalledWith(["opt1", "opt2"]);
  });

  it("passes array value from Fields directly to onChange", () => {
    const onChange = jest.fn();
    render(<MultiSelect onChange={onChange} />);
    // Invoke the Fields onChange with an array directly
    fieldsOnChangeCb?.(["a", "b"]);
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("splits string by comma and trims whitespace", () => {
    const onChange = jest.fn();
    render(<MultiSelect onChange={onChange} />);
    fieldsOnChangeCb?.("  alpha , beta ,  gamma  ");
    expect(onChange).toHaveBeenCalledWith(["alpha", "beta", "gamma"]);
  });

  it("filters out empty strings when splitting", () => {
    const onChange = jest.fn();
    render(<MultiSelect onChange={onChange} />);
    fieldsOnChangeCb?.("a,,b,");
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("passes array value correctly as string to Fields", () => {
    render(
      <MultiSelect
        value={["x", "y"]}
        onChange={jest.fn()}
      />
    );
    // Fields renders value or placeholder — value would be "x,y"
    expect(screen.getByText("x,y")).toBeTruthy();
  });

  it("does NOT render Caption when no caption props", () => {
    render(<MultiSelect onChange={jest.fn()} />);
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders Caption when captionLeft is provided", () => {
    render(<MultiSelect onChange={jest.fn()} captionLeft="Helper" />);
    expect(screen.getByTestId("caption")).toBeTruthy();
  });

  it("renders Caption when hasError=true and errorMessage is provided", () => {
    render(
      <MultiSelect
        onChange={jest.fn()}
        hasError={true}
        errorMessage="At least one required"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
    expect(screen.getByText("At least one required")).toBeTruthy();
  });

  it("does NOT render Caption when hasError=false and no caption props", () => {
    render(
      <MultiSelect
        onChange={jest.fn()}
        hasError={false}
        errorMessage="hidden"
      />
    );
    expect(screen.queryByTestId("caption")).toBeNull();
  });

  it("renders with disabled=true without crash", () => {
    render(<MultiSelect onChange={jest.fn()} disabled={true} />);
    expect(screen.getByTestId("fields")).toBeTruthy();
  });

  it("renders Caption when captionRight_ar is provided", () => {
    render(
      <MultiSelect
        onChange={jest.fn()}
        captionRight_ar="نص"
      />
    );
    expect(screen.getByTestId("caption")).toBeTruthy();
  });
});
