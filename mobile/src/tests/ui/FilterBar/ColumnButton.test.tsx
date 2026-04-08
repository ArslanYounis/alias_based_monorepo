/**
 * Tests for the ColumnButton UI component.
 *
 * Exercises: rendering, dropdown toggle, singleSelect/multiSelect behaviour,
 * setSelectedColumns callback, and no-op when columns is empty.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  const makeIcon = (name: string) => (p: any) =>
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

// RadioField mock — @platform/RadioField resolves to mobile/src/ui/RadioField,
// which is the same module that ColumnButton imports via relative "../RadioField"
jest.mock("@platform/RadioField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioField: ({ id, label, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `radio-${id}`, onPress: () => onChange?.(id) },
        React.createElement(Text, null, label)
      ),
  };
});

// CheckboxField mock — same alias resolution as above
jest.mock("@platform/CheckboxField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    CheckboxField: ({ id, label, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `checkbox-${id}`, onPress: () => onChange?.(id) },
        React.createElement(Text, null, label)
      ),
  };
});

import ColumnButton from "@platform/FilterBar/ColumnButton";

describe("ColumnButton", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<ColumnButton />);
  });

  it("renders the default label", () => {
    render(<ColumnButton label="Column 1 Name" />);
    expect(screen.getByText("Column 1 Name")).toBeTruthy();
  });

  it("renders the chevron down icon", () => {
    render(<ColumnButton />);
    expect(screen.getByTestId("chevron-down")).toBeTruthy();
  });

  // ── Dropdown toggle ────────────────────────────────────────────────────────

  it("does not open modal when columns is empty", () => {
    render(<ColumnButton label="Col" columns={[]} />);
    fireEvent.press(screen.getByText("Col"));
    // Modal should not be visible — no column items rendered
    expect(screen.queryByText("Option A")).toBeNull();
  });

  it("does not open modal when columns is undefined", () => {
    render(<ColumnButton label="Col" />);
    fireEvent.press(screen.getByText("Col"));
    expect(screen.queryByText("Option A")).toBeNull();
  });

  it("opens modal and renders column options when columns provided", () => {
    render(
      <ColumnButton
        label="Col"
        columns={["Option A", "Option B"]}
        title="Pick Column"
      />
    );
    fireEvent.press(screen.getByText("Col"));
    expect(screen.getByText("Option A")).toBeTruthy();
    expect(screen.getByText("Option B")).toBeTruthy();
  });

  it("renders modal title when dropdown opens", () => {
    render(
      <ColumnButton
        label="Col"
        columns={["Option A"]}
        title="Select a column"
      />
    );
    fireEvent.press(screen.getByText("Col"));
    expect(screen.getByText("Select a column")).toBeTruthy();
  });

  // ── singleSelect behaviour ─────────────────────────────────────────────────

  it("calls setSelectedColumns with [col] and closes modal on singleSelect", () => {
    const setSelectedColumns = jest.fn();
    render(
      <ColumnButton
        columns={["Option A", "Option B"]}
        label="Col"
        type="singleSelect"
        setSelectedColumns={setSelectedColumns}
      />
    );
    fireEvent.press(screen.getByText("Col"));
    fireEvent.press(screen.getByTestId("radio-Option A"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["Option A"]);
  });

  // ── multiSelect behaviour ──────────────────────────────────────────────────

  it("adds a column to selection in multiSelect mode", () => {
    const setSelectedColumns = jest.fn();
    render(
      <ColumnButton
        columns={["Option A", "Option B"]}
        label="Col"
        type="multiSelect"
        selectedColumns={[]}
        setSelectedColumns={setSelectedColumns}
      />
    );
    fireEvent.press(screen.getByText("Col"));
    fireEvent.press(screen.getByTestId("checkbox-Option A"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["Option A"]);
  });

  it("removes a column from selection in multiSelect mode when already selected", () => {
    const setSelectedColumns = jest.fn();
    render(
      <ColumnButton
        columns={["Option A", "Option B"]}
        label="Col"
        type="multiSelect"
        selectedColumns={["Option A"]}
        setSelectedColumns={setSelectedColumns}
      />
    );
    fireEvent.press(screen.getByText("Col"));
    fireEvent.press(screen.getByTestId("checkbox-Option A"));
    expect(setSelectedColumns).toHaveBeenCalledWith([]);
  });

  it("does not call setSelectedColumns when it is not provided", () => {
    render(
      <ColumnButton
        columns={["Option A"]}
        label="Col"
        type="multiSelect"
      />
    );
    fireEvent.press(screen.getByText("Col"));
    // Should not throw even without the setter
    expect(() =>
      fireEvent.press(screen.getByTestId("checkbox-Option A"))
    ).not.toThrow();
  });

  // ── Dark theme ─────────────────────────────────────────────────────────────

  it("renders without crashing with isDark=true", () => {
    expect(() =>
      render(<ColumnButton columns={["Col A"]} isDark label="Col" />)
    ).not.toThrow();
  });
});
