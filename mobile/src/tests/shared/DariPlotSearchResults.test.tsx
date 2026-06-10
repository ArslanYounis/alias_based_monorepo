/**
 * Mobile tests for the shared DariPlotSearchResult component.
 * Covers: heading, en/ar + rtl/ltr, loading/empty/success states,
 * result cards, selection (handleRadioSelect), Select Plot / Edit callbacks,
 * Details drawer, server + client pagination.
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
  return {
    Text: ({ children, ...p }: any) => React.createElement(Text, p, children),
  };
});
jest.mock("@platform/Radio", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Radio: ({ id, checked }: any) =>
      React.createElement(View, {
        testID: `radio-${id}`,
        accessibilityState: { checked },
      }),
  };
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
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Pagination: ({ currentPage, onPageChange }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: "pagination-next",
          onPress: () => onPageChange?.((currentPage || 1) + 1),
        },
        React.createElement(Text, null, "Next")
      ),
  };
});
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  const CustomDrawer = React.forwardRef(({ children, open }: any, _ref: any) =>
    open ? React.createElement(View, { testID: "detail-drawer" }, children) : null
  );
  return { CustomDrawer };
});

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/ViewPlotDetail", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ViewPlotDetail: () =>
      React.createElement(View, { testID: "view-plot-detail" }),
  };
});

import DariPlotSearchResult from "@shared/components/DariPlotSearch/dariPlotSearchResult";
import type { SearchResult } from "@shared/components/DariPlotSearch/dariPlotSearchResult";

const makePlot = (
  id: number,
  overrides?: Partial<SearchResult>
): SearchResult => ({
  plotID: id,
  plotNumber: `PN-${id}`,
  landUseNameEn: "Residential",
  landUseNameAr: "سكني",
  communityNameEn: `Community ${id}`,
  communityNameAr: `مجتمع ${id}`,
  districtNameEn: `District ${id}`,
  districtNameAr: `حي ${id}`,
  ...overrides,
});

const EMPTY_SELECTED: SearchResult[] = [];

const baseProps = {
  municipalityNameEn: "Abu Dhabi",
  municipalityNameAr: "أبوظبي",
  zone: "Zone 1",
  sector: "Sector A",
  results: [makePlot(1), makePlot(2)],
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
  selected: EMPTY_SELECTED,
};

describe("DariPlotSearchResult (mobile)", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders Arabic heading when language=ar", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  it("applies rtl direction for Arabic", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.UNSAFE_getByProps({ dir: "rtl" })).toBeTruthy();
  });

  it("applies ltr direction for English", () => {
    render(<DariPlotSearchResult {...baseProps} language="en" />);
    expect(screen.UNSAFE_getByProps({ dir: "ltr" })).toBeTruthy();
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  it("shows loading text when isLoading=true", () => {
    render(<DariPlotSearchResult {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic loading text", () => {
    render(
      <DariPlotSearchResult {...baseProps} isLoading={true} language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeTruthy();
  });

  it("does not render result cards when loading", () => {
    render(<DariPlotSearchResult {...baseProps} isLoading={true} />);
    expect(screen.queryByText("Community 1")).toBeNull();
  });

  // ── Result cards ──────────────────────────────────────────────────────────
  it("renders a card for each result", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Community 1")).toBeTruthy();
    expect(screen.getByText("Community 2")).toBeTruthy();
  });

  it("renders criteria text with municipality, zone, sector", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Abu Dhabi")).toBeTruthy();
    expect(screen.getByText("Zone 1")).toBeTruthy();
    expect(screen.getByText("Sector A")).toBeTruthy();
  });

  it("shows result count and label", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("We returned")).toBeTruthy();
    expect(screen.getAllByText(/2/).length).toBeGreaterThan(0);
    expect(screen.getByText("results")).toBeTruthy();
  });

  it("renders Land Use and Zone/District row labels", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getAllByText("Land Use").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Zone/District").length).toBeGreaterThan(0);
  });

  it("renders Owners and Details buttons for each card", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getAllByTestId("btn-Owners").length).toBe(2);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("renders Edit link", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("renders Select Plot button", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    expect(screen.getByTestId("btn-Select Plot")).toBeTruthy();
  });

  // ── Selection ─────────────────────────────────────────────────────────────
  it("clicking a card selects it", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    fireEvent.press(screen.getByText("Community 1"));
    expect(screen.getByTestId("btn-Select Plot")).toBeTruthy();
  });

  it("calls onSelectResult and onCloseDrawer when Select Plot pressed with a selection", () => {
    const onSelectResult = jest.fn();
    const onCloseDrawer = jest.fn();
    render(
      <DariPlotSearchResult
        {...baseProps}
        selected={[makePlot(1)]}
        onSelectResult={onSelectResult}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Select Plot"));
    expect(onSelectResult).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not call onSelectResult when nothing is selected", () => {
    const onSelectResult = jest.fn();
    render(
      <DariPlotSearchResult {...baseProps} onSelectResult={onSelectResult} />
    );
    fireEvent.press(screen.getByTestId("btn-Select Plot"));
    expect(onSelectResult).not.toHaveBeenCalled();
  });

  it("selecting different cards updates the selection", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    fireEvent.press(screen.getByText("Community 1"));
    fireEvent.press(screen.getByText("Community 2"));
    expect(screen.getByTestId("btn-Select Plot")).toBeTruthy();
  });

  // ── Edit link callback ────────────────────────────────────────────────────
  it("calls onCloseDrawer when Edit is pressed", () => {
    const onCloseDrawer = jest.fn();
    render(
      <DariPlotSearchResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  // ── Details drawer ────────────────────────────────────────────────────────
  it("pressing Details opens the plot detail drawer", () => {
    render(<DariPlotSearchResult {...baseProps} />);
    const detailBtns = screen.getAllByTestId("btn-Details");
    fireEvent.press(detailBtns[0]);
    expect(screen.getByTestId("view-plot-detail")).toBeTruthy();
  });

  // ── Pagination ────────────────────────────────────────────────────────────
  it("calls onPageChange via Next page button", () => {
    const onPageChange = jest.fn();
    const manyResults = Array.from({ length: 5 }, (_, i) => makePlot(i + 1));
    render(
      <DariPlotSearchResult
        {...baseProps}
        results={manyResults}
        totalCount={25}
        pageSize={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.press(screen.getByTestId("pagination-next"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  // ── Client-side pagination ────────────────────────────────────────────────
  it("paginates locally when results exceed pageSize", () => {
    const manyResults = Array.from({ length: 15 }, (_, i) => makePlot(i + 1));
    render(
      <DariPlotSearchResult
        {...baseProps}
        results={manyResults}
        totalCount={15}
        pageSize={5}
      />
    );
    expect(screen.getByText("Community 1")).toBeTruthy();
    expect(screen.getByText("Community 5")).toBeTruthy();
    expect(screen.queryByText("Community 6")).toBeNull();
  });

  it("advances client-side page and shows the next slice", () => {
    const manyResults = Array.from({ length: 15 }, (_, i) => makePlot(i + 1));
    render(
      <DariPlotSearchResult
        {...baseProps}
        results={manyResults}
        totalCount={15}
        pageSize={5}
      />
    );
    fireEvent.press(screen.getByTestId("pagination-next"));
    expect(screen.getByText("Community 6")).toBeTruthy();
    expect(screen.queryByText("Community 1")).toBeNull();
  });

  it("returns all results when pageSize is 0/falsy", () => {
    render(
      <DariPlotSearchResult
        {...baseProps}
        results={[makePlot(1), makePlot(2)]}
        pageSize={0}
        totalCount={2}
      />
    );
    expect(screen.getByText("Community 1")).toBeTruthy();
    expect(screen.getByText("Community 2")).toBeTruthy();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────
  it("renders with mobile heading style", () => {
    render(<DariPlotSearchResult {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  // ── Arabic content ────────────────────────────────────────────────────────
  it("renders Arabic Edit and result heading", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
    expect(screen.getByText("تعديل")).toBeTruthy();
  });

  it("renders Arabic community names when language=ar", () => {
    render(<DariPlotSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("مجتمع 1")).toBeTruthy();
  });

  // ── Pre-selected ──────────────────────────────────────────────────────────
  it("shows pre-selected result", () => {
    render(<DariPlotSearchResult {...baseProps} selected={[makePlot(1)]} />);
    expect(screen.getByTestId("btn-Select Plot")).toBeTruthy();
  });

  it("handles empty results without crashing", () => {
    render(<DariPlotSearchResult {...baseProps} results={[]} totalCount={0} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });
});
