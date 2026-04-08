/**
 * Tests for the AddMoreButton UI component.
 *
 * Exercises: title rendering (English & Arabic), onClick handler, default
 * Plus icon rendering, and custom plusIcon prop override.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";

// ── Mock SharedLanguageSwitchRenderer ────────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "lang-switch" },
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock lucide-react-native (Plus icon used as default plusIcon prop) ────────
jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Plus: (p: any) => React.createElement(View, { testID: "plus-icon", ...p }),
  };
});

import AddMoreButton from "@platform/AddMoreButton/AddMoreButton";

describe("AddMoreButton", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<AddMoreButton />);
  });

  // ── Title text ────────────────────────────────────────────────────────────

  it("renders the title text", () => {
    render(<AddMoreButton title="Add Item" />);
    expect(screen.getByText("Add Item")).toBeTruthy();
  });

  it("renders an empty string title by default", () => {
    render(<AddMoreButton />);
    // Default title="" — lang-switch renders empty string, component should not crash
    expect(screen.getByTestId("lang-switch")).toBeTruthy();
  });

  it("renders Arabic title when language='ar' and title_ar is provided", () => {
    render(
      <AddMoreButton
        title="Add Item"
        title_ar="إضافة عنصر"
        language="ar"
      />
    );
    expect(screen.getByText("إضافة عنصر")).toBeTruthy();
  });

  it("falls back to title when language='ar' but title_ar is empty", () => {
    // AddMoreButton passes value_ar={title_ar || title} so empty title_ar falls
    // back to title for Arabic.
    render(
      <AddMoreButton title="Fallback" title_ar="" language="ar" />
    );
    expect(screen.getByText("Fallback")).toBeTruthy();
  });

  it("renders English title when language='en' even if title_ar is provided", () => {
    render(
      <AddMoreButton title="English" title_ar="عربي" language="en" />
    );
    expect(screen.getByText("English")).toBeTruthy();
  });

  // ── Click / press interaction ─────────────────────────────────────────────

  it("calls onClick when the Pressable is pressed", () => {
    const onClick = jest.fn();
    render(<AddMoreButton title="Press Me" onClick={onClick} />);
    // fireEvent.press walks the tree to find the nearest pressable host element
    fireEvent.press(screen.getByText("Press Me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when no onClick prop is provided and pressed", () => {
    render(<AddMoreButton title="No Handler" />);
    expect(() => fireEvent.press(screen.getByText("No Handler"))).not.toThrow();
  });

  // ── Default Plus icon ─────────────────────────────────────────────────────

  it("renders the default plus icon when no plusIcon prop is provided", () => {
    render(<AddMoreButton />);
    expect(screen.getByTestId("plus-icon")).toBeTruthy();
  });

  // ── Custom plusIcon prop ──────────────────────────────────────────────────

  it("renders a custom plusIcon when provided", () => {
    const CustomIcon = () => (
      <View testID="custom-icon" />
    );
    render(<AddMoreButton plusIcon={<CustomIcon />} />);
    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });

  it("does not render the default plus icon when a custom plusIcon is provided", () => {
    const CustomIcon = () => <View testID="custom-icon" />;
    render(<AddMoreButton plusIcon={<CustomIcon />} />);
    expect(screen.queryByTestId("plus-icon")).toBeNull();
  });
});
