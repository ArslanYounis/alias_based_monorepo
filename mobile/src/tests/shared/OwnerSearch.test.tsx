/**
 * Tests for the shared OwnerSearch component.
 * Covers: tab rendering, switching between owner/company, title/subtitle,
 * initialOwnerType, Arabic language, platform mode.
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
jest.mock("@platform/RadioCard", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioCard: ({ label, onClick, id }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `radio-card-${id}`, onPress: () => onClick?.(id) },
        React.createElement(Text, null, label)
      ),
  };
});
jest.mock("@platform/icons", () => ({
  OwnerIcon: () => null,
  CompanyIcon: () => null,
}));

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/OwnerSearch/OwnerSearchByOwner", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "owner-search-by-owner" }),
  };
});
jest.mock("@shared/components/OwnerSearch/OwnerSearchByCompanyOwner", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "owner-search-by-company" }),
  };
});

import OwnerSearch from "@shared/components/OwnerSearch/OwnerSearch";

describe("OwnerSearch", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing with defaults", () => {
    render(<OwnerSearch />);
  });

  it("renders company radio card", () => {
    render(<OwnerSearch />);
    expect(screen.getByTestId("radio-card-company")).toBeTruthy();
  });

  it("renders owner radio card", () => {
    render(<OwnerSearch />);
    expect(screen.getByTestId("radio-card-owner")).toBeTruthy();
  });

  it("shows ByCompanyOwner by default (initialOwnerType=company)", () => {
    render(<OwnerSearch />);
    expect(screen.getByTestId("owner-search-by-company")).toBeTruthy();
  });

  it("shows ByOwner when initialOwnerType=owner", () => {
    render(<OwnerSearch initialOwnerType="owner" />);
    expect(screen.getByTestId("owner-search-by-owner")).toBeTruthy();
  });

  it("switches to ByOwner when owner tab is pressed", () => {
    render(<OwnerSearch />);
    fireEvent.press(screen.getByTestId("radio-card-owner"));
    expect(screen.getByTestId("owner-search-by-owner")).toBeTruthy();
  });

  it("switches back to ByCompanyOwner when company tab is pressed", () => {
    render(<OwnerSearch initialOwnerType="owner" />);
    fireEvent.press(screen.getByTestId("radio-card-company"));
    expect(screen.getByTestId("owner-search-by-company")).toBeTruthy();
  });

  it("renders title when provided", () => {
    render(<OwnerSearch title="Owner Search" />);
    expect(screen.getByText("Owner Search")).toBeTruthy();
  });

  it("renders Arabic title when language=ar", () => {
    render(<OwnerSearch title="Owner Search" title_ar="بحث المالك" language="ar" />);
    expect(screen.getByText("بحث المالك")).toBeTruthy();
  });

  it("does not render title when empty", () => {
    render(<OwnerSearch title="" />);
    expect(screen.queryByText("Owner Search")).toBeNull();
  });

  it("renders subtitle when provided", () => {
    render(<OwnerSearch subtitle="Find an owner" />);
    expect(screen.getByText("Find an owner")).toBeTruthy();
  });

  it("renders Arabic subtitle when language=ar", () => {
    render(<OwnerSearch subtitle="Find" subtitle_ar="ابحث" language="ar" />);
    expect(screen.getByText("ابحث")).toBeTruthy();
  });

  it("renders By Company Owner radio card label", () => {
    render(<OwnerSearch />);
    expect(screen.getByText("By Company Owner")).toBeTruthy();
  });

  it("renders By Owner radio card label", () => {
    render(<OwnerSearch />);
    expect(screen.getByText("By Owner")).toBeTruthy();
  });

  it("renders in mobile platform mode", () => {
    render(<OwnerSearch platform="mobile" />);
    expect(screen.getByTestId("owner-search-by-company")).toBeTruthy();
  });
});
