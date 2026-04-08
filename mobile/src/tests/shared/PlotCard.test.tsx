/**
 * Tests for the shared PlotCard component.
 *
 * GenericCard and Container are mocked to surface the button callbacks
 * and expand/collapse state without deep platform dependencies. Tests
 * cover: rendering plots, expand/collapse toggling, button show/hide
 * flags, action callbacks (view, change_plot, owners), field mapping,
 * and language defaults.
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

// ── GenericCard mock ──────────────────────────────────────────────────────
jest.mock("@shared/components/GenericCard/GenericCard", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: ({
      cardTitleValue,
      buttons,
      isExpanded,
      onToggleExpand,
    }: any) =>
      React.createElement(
        View,
        { testID: `generic-card-${cardTitleValue}` },
        React.createElement(Text, null, cardTitleValue),
        React.createElement(
          TouchableOpacity,
          { testID: `toggle-${cardTitleValue}`, onPress: onToggleExpand },
          React.createElement(Text, null, isExpanded ? "Collapse" : "Expand")
        ),
        buttons
          ? buttons.map((btn: any, i: number) =>
              React.createElement(
                TouchableOpacity,
                { testID: `action-btn-${btn.title}-${cardTitleValue}`, key: i, onPress: btn.onClick },
                React.createElement(Text, null, btn.title)
              )
            )
          : null
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

import PlotCard from "@shared/components/PlotCard/PlotCard";
import type { Plot } from "@shared/components/PlotCard/PlotCard";

const makePlot = (id: string, number: string): Plot => ({
  plotId: id,
  plotArgs: `args-${id}`,
  plotNumber: number,
  plotNumber_ar: `${number}-ar`,
  fields: [
    { label: "Municipality", value: "Abu Dhabi" },
    { label: "Zone", value: "Zone B" },
    { label: "Area", value: "500 sqm" },
    { label: "Sector", value: "S1" },
  ],
});

const plot1 = makePlot("p1", "PLT-001");
const plot2 = makePlot("p2", "PLT-002");

describe("PlotCard", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
  });

  it("renders plot number", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });

  it("renders multiple plots", () => {
    render(<PlotCard plots={[plot1, plot2]} title="Plot" />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
    expect(screen.getByText("PLT-002")).toBeTruthy();
  });

  it("renders empty plots array without crashing", () => {
    render(<PlotCard plots={[]} title="Plot" />);
  });

  // ── Expand / collapse ────────────────────────────────────────────────────

  it("starts expanded by default (defaultExpanded=true)", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    expect(screen.getByText("Collapse")).toBeTruthy();
  });

  it("starts collapsed when defaultExpanded=false", () => {
    render(<PlotCard plots={[plot1]} title="Plot" defaultExpanded={false} />);
    expect(screen.getByText("Expand")).toBeTruthy();
  });

  it("toggles to collapsed when toggle pressed", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    fireEvent.press(screen.getByTestId("toggle-PLT-001"));
    expect(screen.getByText("Expand")).toBeTruthy();
  });

  it("toggles back to expanded after two presses", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    fireEvent.press(screen.getByTestId("toggle-PLT-001"));
    fireEvent.press(screen.getByTestId("toggle-PLT-001"));
    expect(screen.getByText("Collapse")).toBeTruthy();
  });

  // ── View button ───────────────────────────────────────────────────────────

  it("renders View button by default (showViewButton=true)", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    expect(screen.getByTestId("action-btn-View-PLT-001")).toBeTruthy();
  });

  it("hides View button when showViewButton=false", () => {
    render(<PlotCard plots={[plot1]} title="Plot" showViewButton={false} />);
    expect(screen.queryByTestId("action-btn-View-PLT-001")).toBeNull();
  });

  it("calls onPressView with plot when View pressed", () => {
    const onPressView = jest.fn();
    render(<PlotCard plots={[plot1]} title="Plot" onPressView={onPressView} />);
    fireEvent.press(screen.getByTestId("action-btn-View-PLT-001"));
    expect(onPressView).toHaveBeenCalledWith(plot1);
  });

  // ── Change Plot button ────────────────────────────────────────────────────

  it("does not render Change Plot button by default", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    expect(screen.queryByTestId("action-btn-Change Plot-PLT-001")).toBeNull();
  });

  it("renders Change Plot button when showChangePlotButton=true", () => {
    render(<PlotCard plots={[plot1]} title="Plot" showChangePlotButton />);
    expect(screen.getByTestId("action-btn-Change Plot-PLT-001")).toBeTruthy();
  });

  it("calls onPressPlotChange with plot when Change Plot pressed", () => {
    const onPressPlotChange = jest.fn();
    render(
      <PlotCard
        plots={[plot1]}
        title="Plot"
        showChangePlotButton
        onPressPlotChange={onPressPlotChange}
      />
    );
    fireEvent.press(screen.getByTestId("action-btn-Change Plot-PLT-001"));
    expect(onPressPlotChange).toHaveBeenCalledWith(plot1);
  });

  // ── Owners button ─────────────────────────────────────────────────────────

  it("does not render Owners button by default", () => {
    render(<PlotCard plots={[plot1]} title="Plot" />);
    expect(screen.queryByTestId("action-btn-Owners-PLT-001")).toBeNull();
  });

  it("renders Owners button when showOwnersButton=true", () => {
    render(<PlotCard plots={[plot1]} title="Plot" showOwnersButton />);
    expect(screen.getByTestId("action-btn-Owners-PLT-001")).toBeTruthy();
  });

  it("calls onPressOwners with plot when Owners pressed", () => {
    const onPressOwners = jest.fn();
    render(
      <PlotCard
        plots={[plot1]}
        title="Plot"
        showOwnersButton
        onPressOwners={onPressOwners}
      />
    );
    fireEvent.press(screen.getByTestId("action-btn-Owners-PLT-001"));
    expect(onPressOwners).toHaveBeenCalledWith(plot1);
  });

  // ── Language ──────────────────────────────────────────────────────────────

  it("renders with language='ar' without crashing", () => {
    render(<PlotCard plots={[plot1]} title="Plot" title_ar="قطعة" language="ar" />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });

  // ── Platform ──────────────────────────────────────────────────────────────

  it("renders with platform='mobile' without crashing", () => {
    render(<PlotCard plots={[plot1]} title="Plot" platform="mobile" />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });

  // ── Field mapping ─────────────────────────────────────────────────────────

  it("renders without crashing when plot has empty fields array", () => {
    const emptyFieldPlot: Plot = { ...plot1, fields: [] };
    render(<PlotCard plots={[emptyFieldPlot]} title="Plot" />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });

  // ── defaultShowMore ───────────────────────────────────────────────────────

  it("renders with defaultShowMore=true without crashing", () => {
    render(<PlotCard plots={[plot1]} title="Plot" defaultShowMore />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });
});
