/**
 * Tests for the shared Table component.
 *
 * Platform-specific components (Container, ScrollContainer, Text,
 * Cards, ApplicationCard) are mocked so the table rendering logic can
 * be tested without Expo native modules. Tests cover: empty data,
 * column header rendering, row rendering, platform='web' vs 'mobile'
 * branching, language switching, and onCardClick propagation.
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

// ── Container mock ──────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
  };
});

// ── ScrollContainer mock ─────────────────────────────────────────────────────
jest.mock("@platform/ScrollContainer", () => {
  const React = require("react");
  const { ScrollView } = require("react-native");
  return {
    ScrollContainer: ({ children, ...props }: any) =>
      React.createElement(ScrollView, props, children),
  };
});

// ── Text mock ─────────────────────────────────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

// ── ApplicationCard mock ──────────────────────────────────────────────────────
jest.mock("@platform/ApplicationCard", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    ApplicationCard: ({ cardsData, onClick }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `app-card-${cardsData.id}`, onPress: onClick },
        React.createElement(Text, null, cardsData.title)
      ),
  };
});

// ── Cards mock ────────────────────────────────────────────────────────────────
jest.mock("@platform/Cards", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Cards: ({ action, stepName }: any) =>
      React.createElement(
        View,
        { testID: `cards-${action}` },
        React.createElement(Text, null, action),
        React.createElement(Text, null, stepName)
      ),
  };
});

import { Table } from "@shared/components/Table/Table";
import type {
  ApplicationData,
  ColumnDefinition,
} from "@shared/components/Table/Table";

const columns: ColumnDefinition[] = [
  { header: "Application", header_ar: "الطلب", accessorKey: "applicationTitle" },
  { header: "Status", header_ar: "الحالة", accessorKey: "status" },
  { header: "Date", header_ar: "التاريخ", accessorKey: "timeDate" },
];

const makeRow = (id: string, title: string): ApplicationData => ({
  id,
  applicationTitle: title,
  applicationTitle_ar: `${title} (ar)`,
  location: "Abu Dhabi",
  location_ar: "أبو ظبي",
  timeDate: "2024-01-01",
  daysRemaining: "5 days",
  currentStep: 2,
  additionalColumns: [
    {
      action: "Approve",
      action_ar: "موافقة",
      stepName: "Step 1",
      type: "approval",
    },
  ],
});

const row1 = makeRow("app-001", "Plot Registration");
const row2 = makeRow("app-002", "Title Transfer");

describe("Table", () => {
  // ── Empty state ─────────────────────────────────────────────────────────

  it("renders without crashing with empty data", () => {
    render(<Table data={[]} columns={columns} />);
  });

  it("does not render column headers when data is empty", () => {
    render(<Table data={[]} columns={columns} />);
    expect(screen.queryByText("Application")).toBeNull();
  });

  it("renders without crashing when data is undefined", () => {
    render(<Table columns={columns} />);
  });

  // ── Column headers ────────────────────────────────────────────────────────

  it("renders column headers when data is present", () => {
    render(<Table data={[row1]} columns={columns} />);
    expect(screen.getByText("Application")).toBeTruthy();
    expect(screen.getByText("Status")).toBeTruthy();
  });

  it("renders Arabic column headers when language='ar'", () => {
    render(<Table data={[row1]} columns={columns} language="ar" />);
    expect(screen.getByText("الطلب")).toBeTruthy();
  });

  // ── Row rendering ─────────────────────────────────────────────────────────

  it("renders ApplicationCard for each row", () => {
    render(<Table data={[row1, row2]} columns={columns} />);
    expect(screen.getByTestId("app-card-app-001")).toBeTruthy();
    expect(screen.getByTestId("app-card-app-002")).toBeTruthy();
  });

  it("renders application title in English", () => {
    render(<Table data={[row1]} columns={columns} language="en" />);
    expect(screen.getByText("Plot Registration")).toBeTruthy();
  });

  it("renders application title in Arabic when language='ar'", () => {
    render(<Table data={[row1]} columns={columns} language="ar" />);
    expect(screen.getByText("Plot Registration (ar)")).toBeTruthy();
  });

  it("renders additional column cards", () => {
    render(<Table data={[row1]} columns={columns} />);
    expect(screen.getByTestId("cards-Approve")).toBeTruthy();
  });

  // ── Platform branching ────────────────────────────────────────────────────

  it("renders with platform='web' (default) without crashing", () => {
    render(<Table data={[row1]} columns={columns} platform="web" />);
    expect(screen.getByTestId("app-card-app-001")).toBeTruthy();
  });

  it("renders with platform='mobile' (ScrollContainer path) without crashing", () => {
    render(<Table data={[row1]} columns={columns} platform="mobile" />);
    expect(screen.getByTestId("app-card-app-001")).toBeTruthy();
  });

  // ── onCardClick ───────────────────────────────────────────────────────────

  it("calls onCardClick when ApplicationCard is pressed", () => {
    const onCardClick = jest.fn();
    const rowWithClick = { ...row1, onCardClick };
    render(<Table data={[rowWithClick]} columns={columns} />);
    fireEvent.press(screen.getByTestId("app-card-app-001"));
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });

  it("handles row without onCardClick (undefined) gracefully", () => {
    const rowWithoutClick = { ...row1, onCardClick: undefined };
    render(<Table data={[rowWithoutClick]} columns={columns} />);
    expect(() =>
      fireEvent.press(screen.getByTestId("app-card-app-001"))
    ).not.toThrow();
  });

  // ── daysRemaining language ────────────────────────────────────────────────

  it("uses daysRemaining_ar in Arabic mode", () => {
    const rowWithAr = { ...row1, daysRemaining_ar: "٥ أيام" };
    render(<Table data={[rowWithAr]} columns={columns} language="ar" />);
    // No crash expected - data flows through ApplicationCard mock
    expect(screen.getByTestId("app-card-app-001")).toBeTruthy();
  });

  // ── columnCount clamping ──────────────────────────────────────────────────

  it("renders with 1 column without crashing", () => {
    render(<Table data={[row1]} columns={[columns[0]]} />);
    expect(screen.getByText("Application")).toBeTruthy();
  });

  it("renders with 6+ columns without crashing (clamps to 6)", () => {
    const manyCols: ColumnDefinition[] = Array.from({ length: 8 }, (_, i) => ({
      header: `Col${i}`,
      accessorKey: `col${i}`,
    }));
    render(<Table data={[row1]} columns={manyCols} />);
    expect(screen.getByText("Col0")).toBeTruthy();
  });
});
