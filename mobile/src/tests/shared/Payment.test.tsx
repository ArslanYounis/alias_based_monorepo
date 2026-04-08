/**
 * Tests for the shared Payment component.
 * Covers: payment/no-payment toggle, step navigation, submit callbacks,
 * loading state, Arabic language, draft save, and form remarks validation.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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

// ── TanStack Form mock ───────────────────────────────────────────────────────
jest.mock("@tanstack/react-form", () => ({
  useForm: jest.fn(() => ({
    Field: ({ children, name }: any) =>
      children({
        state: { value: name === "tenancyRemarks" ? "" : "", meta: { errors: [] } },
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        name,
      }),
    handleSubmit: jest.fn(),
    Subscribe: ({ children }: any) =>
      children({ canSubmit: true, isSubmitting: false }),
    state: { values: { tenancyRemarks: "" } },
    reset: jest.fn(),
  })),
}));

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Container: ({ children, ...p }: any) => React.createElement(View, p, children) };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Text: ({ children, ...p }: any) => React.createElement(Text, p, children) };
});
jest.mock("@platform/Fields", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Fields: (p: any) => React.createElement(View, { testID: "fields" }) };
});
jest.mock("@platform/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Label: ({ label }: any) => React.createElement(Text, null, label) };
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Buttons: ({ title, onClick, disabled }: any) =>
      React.createElement(
        View,
        { testID: `btn-${title}`, onPress: onClick, disabled },
        React.createElement(Text, null, title)
      ),
  };
});
jest.mock("@platform/RadioCard", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioCard: ({ label, label_ar, language, onClick, id }: any) => {
      const displayLabel = language === "ar" && label_ar ? label_ar : label;
      return React.createElement(
        TouchableOpacity,
        { testID: `radio-card-${id}`, onPress: () => onClick?.(id) },
        React.createElement(Text, null, displayLabel)
      );
    },
  };
});
jest.mock("@platform/icons", () => ({
  PaymentIcon: () => null,
  NoPaymentIcon: () => null,
  CalendarIcon: () => null,
}));

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/CardTitle/CardTitle", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title }: any) =>
      React.createElement(Text, { testID: "card-title" }, title),
  };
});
jest.mock("@shared/components/Payment/Contract", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "contract-step" }),
  };
});
jest.mock("@shared/components/Payment/Measurement", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "measurement-step" }),
  };
});
jest.mock("@shared/components/Payment/Insurance", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "insurance-step" }),
  };
});
jest.mock("@shared/components/Payment/Rent", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "rent-step" }),
  };
});
jest.mock("@shared/components/Payment/helper", () => ({
  RentSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
  ContractSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
  InsuranceSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
  MeasurementSchema: { _def: {}, safeParse: jest.fn(() => ({ success: true, data: {} })) },
}));

import Payment from "@shared/components/Payment/Payment";

describe("Payment", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing with default props", () => {
    render(<Payment />);
  });

  it("renders Payment and No Payment radio cards", () => {
    render(<Payment />);
    expect(screen.getByTestId("radio-card-payment")).toBeTruthy();
    expect(screen.getByTestId("radio-card-no-payment")).toBeTruthy();
  });

  it("shows contract step (step 0) by default when Payment is selected", () => {
    render(<Payment />);
    expect(screen.getByTestId("contract-step")).toBeTruthy();
  });

  it("renders footer buttons: Continue Later, Back, Next", () => {
    render(<Payment />);
    expect(screen.getByTestId("btn-Continue Later")).toBeTruthy();
    expect(screen.getByTestId("btn-Back")).toBeTruthy();
    expect(screen.getByTestId("btn-Next")).toBeTruthy();
  });

  it("shows loading text when isStepInfoPending=true at step 0", () => {
    render(<Payment isStepInfoPending={true} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("calls onSaveDraft when Continue Later button is pressed", () => {
    const onSaveDraft = jest.fn();
    render(<Payment onSaveDraft={onSaveDraft} />);
    fireEvent.press(screen.getByTestId("btn-Continue Later"));
    expect(onSaveDraft).toHaveBeenCalledTimes(1);
  });

  it("switches to No Payment mode when no-payment card is pressed", () => {
    render(<Payment />);
    fireEvent.press(screen.getByTestId("radio-card-no-payment"));
    expect(screen.getByText("Remarks")).toBeTruthy();
  });

  it("shows Submit button text when on last step (step 3)", () => {
    render(<Payment />);
    // Click Next 3 times to reach last step
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Next"));
    expect(screen.getByTestId("btn-Submit")).toBeTruthy();
  });

  it("shows Submit button in No Payment mode", () => {
    render(<Payment />);
    fireEvent.press(screen.getByTestId("radio-card-no-payment"));
    expect(screen.getByTestId("btn-Submit")).toBeTruthy();
  });

  it("disables primary button when isPaymentSubmitting=true", () => {
    render(<Payment isPaymentSubmitting={true} />);
    const btn = screen.getByTestId("btn-Next");
    expect(btn.props.disabled).toBe(true);
  });

  it("renders in Arabic language", () => {
    render(<Payment language="ar" />);
    expect(screen.getByText("الدفع")).toBeTruthy();
  });

  it("renders with mobile platform", () => {
    render(<Payment platform="mobile" />);
    expect(screen.getByTestId("radio-card-payment")).toBeTruthy();
  });

  it("Back button is disabled at step 0", () => {
    render(<Payment />);
    const backBtn = screen.getByTestId("btn-Back");
    expect(backBtn.props.disabled).toBe(true);
  });

  it("advances from step 0 to step 1 on Next press", () => {
    render(<Payment />);
    fireEvent.press(screen.getByTestId("btn-Next"));
    expect(screen.getByTestId("measurement-step")).toBeTruthy();
  });

  it("advances through steps and reaches insurance step", () => {
    render(<Payment />);
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Next"));
    expect(screen.getByTestId("insurance-step")).toBeTruthy();
  });

  it("goes back from step 1 to step 0 on Back press", () => {
    render(<Payment />);
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Back"));
    expect(screen.getByTestId("contract-step")).toBeTruthy();
  });

  it("calls onPaymentSubmit when Submit is pressed at last step", () => {
    const onPaymentSubmit = jest.fn();
    render(<Payment onPaymentSubmit={onPaymentSubmit} />);
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Next"));
    fireEvent.press(screen.getByTestId("btn-Submit"));
    expect(onPaymentSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders stepInfo data without crashing", () => {
    const stepInfo = {
      result: {
        tenancyContract: {
          type: "New Tenancy",
          contractDate: "2024-01-01",
          contractNumber: "C001",
          ranchTenancyRegistrationFee: "500",
          ranchTenancyRegistrationFeeInWord: "Five Hundred",
          startDate: "2024-01-01",
          endDate: "2025-01-01",
          unitTypeValue: "Square Meters",
          requestLandClassificationId: 1,
          plotId: 123,
          tenancyContractId: 456,
          contractDuration: 12,
        },
        ranchInsuranceFee: "100",
        ranchInsuranceFeeInWord: "One Hundred",
      },
    };
    render(<Payment stepInfo={stepInfo} />);
    expect(screen.getByTestId("contract-step")).toBeTruthy();
  });
});
