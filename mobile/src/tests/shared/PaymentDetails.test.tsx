/**
 * Tests for the shared PaymentDetails component.
 *
 * All hooks (useVerifyPayment, useOverridePayment, usePrintPaymentSlip),
 * useDownload, and sub-components (GenericCard, CustomDrawer, PaymentOverride)
 * are mocked. Branches covered:
 *  - isLoading=true → loading view
 *  - empty payments → no cards rendered
 *  - payment without receiptNumber → verify + override buttons shown
 *  - payment with receiptNumber + receiptDate → only print slip button shown
 *  - print pay slip button click → printPaymentSlip mutate called
 *  - verify pay slip button click → verifyPayment mutate called, onVerifyComplete fired
 *  - override payment button click → selectedPayment set (drawer opens)
 *  - drawer open state and PaymentOverride rendered
 *  - closing drawer → selectedPayment cleared
 *  - onOverrideComplete called on successful override
 *  - showButtons=true with buttons array → footer buttons rendered
 *  - showButtons=false → footer buttons hidden
 *  - language='en' vs 'ar'
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

jest.mock("@shared/hooks/useVerifyPayment", () => ({
  useVerifyPayment: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

jest.mock("@shared/hooks/useOverridePayment", () => ({
  useOverridePayment: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@shared/hooks/usePrintPaymentSlip", () => ({
  usePrintPaymentSlip: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

jest.mock("@platform/sharedHooks/useDownload", () => ({
  useDownload: jest.fn(() => ({ download: jest.fn() })),
}));

// ── Platform components ────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
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
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: `btn-${label}`, onPress: onClick, disabled },
        React.createElement(Text, null, label)
      );
    },
  };
});

jest.mock("@platform/CustomDrawer/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CustomDrawer: ({ children, open, onOpenChange }: any) => {
      if (!open) return null;
      return React.createElement(
        View,
        { testID: "custom-drawer" },
        React.createElement(
          View,
          {
            testID: "drawer-close",
            // Expose a way for tests to trigger close
            accessible: true,
          },
          null
        ),
        children
      );
    },
  };
});

// ── Shared sub-components ──────────────────────────────────────────────────
jest.mock("@shared/components/GenericCard", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title, status }: any) =>
      React.createElement(
        View,
        { testID: "generic-card" },
        React.createElement(Text, null, title),
        React.createElement(Text, { testID: `status-${status}` }, status)
      ),
  };
});

jest.mock("@shared/components/PaymentDetails/PaymentOverride", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: ({ onSubmit, title }: any) =>
      React.createElement(
        View,
        { testID: "payment-override" },
        React.createElement(Text, null, title),
        React.createElement(
          TouchableOpacity,
          {
            testID: "submit-override",
            onPress: () =>
              onSubmit?.({
                referenceNumber: "REF-123",
                receiptDate: "2024-01-01",
                amount: "500",
                ignoreDuplicate: false,
              }),
          },
          React.createElement(Text, null, "Submit")
        )
      ),
  };
});

// ── Imports ────────────────────────────────────────────────────────────────
import PaymentDetails from "@shared/components/PaymentDetails/PaymentDetails";
import { useVerifyPayment } from "@shared/hooks/useVerifyPayment";
import { useOverridePayment } from "@shared/hooks/useOverridePayment";
import { usePrintPaymentSlip } from "@shared/hooks/usePrintPaymentSlip";
import { useDownload } from "@platform/sharedHooks/useDownload";

const mockUseVerifyPayment = useVerifyPayment as jest.Mock;
const mockUseOverridePayment = useOverridePayment as jest.Mock;
const mockUsePrintPaymentSlip = usePrintPaymentSlip as jest.Mock;
const mockUseDownload = useDownload as jest.Mock;

// ── Fixtures ───────────────────────────────────────────────────────────────
const unpaidPayment = {
  applicationPaymentId: "1",
  municipalityId: "10",
  paymentDescriptionE: "Registration Fee",
  paymentDescriptionA: "رسوم التسجيل",
  municipalityNameE: "Central Municipality",
  municipalityNameA: "البلدية المركزية",
  paidByName: "John Smith",
  receiptNumber: undefined,
  receiptDate: undefined,
  amountDue: "500.00",
  amountInWords: "Five hundred",
  vatAmount: "75.00",
};

const paidPayment = {
  ...unpaidPayment,
  applicationPaymentId: "2",
  receiptNumber: "RCT-001",
  receiptDate: "2024-01-15",
};

const baseProps = {
  applicationId: "APP-001",
  language: "en" as const,
};

describe("PaymentDetails", () => {
  let mockVerifyMutate: jest.Mock;
  let mockOverrideMutate: jest.Mock;
  let mockPrintMutate: jest.Mock;
  let mockDownload: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockVerifyMutate = jest.fn();
    mockOverrideMutate = jest.fn();
    mockPrintMutate = jest.fn();
    mockDownload = jest.fn();

    mockUseVerifyPayment.mockReturnValue({
      mutate: mockVerifyMutate,
      isPending: false,
    });
    mockUseOverridePayment.mockReturnValue({
      mutate: mockOverrideMutate,
      isPending: false,
    });
    mockUsePrintPaymentSlip.mockReturnValue({
      mutate: mockPrintMutate,
      isPending: false,
    });
    mockUseDownload.mockReturnValue({ download: mockDownload });
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it("shows loading message when isLoading=true", () => {
    render(<PaymentDetails {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic loading message when isLoading=true and language='ar'", () => {
    render(<PaymentDetails {...baseProps} isLoading={true} language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeTruthy();
  });

  it("does not render payment cards when loading", () => {
    render(
      <PaymentDetails
        {...baseProps}
        isLoading={true}
        payments={[unpaidPayment]}
      />
    );
    expect(screen.queryByTestId("generic-card")).toBeNull();
  });

  // ── Empty payments ─────────────────────────────────────────────────────────

  it("renders without crashing when payments is empty", () => {
    render(<PaymentDetails {...baseProps} payments={[]} />);
  });

  it("renders without crashing when payments is not provided", () => {
    render(<PaymentDetails {...baseProps} />);
  });

  // ── Payment card rendering ────────────────────────────────────────────────

  it("renders a GenericCard for each payment", () => {
    render(
      <PaymentDetails
        {...baseProps}
        payments={[unpaidPayment, paidPayment]}
      />
    );
    expect(screen.getAllByTestId("generic-card").length).toBe(2);
  });

  it("renders payment description as GenericCard title", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    expect(screen.getByText("Registration Fee")).toBeTruthy();
  });

  it("renders status=Pending when receiptNumber is absent", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    expect(screen.getByTestId("status-Pending")).toBeTruthy();
  });

  it("renders status=Paid when receiptNumber is present", () => {
    render(<PaymentDetails {...baseProps} payments={[paidPayment]} />);
    expect(screen.getByTestId("status-Paid")).toBeTruthy();
  });

  // ── Print Pay Slip button ─────────────────────────────────────────────────

  it("renders Print Pay Slip button for all payments", () => {
    render(
      <PaymentDetails
        {...baseProps}
        payments={[unpaidPayment, paidPayment]}
      />
    );
    expect(screen.getAllByTestId("btn-Print Pay Slip").length).toBe(2);
  });

  it("calls printPaymentSlip mutate when Print Pay Slip is pressed", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Print Pay Slip"));
    expect(mockPrintMutate).toHaveBeenCalledTimes(1);
    expect(mockPrintMutate).toHaveBeenCalledWith(
      {
        payload: { applicationPaymentId: 1 },
        args: "APP-001",
      },
      expect.objectContaining({ onSuccess: expect.any(Function), onSettled: expect.any(Function) })
    );
  });

  it("calls download when printPaymentSlip onSuccess returns downloadUrl", () => {
    mockPrintMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess({ result: { downloadUrl: "https://example.com/slip.pdf" } });
    });
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Print Pay Slip"));
    expect(mockDownload).toHaveBeenCalledWith("https://example.com/slip.pdf");
  });

  it("does not call download when printPaymentSlip onSuccess has no downloadUrl", () => {
    mockPrintMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess({ result: {} });
    });
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Print Pay Slip"));
    expect(mockDownload).not.toHaveBeenCalled();
  });

  // ── Verify Pay Slip button ────────────────────────────────────────────────

  it("renders Verify Pay Slip button when payment is unpaid", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    expect(screen.getByTestId("btn-Verify Pay Slip")).toBeTruthy();
  });

  it("does not render Verify Pay Slip button when payment has receiptNumber and receiptDate", () => {
    render(<PaymentDetails {...baseProps} payments={[paidPayment]} />);
    expect(screen.queryByTestId("btn-Verify Pay Slip")).toBeNull();
  });

  it("calls verifyPayment mutate when Verify Pay Slip is pressed", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Verify Pay Slip"));
    expect(mockVerifyMutate).toHaveBeenCalledTimes(1);
    expect(mockVerifyMutate).toHaveBeenCalledWith(
      {
        payload: {
          ApplicationPaymentId: 1,
          MunicipalityId: 10,
        },
        args: "APP-001",
      },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });

  it("calls onVerifyComplete when verifyPayment succeeds", () => {
    const onVerifyComplete = jest.fn();
    mockVerifyMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess();
    });
    render(
      <PaymentDetails
        {...baseProps}
        payments={[unpaidPayment]}
        onVerifyComplete={onVerifyComplete}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Verify Pay Slip"));
    expect(onVerifyComplete).toHaveBeenCalledTimes(1);
  });

  it("does not crash when onVerifyComplete is not provided", () => {
    mockVerifyMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess();
    });
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Verify Pay Slip"));
  });

  // ── Override Payment button ────────────────────────────────────────────────

  it("renders Override Payment button when payment is unpaid", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    expect(screen.getByTestId("btn-Override Payment")).toBeTruthy();
  });

  it("does not render Override Payment button when payment is paid", () => {
    render(<PaymentDetails {...baseProps} payments={[paidPayment]} />);
    expect(screen.queryByTestId("btn-Override Payment")).toBeNull();
  });

  it("opens CustomDrawer when Override Payment is pressed", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
    fireEvent.press(screen.getByTestId("btn-Override Payment"));
    expect(screen.getByTestId("custom-drawer")).toBeTruthy();
  });

  it("renders PaymentOverride inside drawer when override button pressed", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Override Payment"));
    expect(screen.getByTestId("payment-override")).toBeTruthy();
  });

  it("calls overridePayment mutate when PaymentOverride submits", () => {
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Override Payment"));
    fireEvent.press(screen.getByTestId("submit-override"));
    expect(mockOverrideMutate).toHaveBeenCalledTimes(1);
    expect(mockOverrideMutate).toHaveBeenCalledWith(
      {
        payload: {
          applicationPaymentId: 1,
          receiptNumber: "REF-123",
          receiptDate: "2024-01-01",
          amount: "500",
          duplicateReceiptNumber: false,
        },
        args: "APP-001",
      },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });

  it("closes drawer on successful override", () => {
    mockOverrideMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess();
    });
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Override Payment"));
    expect(screen.getByTestId("custom-drawer")).toBeTruthy();
    fireEvent.press(screen.getByTestId("submit-override"));
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });

  it("calls onOverrideComplete when override succeeds", () => {
    const onOverrideComplete = jest.fn();
    mockOverrideMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess();
    });
    render(
      <PaymentDetails
        {...baseProps}
        payments={[unpaidPayment]}
        onOverrideComplete={onOverrideComplete}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Override Payment"));
    fireEvent.press(screen.getByTestId("submit-override"));
    expect(onOverrideComplete).toHaveBeenCalledTimes(1);
  });

  it("does not crash when onOverrideComplete is not provided", () => {
    mockOverrideMutate.mockImplementation((_args: any, callbacks: any) => {
      callbacks.onSuccess();
    });
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    fireEvent.press(screen.getByTestId("btn-Override Payment"));
    fireEvent.press(screen.getByTestId("submit-override"));
  });

  // ── handleOverrideSubmit: selectedPayment guard ───────────────────────────

  it("does not call overridePayment when selectedPayment is null (guard branch)", () => {
    // Drawer is closed (selectedPayment=null), so PaymentOverride won't even render.
    render(<PaymentDetails {...baseProps} payments={[unpaidPayment]} />);
    // Override drawer not open → overridePayment not called
    expect(mockOverrideMutate).not.toHaveBeenCalled();
  });

  // ── Footer buttons ────────────────────────────────────────────────────────

  it("renders footer buttons when showButtons=true", () => {
    render(
      <PaymentDetails
        {...baseProps}
        showButtons={true}
        buttons={[
          { title: "Submit", type: "primary" },
          { title: "Cancel", type: "secondary" },
        ]}
      />
    );
    expect(screen.getByTestId("btn-Submit")).toBeTruthy();
    expect(screen.getByTestId("btn-Cancel")).toBeTruthy();
  });

  it("does not render footer buttons when showButtons=false", () => {
    render(
      <PaymentDetails
        {...baseProps}
        showButtons={false}
        buttons={[{ title: "Submit", type: "primary" }]}
      />
    );
    expect(screen.queryByTestId("btn-Submit")).toBeNull();
  });

  it("renders no footer buttons when buttons array is empty", () => {
    render(<PaymentDetails {...baseProps} showButtons={true} buttons={[]} />);
    // No footer buttons — just no crash
  });

  // ── Arabic language ───────────────────────────────────────────────────────

  it("renders Arabic button labels when language='ar'", () => {
    render(
      <PaymentDetails
        {...baseProps}
        language="ar"
        payments={[unpaidPayment]}
      />
    );
    expect(screen.getByTestId("btn-طباعة إيصال الدفع")).toBeTruthy();
    expect(screen.getByTestId("btn-تحقق من إيصال الدفع")).toBeTruthy();
    expect(screen.getByTestId("btn-تجاوز الدفع")).toBeTruthy();
  });

  // ── Multiple unpaid payments ──────────────────────────────────────────────

  it("renders verify and override buttons for each unpaid payment", () => {
    const secondUnpaid = {
      ...unpaidPayment,
      applicationPaymentId: "3",
      paymentDescriptionE: "Processing Fee",
    };
    render(
      <PaymentDetails
        {...baseProps}
        payments={[unpaidPayment, secondUnpaid]}
      />
    );
    expect(screen.getAllByTestId("btn-Verify Pay Slip").length).toBe(2);
    expect(screen.getAllByTestId("btn-Override Payment").length).toBe(2);
  });

  // ── drawerSize prop ───────────────────────────────────────────────────────

  it("renders without crashing with drawerSize='layer2'", () => {
    render(
      <PaymentDetails
        {...baseProps}
        payments={[unpaidPayment]}
        drawerSize="layer2"
      />
    );
  });
});
