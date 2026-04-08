/**
 * Tests for the shared ApplicationSummaryDetail component.
 *
 * CardTitle, Buttons, Container, Text, and SharedLanguageSwitchRenderer
 * are mocked. Tests cover: title rendering, button show/hide, button
 * click callback, conditional rows (date and reference number presence),
 * reference number rendered as input-style view, Arabic language switching,
 * and various buttonType values.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Standard language-switch mocks ──────────────────────────────────────────
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

// ── CardTitle mock ────────────────────────────────────────────────────────
jest.mock("@shared/components/CardTitle/CardTitle", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title, title_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "card-title" },
        language === "ar" && title_ar ? title_ar : title
      ),
  };
});

// ── Platform mocks ────────────────────────────────────────────────────────
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

import ApplicationSummaryDetail from "@shared/components/ApplicationSummary/ApplicationSummaryDetail";

describe("ApplicationSummaryDetail", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing with all defaults", () => {
    render(<ApplicationSummaryDetail />);
  });

  it("renders default title 'Application Detail'", () => {
    render(<ApplicationSummaryDetail />);
    expect(screen.getByTestId("card-title")).toBeTruthy();
    expect(screen.getByText("Application Detail")).toBeTruthy();
  });

  it("renders custom title", () => {
    render(<ApplicationSummaryDetail title="Summary" />);
    expect(screen.getByText("Summary")).toBeTruthy();
  });

  it("renders Arabic title when language='ar'", () => {
    render(
      <ApplicationSummaryDetail
        title="Application Detail"
        title_ar="تفاصيل الطلب"
        language="ar"
      />
    );
    expect(screen.getByText("تفاصيل الطلب")).toBeTruthy();
  });

  // ── Application Number ────────────────────────────────────────────────────

  it("renders Application Number label", () => {
    render(<ApplicationSummaryDetail applicationNumber="APP-001" />);
    expect(screen.getByText("Application Number")).toBeTruthy();
  });

  it("renders application number value", () => {
    render(<ApplicationSummaryDetail applicationNumber="APP-001" />);
    expect(screen.getByText("APP-001")).toBeTruthy();
  });

  it("renders Arabic application number label when language='ar'", () => {
    render(<ApplicationSummaryDetail language="ar" />);
    expect(screen.getByText("رقم الطلب")).toBeTruthy();
  });

  // ── Application Date (conditional) ───────────────────────────────────────

  it("does not render Application Date row when applicationDate is empty", () => {
    render(<ApplicationSummaryDetail applicationNumber="APP-001" />);
    expect(screen.queryByText("Application Date")).toBeNull();
  });

  it("renders Application Date row when applicationDate is provided", () => {
    render(
      <ApplicationSummaryDetail
        applicationNumber="APP-001"
        applicationDate="2024-01-15"
      />
    );
    expect(screen.getByText("Application Date")).toBeTruthy();
    expect(screen.getByText("2024-01-15")).toBeTruthy();
  });

  it("renders Arabic Application Date label when language='ar'", () => {
    render(
      <ApplicationSummaryDetail applicationDate="2024-01-15" language="ar" />
    );
    expect(screen.getByText("تاريخ الطلب")).toBeTruthy();
  });

  // ── Reference Number (conditional + isInput) ──────────────────────────────

  it("does not render Reference Number row when referenceNumber is empty", () => {
    render(<ApplicationSummaryDetail applicationNumber="APP-001" />);
    expect(screen.queryByText("Reference Number")).toBeNull();
  });

  it("renders Reference Number row when referenceNumber is provided", () => {
    render(
      <ApplicationSummaryDetail
        applicationNumber="APP-001"
        referenceNumber="REF-001"
      />
    );
    expect(screen.getByText("Reference Number")).toBeTruthy();
    expect(screen.getByText("REF-001")).toBeTruthy();
  });

  it("renders Arabic Reference Number label when language='ar'", () => {
    render(
      <ApplicationSummaryDetail referenceNumber="REF-001" language="ar" />
    );
    expect(screen.getByText("رقم المرجع")).toBeTruthy();
  });

  it("renders all three rows when all data provided", () => {
    render(
      <ApplicationSummaryDetail
        applicationNumber="APP-001"
        applicationDate="2024-01-15"
        referenceNumber="REF-001"
      />
    );
    expect(screen.getByText("Application Number")).toBeTruthy();
    expect(screen.getByText("Application Date")).toBeTruthy();
    expect(screen.getByText("Reference Number")).toBeTruthy();
  });

  // ── Button ────────────────────────────────────────────────────────────────

  it("renders View button by default (showButton=true)", () => {
    render(<ApplicationSummaryDetail />);
    expect(screen.getByTestId("btn-View")).toBeTruthy();
  });

  it("does not render button when showButton=false", () => {
    render(<ApplicationSummaryDetail showButton={false} />);
    expect(screen.queryByTestId("btn-View")).toBeNull();
  });

  it("renders custom buttonTitle", () => {
    render(<ApplicationSummaryDetail buttonTitle="Open" />);
    expect(screen.getByTestId("btn-Open")).toBeTruthy();
  });

  it("renders Arabic button title when language='ar'", () => {
    render(
      <ApplicationSummaryDetail
        buttonTitle="View"
        buttonTitle_ar="عرض"
        language="ar"
      />
    );
    expect(screen.getByTestId("btn-عرض")).toBeTruthy();
  });

  it("calls onButtonClick when button pressed", () => {
    const onButtonClick = jest.fn();
    render(<ApplicationSummaryDetail onButtonClick={onButtonClick} />);
    fireEvent.press(screen.getByTestId("btn-View"));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("renders with buttonType='primary' without crashing", () => {
    render(<ApplicationSummaryDetail buttonType="primary" />);
    expect(screen.getByTestId("btn-View")).toBeTruthy();
  });

  it("renders with buttonType='delete' without crashing", () => {
    render(<ApplicationSummaryDetail buttonType="delete" buttonTitle="Delete" />);
    expect(screen.getByTestId("btn-Delete")).toBeTruthy();
  });

  // ── Arabic value rendering (isArabic branch) ──────────────────────────────

  it("renders Arabic application number value when language='ar'", () => {
    render(
      <ApplicationSummaryDetail
        applicationNumber="APP-001"
        applicationNumber_ar="طلب-001"
        language="ar"
      />
    );
    expect(screen.getByText("طلب-001")).toBeTruthy();
  });

  it("renders Arabic applicationDate value when language='ar'", () => {
    render(
      <ApplicationSummaryDetail
        applicationDate="2024-01-15"
        applicationDate_ar="١٥-٠١-٢٠٢٤"
        language="ar"
      />
    );
    expect(screen.getByText("١٥-٠١-٢٠٢٤")).toBeTruthy();
  });
});
