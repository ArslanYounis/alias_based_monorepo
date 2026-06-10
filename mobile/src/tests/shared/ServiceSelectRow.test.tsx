/**
 * Tests for the shared ServiceSelectRow component (mobile platform).
 *
 * Platform Container/Text/CheckboxField and SharedLanguageSwitchRenderer are
 * mocked so the row's rendering logic (tag vs value, language, border, padding)
 * can be tested without Expo native modules. The CheckboxField mock is a
 * Pressable that fires onChange(id, !checked), matching the role-based mobile
 * checkbox behaviour.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── SharedLanguageSwitchRenderer ─────────────────────────────────────────────
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

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, ...p }: any) =>
      React.createElement(View, p, children),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...p }: any) => React.createElement(Text, p, children),
  };
});
jest.mock("@platform/CheckboxField", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  return {
    CheckboxField: ({ id, label, label_ar, checked, disabled, onChange, language }: any) =>
      React.createElement(
        Pressable,
        {
          testID: `checkbox-${id}`,
          accessibilityRole: "checkbox",
          accessibilityState: { checked, disabled },
          disabled,
          onPress: () => onChange?.(id, !checked),
        },
        React.createElement(
          Text,
          null,
          language === "ar" && label_ar ? label_ar : label
        )
      ),
  };
});

import ServiceSelectRow from "@shared/components/ServiceSelectRow";

describe("ServiceSelectRow (shared component – mobile platform)", () => {
  it("renders the label via checkbox", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    expect(screen.getByText("Block A")).toBeTruthy();
  });

  it("renders Arabic label when language=ar", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" label_ar="بلوك أ" language="ar" />
    );
    expect(screen.getByText("بلوك أ")).toBeTruthy();
  });

  it("applies ltr direction for English", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    // The outermost Container receives dir="ltr"
    const checkbox = screen.getByTestId("checkbox-row-1");
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it("renders a tag when tag is provided", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" tag="Existing Block" />);
    expect(screen.getByText("Existing Block")).toBeTruthy();
  });

  it("renders Arabic tag when language=ar", () => {
    render(
      <ServiceSelectRow
        id="row-1"
        label="Block A"
        tag="Existing Block"
        tag_ar="كتلة موجودة"
        language="ar"
      />
    );
    expect(screen.getByText("كتلة موجودة")).toBeTruthy();
  });

  it("renders a value when no tag is provided", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" value="AED 100" />);
    expect(screen.getByText("AED 100")).toBeTruthy();
  });

  it("does not render value when tag is present (tag wins)", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" tag="Tag" value="Value" />
    );
    expect(screen.getByText("Tag")).toBeTruthy();
    expect(screen.queryByText("Value")).toBeNull();
  });

  it("renders neither tag nor value when both absent", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    expect(screen.queryByText("Existing Block")).toBeNull();
  });

  it("fires onChange when the checkbox is toggled", () => {
    const onChange = jest.fn();
    render(<ServiceSelectRow id="row-1" label="Block A" onChange={onChange} />);
    fireEvent.press(screen.getByTestId("checkbox-row-1"));
    expect(onChange).toHaveBeenCalledWith("row-1", true);
  });

  it("renders checked state", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" checked />);
    expect(screen.getByTestId("checkbox-row-1").props.accessibilityState.checked).toBe(
      true
    );
  });

  it("renders disabled state", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" disabled />);
    expect(
      screen.getByTestId("checkbox-row-1").props.accessibilityState.disabled
    ).toBe(true);
  });

  it("renders mobile padding when platform=mobile", () => {
    expect(() =>
      render(<ServiceSelectRow id="row-1" label="Block A" platform="mobile" />)
    ).not.toThrow();
    expect(screen.getByText("Block A")).toBeTruthy();
  });

  it("renders without bottom border when showBorder=false", () => {
    expect(() =>
      render(<ServiceSelectRow id="row-1" label="Block A" showBorder={false} />)
    ).not.toThrow();
  });

  it("toggling with no onChange handler uses the default no-op", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    expect(() =>
      fireEvent.press(screen.getByTestId("checkbox-row-1"))
    ).not.toThrow();
  });

  it("falls back to English tag when only tag is set and language=ar", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" tag="OnlyEn" language="ar" />
    );
    expect(screen.getByText("OnlyEn")).toBeTruthy();
  });

  it("falls back to English value when only value is set and language=ar", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" value="ValEn" language="ar" />
    );
    expect(screen.getByText("ValEn")).toBeTruthy();
  });

  it("renders Arabic value when value_ar is provided", () => {
    render(
      <ServiceSelectRow
        id="row-1"
        label="Block A"
        value="ValEn"
        value_ar="قيمة"
        language="ar"
      />
    );
    expect(screen.getByText("قيمة")).toBeTruthy();
  });
});
