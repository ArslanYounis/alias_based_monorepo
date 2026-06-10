/**
 * Mobile tests for the shared SearchAllotment component.
 * Covers: title/subtitle (en/ar), owner/company radio cards, tab switching,
 * initialOwnerType, showTabs, custom ownerTypeOptions, onSubmit passthrough,
 * selected prop, mobile platform.
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
    RadioCard: ({ label, label_ar, language, onClick, id }: any) => {
      const text = language === "ar" && label_ar ? label_ar : label;
      return React.createElement(
        TouchableOpacity,
        { testID: `radio-card-${id}`, onPress: () => onClick?.(id) },
        React.createElement(Text, null, text)
      );
    },
  };
});
jest.mock("@platform/icons", () => ({
  OwnerIcon: () => null,
  CompanyIcon: () => null,
}));

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/SearchAllotment/searchByOwner", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: "by-owner" }, [
        React.createElement(
          TouchableOpacity,
          {
            key: "submit",
            testID: "by-owner-submit",
            onPress: () => props.onSubmit?.([{ ownerId: "1" }]),
          },
          React.createElement(Text, null, "Submit Owner")
        ),
        props.selected && props.selected.length > 0
          ? React.createElement(View, { key: "sel", testID: "by-owner-selected" })
          : null,
      ]),
  };
});
jest.mock("@shared/components/SearchAllotment/searchByCompanyOwner", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(
        View,
        { testID: "by-company-owner" },
        React.createElement(
          TouchableOpacity,
          {
            testID: "by-company-submit",
            onPress: () => props.onSubmit?.([{ companyId: "1" }]),
          },
          React.createElement(Text, null, "Submit Company")
        )
      ),
  };
});

import SearchAllotment from "@shared/components/SearchAllotment/searchAllotment";

const defaultProps = {
  title: "Search Allotment",
  title_ar: "بحث عن التخصيص",
  subtitle: "Find your allotment",
  subtitle_ar: "ابحث عن التخصيص الخاص بك",
};

describe("SearchAllotment", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders title", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByText("Search Allotment")).toBeTruthy();
  });

  it("renders subtitle", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByText("Find your allotment")).toBeTruthy();
  });

  it("renders Arabic title when language=ar", () => {
    render(<SearchAllotment {...defaultProps} language="ar" />);
    expect(screen.getByText("بحث عن التخصيص")).toBeTruthy();
  });

  it("shows SearchByOwner by default (initialOwnerType=owner)", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });

  it("renders default owner type radio cards", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByText("By Owner")).toBeTruthy();
    expect(screen.getByText("By Company Owner")).toBeTruthy();
  });

  it("renders Arabic radio card labels when language=ar", () => {
    render(<SearchAllotment {...defaultProps} language="ar" />);
    expect(screen.getByText("حسب المالك")).toBeTruthy();
    expect(screen.getByText("حسب مالك الشركة")).toBeTruthy();
  });

  it("switches to SearchByCompanyOwner when Company card pressed", () => {
    render(<SearchAllotment {...defaultProps} />);
    fireEvent.press(screen.getByTestId("radio-card-company"));
    expect(screen.getByTestId("by-company-owner")).toBeTruthy();
  });

  it("switches back to SearchByOwner after switching to company", () => {
    render(<SearchAllotment {...defaultProps} />);
    fireEvent.press(screen.getByTestId("radio-card-company"));
    expect(screen.getByTestId("by-company-owner")).toBeTruthy();
    fireEvent.press(screen.getByTestId("radio-card-owner"));
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });

  it("starts on company when initialOwnerType='company'", () => {
    render(<SearchAllotment {...defaultProps} initialOwnerType="company" />);
    expect(screen.getByTestId("by-company-owner")).toBeTruthy();
  });

  it("calls onSubmit when SearchByOwner submits", () => {
    const onSubmit = jest.fn();
    render(<SearchAllotment {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("by-owner-submit"));
    expect(onSubmit).toHaveBeenCalledWith([{ ownerId: "1" }]);
  });

  it("calls onSubmit when SearchByCompanyOwner submits", () => {
    const onSubmit = jest.fn();
    render(<SearchAllotment {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("radio-card-company"));
    fireEvent.press(screen.getByTestId("by-company-submit"));
    expect(onSubmit).toHaveBeenCalledWith([{ companyId: "1" }]);
  });

  it("passes selected prop to SearchByOwner", () => {
    render(
      <SearchAllotment
        {...defaultProps}
        selected={[{ familyBookNumber: "1" }] as any}
      />
    );
    expect(screen.getByTestId("by-owner-selected")).toBeTruthy();
  });

  it("hides tabs when showTabs=false", () => {
    render(<SearchAllotment {...defaultProps} showTabs={false} />);
    expect(screen.queryByText("By Owner")).toBeNull();
    expect(screen.queryByText("By Company Owner")).toBeNull();
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });

  it("renders custom ownerTypeOptions labels", () => {
    render(
      <SearchAllotment
        {...defaultProps}
        ownerTypeOptions={{
          company: "Corp",
          company_ar: "شركة",
          owner: "Person",
          owner_ar: "شخص",
        }}
      />
    );
    expect(screen.getByText("Corp")).toBeTruthy();
    expect(screen.getByText("Person")).toBeTruthy();
  });

  it("renders without title or subtitle", () => {
    render(<SearchAllotment />);
    expect(screen.queryByText("Search Allotment")).toBeNull();
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });

  it("renders with mobile platform", () => {
    render(<SearchAllotment {...defaultProps} platform="mobile" />);
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });

  it("uses default onSubmit without throwing when none provided", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(() =>
      fireEvent.press(screen.getByTestId("by-owner-submit"))
    ).not.toThrow();
  });

  it("keeps owner view when already-active Owner card pressed", () => {
    render(<SearchAllotment {...defaultProps} />);
    fireEvent.press(screen.getByTestId("radio-card-owner"));
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });
});
