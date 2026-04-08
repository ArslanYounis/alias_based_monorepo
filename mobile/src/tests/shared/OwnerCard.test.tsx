/**
 * Tests for the shared OwnerCard component.
 *
 * GenericCard, Container, and platform Buttons are mocked to isolate
 * OwnerCard logic. Tests cover: rendering multiple owners, expand/collapse
 * toggling, button show/hide flags, action callbacks (view, plot, edit,
 * delete), language switching, and the useEffect that adds newly mounted
 * owner indices to expandedIndices.
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
      showButtons,
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
        showButtons && buttons
          ? buttons.map((btn: any, i: number) =>
              React.createElement(
                TouchableOpacity,
                { testID: `action-btn-${btn.title}`, key: i, onPress: btn.onClick },
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

import OwnerCard from "@shared/components/OwnerCard/OwnerCard";
import type { Owner } from "@shared/components/OwnerCard/OwnerCard";

const makeOwner = (id: string, name: string): Owner => ({
  ownerId: id,
  ownerArgs: `args-${id}`,
  name,
  name_ar: `${name} (ar)`,
  fields: [
    { label: "City", value: "Dubai" },
    { label: "Family Book", value: "FB-001" },
  ],
});

const owner1 = makeOwner("1", "Alice");
const owner2 = makeOwner("2", "Bob");

describe("OwnerCard", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
  });

  it("renders owner name", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
    expect(screen.getByText("Alice")).toBeTruthy();
  });

  it("renders multiple owners", () => {
    render(<OwnerCard owners={[owner1, owner2]} title="Owners" />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  it("renders empty owners array without crashing", () => {
    render(<OwnerCard owners={[]} title="Owners" />);
  });

  // ── Expand / collapse ────────────────────────────────────────────────────

  it("owner card starts expanded (expandedIndices includes index)", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
    expect(screen.getByText("Collapse")).toBeTruthy();
  });

  it("toggles owner card to collapsed state when toggle pressed", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
    fireEvent.press(screen.getByTestId("toggle-Alice"));
    expect(screen.getByText("Expand")).toBeTruthy();
  });

  it("toggles owner card back to expanded state after two presses", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
    fireEvent.press(screen.getByTestId("toggle-Alice"));
    fireEvent.press(screen.getByTestId("toggle-Alice"));
    expect(screen.getByText("Collapse")).toBeTruthy();
  });

  // ── Button visibility ─────────────────────────────────────────────────────

  it("renders View, Plots, and Edit buttons by default", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
    expect(screen.getByTestId("action-btn-View")).toBeTruthy();
    expect(screen.getByTestId("action-btn-Plots")).toBeTruthy();
    expect(screen.getByTestId("action-btn-Edit")).toBeTruthy();
  });

  it("does not render Delete button by default (showDeleteButton=false)", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" />);
    expect(screen.queryByTestId("action-btn-Delete")).toBeNull();
  });

  it("renders Delete button when showDeleteButton=true", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" showDeleteButton />);
    expect(screen.getByTestId("action-btn-Delete")).toBeTruthy();
  });

  it("hides View button when showViewButton=false", () => {
    render(
      <OwnerCard owners={[owner1]} title="Owners" showViewButton={false} />
    );
    expect(screen.queryByTestId("action-btn-View")).toBeNull();
  });

  it("hides Plots button when showPlotsButton=false", () => {
    render(
      <OwnerCard owners={[owner1]} title="Owners" showPlotsButton={false} />
    );
    expect(screen.queryByTestId("action-btn-Plots")).toBeNull();
  });

  it("hides Edit button when showEditButton=false", () => {
    render(
      <OwnerCard owners={[owner1]} title="Owners" showEditButton={false} />
    );
    expect(screen.queryByTestId("action-btn-Edit")).toBeNull();
  });

  it("hides all buttons when all show flags are false", () => {
    render(
      <OwnerCard
        owners={[owner1]}
        title="Owners"
        showViewButton={false}
        showPlotsButton={false}
        showEditButton={false}
        showDeleteButton={false}
      />
    );
    expect(screen.queryByTestId("action-btn-View")).toBeNull();
    expect(screen.queryByTestId("action-btn-Edit")).toBeNull();
    expect(screen.queryByTestId("action-btn-Plots")).toBeNull();
  });

  // ── Action callbacks ──────────────────────────────────────────────────────

  it("calls onPressAction with 'view' action and owner when View clicked", () => {
    const onPressAction = jest.fn();
    render(
      <OwnerCard owners={[owner1]} title="Owners" onPressAction={onPressAction} />
    );
    fireEvent.press(screen.getByTestId("action-btn-View"));
    expect(onPressAction).toHaveBeenCalledWith({ action: "view", owner: owner1 });
  });

  it("calls onPressAction with 'plot' action and owner when Plots clicked", () => {
    const onPressAction = jest.fn();
    render(
      <OwnerCard owners={[owner1]} title="Owners" onPressAction={onPressAction} />
    );
    fireEvent.press(screen.getByTestId("action-btn-Plots"));
    expect(onPressAction).toHaveBeenCalledWith({ action: "plot", owner: owner1 });
  });

  it("calls onPressAction with 'edit' action and owner when Edit clicked", () => {
    const onPressAction = jest.fn();
    render(
      <OwnerCard owners={[owner1]} title="Owners" onPressAction={onPressAction} />
    );
    fireEvent.press(screen.getByTestId("action-btn-Edit"));
    expect(onPressAction).toHaveBeenCalledWith({ action: "edit", owner: owner1 });
  });

  it("calls onPressAction with 'delete' action when Delete clicked", () => {
    const onPressAction = jest.fn();
    render(
      <OwnerCard
        owners={[owner1]}
        title="Owners"
        showDeleteButton
        onPressAction={onPressAction}
      />
    );
    fireEvent.press(screen.getByTestId("action-btn-Delete"));
    expect(onPressAction).toHaveBeenCalledWith({ action: "delete", owner: owner1 });
  });

  // ── itemsPerRow ──────────────────────────────────────────────────────────

  it("renders with itemsPerRow='2' without crashing", () => {
    render(<OwnerCard owners={[owner1, owner2]} title="Owners" itemsPerRow="2" />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  // ── language ─────────────────────────────────────────────────────────────

  it("renders with language='ar' without crashing", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" title_ar="الملاك" language="ar" />);
    expect(screen.getByText("Alice")).toBeTruthy();
  });

  // ── defaultShowMore ───────────────────────────────────────────────────────

  it("renders with defaultShowMore=true without crashing", () => {
    render(<OwnerCard owners={[owner1]} title="Owners" defaultShowMore />);
    expect(screen.getByText("Alice")).toBeTruthy();
  });
});
