/**
 * Tests for the shared OwnerSearchResult component (OwnerSearch module).
 * Covers: result cards, loading state, radio selection, Select Owner button,
 * detail drawer, pagination, Arabic language, ranchRecipient hook call.
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

// ── External lib mocks ───────────────────────────────────────────────────────
jest.mock("lodash", () => ({
  some: (arr: any[], pred: any) => arr.some(pred),
}));

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    Container: ({ children, onClick, ...p }: any) =>
      React.createElement(
        onClick ? Pressable : View,
        { onPress: onClick, ...p },
        children
      ),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Text: ({ children, ...p }: any) => React.createElement(Text, p, children) };
});
jest.mock("@platform/Radio", () => {
  const React = require("react");
  const { TouchableOpacity, View } = require("react-native");
  return {
    Radio: ({ id, onChange }: any) =>
      React.createElement(TouchableOpacity, { testID: `radio-${id}`, onPress: onChange }),
  };
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        View,
        { testID: `btn-${title}`, onPress: onClick, disabled },
        React.createElement(Text, null, label)
      );
    },
  };
});
jest.mock("@platform/Pagination", () => {
  const React = require("react");
  return { Pagination: (p: any) => null };
});
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  const CustomDrawer = ({ children, open }: any) =>
    open ? React.createElement(View, { testID: "custom-drawer" }, children) : null;
  return { CustomDrawer };
});

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "view-owner-detail" }),
  };
});

import OwnerSearchResult from "@shared/components/OwnerSearch/OwnerSearchResult";
import type { IOwnerSearchResult } from "@shared/components/OwnerSearch/OwnerSearchResult";

const mockResults: IOwnerSearchResult[] = [
  {
    id: "o1",
    ownerId: "o1",
    ownerName_E: "Alice Johnson",
    ownerName_A: "أليس جونسون",
    nationalNumber: "784-0001",
    cityName: "Abu Dhabi",
    moiUnifiedNumber: "MOI-001",
    nationalityName: "Emirati",
    nationalityName_ar: "إماراتي",
  },
  {
    id: "o2",
    ownerId: "o2",
    ownerName_E: "Bob Williams",
    ownerName_A: "بوب ويليامز",
    nationalNumber: "784-0002",
    cityName: "Dubai",
  },
];

const defaultProps = {
  ownerName: "Johnson",
  results: mockResults,
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
  selected: [] as IOwnerSearchResult[],
};

describe("OwnerSearchResult (OwnerSearch)", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<OwnerSearchResult {...defaultProps} />);
  });

  it("renders Search Results heading", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("shows loading when isLoading=true", () => {
    render(<OwnerSearchResult {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders owner names", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("Alice Johnson")).toBeTruthy();
    expect(screen.getByText("Bob Williams")).toBeTruthy();
  });

  it("renders national numbers", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("784-0001")).toBeTruthy();
    expect(screen.getByText("784-0002")).toBeTruthy();
  });

  it("renders city names", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("Abu Dhabi")).toBeTruthy();
    expect(screen.getByText("Dubai")).toBeTruthy();
  });

  it("renders Details button per result", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("renders owner name in search criteria", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("Johnson")).toBeTruthy();
  });

  it("renders Edit link", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("calls onCloseDrawer when Edit is pressed", () => {
    const onCloseDrawer = jest.fn();
    render(<OwnerSearchResult {...defaultProps} onCloseDrawer={onCloseDrawer} />);
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Select Owner button when there are results", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByTestId("btn-Select Owner")).toBeTruthy();
  });

  it("Select Owner is disabled when no selectedIds", () => {
    render(<OwnerSearchResult {...defaultProps} selected={[]} />);
    const btn = screen.getByTestId("btn-Select Owner");
    expect(btn.props.disabled).toBeTruthy();
  });

  // Current behavior: Select Owner invokes the onSubmit callback with the
  // selected results (the ranchRecipient mutation was lifted out of this
  // component).
  it("calls onSubmit with the selected owners when Select Owner is pressed", () => {
    const onSubmit = jest.fn();
    render(
      <OwnerSearchResult
        {...defaultProps}
        selected={[mockResults[0]]}
        onSubmit={onSubmit}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Select Owner"));
    expect(onSubmit).toHaveBeenCalledWith([mockResults[0]]);
  });

  it("calls radio onChange to select an owner", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    fireEvent.press(screen.getAllByTestId("radio-o1")[0]);
    // After selection, Select Owner button should exist
    expect(screen.getByTestId("btn-Select Owner")).toBeTruthy();
  });

  it("renders Arabic Search Results heading when language=ar", () => {
    render(<OwnerSearchResult {...defaultProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  it("renders in mobile platform mode", () => {
    render(<OwnerSearchResult {...defaultProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders result count text", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.getByText("We returned")).toBeTruthy();
  });

  it("renders Arabic result count when language=ar", () => {
    render(<OwnerSearchResult {...defaultProps} language="ar" />);
    expect(screen.getByText("أعدنا")).toBeTruthy();
  });

  it("renders empty results without crashing", () => {
    render(<OwnerSearchResult {...defaultProps} results={[]} totalCount={0} />);
    expect(screen.getByText("0 results")).toBeTruthy();
  });

  it("does not show detail drawer by default", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    expect(screen.queryByTestId("view-owner-detail")).toBeNull();
  });

  it("shows detail drawer when Details button pressed", () => {
    render(<OwnerSearchResult {...defaultProps} />);
    fireEvent.press(screen.getAllByTestId("btn-Details")[0]);
    expect(screen.getByTestId("view-owner-detail")).toBeTruthy();
  });
});
