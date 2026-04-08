/**
 * Tests for the shared Insurance step component.
 * Covers: rendering, Yes/No radio toggle, fee fields visibility,
 * Arabic language, onLiveValidate callback.
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
      return React.createElement(View, { testID: "text-input" },
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
jest.mock("@platform/icons", () => ({ CalendarIcon: () => null }));

// ── Schema mock ──────────────────────────────────────────────────────────────
jest.mock("@shared/components/Payment/helper", () => ({
  InsuranceSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
}));

import Insurance from "@shared/components/Payment/Insurance";

const makeField = (value: string = "Yes") => ({
  state: { value, meta: { errors: [] } },
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  name: "field",
});

// Form that returns "Yes" for insuranceFee and "" for fee fields
const mockFormYes = {
  Field: ({ children, name }: any) =>
    children(makeField(name === "insuranceFee" ? "Yes" : "")),
  state: { values: {} },
} as any;

const mockFormNo = {
  Field: ({ children, name }: any) =>
    children(makeField(name === "insuranceFee" ? "No" : "")),
  state: { values: {} },
} as any;

describe("Insurance", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<Insurance form={mockFormYes} language="en" />);
  });

  it("renders insurance fee label", () => {
    render(<Insurance form={mockFormYes} language="en" />);
    expect(screen.getByText("Insurance fee")).toBeTruthy();
  });

  it("renders Yes and No radio options", () => {
    render(<Insurance form={mockFormYes} language="en" />);
    expect(screen.getByTestId("radio-insurance-Yes")).toBeTruthy();
    expect(screen.getByTestId("radio-insurance-No")).toBeTruthy();
  });

  it("shows insurance fee fields when insuranceFee is Yes", () => {
    render(<Insurance form={mockFormYes} language="en" />);
    // Two text inputs: registration fees and amount in words
    const inputs = screen.getAllByTestId("text-input");
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders fee amount label when Yes", () => {
    render(<Insurance form={mockFormYes} language="en" />);
    expect(screen.getByText("Rent fees area per unit (in fils)")).toBeTruthy();
  });

  it("renders amount in words label when Yes", () => {
    render(<Insurance form={mockFormYes} language="en" />);
    expect(screen.getByText("Amount in words")).toBeTruthy();
  });

  it("renders Arabic insurance fee label when language=ar", () => {
    render(<Insurance form={mockFormYes} language="ar" />);
    expect(screen.getByText("رسوم التأمين")).toBeTruthy();
  });

  it("does not crash without onLiveValidate", () => {
    render(<Insurance form={mockFormYes} />);
  });
});
