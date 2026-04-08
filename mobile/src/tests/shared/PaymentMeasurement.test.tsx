/**
 * Tests for the shared Measurement step component.
 * Covers: rendering, ranch type options, rent fee calculation hook call,
 * unit radio options, Arabic language.
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

// ── Hook mocks ───────────────────────────────────────────────────────────────
const mockCalculateRentFees = jest.fn();
jest.mock("@shared/hooks/useCalculateRentFees", () => ({
  useCalculateRentFees: jest.fn(() => ({ mutate: mockCalculateRentFees, isPending: false })),
}));

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
jest.mock("@platform/icons", () => ({ CalendarIcon: () => null }));

// ── Schema mock ──────────────────────────────────────────────────────────────
jest.mock("@shared/components/Payment/helper", () => ({
  MeasurementSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
}));

import Measurement from "@shared/components/Payment/Measurement";

const makeField = (value: string = "") => ({
  state: { value, meta: { errors: [] } },
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  name: "field",
});

const mockForm = {
  Field: ({ children, name }: any) => children(makeField()),
  state: { values: { ranchType: "3" } },
} as any;

describe("Measurement", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<Measurement form={mockForm} language="en" />);
  });

  it("renders units of measurement label", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByText("Units of measurement")).toBeTruthy();
  });

  it("renders Square Feet radio option", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByTestId("radio-unit-Square Feet")).toBeTruthy();
  });

  it("renders Square Meters radio option", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByTestId("radio-unit-Square Meters")).toBeTruthy();
  });

  it("renders Ranch Type label", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByText("Ranch Type")).toBeTruthy();
  });

  it("renders Rent fees area per unit label", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByText("Rent fees area per unit (in fils)")).toBeTruthy();
  });

  it("renders Fee amount label", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByText("Fee amount")).toBeTruthy();
  });

  it("renders Amount in words label", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByText("Amount in words")).toBeTruthy();
  });

  it("renders Tenancy Remarks label", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(screen.getByText("Tenancy Remarks")).toBeTruthy();
  });

  it("calls calculateRentFees on mount", () => {
    render(<Measurement form={mockForm} language="en" />);
    expect(mockCalculateRentFees).toHaveBeenCalled();
  });

  it("calls calculateRentFees with plotId and classificationId from data", () => {
    render(
      <Measurement
        form={mockForm}
        language="en"
        data={{ plotId: 10, requestLandClassificationId: 5 }}
      />
    );
    expect(mockCalculateRentFees).toHaveBeenCalledWith(
      expect.objectContaining({ plotId: 10, ranchLandClassificationId: 5 }),
      expect.any(Object)
    );
  });

  it("renders Arabic label when language=ar", () => {
    render(<Measurement form={mockForm} language="ar" />);
    expect(screen.getByText("وحدة القياس")).toBeTruthy();
  });

  it("renders without onRentFeesCalculated prop", () => {
    render(<Measurement form={mockForm} language="en" data={{ plotId: 1, requestLandClassificationId: 1 }} />);
    expect(screen.getByText("Ranch Type")).toBeTruthy();
  });
});
