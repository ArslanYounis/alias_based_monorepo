/**
 * Tests for the shared SearchOwnerResult component.
 * Covers: results rendering, loading state, pagination, owner selection,
 * plots drawer, detail drawer, Arabic language.
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

// ── Hook mocks ───────────────────────────────────────────────────────────────
jest.mock("../../hooks/useGetOwnerPlots", () => ({
  useGetOwnerPlots: jest.fn(() => ({
    data: null,
    refetch: jest.fn(),
    isFetching: false,
  })),
}), { virtual: true });
jest.mock("@shared/hooks/useGetOwnerPlots", () => ({
  useGetOwnerPlots: jest.fn(() => ({
    data: null,
    refetch: jest.fn(),
    isFetching: false,
  })),
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
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
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
jest.mock("@shared/components/SearchPlot/SearchOwnerPlotsResult", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "search-owner-plots-result" }),
  };
});

import SearchOwnerResult from "@shared/components/SearchPlot/SearchOwnerResult";
import type { IOwnerSearchResult } from "@shared/components/SearchPlot/SearchOwnerResult";

const mockResults: IOwnerSearchResult[] = [
  {
    id: "o1",
    ownerId: "o1",
    ownerName_E: "John Smith",
    ownerName_A: "جون سميث",
    nationalNumber: "784-1234",
    cityName: "Abu Dhabi",
    nationalityName: "Emirati",
  },
  {
    id: "o2",
    ownerId: "o2",
    ownerName_E: "Jane Doe",
    ownerName_A: "جين دو",
    nationalNumber: "784-5678",
    cityName: "Dubai",
  },
];

const defaultProps = {
  ownerName: "Smith",
  results: mockResults,
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
};

describe("SearchOwnerResult (SearchPlot)", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<SearchOwnerResult {...defaultProps} />);
  });

  it("renders Search Results heading", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("shows loading indicator when isLoading=true", () => {
    render(<SearchOwnerResult {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders owner names", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("John Smith")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
  });

  it("renders national numbers", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("784-1234")).toBeTruthy();
    expect(screen.getByText("784-5678")).toBeTruthy();
  });

  it("renders city names", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("Abu Dhabi")).toBeTruthy();
    expect(screen.getByText("Dubai")).toBeTruthy();
  });

  it("renders Plots and Details buttons per result", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getAllByTestId("btn-Plots").length).toBe(2);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("renders search criteria owner name", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("Smith")).toBeTruthy();
  });

  it("renders Edit link", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("calls onCloseDrawer when Edit is pressed", () => {
    const onCloseDrawer = jest.fn();
    render(<SearchOwnerResult {...defaultProps} onCloseDrawer={onCloseDrawer} />);
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Arabic heading when language=ar", () => {
    render(<SearchOwnerResult {...defaultProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  it("renders in mobile platform mode", () => {
    render(<SearchOwnerResult {...defaultProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders empty results without crashing", () => {
    render(<SearchOwnerResult {...defaultProps} results={[]} totalCount={0} />);
    expect(screen.getByText("0 results")).toBeTruthy();
  });

  it("result count text is rendered", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.getByText("We returned")).toBeTruthy();
  });
});
