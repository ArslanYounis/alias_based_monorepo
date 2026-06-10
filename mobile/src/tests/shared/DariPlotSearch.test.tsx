/**
 * Mobile tests for the shared DariPlotSearch component.
 * Covers: title/subtitle rendering, en/ar + rtl/ltr, selected handling,
 * onSubmit callback, platform passthrough. ByPlot is mocked to avoid deep
 * rendering / hooks.
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
  return {
    Container: ({ children, ...p }: any) =>
      React.createElement(View, p, children),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...p }: any) =>
      React.createElement(Text, p, children),
  };
});

// ── ByPlot mock (avoid deep rendering / hooks) ───────────────────────────────
jest.mock("@shared/components/DariPlotSearch/byPlot", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(
        View,
        { testID: "by-plot" },
        React.createElement(
          TouchableOpacity,
          {
            testID: "by-plot-submit",
            onPress: () => props.onSelectResult?.({ plotID: 1 }),
          },
          React.createElement(Text, null, "Submit Plot")
        ),
        props.selected?.length > 0
          ? React.createElement(Text, { testID: "by-plot-selected" }, "selected")
          : null,
        React.createElement(Text, { testID: "by-plot-language" }, props.language),
        React.createElement(Text, { testID: "by-plot-platform" }, props.platform)
      ),
  };
});

import DariPlotSearch from "@shared/components/DariPlotSearch/dariPlotSearch";

describe("DariPlotSearch (mobile)", () => {
  afterEach(() => jest.clearAllMocks());

  const defaultProps = {
    title: "Search Plot",
    title_ar: "بحث عن قطعة",
    subtitle: "Find your plot",
    subtitle_ar: "ابحث عن قطعتك",
  };

  it("renders without crashing", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByText("Search Plot")).toBeTruthy();
  });

  it("renders subtitle text", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByText("Find your plot")).toBeTruthy();
  });

  it("renders ByPlot child", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("defaults language to en passed into ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByTestId("by-plot-language").props.children).toBe("en");
  });

  it("defaults platform to web passed into ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(screen.getByTestId("by-plot-platform").props.children).toBe("web");
  });

  it("renders Arabic title when language=ar", () => {
    render(<DariPlotSearch {...defaultProps} language="ar" />);
    expect(screen.getByText("بحث عن قطعة")).toBeTruthy();
  });

  it("renders Arabic subtitle when language=ar", () => {
    render(<DariPlotSearch {...defaultProps} language="ar" />);
    expect(screen.getByText("ابحث عن قطعتك")).toBeTruthy();
  });

  it("passes mobile platform down to ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} platform="mobile" />);
    expect(screen.getByTestId("by-plot-platform").props.children).toBe("mobile");
  });

  it("does not render title when title is empty", () => {
    render(<DariPlotSearch subtitle="Only subtitle" />);
    expect(screen.queryByText("Search Plot")).toBeNull();
    expect(screen.getByText("Only subtitle")).toBeTruthy();
  });

  it("does not render subtitle when subtitle is empty", () => {
    render(<DariPlotSearch title="Only title" />);
    expect(screen.getByText("Only title")).toBeTruthy();
  });

  it("falls back to title for title_ar when title_ar missing in ar", () => {
    render(<DariPlotSearch title="Fallback" language="ar" />);
    expect(screen.getByText("Fallback")).toBeTruthy();
  });

  it("renders with no props at all", () => {
    render(<DariPlotSearch />);
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("passes selected array to ByPlot", () => {
    render(<DariPlotSearch {...defaultProps} selected={[{ plotID: 1 }]} />);
    expect(screen.getByTestId("by-plot-selected")).toBeTruthy();
  });

  it("treats null selected as empty array safely", () => {
    render(<DariPlotSearch {...defaultProps} selected={null} />);
    expect(screen.queryByTestId("by-plot-selected")).toBeNull();
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("calls onSubmit when ByPlot selects a result", () => {
    const onSubmit = jest.fn();
    render(<DariPlotSearch {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("by-plot-submit"));
    expect(onSubmit).toHaveBeenCalledWith({ plotID: 1 });
  });

  it("does not throw when onSubmit not provided", () => {
    render(<DariPlotSearch {...defaultProps} />);
    expect(() =>
      fireEvent.press(screen.getByTestId("by-plot-submit"))
    ).not.toThrow();
  });
});
