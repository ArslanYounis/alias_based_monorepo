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
// A single stable refetch reference — the component's effect depends on it, so a
// fresh jest.fn() per render would re-fire the effect every render (loop once the
// plots drawer is open).
const mockStableRefetch = jest.fn();
jest.mock("../../hooks/useGetOwnerPlots", () => ({
  useGetOwnerPlots: jest.fn(() => ({
    data: null,
    refetch: mockStableRefetch,
    isFetching: false,
  })),
}), { virtual: true });
jest.mock("@shared/hooks/useGetOwnerPlots", () => ({
  useGetOwnerPlots: jest.fn(() => ({
    data: null,
    refetch: mockStableRefetch,
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
  const { TouchableOpacity } = require("react-native");
  return {
    Pagination: ({ onPageChange }: any) =>
      React.createElement(TouchableOpacity, {
        testID: "pagination-next",
        onPress: () => onPageChange?.(2),
      }),
  };
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
  const { View, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: ({ onSelectPlot, onCloseDrawer }: any) =>
      React.createElement(
        View,
        { testID: "search-owner-plots-result" },
        React.createElement(TouchableOpacity, {
          testID: "plots-select",
          onPress: () => onSelectPlot?.({ plotId: "px" }),
        }),
        React.createElement(TouchableOpacity, {
          testID: "plots-close",
          onPress: () => onCloseDrawer?.(),
        })
      ),
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

// Stable reference: the component has a useEffect keyed on `selected`. Passing a
// fresh [] each render (the prop default) would re-run it every render; once an
// interactive state update is in flight (e.g. opening a drawer) that turns into a
// render loop under act(). A stable array keeps the effect dependency constant.
const stableSelected: IOwnerSearchResult[] = [];

const defaultProps = {
  ownerName: "Smith",
  results: mockResults,
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
  selected: stableSelected,
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

  // ── Plots drawer (selectOwnerForPlots) ──────────────────────────────────────

  it("opens the plots drawer when a result's Plots button is pressed", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.queryByTestId("search-owner-plots-result")).toBeNull();
    fireEvent.press(screen.getAllByTestId("btn-Plots")[0]);
    expect(screen.getByTestId("search-owner-plots-result")).toBeTruthy();
  });

  it("does not open plots drawer when result has no id", () => {
    const noId = [{ ...mockResults[0], id: undefined }] as IOwnerSearchResult[];
    render(<SearchOwnerResult {...defaultProps} results={noId} totalCount={1} />);
    fireEvent.press(screen.getByTestId("btn-Plots"));
    expect(screen.queryByTestId("search-owner-plots-result")).toBeNull();
  });

  // ── Owner detail drawer ─────────────────────────────────────────────────────

  it("opens the owner detail drawer when Details is pressed", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    expect(screen.queryByTestId("view-owner-detail")).toBeNull();
    fireEvent.press(screen.getAllByTestId("btn-Details")[0]);
    expect(screen.getByTestId("view-owner-detail")).toBeTruthy();
  });

  // ── Pagination (getCurrentPageResults slicing) ──────────────────────────────

  it("slices results to the current page when results exceed pageSize", () => {
    const many: IOwnerSearchResult[] = Array.from({ length: 15 }, (_, i) => ({
      id: `id-${i}`,
      ownerId: `id-${i}`,
      ownerName_E: `Owner ${i}`,
      nationalNumber: `nn-${i}`,
      cityName: `City ${i}`,
    }));
    render(
      <SearchOwnerResult
        {...defaultProps}
        results={many}
        pageSize={10}
        totalCount={15}
      />
    );
    // First page shows the first 10 owners; the 11th is sliced off.
    expect(screen.getByText("Owner 0")).toBeTruthy();
    expect(screen.getByText("Owner 9")).toBeTruthy();
    expect(screen.queryByText("Owner 10")).toBeNull();
  });

  it("returns all results when pageSize is 0 (falsy)", () => {
    render(<SearchOwnerResult {...defaultProps} pageSize={0} totalCount={2} />);
    expect(screen.getByText("John Smith")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
  });

  it("calls onPageChange when pagination changes the page", () => {
    const onPageChange = jest.fn();
    render(<SearchOwnerResult {...defaultProps} onPageChange={onPageChange} />);
    fireEvent.press(screen.getByTestId("pagination-next"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("handles plot selection and closing from the plots drawer", () => {
    render(<SearchOwnerResult {...defaultProps} />);
    // Open the plots drawer
    fireEvent.press(screen.getAllByTestId("btn-Plots")[0]);
    expect(screen.getByTestId("search-owner-plots-result")).toBeTruthy();
    // Selecting a plot (handleSelectPlot) does not throw
    fireEvent.press(screen.getByTestId("plots-select"));
    // Closing the plots drawer (onCloseDrawer) hides the sub-component
    fireEvent.press(screen.getByTestId("plots-close"));
    expect(screen.queryByTestId("search-owner-plots-result")).toBeNull();
  });
});
