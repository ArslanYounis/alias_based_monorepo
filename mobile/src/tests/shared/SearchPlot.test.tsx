/**
 * Tests for the shared SearchPlot component.
 * Covers: tab rendering, tab switching, title/subtitle display,
 * enabledTabs logic, platform switching, Arabic language.
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
    RadioCard: ({ label, onClick, id, disabled }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `radio-card-${id}`, onPress: () => !disabled && onClick?.(id), disabled },
        React.createElement(Text, null, label)
      ),
  };
});
jest.mock("@platform/ScrollContainer", () => {
  const React = require("react");
  const { ScrollView } = require("react-native");
  return {
    ScrollContainer: ({ children, ...p }: any) =>
      React.createElement(ScrollView, p, children),
  };
});
jest.mock("@platform/icons", () => ({
  PlotIcon: () => null,
  OwnerIcon: () => null,
  CompanyIcon: () => null,
}));

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/SearchPlot/ByPlot", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "by-plot" }),
  };
});
jest.mock("@shared/components/SearchPlot/ByOwner", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "by-owner" }),
  };
});
jest.mock("@shared/components/SearchPlot/ByCompanyOwner", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "by-company-owner" }),
  };
});

import SearchPlot from "@shared/components/SearchPlot/SearchPlot";

describe("SearchPlot", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing with defaults", () => {
    render(<SearchPlot />);
  });

  it("renders ByPlot as default form", () => {
    render(<SearchPlot />);
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("renders plot radio card", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: true, owner: true }} />);
    expect(screen.getByTestId("radio-card-plot")).toBeTruthy();
  });

  it("renders company radio card when enabled", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: true, owner: true }} />);
    expect(screen.getByTestId("radio-card-company")).toBeTruthy();
  });

  it("renders owner radio card when enabled", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: false, owner: true }} />);
    expect(screen.getByTestId("radio-card-owner")).toBeTruthy();
  });

  it("does not render company card when company tab is disabled", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: false, owner: false }} />);
    expect(screen.queryByTestId("radio-card-company")).toBeNull();
  });

  it("switches to ByOwner when owner radio card is pressed", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: true, owner: true }} />);
    fireEvent.press(screen.getByTestId("radio-card-owner"));
    expect(screen.getByTestId("by-owner")).toBeTruthy();
  });

  it("switches to ByCompanyOwner when company radio card is pressed", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: true, owner: true }} />);
    fireEvent.press(screen.getByTestId("radio-card-company"));
    expect(screen.getByTestId("by-company-owner")).toBeTruthy();
  });

  it("renders title when provided", () => {
    render(<SearchPlot title="Search" />);
    expect(screen.getByText("Search")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    render(<SearchPlot subtitle="Find a plot" />);
    expect(screen.getByText("Find a plot")).toBeTruthy();
  });

  it("does not render title when empty", () => {
    render(<SearchPlot title="" />);
    expect(screen.queryByText("Search")).toBeNull();
  });

  it("renders Arabic title when language=ar", () => {
    render(<SearchPlot title="Search" title_ar="بحث" language="ar" />);
    expect(screen.getByText("بحث")).toBeTruthy();
  });

  it("renders in mobile platform", () => {
    render(
      <SearchPlot
        platform="mobile"
        enabledTabs={{ plot: true, company: true, owner: true }}
      />
    );
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("starts at plot tab when initialOwnerType=plot", () => {
    render(<SearchPlot initialOwnerType="plot" />);
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("starts at company tab when initialOwnerType=company and company enabled", () => {
    render(
      <SearchPlot
        initialOwnerType="company"
        enabledTabs={{ plot: true, company: true, owner: true }}
      />
    );
    expect(screen.getByTestId("by-company-owner")).toBeTruthy();
  });

  it("falls back to plot when initialOwnerType tab is disabled", () => {
    render(
      <SearchPlot
        initialOwnerType="company"
        enabledTabs={{ plot: true, company: false, owner: false }}
      />
    );
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("handles null selected gracefully", () => {
    render(<SearchPlot selected={null as any} />);
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });

  it("returns to plot tab when plot card is pressed", () => {
    render(<SearchPlot enabledTabs={{ plot: true, company: true, owner: true }} />);
    fireEvent.press(screen.getByTestId("radio-card-owner"));
    fireEvent.press(screen.getByTestId("radio-card-plot"));
    expect(screen.getByTestId("by-plot")).toBeTruthy();
  });
});
