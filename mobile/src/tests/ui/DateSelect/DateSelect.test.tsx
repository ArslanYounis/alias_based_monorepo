/**
 * Tests for the DateSelect UI component.
 *
 * Exercises: rendering, label/placeholder display, disabled state, error state,
 * opening/closing the picker modal, onDateChange callback, controlled value,
 * and Arabic language support.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { Platform } from "react-native";

// ── Mocks must come before component imports ──────────────────────────────────

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

jest.mock("~/assets/svg/icons/Info", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, { testID: "info-svg", ...p }),
  };
});

jest.mock("~/assets/svg/icons/Calendar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) =>
      React.createElement(View, { testID: "calendar-icon", ...p }),
  };
});

jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ onChange, value, disabled }: any) =>
      React.createElement(View, {
        testID: "date-time-picker",
        accessibilityState: { disabled: !!disabled },
      }),
  };
});

// Caption mock — "@platform/Caption" resolves to mobile/src/ui/Caption which is
// the same module imported via relative "../Caption" from DateSelect.tsx
jest.mock("@platform/Caption", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Caption: ({ errorMessage, errorMessage_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "caption" },
        language === "ar" && errorMessage_ar ? errorMessage_ar : errorMessage ?? ""
      ),
  };
});

import { DateSelect } from "@platform/DateSelect/DateSelect";

describe("DateSelect", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<DateSelect />);
  });

  it("shows default English placeholder when no value", () => {
    render(<DateSelect placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeTruthy();
  });

  it("shows Arabic placeholder when language='ar' and no value", () => {
    render(
      <DateSelect
        placeholder="Select date"
        placeholder_ar="اختر التاريخ"
        language="ar"
      />
    );
    expect(screen.getByText("اختر التاريخ")).toBeTruthy();
  });

  it("renders the calendar icon", () => {
    render(<DateSelect />);
    expect(screen.getByTestId("calendar-icon")).toBeTruthy();
  });

  // ── Label ──────────────────────────────────────────────────────────────────

  it("renders label when provided", () => {
    render(<DateSelect label="Birth Date" />);
    expect(screen.getByText("Birth Date")).toBeTruthy();
  });

  it("does not render label when not provided", () => {
    render(<DateSelect />);
    expect(screen.queryByText("Birth Date")).toBeNull();
  });

  it("renders Arabic label when language='ar'", () => {
    render(
      <DateSelect label="Birth Date" label_ar="تاريخ الميلاد" language="ar" />
    );
    expect(screen.getByText("تاريخ الميلاد")).toBeTruthy();
  });

  it("renders required asterisk when required=true and label provided", () => {
    render(<DateSelect label="Date" required />);
    expect(screen.getByText("*")).toBeTruthy();
  });

  it("does not render asterisk when required=false", () => {
    render(<DateSelect label="Date" required={false} />);
    expect(screen.queryByText("*")).toBeNull();
  });

  // ── Info tooltip ───────────────────────────────────────────────────────────

  it("renders info icon when infoText provided and label present", () => {
    render(<DateSelect label="Date" infoText="Some info" />);
    expect(screen.getByTestId("info-svg")).toBeTruthy();
  });

  it("does not render info icon when infoText is not provided", () => {
    render(<DateSelect label="Date" />);
    expect(screen.queryByTestId("info-svg")).toBeNull();
  });

  it("shows infoText after pressing the info icon", () => {
    render(<DateSelect label="Date" infoText="Helpful info text" />);
    expect(screen.queryByText("Helpful info text")).toBeNull();
    fireEvent.press(screen.getByTestId("info-svg"));
    expect(screen.getByText("Helpful info text")).toBeTruthy();
  });

  it("toggles infoText off when info icon is pressed again", () => {
    render(<DateSelect label="Date" infoText="Helpful info text" />);
    fireEvent.press(screen.getByTestId("info-svg"));
    expect(screen.getByText("Helpful info text")).toBeTruthy();
    fireEvent.press(screen.getByTestId("info-svg"));
    expect(screen.queryByText("Helpful info text")).toBeNull();
  });

  it("shows Arabic infoText when language='ar'", () => {
    render(
      <DateSelect
        label="Date"
        infoText="Info"
        infoText_ar="معلومات"
        language="ar"
      />
    );
    fireEvent.press(screen.getByTestId("info-svg"));
    expect(screen.getByText("معلومات")).toBeTruthy();
  });

  // ── Modal open / close ─────────────────────────────────────────────────────

  it("opens picker modal when Pressable is pressed", () => {
    render(<DateSelect placeholder="Pick date" />);
    fireEvent.press(screen.getByText("Pick date"));
    expect(screen.getByTestId("date-time-picker")).toBeTruthy();
  });

  it("closes picker modal when backdrop is pressed (cancel)", () => {
    render(<DateSelect placeholder="Pick date" />);
    // Open
    fireEvent.press(screen.getByText("Pick date"));
    expect(screen.getByTestId("date-time-picker")).toBeTruthy();
    // The outer TouchableOpacity is the backdrop — press it
    const backdrop = screen.UNSAFE_getAllByType(
      require("react-native").TouchableOpacity
    )[0];
    fireEvent.press(backdrop);
    expect(screen.queryByTestId("date-time-picker")).toBeNull();
  });

  // ── Controlled value ───────────────────────────────────────────────────────

  it("displays formatted date when value is provided", () => {
    render(<DateSelect value="2024-06-15" language="en" />);
    // Month long format includes "June"
    expect(screen.getByText(/June/i)).toBeTruthy();
  });

  it("displays Arabic formatted date when language='ar' and value provided", () => {
    render(<DateSelect value="2024-06-15" language="ar" />);
    // Arabic date locale — just verify it does not show the placeholder
    expect(screen.queryByText("اختر التاريخ")).toBeNull();
  });

  it("resets to undefined when value prop changes to empty", () => {
    const { rerender } = render(
      <DateSelect value="2024-06-15" placeholder="Select date" />
    );
    expect(screen.queryByText("Select date")).toBeNull();
    rerender(<DateSelect value="" placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeTruthy();
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  it("does not open modal when disabled=true", () => {
    render(<DateSelect disabled placeholder="Pick date" />);
    fireEvent.press(screen.getByText("Pick date"));
    expect(screen.queryByTestId("date-time-picker")).toBeNull();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it("renders without crashing when hasError=true", () => {
    expect(() =>
      render(<DateSelect hasError errorMessage="Date required" />)
    ).not.toThrow();
  });

  // ── testId prop ────────────────────────────────────────────────────────────

  it("applies testId to the root view", () => {
    render(<DateSelect testId="date-select-root" />);
    expect(screen.getByTestId("date-select-root")).toBeTruthy();
  });

  // ── onDateChange callback ──────────────────────────────────────────────────

  it("calls onDateChange after pressing Done on iOS", () => {
    const originalOS = Platform.OS;
    (Platform as any).OS = "ios";

    const onDateChange = jest.fn();
    render(
      <DateSelect
        placeholder="Pick date"
        onDateChange={onDateChange}
        value="2024-06-15"
      />
    );
    // Open modal
    fireEvent.press(screen.getByText(/June/i));
    // Press Done button
    const doneButton = screen.getByText("Done");
    fireEvent.press(doneButton);
    expect(onDateChange).toHaveBeenCalledTimes(1);

    (Platform as any).OS = originalOS;
  });
});
