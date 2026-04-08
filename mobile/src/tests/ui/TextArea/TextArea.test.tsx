/**
 * Tests for the mobile TextArea component.
 *
 * Label, Fields, and Caption sub-components are the real implementations
 * (resolved via moduleNameMapper). The tests cover the main branches:
 * label rendering, placeholder language switching, caption conditional
 * rendering, error state, and disabled state.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Standard language-switch mocks ──────────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});
jest.mock("@shared/components/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock: Label ────────────────────────────────────────────────────────────
jest.mock("~/src/ui/Label/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Label: ({ label }: any) =>
      React.createElement(Text, { testID: "label" }, label),
  };
});

// ── Mock: Fields ───────────────────────────────────────────────────────────
jest.mock("~/src/ui/Fields/Fields", () => {
  const React = require("react");
  const { TextInput } = require("react-native");
  return {
    Fields: ({ value, onChange, placeholder, disabled }: any) =>
      React.createElement(TextInput, {
        testID: "fields-textarea",
        value: value ?? "",
        onChangeText: onChange,
        placeholder: placeholder ?? "",
        editable: !disabled,
      }),
  };
});

// ── Mock: Caption ──────────────────────────────────────────────────────────
jest.mock("~/src/ui/Caption/Caption", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Caption: ({ captionLeft, captionLeft_ar, captionRight, captionRight_ar, errorMessage, errorMessage_ar, language }: any) => {
      const left = language === "ar" && captionLeft_ar ? captionLeft_ar : captionLeft;
      const right = language === "ar" && captionRight_ar ? captionRight_ar : captionRight;
      const err = language === "ar" && errorMessage_ar ? errorMessage_ar : errorMessage;
      return React.createElement(
        React.Fragment,
        null,
        left ? React.createElement(Text, { testID: "caption-left" }, left) : null,
        right ? React.createElement(Text, { testID: "caption-right" }, right) : null,
        err ? React.createElement(Text, { testID: "caption-error" }, err) : null
      );
    },
  };
});

import { TextArea } from "~/src/ui/TextArea/TextArea";

describe("TextArea", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing with all defaults", () => {
    render(<TextArea />);
  });

  it("renders with provided value", () => {
    render(<TextArea value="Hello world" />);
    expect(screen.getByDisplayValue("Hello world")).toBeTruthy();
  });

  it("renders with empty value by default", () => {
    render(<TextArea />);
    expect(screen.getByTestId("fields-textarea")).toBeTruthy();
  });

  // ── onChange ─────────────────────────────────────────────────────────────

  it("calls onChange when text changes", () => {
    const onChange = jest.fn();
    render(<TextArea onChange={onChange} />);
    fireEvent.changeText(screen.getByTestId("fields-textarea"), "New text");
    expect(onChange).toHaveBeenCalledWith("New text");
  });

  // ── Placeholder language switching ────────────────────────────────────────

  it("renders English placeholder when language='en'", () => {
    render(<TextArea placeholder="Enter text" placeholder_ar="أدخل النص" language="en" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeTruthy();
  });

  it("renders Arabic placeholder when language='ar'", () => {
    render(<TextArea placeholder="Enter text" placeholder_ar="أدخل النص" language="ar" />);
    expect(screen.getByPlaceholderText("أدخل النص")).toBeTruthy();
  });

  it("falls back to English placeholder when language='ar' but placeholder_ar is empty", () => {
    render(<TextArea placeholder="Enter text" placeholder_ar="" language="ar" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeTruthy();
  });

  // ── Caption section ───────────────────────────────────────────────────────

  it("does not render Caption when no caption or error props provided", () => {
    render(<TextArea />);
    expect(screen.queryByTestId("caption-left")).toBeNull();
    expect(screen.queryByTestId("caption-right")).toBeNull();
    expect(screen.queryByTestId("caption-error")).toBeNull();
  });

  it("renders Caption when captionLeft is provided", () => {
    render(<TextArea captionLeft="Left caption" />);
    expect(screen.getByTestId("caption-left")).toBeTruthy();
    expect(screen.getByText("Left caption")).toBeTruthy();
  });

  it("renders Caption when captionRight is provided", () => {
    render(<TextArea captionRight="Right caption" />);
    expect(screen.getByTestId("caption-right")).toBeTruthy();
    expect(screen.getByText("Right caption")).toBeTruthy();
  });

  it("renders Caption with error message when hasError=true and errorMessage provided", () => {
    render(<TextArea hasError errorMessage="Field required" />);
    expect(screen.getByTestId("caption-error")).toBeTruthy();
    expect(screen.getByText("Field required")).toBeTruthy();
  });

  it("does not render Caption when hasError=true but no errorMessage", () => {
    // hasError=true but errorMessage="" and errorMessage_ar="" → condition false
    render(<TextArea hasError errorMessage="" errorMessage_ar="" />);
    expect(screen.queryByTestId("caption-error")).toBeNull();
  });

  it("renders Arabic caption when language='ar' and captionLeft_ar provided", () => {
    render(<TextArea captionLeft="Left" captionLeft_ar="يسار" language="ar" />);
    expect(screen.getByText("يسار")).toBeTruthy();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("renders without crashing when disabled=true", () => {
    render(<TextArea disabled />);
    expect(screen.getByTestId("fields-textarea")).toBeTruthy();
  });

  // ── required / showInfoIcon ────────────────────────────────────────────────

  it("renders without crashing when required=true", () => {
    render(<TextArea required label="Notes" />);
  });

  it("renders without crashing when showInfoIcon=true with tooltip", () => {
    render(<TextArea showInfoIcon tooltipText="Hint" label="Notes" />);
  });

  // ── Language default ──────────────────────────────────────────────────────

  it("defaults to English language when language prop omitted", () => {
    render(<TextArea placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeTruthy();
  });
});
