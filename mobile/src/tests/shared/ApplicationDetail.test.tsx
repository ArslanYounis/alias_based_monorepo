/**
 * Tests for the shared ApplicationDetail component (current presentational version).
 *
 * The component is now a props-driven card. It renders:
 *  - a CardTitle (title / title_ar) via the `variant="small"` heading
 *  - an optional action button (gated by showButton / onButtonClick)
 *  - an "Application Number" row (always)
 *  - an "Application Date" row (only when applicationDate / applicationDate_ar set)
 *  - a "Reference Number" row (only when referenceNumber / referenceNumber_ar set)
 *  - RTL/LTR direction based on `language`
 *
 * The old hook-driven version (useGetApplicationDetails, owners/plots/documents/
 * interaction-history) no longer exists, so those cases have been rewritten.
 *
 * Container / Text / Buttons / icons / SharedLanguageSwitchRenderer are mocked;
 * the real CardTitle renders (it just composes the same mocked primitives).
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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

// ── Platform components ────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, onClick, dir, ...props }: any) =>
      React.createElement(
        View,
        { ...props, accessibilityLabel: dir, onTouchEnd: onClick },
        children
      ),
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
    Buttons: ({ title, title_ar, language, onClick }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: `btn-${label}`, onPress: onClick },
        React.createElement(Text, null, label)
      );
    },
  };
});

jest.mock("@platform/icons", () => ({
  ChevronDownIcon: () => null,
  ChevronUpIcon: () => null,
}));

// ── Imports ────────────────────────────────────────────────────────────────
import ApplicationDetail from "@shared/components/ApplicationDetail/ApplicationDetail";

// ── Fixtures ───────────────────────────────────────────────────────────────
const fullProps = {
  title: "Land Application",
  title_ar: "طلب الأرض",
  applicationNumber: "APP-2024-001",
  applicationNumber_ar: "APP-2024-001-AR",
  applicationDate: "2024-01-15",
  applicationDate_ar: "٢٠٢٤-٠١-١٥",
  referenceNumber: "REF-001",
  referenceNumber_ar: "REF-001-AR",
  language: "en" as const,
};

describe("ApplicationDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Basic rendering ─────────────────────────────────────────────────────

  it("renders without crashing with no props (defaults)", () => {
    render(<ApplicationDetail />);
    expect(screen.getByText("Application Detail")).toBeTruthy();
  });

  it("renders without crashing with full data", () => {
    render(<ApplicationDetail {...fullProps} />);
  });

  // ── Title ────────────────────────────────────────────────────────────────

  it("renders English title", () => {
    render(<ApplicationDetail {...fullProps} />);
    expect(screen.getByText("Land Application")).toBeTruthy();
  });

  it("renders Arabic title when language='ar'", () => {
    render(<ApplicationDetail {...fullProps} language="ar" />);
    expect(screen.getByText("طلب الأرض")).toBeTruthy();
  });

  it("renders default Arabic title when language='ar' and no title provided", () => {
    render(<ApplicationDetail language="ar" />);
    expect(screen.getByText("تفاصيل الطلب")).toBeTruthy();
  });

  // ── Detail labels ──────────────────────────────────────────────────────────

  it("renders English detail labels", () => {
    render(<ApplicationDetail {...fullProps} />);
    expect(screen.getByText("Application Number")).toBeTruthy();
    expect(screen.getByText("Application Date")).toBeTruthy();
    expect(screen.getByText("Reference Number")).toBeTruthy();
  });

  it("renders Arabic detail labels when language='ar'", () => {
    render(<ApplicationDetail {...fullProps} language="ar" />);
    expect(screen.getByText("رقم الطلب")).toBeTruthy();
    expect(screen.getByText("تاريخ الطلب")).toBeTruthy();
    expect(screen.getByText("رقم المرجع")).toBeTruthy();
  });

  // ── Application number ─────────────────────────────────────────────────────

  it("renders application number (English)", () => {
    render(<ApplicationDetail {...fullProps} />);
    expect(screen.getByText("APP-2024-001")).toBeTruthy();
  });

  it("renders Arabic application number when language='ar'", () => {
    render(<ApplicationDetail {...fullProps} language="ar" />);
    expect(screen.getByText("APP-2024-001-AR")).toBeTruthy();
  });

  // ── Application date row (conditional) ─────────────────────────────────────

  it("renders application date when provided", () => {
    render(<ApplicationDetail {...fullProps} />);
    expect(screen.getByText("2024-01-15")).toBeTruthy();
  });

  it("does not render Application Date row when date is absent", () => {
    render(
      <ApplicationDetail
        title="X"
        applicationNumber="A-1"
        applicationDate=""
        applicationDate_ar=""
        referenceNumber=""
        referenceNumber_ar=""
      />
    );
    expect(screen.queryByText("Application Date")).toBeNull();
  });

  // ── Reference number row (conditional) ─────────────────────────────────────

  it("renders reference number when provided", () => {
    render(<ApplicationDetail {...fullProps} />);
    expect(screen.getByText("REF-001")).toBeTruthy();
  });

  it("does not render Reference Number row when reference is absent", () => {
    render(
      <ApplicationDetail
        title="X"
        applicationNumber="A-1"
        applicationDate="2024-01-15"
        referenceNumber=""
        referenceNumber_ar=""
      />
    );
    expect(screen.queryByText("Reference Number")).toBeNull();
  });

  it("renders only the Application Number row when date and reference absent", () => {
    render(
      <ApplicationDetail
        title="X"
        applicationNumber="A-1"
        applicationDate=""
        applicationDate_ar=""
        referenceNumber=""
        referenceNumber_ar=""
      />
    );
    expect(screen.getByText("Application Number")).toBeTruthy();
    expect(screen.queryByText("Application Date")).toBeNull();
    expect(screen.queryByText("Reference Number")).toBeNull();
  });

  // ── Action button (gated by showButton) ────────────────────────────────────

  it("renders the action button with default title 'View' when showButton=true", () => {
    render(<ApplicationDetail {...fullProps} showButton={true} />);
    expect(screen.getByTestId("btn-View")).toBeTruthy();
  });

  it("renders a custom button title", () => {
    render(
      <ApplicationDetail {...fullProps} showButton={true} buttonTitle="Open" />
    );
    expect(screen.getByTestId("btn-Open")).toBeTruthy();
  });

  it("renders Arabic button title when language='ar'", () => {
    render(<ApplicationDetail {...fullProps} language="ar" showButton={true} />);
    expect(screen.getByTestId("btn-عرض")).toBeTruthy();
  });

  it("does not render the action button when showButton=false", () => {
    render(<ApplicationDetail {...fullProps} showButton={false} />);
    expect(screen.queryByTestId("btn-View")).toBeNull();
  });

  it("calls onButtonClick when the action button is pressed", () => {
    const onButtonClick = jest.fn();
    render(
      <ApplicationDetail
        {...fullProps}
        showButton={true}
        onButtonClick={onButtonClick}
      />
    );
    fireEvent.press(screen.getByTestId("btn-View"));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  // ── Direction (RTL / LTR) ──────────────────────────────────────────────────

  it("renders LTR direction by default", () => {
    render(<ApplicationDetail {...fullProps} />);
    expect(screen.getAllByLabelText("ltr").length).toBeGreaterThanOrEqual(1);
  });

  it("renders RTL direction when language='ar'", () => {
    render(<ApplicationDetail {...fullProps} language="ar" />);
    expect(screen.getAllByLabelText("rtl").length).toBeGreaterThanOrEqual(1);
  });
});
