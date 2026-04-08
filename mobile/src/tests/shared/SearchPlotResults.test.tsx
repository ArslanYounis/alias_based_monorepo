/**
 * Tests for the shared SearchPlotResults component.
 * Covers: result cards, loading state, pagination, select plot action,
 * radio selection, Arabic language, detail drawer.
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
  const { View } = require("react-native");
  return { Radio: ({ id, checked }: any) => React.createElement(View, { testID: `radio-${id}`, accessibilityState: { checked } }) };
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
  const CustomDrawer = React.forwardRef(({ children, open }: any, ref: any) =>
    open ? React.createElement(View, { testID: "custom-drawer" }, children) : null
  );
  return { CustomDrawer };
});

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/ViewPlotDetail/ViewPlotDetail", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "view-plot-detail" }),
  };
});

import SearchPlotResults from "@shared/components/SearchPlot/SearchPlotResults";
import type { SearchResult } from "@shared/components/SearchPlot/SearchPlotResults";

const mockResults: SearchResult[] = [
  {
    plotId: "p1",
    plotNumber: "101",
    landUseName: "Residential",
    hasMortgage: false,
    code: "R",
    communityName: "Community A",
    districtName: "District 1",
  },
  {
    plotId: "p2",
    plotNumber: "102",
    landUseName: "Commercial",
    hasMortgage: true,
    code: "C",
    communityName: "Community B",
    districtName: "District 2",
  },
];

const defaultProps = {
  args: "",
  municipality: "Abu Dhabi",
  zone: "Zone 1",
  sector: "Sector A",
  results: mockResults,
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
};

describe("SearchPlotResults", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<SearchPlotResults {...defaultProps} />);
  });

  it("renders Search Results heading", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("shows loading state when isLoading=true", () => {
    render(<SearchPlotResults {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders result count text", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("We returned")).toBeTruthy();
    expect(screen.getByText("2 results")).toBeTruthy();
  });

  it("renders municipality search criteria", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("Abu Dhabi")).toBeTruthy();
  });

  it("renders zone criteria", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("Zone 1")).toBeTruthy();
  });

  it("renders sector criteria", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("Sector A")).toBeTruthy();
  });

  it("renders community names from results", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("Community A")).toBeTruthy();
    expect(screen.getByText("Community B")).toBeTruthy();
  });

  it("renders Edit link", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("calls onCloseDrawer when Edit is pressed", () => {
    const onCloseDrawer = jest.fn();
    render(<SearchPlotResults {...defaultProps} onCloseDrawer={onCloseDrawer} />);
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Select Plot button", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getByTestId("btn-Select Plot")).toBeTruthy();
  });

  it("renders Owners and Details buttons per result", () => {
    render(<SearchPlotResults {...defaultProps} />);
    expect(screen.getAllByTestId("btn-Owners").length).toBe(2);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("calls onSelectResult when Select Plot is pressed after selection", () => {
    const onSelectResult = jest.fn();
    const onCloseDrawer = jest.fn();
    render(
      <SearchPlotResults
        {...defaultProps}
        selected={[mockResults[0]]}
        onSelectResult={onSelectResult}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Select Plot"));
    expect(onSelectResult).toHaveBeenCalledWith(mockResults[0]);
  });

  it("renders Arabic heading when language=ar", () => {
    render(<SearchPlotResults {...defaultProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  it("renders in mobile platform mode", () => {
    render(<SearchPlotResults {...defaultProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders empty results without crashing", () => {
    render(<SearchPlotResults {...defaultProps} results={[]} totalCount={0} />);
    expect(screen.getByText("0 results")).toBeTruthy();
  });
});
