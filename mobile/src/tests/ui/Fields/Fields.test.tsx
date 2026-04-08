/**
 * Tests for the Fields UI component — covers all type variants and key branches.
 *
 * Module alias resolution (from jest.config.js):
 *   @platform/*  →  mobile/src/ui/*
 *   @shared/*    →  shared/*
 *   ~/           →  mobile/
 *
 * Heavy native dependencies are mocked so the component tree renders under
 * jest-expo without a real native environment.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { TextInput } from "react-native";

// ── 1. @gorhom/bottom-sheet ───────────────────────────────────────────────────
jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View, TextInput } = require("react-native");
  return {
    BottomSheetModal: React.forwardRef(({ children }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return React.createElement(
        View,
        { testID: "bottom-sheet-modal" },
        children
      );
    }),
    BottomSheetScrollView: ({ children }: any) =>
      React.createElement(
        View,
        { testID: "bottom-sheet-scroll" },
        children
      ),
    BottomSheetBackdrop: () => null,
    BottomSheetTextInput: ({ value, onChangeText, placeholder }: any) =>
      React.createElement(TextInput, {
        value,
        onChangeText,
        placeholder,
        testID: "bottom-sheet-text-input",
      }),
  };
});

// ── 2. DateSelect (relative import ../DateSelect resolves via @platform alias) ─
jest.mock("@platform/DateSelect", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    DateSelect: (_p: any) =>
      React.createElement(View, { testID: "date-select" }),
  };
});

// ── 3. SharedLanguageSwitchRenderer ──────────────────────────────────────────
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

// ── 4. SVG asset ──────────────────────────────────────────────────────────────
jest.mock("~/assets/svg/icons/SelectArrow", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "select-arrow" }),
  };
});

// ── 5. Checkbox (used inside Fields for multi-select) ─────────────────────────
jest.mock("@platform/Checkbox", () => {
  const React = require("react");
  const { TouchableOpacity } = require("react-native");
  return {
    Checkbox: ({ id, onChange }: any) =>
      React.createElement(TouchableOpacity, {
        testID: `checkbox-${id}`,
        onPress: () => onChange?.(id, true),
      }),
  };
});

// ── 6. CheckRadioLabel ────────────────────────────────────────────────────────
jest.mock("@platform/CheckRadioLabel", () => {
  const React = require("react");
  const { Text, TouchableOpacity } = require("react-native");
  return {
    CheckRadioLabel: ({ label, onClick }: any) =>
      React.createElement(
        TouchableOpacity,
        { onPress: onClick, testID: `check-radio-label-${label}` },
        React.createElement(Text, null, label)
      ),
  };
});

// ── 7. AddButton ──────────────────────────────────────────────────────────────
jest.mock("@platform/AddButton", () => {
  const React = require("react");
  const { TouchableOpacity } = require("react-native");
  return {
    AddButton: ({ onClick }: any) =>
      React.createElement(TouchableOpacity, {
        testID: "add-button",
        onPress: onClick,
      }),
  };
});

import { Fields } from "@platform/Fields/Fields";

// ─────────────────────────────────────────────────────────────────────────────

describe("Fields", () => {
  // ── type="text" (default) ──────────────────────────────────────────────────
  describe('type="text"', () => {
    it("renders a TextInput", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      const inputs = screen.UNSAFE_getAllByType(TextInput);
      expect(inputs.length).toBeGreaterThan(0);
    });

    it("fires onChange when text changes", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="text"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChange", { nativeEvent: { text: "hello" } });
      expect(onChange).toHaveBeenCalledWith("hello");
    });

    it("displays the provided value", () => {
      render(
        <Fields
          type="text"
          value="initial text"
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.value).toBe("initial text");
    });

    it("renders with placeholder", () => {
      render(
        <Fields
          type="text"
          value=""
          placeholder="Enter text"
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.placeholder).toBe("Enter text");
    });

    it("uses Arabic placeholder when language=ar", () => {
      render(
        <Fields
          type="text"
          value=""
          placeholder="Enter text"
          placeholder_ar="أدخل النص"
          language="ar"
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.placeholder).toBe("أدخل النص");
    });

    it("sets editable=false when disabled=true", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          disabled={true}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.editable).toBe(false);
    });
  });

  // ── type="textarea" ────────────────────────────────────────────────────────
  describe('type="textarea"', () => {
    it("renders a multiline TextInput", () => {
      render(
        <Fields
          type="textarea"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      const inputs = screen.UNSAFE_getAllByType(TextInput);
      const multiline = inputs.find((i) => i.props.multiline === true);
      expect(multiline).toBeTruthy();
    });

    it("fires onChange when text changes", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="textarea"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChange", { nativeEvent: { text: "multi\nline" } });
      expect(onChange).toHaveBeenCalledWith("multi\nline");
    });
  });

  // ── type="date" ────────────────────────────────────────────────────────────
  describe('type="date"', () => {
    it("renders the DateSelect component", () => {
      render(
        <Fields
          type="date"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      expect(screen.getByTestId("date-select")).toBeTruthy();
    });

    it("does not render a plain TextInput for date type", () => {
      render(
        <Fields
          type="date"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      // DateSelect mock renders a View, no TextInput should be present
      expect(screen.UNSAFE_queryAllByType(TextInput).length).toBe(0);
    });
  });

  // ── type="select" (single) ─────────────────────────────────────────────────
  describe('type="select" single', () => {
    it("renders a TouchableOpacity trigger", () => {
      const { UNSAFE_getAllByType } = render(
        <Fields
          type="select"
          selectType="single"
          value=""
          placeholder="Choose one"
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
        />
      );
      // TouchableOpacity exists (the trigger button)
      const { TouchableOpacity } = require("react-native");
      expect(UNSAFE_getAllByType(TouchableOpacity).length).toBeGreaterThan(0);
    });

    it("shows placeholder text when no value is selected", () => {
      render(
        <Fields
          type="select"
          selectType="single"
          value=""
          placeholder="Choose one"
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
        />
      );
      expect(screen.getByText("Choose one")).toBeTruthy();
    });

    it("renders BottomSheetModal", () => {
      render(
        <Fields
          type="select"
          selectType="single"
          value=""
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
        />
      );
      expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
    });

    it("renders option labels inside BottomSheetScrollView", () => {
      render(
        <Fields
          type="select"
          selectType="single"
          value=""
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
          ]}
        />
      );
      expect(screen.getByText("Option A")).toBeTruthy();
      expect(screen.getByText("Option B")).toBeTruthy();
    });

    it("calls onChange with selected value when option is pressed", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="select"
          selectType="single"
          value=""
          placeholder="Choose"
          onChange={onChange}
          errorMessage=""
          options={[{ label: "Option A", value: "a" }]}
        />
      );
      // Press the CheckRadioLabel for "Option A"
      fireEvent.press(screen.getByTestId("check-radio-label-Option A"));
      expect(onChange).toHaveBeenCalledWith("a");
    });

    it("shows selected label when value matches an option", () => {
      render(
        <Fields
          type="select"
          selectType="single"
          value="a"
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[{ label: "Option A", value: "a" }]}
        />
      );
      // The trigger text should show the label of the selected option
      // Option A appears in both the trigger and the options list
      expect(screen.getAllByText("Option A").length).toBeGreaterThan(0);
    });

    it("renders SelectArrow icon", () => {
      render(
        <Fields
          type="select"
          selectType="single"
          value=""
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
        />
      );
      expect(screen.getByTestId("select-arrow")).toBeTruthy();
    });
  });

  // ── type="select" multi ────────────────────────────────────────────────────
  describe('type="select" multi', () => {
    it("renders checkbox for each option", () => {
      render(
        <Fields
          type="select"
          selectType="multi"
          value=""
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[
            { label: "Opt 1", value: "1" },
            { label: "Opt 2", value: "2" },
          ]}
        />
      );
      expect(screen.getByTestId("checkbox-1")).toBeTruthy();
      expect(screen.getByTestId("checkbox-2")).toBeTruthy();
    });

    it("calls onChange with comma-separated values when multi-selecting", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="select"
          selectType="multi"
          value=""
          placeholder="Choose"
          onChange={onChange}
          errorMessage=""
          options={[{ label: "Opt 1", value: "1" }]}
        />
      );
      fireEvent.press(screen.getByTestId("check-radio-label-Opt 1"));
      expect(onChange).toHaveBeenCalledWith("1");
    });

    it("shows item count text when items are selected", () => {
      render(
        <Fields
          type="select"
          selectType="multi"
          value="1, 2"
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[
            { label: "Opt 1", value: "1" },
            { label: "Opt 2", value: "2" },
          ]}
        />
      );
      expect(screen.getByText("2 item(s) selected")).toBeTruthy();
    });
  });

  // ── type="uaeid" ───────────────────────────────────────────────────────────
  describe('type="uaeid"', () => {
    it("renders a TextInput", () => {
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      expect(screen.UNSAFE_getAllByType(TextInput).length).toBeGreaterThan(0);
    });

    it("formats UAE ID with dashes on input", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      // Simulate typing raw digits "784123412345671"
      fireEvent(input, "onChangeText", "7841234123456711");
      // formatUAEID: 784-1234-123456-7 (3-4-6-1)
      expect(onChange).toHaveBeenCalledWith(
        expect.stringMatching(/\d{3}-\d{4}-\d{6}-\d/)
      );
    });

    it("formats partial UAE ID (3 digits only)", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChangeText", "784");
      expect(onChange).toHaveBeenCalledWith("784");
    });

    it("formats UAE ID with 5 digits (3-4 pattern)", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChangeText", "78412");
      expect(onChange).toHaveBeenCalledWith("784-12");
    });

    it("formats UAE ID with 9 digits (3-4-6 pattern)", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChangeText", "784123456");
      expect(onChange).toHaveBeenCalledWith("784-1234-56");
    });
  });

  // ── type="currency" ────────────────────────────────────────────────────────
  describe('type="currency"', () => {
    it("renders a TextInput", () => {
      render(
        <Fields
          type="currency"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          currencySymbol="AED"
        />
      );
      expect(screen.UNSAFE_getAllByType(TextInput).length).toBeGreaterThan(0);
    });

    it("renders with default AED prefix text", () => {
      render(
        <Fields
          type="currency"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          currencySymbol="AED"
        />
      );
      expect(screen.getByText("AED")).toBeTruthy();
    });

    it("renders with custom currency symbol", () => {
      render(
        <Fields
          type="currency"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          currencySymbol="USD"
        />
      );
      expect(screen.getByText("USD")).toBeTruthy();
    });

    it("fires onChange with filtered numeric value", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="currency"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChange", { nativeEvent: { text: "12.5abc" } });
      expect(onChange).toHaveBeenCalledWith("12.5");
    });
  });

  // ── type="phone" ───────────────────────────────────────────────────────────
  describe('type="phone"', () => {
    it("renders a TextInput", () => {
      render(
        <Fields
          type="phone"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          phoneCode="+971"
        />
      );
      expect(screen.UNSAFE_getAllByType(TextInput).length).toBeGreaterThan(0);
    });

    it("renders with default phone code prefix", () => {
      render(
        <Fields
          type="phone"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          phoneCode="+971"
        />
      );
      expect(screen.getByText("+971")).toBeTruthy();
    });

    it("fires onChange with numeric-only value", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="phone"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChange", { nativeEvent: { text: "050abc123" } });
      expect(onChange).toHaveBeenCalledWith("050123");
    });
  });

  // ── type="number" ──────────────────────────────────────────────────────────
  describe('type="number"', () => {
    it("renders a TextInput", () => {
      render(
        <Fields
          type="number"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      expect(screen.UNSAFE_getAllByType(TextInput).length).toBeGreaterThan(0);
    });

    it("uses numeric keyboard type", () => {
      render(
        <Fields
          type="number"
          value=""
          onChange={jest.fn()}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.keyboardType).toBe("numeric");
    });

    it("fires onChange with filtered numeric value", () => {
      const onChange = jest.fn();
      render(
        <Fields
          type="number"
          value=""
          onChange={onChange}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      fireEvent(input, "onChange", { nativeEvent: { text: "42.5xyz" } });
      expect(onChange).toHaveBeenCalledWith("42.5");
    });
  });

  // ── hasError + errorMessage ────────────────────────────────────────────────
  describe("error display", () => {
    it("shows errorMessage when hasError=true and errorMessage is provided", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="This field is required"
          errorMessage_ar="هذا الحقل مطلوب"
        />
      );
      expect(screen.getByText("This field is required")).toBeTruthy();
    });

    it("shows Arabic errorMessage when language=ar", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="This field is required"
          errorMessage_ar="هذا الحقل مطلوب"
          language="ar"
        />
      );
      expect(screen.getByText("هذا الحقل مطلوب")).toBeTruthy();
    });

    it("does NOT show error when hasError=false", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          hasError={false}
          errorMessage="This field is required"
        />
      );
      expect(screen.queryByText("This field is required")).toBeNull();
    });

    it("does NOT show error when errorMessage is empty", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage=""
        />
      );
      // No error text rendered
      expect(screen.queryByText("")).toBeNull();
    });

    it("shows error for textarea type", () => {
      render(
        <Fields
          type="textarea"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="Textarea error"
        />
      );
      expect(screen.getByText("Textarea error")).toBeTruthy();
    });

    it("shows error for select type", () => {
      render(
        <Fields
          type="select"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="Select error"
          options={[]}
        />
      );
      expect(screen.getByText("Select error")).toBeTruthy();
    });

    it("shows error for uaeid type", () => {
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="UAE ID error"
        />
      );
      expect(screen.getByText("UAE ID error")).toBeTruthy();
    });

    it("shows error for currency type", () => {
      render(
        <Fields
          type="currency"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="Currency error"
        />
      );
      expect(screen.getByText("Currency error")).toBeTruthy();
    });

    it("shows error for number type", () => {
      render(
        <Fields
          type="number"
          value=""
          onChange={jest.fn()}
          hasError={true}
          errorMessage="Number error"
        />
      );
      expect(screen.getByText("Number error")).toBeTruthy();
    });
  });

  // ── disabled ───────────────────────────────────────────────────────────────
  describe("disabled prop", () => {
    it("sets editable=false on text TextInput when disabled", () => {
      render(
        <Fields
          type="text"
          value=""
          onChange={jest.fn()}
          disabled={true}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.editable).toBe(false);
    });

    it("disables the select trigger TouchableOpacity when disabled", () => {
      render(
        <Fields
          type="select"
          value=""
          onChange={jest.fn()}
          disabled={true}
          errorMessage=""
          options={[]}
        />
      );
      const { TouchableOpacity } = require("react-native");
      const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
      const trigger = buttons.find((b) => b.props.disabled === true);
      expect(trigger).toBeTruthy();
    });

    it("sets editable=false on uaeid TextInput when disabled", () => {
      render(
        <Fields
          type="uaeid"
          value=""
          onChange={jest.fn()}
          disabled={true}
          errorMessage=""
        />
      );
      const input = screen.UNSAFE_getAllByType(TextInput)[0];
      expect(input.props.editable).toBe(false);
    });
  });

  // ── showAddButton ──────────────────────────────────────────────────────────
  describe("showAddButton (select type only)", () => {
    it("renders AddButton when showAddButton=true on select type", () => {
      render(
        <Fields
          type="select"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
          showAddButton={true}
        />
      );
      expect(screen.getByTestId("add-button")).toBeTruthy();
    });

    it("does NOT render AddButton when showAddButton=false", () => {
      render(
        <Fields
          type="select"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
          showAddButton={false}
        />
      );
      expect(screen.queryByTestId("add-button")).toBeNull();
    });
  });

  // ── select with empty filtered options ────────────────────────────────────
  describe("select empty options", () => {
    it('shows "No options found" when options list is empty', () => {
      render(
        <Fields
          type="select"
          value=""
          placeholder="Choose"
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
        />
      );
      expect(screen.getByText("No options found")).toBeTruthy();
    });
  });

  // ── select title rendering ─────────────────────────────────────────────────
  describe("select title", () => {
    it("renders title inside bottom sheet when provided", () => {
      render(
        <Fields
          type="select"
          value=""
          onChange={jest.fn()}
          errorMessage=""
          options={[]}
          title="Pick an option"
        />
      );
      expect(screen.getByText("Pick an option")).toBeTruthy();
    });
  });
});
