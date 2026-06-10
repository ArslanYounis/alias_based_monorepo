/**
 * Tests for the shared GenericCards component.
 *
 * GenericCard and Container are mocked. All meaningful branches are covered:
 * rendering without crash, different itemsPerRow configurations (1, 2, 3),
 * rendering items, expand/collapse toggle, button callbacks with card index,
 * and RTL support.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer (both paths) ────────────────────────
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

// ── Mock CardTitle (cuts the Buttons → useRenderIcon → lib-index chain) ────
jest.mock("@shared/components/CardTitle", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: ({
      title,
      title_ar,
      language,
      isExpandable,
      isExpanded,
      onToggleExpand,
    }: any) =>
      React.createElement(
        View,
        { testID: "card-title" },
        React.createElement(
          Text,
          null,
          language === "ar" && title_ar ? title_ar : title
        ),
        isExpandable
          ? React.createElement(
              TouchableOpacity,
              { testID: "master-toggle", onPress: onToggleExpand },
              React.createElement(
                Text,
                null,
                isExpanded ? "CollapseAll" : "ExpandAll"
              )
            )
          : null
      ),
  };
});

// ── Mock GenericCard ──────────────────────────────────────────────────────
jest.mock("@shared/components/GenericCard", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: ({
      title,
      title_ar,
      language,
      isExpanded,
      onToggleExpand,
      buttons,
    }: {
      title?: string;
      title_ar?: string;
      language?: string;
      isExpanded?: boolean;
      onToggleExpand?: () => void;
      buttons?: Array<{ title?: string; onClick?: () => void }>;
    }) => {
      const displayTitle = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        View,
        { testID: `generic-card-${title || "card"}` },
        React.createElement(Text, null, displayTitle),
        React.createElement(
          TouchableOpacity,
          { testID: `toggle-${title || "card"}`, onPress: onToggleExpand },
          React.createElement(Text, null, isExpanded ? "Collapse" : "Expand")
        ),
        ...(buttons ?? []).map((btn: any, i: number) =>
          React.createElement(
            TouchableOpacity,
            {
              key: i,
              testID: `card-btn-${btn.title || i}`,
              onPress: btn.onClick,
            },
            React.createElement(Text, null, btn.title)
          )
        )
      );
    },
  };
});

// ── Mock Container ────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, style, ...p }: any) =>
      React.createElement(View, { style, ...p }, children),
  };
});

import GenericCards from "@shared/components/GenericCards/GenericCards";

const makeRows = (n = 2) =>
  Array.from({ length: n }, (_, i) => ({
    label: `Label ${i + 1}`,
    value: `Value ${i + 1}`,
  }));

const card1 = { id: "c1", rowsData: makeRows(2), cardTitleValue: "Plot A" };
const card2 = { id: "c2", rowsData: makeRows(2), cardTitleValue: "Plot B" };
const card3 = { id: "c3", rowsData: makeRows(2), cardTitleValue: "Plot C" };

describe("GenericCards (shared/components/GenericCards/GenericCards.tsx)", () => {
  // ── Smoke tests ───────────────────────────────────────────────────────────

  it("renders without crashing with empty cardsData", () => {
    render(<GenericCards cardsData={[]} />);
  });

  it("renders without crashing with card items", () => {
    render(<GenericCards cardsData={[card1]} title="Test" />);
  });

  // ── Renders items ─────────────────────────────────────────────────────────

  it("renders a GenericCard for each item in cardsData", () => {
    render(
      <GenericCards cardsData={[card1, card2, card3]} title="Cards" />
    );
    // 3 cards rendered
    expect(screen.getAllByTestId("generic-card-Cards").length).toBe(3);
  });

  it("renders title text in each card", () => {
    render(<GenericCards cardsData={[card1]} title="Plot Info" />);
    // Title appears in the master CardTitle header and in each card
    expect(screen.getAllByText("Plot Info").length).toBeGreaterThan(0);
  });

  it("renders Arabic title when language='ar'", () => {
    render(
      <GenericCards
        cardsData={[card1]}
        title="Plot Info"
        title_ar="معلومات القطعة"
        language="ar"
      />
    );
    // title_ar is passed to both the master CardTitle and each GenericCard
    expect(screen.getAllByText("معلومات القطعة").length).toBeGreaterThan(0);
  });

  // ── itemsPerRow configurations ────────────────────────────────────────────

  describe("itemsPerRow configurations", () => {
    it('renders with itemsPerRow="1" without crash', () => {
      render(
        <GenericCards cardsData={[card1, card2]} title="T" itemsPerRow="1" />
      );
      expect(screen.getAllByTestId("generic-card-T").length).toBe(2);
    });

    it('renders with itemsPerRow="2" without crash', () => {
      render(
        <GenericCards cardsData={[card1, card2]} title="T" itemsPerRow="2" />
      );
      expect(screen.getAllByTestId("generic-card-T").length).toBe(2);
    });

    it('renders with itemsPerRow="3" without crash', () => {
      render(
        <GenericCards
          cardsData={[card1, card2, card3]}
          title="T"
          itemsPerRow="3"
        />
      );
      expect(screen.getAllByTestId("generic-card-T").length).toBe(3);
    });
  });

  // ── Expand / collapse ─────────────────────────────────────────────────────

  it("all cards start expanded", () => {
    render(<GenericCards cardsData={[card1]} title="Info" />);
    expect(screen.getByText("Collapse")).toBeTruthy();
  });

  it("toggles card collapse when toggle is pressed", () => {
    render(<GenericCards cardsData={[card1]} title="Info" />);
    fireEvent.press(screen.getByTestId("toggle-Info"));
    expect(screen.getByText("Expand")).toBeTruthy();
  });

  it("expands card again after second toggle press", () => {
    render(<GenericCards cardsData={[card1]} title="Info" />);
    fireEvent.press(screen.getByTestId("toggle-Info"));
    fireEvent.press(screen.getByTestId("toggle-Info"));
    expect(screen.getByText("Collapse")).toBeTruthy();
  });

  // ── Button callbacks ──────────────────────────────────────────────────────

  it("passes button onClick with correct card and index to each card", () => {
    const onClick = jest.fn();
    render(
      <GenericCards
        cardsData={[card1, card2]}
        title="T"
        showButtons
        buttons={[{ title: "View", onClick }]}
      />
    );
    // Press the View button on the first card
    const viewBtns = screen.getAllByTestId("card-btn-View");
    fireEvent.press(viewBtns[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
    // Called with (card, index)
    expect(onClick).toHaveBeenCalledWith(card1, 0);
  });

  it("calls onClick with correct card and index for second card", () => {
    const onClick = jest.fn();
    render(
      <GenericCards
        cardsData={[card1, card2]}
        title="T"
        showButtons
        buttons={[{ title: "View", onClick }]}
      />
    );
    const viewBtns = screen.getAllByTestId("card-btn-View");
    fireEvent.press(viewBtns[1]);
    expect(onClick).toHaveBeenCalledWith(card2, 1);
  });

  it("does not throw when button onClick is undefined", () => {
    render(
      <GenericCards
        cardsData={[card1]}
        title="T"
        showButtons
        buttons={[{ title: "NoClick" }]}
      />
    );
    expect(() =>
      fireEvent.press(screen.getByTestId("card-btn-NoClick"))
    ).not.toThrow();
  });

  // ── New cards added to cardsData ──────────────────────────────────────────

  it("adds new card indices to expandedIndices when cardsData changes", () => {
    const { rerender } = render(
      <GenericCards cardsData={[card1]} title="T" />
    );
    rerender(<GenericCards cardsData={[card1, card2]} title="T" />);
    // Both cards should be expanded (showing Collapse)
    const collapseButtons = screen.getAllByText("Collapse");
    expect(collapseButtons.length).toBe(2);
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders with undefined cardsData gracefully", () => {
    expect(() =>
      render(<GenericCards cardsData={undefined as any} />)
    ).not.toThrow();
  });

  it("renders with showBorder prop", () => {
    render(
      <GenericCards cardsData={[card1]} title="T" showBorder={true} />
    );
    expect(screen.getByTestId("generic-card-T")).toBeTruthy();
  });

  it("renders with platform='mobile'", () => {
    render(
      <GenericCards
        cardsData={[card1]}
        title="T"
        platform="mobile"
      />
    );
    expect(screen.getByTestId("generic-card-T")).toBeTruthy();
  });
});
