/**
 * Tests for the shared ViewOwnerDetail component.
 *
 * Platform components (Container, Text, Buttons) and
 * SharedLanguageSwitchRenderer are mocked. Tests cover: default rendering,
 * mainTitle conditional display, owner name, owner detail rows, language
 * switching, and the View button presence.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

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

// ── Platform mocks ──────────────────────────────────────────────────────────
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

import ViewOwnerDetail from "@shared/components/ViewOwnerDetail/ViewOwnerDetail";

const ownerDetails = [
  { label: "UAE ID", label_ar: "الهوية", value: "784-1990-0000000-1", value_ar: "784" },
  { label: "Nationality", label_ar: "الجنسية", value: "Emirati", value_ar: "إماراتي" },
];

const mockOwner = {
  name: "Mohammed Al Rashid",
  details: ownerDetails,
};

describe("ViewOwnerDetail", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing with minimal props", () => {
    render(<ViewOwnerDetail />);
  });

  it("renders with owner data", () => {
    render(<ViewOwnerDetail owner={mockOwner} />);
    expect(screen.getByText("Mohammed Al Rashid")).toBeTruthy();
  });

  // ── mainTitle conditional ────────────────────────────────────────────────

  it("renders mainTitle when provided", () => {
    render(<ViewOwnerDetail mainTitle="Owner Information" />);
    expect(screen.getByText("Owner Information")).toBeTruthy();
  });

  it("renders Arabic mainTitle when language='ar'", () => {
    render(
      <ViewOwnerDetail
        mainTitle="Owner Information"
        mainTitle_ar="معلومات المالك"
        language="ar"
      />
    );
    expect(screen.getByText("معلومات المالك")).toBeTruthy();
  });

  it("does not render mainTitle element when mainTitle and mainTitle_ar are empty", () => {
    render(<ViewOwnerDetail mainTitle="" mainTitle_ar="" />);
    expect(screen.queryByText("Owner Information")).toBeNull();
  });

  // ── ownerText section ────────────────────────────────────────────────────

  it("renders default ownerText 'Owner'", () => {
    render(<ViewOwnerDetail />);
    expect(screen.getByText("Owner")).toBeTruthy();
  });

  it("renders custom ownerText", () => {
    render(<ViewOwnerDetail ownerText="Property Owner" />);
    expect(screen.getByText("Property Owner")).toBeTruthy();
  });

  it("renders Arabic ownerText when language='ar'", () => {
    render(<ViewOwnerDetail ownerText="Owner" ownerText_ar="المالك" language="ar" />);
    expect(screen.getByText("المالك")).toBeTruthy();
  });

  // ── Owner details rendering ──────────────────────────────────────────────

  it("renders owner detail labels", () => {
    render(<ViewOwnerDetail owner={mockOwner} />);
    expect(screen.getByText("UAE ID")).toBeTruthy();
    expect(screen.getByText("Nationality")).toBeTruthy();
  });

  it("renders owner detail values", () => {
    render(<ViewOwnerDetail owner={mockOwner} />);
    expect(screen.getByText("784-1990-0000000-1")).toBeTruthy();
    expect(screen.getByText("Emirati")).toBeTruthy();
  });

  it("renders Arabic label values when language='ar'", () => {
    render(<ViewOwnerDetail owner={mockOwner} language="ar" />);
    expect(screen.getByText("الهوية")).toBeTruthy();
    expect(screen.getByText("إماراتي")).toBeTruthy();
  });

  it("renders with empty details array without crashing", () => {
    render(<ViewOwnerDetail owner={{ name: "Test Owner", details: [] }} />);
    expect(screen.getByText("Test Owner")).toBeTruthy();
  });

  // ── View button ───────────────────────────────────────────────────────────
  // The "View"/"عرض" button is now commented out in ViewOwnerDetail source,
  // so the button-presence test cases have been removed.

  // ── Default owner fallback ────────────────────────────────────────────────

  it("renders with default empty owner when owner prop omitted", () => {
    render(<ViewOwnerDetail />);
    // No crash; owner defaults to { name: "", details: [] }
    expect(screen.getByText("Owner")).toBeTruthy();
  });

  // ── plotCode ──────────────────────────────────────────────────────────────

  it("renders with plotCode prop without crashing", () => {
    render(<ViewOwnerDetail plotCode="PLT-001" plotCode_ar="ق-001" />);
    expect(screen.getByText("Owner")).toBeTruthy();
  });
});
