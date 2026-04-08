/**
 * Tests for the shared Contract step component.
 * Covers: rendering fields, language switching, onLiveValidate callback.
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
jest.mock("@platform/TextInput/TextInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    TextInput: ({ label, testID, onChange }: any) => {
      onChange?.("test");
      return React.createElement(View, { testID: testID ?? "text-input" },
        React.createElement(Text, null, label ?? "")
      );
    },
  };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    TextInput: ({ label, testID, onChange }: any) => {
      onChange?.("test");
      return React.createElement(View, { testID: testID ?? "text-input" },
        React.createElement(Text, null, label ?? "")
      );
    },
  };
});
jest.mock("@platform/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Label: ({ label, label_ar, language }: any) =>
    React.createElement(Text, null, language === "ar" && label_ar ? label_ar : label) };
});
jest.mock("@platform/RadioField", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { RadioField: (p: any) => React.createElement(View, { testID: `radio-field-${p.id}` }) };
});
jest.mock("@platform/icons", () => ({ CalendarIcon: () => null }));

// ── Schema mock ──────────────────────────────────────────────────────────────
jest.mock("@shared/components/Payment/helper", () => ({
  ContractSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
}));

import Contract from "@shared/components/Payment/Contract";

const makeField = (value: string = "") => ({
  state: { value, meta: { errors: [] } },
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  name: "field",
});

const mockForm = {
  Field: ({ children, name }: any) => children(makeField()),
  state: { values: {} },
} as any;

describe("Contract", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<Contract form={mockForm} language="en" />);
  });

  it("renders contract date label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("Contract date")).toBeTruthy();
  });

  it("renders contract number label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("Contract number")).toBeTruthy();
  });

  it("renders registration fees label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("Contract registration fees")).toBeTruthy();
  });

  it("renders amount in words label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("Amount in words")).toBeTruthy();
  });

  it("renders start date label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("Start date")).toBeTruthy();
  });

  it("renders end date label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("End Date")).toBeTruthy();
  });

  it("renders emergency number label", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByText("Emergency Number")).toBeTruthy();
  });

  it("renders tenancy contract type radio options", () => {
    render(<Contract form={mockForm} language="en" />);
    expect(screen.getByTestId("radio-field-tenancy-new")).toBeTruthy();
    expect(screen.getByTestId("radio-field-tenancy-renew")).toBeTruthy();
  });

  it("renders Arabic label for contract type when language=ar", () => {
    render(<Contract form={mockForm} language="ar" />);
    expect(screen.getByText("نوع عقد الايجار")).toBeTruthy();
  });

  it("does not crash when onLiveValidate is not provided", () => {
    render(<Contract form={mockForm} language="en" />);
  });
});
