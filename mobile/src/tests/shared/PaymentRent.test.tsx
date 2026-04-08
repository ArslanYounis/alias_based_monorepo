/**
 * Tests for the shared Rent step component.
 * Covers: rendering all fields, insurance radio options,
 * checkbox fields, Arabic language.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Language switch mock ─────────────────────────────────────────────────────
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
  return { Container: ({ children, ...p }: any) => React.createElement(View, p, children) };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    TextInput: ({ label, onChange }: any) => {
      onChange?.("test");
      return React.createElement(
        View,
        { testID: "text-input" },
        React.createElement(Text, null, label ?? "")
      );
    },
  };
});
jest.mock("@platform/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Label: ({ label, label_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && label_ar ? label_ar : label
      ),
  };
});
jest.mock("@platform/RadioField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioField: ({ id, label, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `radio-${id}`, onPress: onChange },
        React.createElement(Text, null, label)
      ),
  };
});
jest.mock("@platform/CheckboxField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    CheckboxField: ({ id, label, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `checkbox-${id}`, onPress: onChange },
        React.createElement(Text, null, label)
      ),
  };
});
jest.mock("@platform/icons", () => ({ CalendarIcon: () => null }));

// ── Schema mock ──────────────────────────────────────────────────────────────
jest.mock("@shared/components/Payment/helper", () => ({
  RentSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
}));

import Rent from "@shared/components/Payment/Rent";

const makeField = (value: any = "") => ({
  state: { value, meta: { errors: [] } },
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  name: "field",
});

const mockForm = {
  Field: ({ children, name }: any) => {
    const val =
      name === "isFirstYearFreeOfPayment" || name === "exemptSocialAssistance"
        ? false
        : "";
    return children(makeField(val));
  },
  state: { values: {} },
} as any;

describe("Rent", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<Rent form={mockForm} language="en" />);
  });

  it("renders Insurance fee label", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Insurance fee")).toBeTruthy();
  });

  it("renders Yes and No radio options for insurance", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByTestId("radio-insurance-Yes")).toBeTruthy();
    expect(screen.getByTestId("radio-insurance-No")).toBeTruthy();
  });

  it("renders Rent payment start date label", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Rent payment start date")).toBeTruthy();
  });

  it("renders Rent payment end date label", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Rent payment end date")).toBeTruthy();
  });

  it("renders Payment amount label", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Payment amount")).toBeTruthy();
  });

  it("renders first year free checkbox", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByTestId("checkbox-is-first-year-free-of-payment")).toBeTruthy();
  });

  it("renders exempt social assistance checkbox", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByTestId("checkbox-exempt-social-assistance")).toBeTruthy();
  });

  it("renders first year free label text", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Rent payment is free for the year")).toBeTruthy();
  });

  it("renders exempt social assistance label text", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Exempt social assistance recipient")).toBeTruthy();
  });

  it("renders Arabic insurance fee label when language=ar", () => {
    render(<Rent form={mockForm} language="ar" />);
    expect(screen.getByText("رسوم التأمين")).toBeTruthy();
  });

  it("renders without onLiveValidate prop", () => {
    render(<Rent form={mockForm} language="en" />);
    expect(screen.getByText("Insurance fee")).toBeTruthy();
  });
});
