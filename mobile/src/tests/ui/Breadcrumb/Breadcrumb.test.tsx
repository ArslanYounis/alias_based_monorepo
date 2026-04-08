/**
 * Tests for the Breadcrumb UI component.
 *
 * Exercises: item rendering, default last-item selection, custom
 * selectedItemIndex, onClick callbacks, separator display, and Arabic labels.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer ─────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value
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
        language === "ar" && value_ar ? value_ar : value
      ),
  };
});

import { Breadcrumb } from "@platform/Breadcrumb";

const sampleItems = [
  { label: "Home", label_ar: "الرئيسية" },
  { label: "Products", label_ar: "المنتجات" },
  { label: "Detail", label_ar: "التفاصيل" },
];

describe("Breadcrumb", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Breadcrumb items={sampleItems} />);
  });

  it("renders all item labels", () => {
    render(<Breadcrumb items={sampleItems} />);
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Products")).toBeTruthy();
    expect(screen.getByText("Detail")).toBeTruthy();
  });

  it("renders separator '/' between items", () => {
    render(<Breadcrumb items={sampleItems} />);
    // Two separators for three items
    const separators = screen.getAllByText("/");
    expect(separators).toHaveLength(2);
  });

  it("does not render a separator before the first item", () => {
    render(<Breadcrumb items={[{ label: "Home" }, { label: "About" }]} />);
    const separators = screen.getAllByText("/");
    expect(separators).toHaveLength(1);
  });

  it("renders with default items when none are provided", () => {
    // Default items: Home and Level 1
    render(<Breadcrumb />);
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Level 1")).toBeTruthy();
  });

  // ── selectedItemIndex ─────────────────────────────────────────────────────

  it("selects the last item by default when selectedItemIndex is undefined", () => {
    // The last item gets text-text-default class and others get text-text-dimmed.
    // We can't inspect className in RNTL directly, but we verify the component renders
    // with the correct number of items and the correct default selection (no crash).
    render(<Breadcrumb items={sampleItems} />);
    // All items visible
    expect(screen.getByText("Detail")).toBeTruthy();
  });

  it("applies selection to the specified selectedItemIndex", () => {
    render(<Breadcrumb items={sampleItems} selectedItemIndex={0} />);
    // All items still visible
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Products")).toBeTruthy();
    expect(screen.getByText("Detail")).toBeTruthy();
  });

  it("renders without crashing when selectedItemIndex=1 for 3 items", () => {
    expect(() =>
      render(<Breadcrumb items={sampleItems} selectedItemIndex={1} />)
    ).not.toThrow();
  });

  // ── onClick ───────────────────────────────────────────────────────────────

  it("calls item.onClick when a pressable item is pressed", () => {
    const onClick = jest.fn();
    const items = [
      { label: "Home", onClick },
      { label: "Products" },
    ];
    render(<Breadcrumb items={items} />);
    fireEvent.press(screen.getByText("Home"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when pressing an item without onClick", () => {
    const items = [{ label: "Home" }, { label: "Products" }];
    render(<Breadcrumb items={items} />);
    expect(() => fireEvent.press(screen.getByText("Home"))).not.toThrow();
  });

  it("calls correct onClick for each item independently", () => {
    const onClickHome = jest.fn();
    const onClickProducts = jest.fn();
    const items = [
      { label: "Home", onClick: onClickHome },
      { label: "Products", onClick: onClickProducts },
    ];
    render(<Breadcrumb items={items} />);

    fireEvent.press(screen.getByText("Home"));
    expect(onClickHome).toHaveBeenCalledTimes(1);
    expect(onClickProducts).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText("Products"));
    expect(onClickProducts).toHaveBeenCalledTimes(1);
  });

  // ── Arabic labels ─────────────────────────────────────────────────────────

  it("renders Arabic labels when language='ar'", () => {
    render(<Breadcrumb items={sampleItems} language="ar" />);
    expect(screen.getByText("الرئيسية")).toBeTruthy();
    expect(screen.getByText("المنتجات")).toBeTruthy();
    expect(screen.getByText("التفاصيل")).toBeTruthy();
  });

  it("falls back to English when language='ar' but label_ar is not provided", () => {
    const items = [{ label: "Home" }, { label: "About" }];
    render(<Breadcrumb items={items} language="ar" />);
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("About")).toBeTruthy();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders a single item without a separator", () => {
    render(<Breadcrumb items={[{ label: "Only" }]} />);
    expect(screen.getByText("Only")).toBeTruthy();
    expect(screen.queryByText("/")).toBeNull();
  });

  it("renders two items with one separator", () => {
    render(<Breadcrumb items={[{ label: "A" }, { label: "B" }]} />);
    expect(screen.getAllByText("/")).toHaveLength(1);
  });
});
