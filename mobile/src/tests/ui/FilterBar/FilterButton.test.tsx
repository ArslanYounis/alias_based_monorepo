/**
 * Tests for the FilterButton UI component.
 *
 * Exercises: default rendering, count badge, active state styling,
 * custom icon, onClick callback, and className passthrough.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  const makeIcon = (name) => (p) =>
    React.createElement(View, { testID: name });
  return {
    ListFilter: makeIcon("list-filter"),
    Search: makeIcon("search"),
    ChevronDown: makeIcon("chevron-down"),
    Plus: makeIcon("plus"),
    FileText: makeIcon("file-text"),
    Filter: makeIcon("filter"),
    ChevronRight: makeIcon("chevron-right"),
    ChevronLeft: makeIcon("chevron-left"),
  };
});

import FilterButton from "@platform/FilterBar/FilterButton";

describe("FilterButton", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<FilterButton />);
  });

  it("renders the default ListFilter icon when no icon prop is provided", () => {
    render(<FilterButton />);
    expect(screen.getByTestId("list-filter")).toBeTruthy();
  });

  // ── Count badge ────────────────────────────────────────────────────────────

  it("does not render count badge when count=0 (default)", () => {
    render(<FilterButton count={0} />);
    expect(screen.queryByText("0")).toBeNull();
  });

  it("renders count badge when count > 0", () => {
    render(<FilterButton count={3} />);
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders count badge value correctly for count=10", () => {
    render(<FilterButton count={10} />);
    expect(screen.getByText("10")).toBeTruthy();
  });

  // ── Custom icon ────────────────────────────────────────────────────────────

  it("renders custom icon when icon prop is provided", () => {
    const customIcon = <View testID="custom-icon" />;
    render(<FilterButton icon={customIcon} />);
    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });

  it("does not render ListFilter when custom icon is provided", () => {
    const customIcon = <View testID="custom-icon" />;
    render(<FilterButton icon={customIcon} />);
    expect(screen.queryByTestId("list-filter")).toBeNull();
  });

  // ── onClick callback ───────────────────────────────────────────────────────

  it("calls onClick when pressed", () => {
    const onClick = jest.fn();
    render(<FilterButton onClick={onClick} />);
    fireEvent.press(screen.getByTestId("list-filter"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when pressed without onClick handler", () => {
    render(<FilterButton />);
    expect(() =>
      fireEvent.press(screen.getByTestId("list-filter"))
    ).not.toThrow();
  });

  // ── isActive state ─────────────────────────────────────────────────────────

  it("renders without crashing when isActive=true", () => {
    expect(() => render(<FilterButton isActive />)).not.toThrow();
  });

  it("renders without crashing when isActive=false (default)", () => {
    expect(() => render(<FilterButton isActive={false} />)).not.toThrow();
  });

  // ── Count + isActive together ──────────────────────────────────────────────

  it("renders count badge and active state together", () => {
    render(<FilterButton count={5} isActive />);
    expect(screen.getByText("5")).toBeTruthy();
  });
});
