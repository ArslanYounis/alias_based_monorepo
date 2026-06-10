/**
 * Tests for the shared PaymentOverride component.
 *
 * @tanstack/react-form and all platform UI components are mocked so no
 * native dependencies are needed. Branches covered:
 *  - renders title, description, static info rows
 *  - language='en' vs language='ar' label/value rendering
 *  - form fields rendered (referenceNumber, receiptDate, amount, ignoreDuplicate)
 *  - field onChange calls field.handleChange and validateField
 *  - Submit button: disabled when isLoading=true
 *  - Submit button: disabled when isSubmitting=true (internal state)
 *  - handleFormSubmit calls form.handleSubmit
 *  - onSubmit called with correct values on valid form
 *  - custom labels override defaultLabels
 *  - PaymentFee displayed
 *  - isRTL class applied when language='ar'
 *  - ignoreDuplicate checkbox toggle
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";

// ── All jest.mock calls MUST come before any component imports ──────────────

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

// ── TanStack Form mock ─────────────────────────────────────────────────────
// The mock is defined before the component import.
// Each call to useForm returns a fresh instance with controllable handleSubmit.
const mockHandleSubmit = jest.fn();
const mockFieldHandleChange = jest.fn();
const mockFieldHandleBlur = jest.fn();

jest.mock("@tanstack/react-form", () => ({
  useForm: jest.fn(({ onSubmit }: any) => ({
    Field: ({ children, name }: any) =>
      children({
        state: {
          value: name === "ignoreDuplicate" ? true : "",
          meta: { errors: [] },
        },
        handleChange: mockFieldHandleChange,
        handleBlur: mockFieldHandleBlur,
        name,
      }),
    handleSubmit: jest.fn(async () => {
      await onSubmit?.({
        value: {
          referenceNumber: "REF-001",
          receiptDate: "2024-01-15",
          amount: "500",
          ignoreDuplicate: true,
        },
      });
    }),
    state: {
      values: {
        referenceNumber: "",
        receiptDate: "",
        amount: "",
        ignoreDuplicate: true,
      },
    },
    Subscribe: ({ children, selector }: any) =>
      children(
        selector
          ? selector({ canSubmit: true, isSubmitting: false })
          : { canSubmit: true, isSubmitting: false }
      ),
  })),
}));

// ── Platform components ────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, className, ...props }: any) =>
      React.createElement(View, { ...props, testID: className }, children),
  };
});

jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({
      title,
      title_ar,
      language,
      onClick,
      disabled,
    }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: `btn-${label}`, onPress: onClick, disabled },
        React.createElement(Text, null, label)
      );
    },
  };
});

jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View, TextInput, Text } = require("react-native");
  return {
    TextInput: ({
      label,
      label_ar,
      language,
      value,
      onChange,
      hasError,
      errorMessage,
      testID,
    }: any) => {
      const displayLabel = language === "ar" && label_ar ? label_ar : label;
      return React.createElement(
        View,
        { testID: testID ?? `input-${displayLabel}` },
        React.createElement(Text, null, displayLabel),
        React.createElement(TextInput, {
          testID: `text-input-${displayLabel}`,
          value: value ?? "",
          onChangeText: onChange,
        }),
        hasError
          ? React.createElement(
              Text,
              { testID: `error-${displayLabel}` },
              errorMessage
            )
          : null
      );
    },
  };
});

jest.mock("@platform/CheckboxField", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    CheckboxField: ({
      id,
      checked,
      onChange,
      label,
      label_ar,
      language,
    }: any) => {
      const displayLabel = language === "ar" && label_ar ? label_ar : label;
      return React.createElement(
        TouchableOpacity,
        {
          testID: `checkbox-${id}`,
          onPress: () => onChange?.(id, !checked),
        },
        React.createElement(Text, null, displayLabel),
        React.createElement(Text, { testID: `checkbox-state-${id}` }, String(checked))
      );
    },
  };
});

// ── Zod mock: use the real zod so schema validation works ──────────────────
// No mock needed for zod — it's a pure JS library with no native deps.

// ── Imports ────────────────────────────────────────────────────────────────
import PaymentOverride from "@shared/components/PaymentDetails/PaymentOverride";
import { useForm } from "@tanstack/react-form";

const mockUseForm = useForm as jest.Mock;

// ── Fixtures ───────────────────────────────────────────────────────────────
const defaultProps = {
  title: "Payment Override",
  title_ar: "تجاوز الدفع",
  description: "Search for the customer who wants to have the ranch land allocated to them.",
  description_ar: "ابحث عن العميل الذي يرغب في تخصيص أرض المزرعة له.",
  ServiceName: "Registration Service",
  ServiceName_ar: "خدمة التسجيل",
  applicationNo: "APP-001",
  applicationNo_ar: "طلب-001",
  PaymentFee: "500",
  PaymentFee_ar: "٥٠٠",
  language: "en" as const,
  isLoading: false,
  onSubmit: jest.fn(),
};

describe("PaymentOverride", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Basic render ──────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<PaymentOverride {...defaultProps} />);
  });

  it("renders English title", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Payment Override")).toBeTruthy();
  });

  it("renders Arabic title when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    // "تجاوز الدفع" appears in both title and submit button; check at least one
    expect(screen.getAllByText("تجاوز الدفع").length).toBeGreaterThanOrEqual(1);
  });

  it("renders description", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(
      screen.getByText(
        "Search for the customer who wants to have the ranch land allocated to them."
      )
    ).toBeTruthy();
  });

  it("renders Arabic description when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(
      screen.getByText(
        "ابحث عن العميل الذي يرغب في تخصيص أرض المزرعة له."
      )
    ).toBeTruthy();
  });

  // ── Static info rows ──────────────────────────────────────────────────────

  it("renders Payment Name label", () => {
    // Default serviceName label changed from "Service Name" to "Payment Name".
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Payment Name")).toBeTruthy();
  });

  it("renders Arabic Payment Name label when language='ar'", () => {
    // Default serviceName_ar label changed to "اسم خدمة الدفع".
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByText("اسم خدمة الدفع")).toBeTruthy();
  });

  it("renders ServiceName value", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Registration Service")).toBeTruthy();
  });

  it("renders Arabic ServiceName value when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByText("خدمة التسجيل")).toBeTruthy();
  });

  it("renders Application Number label", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Application Number")).toBeTruthy();
  });

  it("renders Arabic Application Number label when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByText("رقم الطلب")).toBeTruthy();
  });

  it("renders applicationNo value", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("APP-001")).toBeTruthy();
  });

  it("renders Payment Fee label", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Payment Fee")).toBeTruthy();
  });

  it("renders Arabic Payment Fee label when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByText("رسوم الدفع")).toBeTruthy();
  });

  it("renders PaymentFee value", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("500")).toBeTruthy();
  });

  it("renders Arabic PaymentFee value when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByText("٥٠٠")).toBeTruthy();
  });

  // ── Form fields rendered ──────────────────────────────────────────────────

  it("renders Reference Number input", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Reference Number")).toBeTruthy();
  });

  it("renders Receipt Date input", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Receipt Date")).toBeTruthy();
  });

  it("renders Amount input", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByText("Amount")).toBeTruthy();
  });

  it("renders Ignore duplicate checkbox", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByTestId("checkbox-ignore-duplicate")).toBeTruthy();
  });

  it("renders Arabic field labels when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByText("الرقم المرجعي")).toBeTruthy();
    expect(screen.getByText("تاريخ الإيصال")).toBeTruthy();
    expect(screen.getByText("المبلغ")).toBeTruthy();
    expect(screen.getByText("تجاهل رقم الإيصال المكرر")).toBeTruthy();
  });

  // ── Submit button ──────────────────────────────────────────────────────────

  it("renders Override Payment submit button", () => {
    render(<PaymentOverride {...defaultProps} />);
    expect(screen.getByTestId("btn-Override Payment")).toBeTruthy();
  });

  it("renders Arabic submit button label when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    expect(screen.getByTestId("btn-تجاوز الدفع")).toBeTruthy();
  });

  it("submit button is disabled when isLoading=true", () => {
    render(<PaymentOverride {...defaultProps} isLoading={true} />);
    const btn = screen.getByTestId("btn-Override Payment");
    // TouchableOpacity renders disabled as accessibilityState.disabled or as the disabled prop
    const isDisabled =
      btn.props.disabled === true ||
      btn.props.accessibilityState?.disabled === true;
    expect(isDisabled).toBe(true);
  });

  it("submit button is enabled when isLoading=false", () => {
    render(<PaymentOverride {...defaultProps} isLoading={false} />);
    const btn = screen.getByTestId("btn-Override Payment");
    // disabled should be falsy (undefined or false) when isLoading=false and not submitting
    const isDisabled =
      btn.props.disabled === true ||
      btn.props.accessibilityState?.disabled === true;
    expect(isDisabled).toBe(false);
  });

  // ── handleFormSubmit ──────────────────────────────────────────────────────

  it("calls form.handleSubmit when Override Payment is pressed", async () => {
    const onSubmit = jest.fn();
    render(<PaymentOverride {...defaultProps} onSubmit={onSubmit} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Override Payment"));
    });
    // handleSubmit was called via useForm mock which calls onSubmit({ value: ... })
    // onSubmit is called when the mock form runs its onSubmit handler
    expect(onSubmit).toHaveBeenCalledWith({
      referenceNumber: "REF-001",
      receiptDate: "2024-01-15",
      amount: "500",
      ignoreDuplicate: true,
    });
  });

  it("does not crash when onSubmit is not provided and form is submitted", async () => {
    render(
      <PaymentOverride
        {...defaultProps}
        onSubmit={undefined}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Override Payment"));
    });
  });

  // ── Checkbox toggle ───────────────────────────────────────────────────────

  it("calls field.handleChange when checkbox is toggled", () => {
    render(<PaymentOverride {...defaultProps} />);
    fireEvent.press(screen.getByTestId("checkbox-ignore-duplicate"));
    expect(mockFieldHandleChange).toHaveBeenCalled();
  });

  it("shows initial checkbox state as true (default ignoreDuplicate)", () => {
    render(<PaymentOverride {...defaultProps} />);
    // The checkbox-state testID shows the current checked value
    expect(screen.getByTestId("checkbox-state-ignore-duplicate").props.children).toBe("true");
  });

  // ── Custom labels ─────────────────────────────────────────────────────────

  it("renders custom label overrides", () => {
    const customLabels = {
      serviceName: "Custom Service",
      applicationNumber: "Custom AppNo",
      paymentFee: "Custom Fee",
      referenceNumber: "Custom Ref",
      receiptDate: "Custom Date",
      amount: "Custom Amount",
      rentPaymentsFree: "Custom Ignore",
    };
    render(<PaymentOverride {...defaultProps} labels={customLabels} />);
    expect(screen.getByText("Custom Service")).toBeTruthy();
    expect(screen.getByText("Custom AppNo")).toBeTruthy();
    expect(screen.getByText("Custom Fee")).toBeTruthy();
    expect(screen.getByText("Custom Ref")).toBeTruthy();
    expect(screen.getByText("Custom Date")).toBeTruthy();
    expect(screen.getByText("Custom Amount")).toBeTruthy();
    expect(screen.getByText("Custom Ignore")).toBeTruthy();
  });

  // ── PaymentFee edge cases (paymentFeeNumber) ──────────────────────────────

  it("renders with PaymentFee='0' (zero amount)", () => {
    render(<PaymentOverride {...defaultProps} PaymentFee="0" />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("renders with non-numeric PaymentFee (paymentFeeNumber=null branch)", () => {
    render(<PaymentOverride {...defaultProps} PaymentFee="not-a-number" />);
    expect(screen.getByText("not-a-number")).toBeTruthy();
  });

  // ── isRTL rendered without crash ──────────────────────────────────────────

  it("renders RTL container when language='ar'", () => {
    render(<PaymentOverride {...defaultProps} language="ar" />);
    // The outer container has className="rtl" when language='ar'.
    // Our Container mock sets testID = className. Check it exists.
    expect(screen.getByTestId("rtl")).toBeTruthy();
  });

  it("renders LTR container when language='en'", () => {
    render(<PaymentOverride {...defaultProps} language="en" />);
    expect(screen.getByTestId("ltr")).toBeTruthy();
  });

  // ── Missing optional Arabic props ────────────────────────────────────────

  it("renders without crashing when Arabic props are undefined", () => {
    render(
      <PaymentOverride
        title="Override"
        description="Desc"
        ServiceName="Service"
        applicationNo="APP"
        PaymentFee="100"
        language="en"
      />
    );
  });

  it("falls back to PaymentFee when PaymentFee_ar is undefined and language='ar'", () => {
    render(
      <PaymentOverride
        {...defaultProps}
        PaymentFee_ar={undefined}
        language="ar"
      />
    );
    // The component passes `PaymentFee_ar ?? PaymentFee` so will render "500"
    expect(screen.getByText("500")).toBeTruthy();
  });

  // ── validateField via TextInput onChange ─────────────────────────────────────
  // platform="mobile" makes the mock TextInput render labelled testIDs.

  it("shows a validation error on the Amount field when value is below the fee", () => {
    // PaymentFee=500; entering "100" fails the >= refine -> error set for amount.
    render(<PaymentOverride {...defaultProps} platform="mobile" />);
    act(() => {
      fireEvent.changeText(screen.getByTestId("text-input-Amount"), "100");
    });
    expect(mockFieldHandleChange).toHaveBeenCalledWith("100");
    expect(screen.getByTestId("error-Amount")).toBeTruthy();
  });

  it("shows a validation error on Amount when value is not a number", () => {
    render(<PaymentOverride {...defaultProps} platform="mobile" />);
    act(() => {
      fireEvent.changeText(screen.getByTestId("text-input-Amount"), "abc");
    });
    expect(screen.getByTestId("error-Amount")).toBeTruthy();
  });

  it("does not error the Reference Number field for a valid value", () => {
    render(<PaymentOverride {...defaultProps} platform="mobile" />);
    act(() => {
      fireEvent.changeText(
        screen.getByTestId("text-input-Reference Number"),
        "REF-123"
      );
    });
    expect(mockFieldHandleChange).toHaveBeenCalledWith("REF-123");
    expect(screen.queryByTestId("error-Reference Number")).toBeNull();
  });

  it("clears a previously set field error when a valid value is entered", () => {
    render(<PaymentOverride {...defaultProps} platform="mobile" />);
    // First set an error on amount
    act(() => {
      fireEvent.changeText(screen.getByTestId("text-input-Amount"), "1");
    });
    expect(screen.getByTestId("error-Amount")).toBeTruthy();
    // Then enter a valid amount (>= 500) which clears it
    act(() => {
      fireEvent.changeText(screen.getByTestId("text-input-Amount"), "600");
    });
    expect(screen.queryByTestId("error-Amount")).toBeNull();
  });

  it("validates the Receipt Date field via onChange", () => {
    render(<PaymentOverride {...defaultProps} platform="mobile" />);
    act(() => {
      fireEvent.changeText(
        screen.getByTestId("text-input-Receipt Date"),
        "2024-02-02"
      );
    });
    expect(mockFieldHandleChange).toHaveBeenCalledWith("2024-02-02");
  });

  it("validates with non-numeric PaymentFee (paymentFeeNumber=null amount refine)", () => {
    // With a null fee, the >= refine always passes; "10" only needs to be numeric.
    render(
      <PaymentOverride {...defaultProps} PaymentFee="abc" platform="mobile" />
    );
    act(() => {
      fireEvent.changeText(screen.getByTestId("text-input-Amount"), "10");
    });
    expect(screen.queryByTestId("error-Amount")).toBeNull();
  });

  // ── form.onSubmit failure path (safeParse fails -> setErrors) ─────────────────

  it("sets field errors when submitted form values are invalid", async () => {
    // Override useForm so its onSubmit receives invalid (empty) values.
    mockUseForm.mockImplementationOnce(({ onSubmit }: any) => ({
      Field: ({ children, name }: any) =>
        children({
          state: { value: name === "ignoreDuplicate" ? true : "", meta: { errors: [] } },
          handleChange: mockFieldHandleChange,
          handleBlur: mockFieldHandleBlur,
          name,
        }),
      handleSubmit: jest.fn(async () => {
        await onSubmit?.({
          value: {
            referenceNumber: "",
            receiptDate: "",
            amount: "",
            ignoreDuplicate: true,
          },
        });
      }),
      state: {
        values: {
          referenceNumber: "",
          receiptDate: "",
          amount: "",
          ignoreDuplicate: true,
        },
      },
    }));

    render(<PaymentOverride {...defaultProps} platform="mobile" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Override Payment"));
    });
    // safeParse fails for empty required fields -> errors rendered on inputs.
    expect(screen.getByTestId("error-Reference Number")).toBeTruthy();
    expect(screen.getByTestId("error-Receipt Date")).toBeTruthy();
    expect(screen.getByTestId("error-Amount")).toBeTruthy();
  });

  it("uses Arabic validation messages when language='ar' on invalid submit", async () => {
    mockUseForm.mockImplementationOnce(({ onSubmit }: any) => ({
      Field: ({ children, name }: any) =>
        children({
          state: { value: name === "ignoreDuplicate" ? true : "", meta: { errors: [] } },
          handleChange: mockFieldHandleChange,
          handleBlur: mockFieldHandleBlur,
          name,
        }),
      handleSubmit: jest.fn(async () => {
        await onSubmit?.({
          value: { referenceNumber: "", receiptDate: "", amount: "", ignoreDuplicate: true },
        });
      }),
      state: {
        values: { referenceNumber: "", receiptDate: "", amount: "", ignoreDuplicate: true },
      },
    }));

    render(<PaymentOverride {...defaultProps} language="ar" platform="mobile" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-تجاوز الدفع"));
    });
    expect(screen.getByText("حقل رقم المرجع مطلوب")).toBeTruthy();
  });
});
