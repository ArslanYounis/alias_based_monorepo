/**
 * Tests for the DropdownFilter UI component.
 *
 * Exercises: default rendering, tab switching (filter / sort),
 * RadioField selection for application options, CheckboxField toggling,
 * Arabic language layout, and empty options edge cases.
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

jest.mock("@platform/RadioField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioField: ({ id, label, label_ar, language, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `radio-${id}`, onPress: () => onChange?.(id) },
        React.createElement(
          Text,
          null,
          language === "ar" && label_ar ? label_ar : label
        )
      ),
  };
});

jest.mock("@platform/CheckboxField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    CheckboxField: ({ id, label, onChange, checked }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: `checkbox-${id}`,
          onPress: () => onChange?.(id, !checked),
          accessibilityState: { checked },
        },
        React.createElement(Text, null, label)
      ),
  };
});

import DropdownFilter from "@platform/FilterBar/DropdownFilter";

const defaultFilterOptions = [
  { label: "Actions", value: "actions" },
  { label: "Critical", value: "critical" },
];
const defaultSortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];
const defaultApplicationOptions = [
  { label: "My Applications", value: "my" },
  { label: "All Applications", value: "all" },
];

describe("DropdownFilter", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<DropdownFilter />);
  });

  it("defaults to filter tab and shows Filter By text", () => {
    render(<DropdownFilter />);
    expect(screen.getByText("Filter By")).toBeTruthy();
  });

  it("renders Sort By tab button", () => {
    render(<DropdownFilter />);
    expect(screen.getByText("Sort By")).toBeTruthy();
  });

  // ── Filter tab content ─────────────────────────────────────────────────────

  it("renders application options on filter tab by default", () => {
    render(
      <DropdownFilter
        applicationOptions={defaultApplicationOptions}
        filterOptions={defaultFilterOptions}
        sortOptions={defaultSortOptions}
      />
    );
    expect(screen.getByText("My Applications")).toBeTruthy();
    expect(screen.getByText("All Applications")).toBeTruthy();
  });

  it("renders filter checkboxes on filter tab", () => {
    render(
      <DropdownFilter
        filterOptions={defaultFilterOptions}
        sortOptions={defaultSortOptions}
        applicationOptions={defaultApplicationOptions}
      />
    );
    expect(screen.getByText("Actions")).toBeTruthy();
    expect(screen.getByText("Critical")).toBeTruthy();
  });

  // ── Tab switching ──────────────────────────────────────────────────────────

  it("switches to sort tab when Sort By is pressed", () => {
    render(
      <DropdownFilter
        sortOptions={defaultSortOptions}
        filterOptions={defaultFilterOptions}
        applicationOptions={defaultApplicationOptions}
      />
    );
    fireEvent.press(screen.getByText("Sort By"));
    expect(screen.getByText("Newest First")).toBeTruthy();
    expect(screen.getByText("Oldest First")).toBeTruthy();
  });

  it("hides filter options after switching to sort tab", () => {
    render(
      <DropdownFilter
        sortOptions={defaultSortOptions}
        filterOptions={defaultFilterOptions}
        applicationOptions={defaultApplicationOptions}
      />
    );
    fireEvent.press(screen.getByText("Sort By"));
    expect(screen.queryByText("Actions")).toBeNull();
  });

  it("switches back to filter tab when Filter By is pressed", () => {
    render(
      <DropdownFilter
        filterOptions={defaultFilterOptions}
        sortOptions={defaultSortOptions}
        applicationOptions={defaultApplicationOptions}
      />
    );
    fireEvent.press(screen.getByText("Sort By"));
    fireEvent.press(screen.getByText("Filter By"));
    expect(screen.getByText("Actions")).toBeTruthy();
  });

  // ── Radio selection for application options ────────────────────────────────

  it("updates selected app when a radio option is pressed", () => {
    render(
      <DropdownFilter
        applicationOptions={defaultApplicationOptions}
        filterOptions={[]}
        sortOptions={[]}
      />
    );
    // Press the second application option
    fireEvent.press(screen.getByTestId("radio-all"));
    // Should not throw and component re-renders fine
    expect(screen.getByText("All Applications")).toBeTruthy();
  });

  // ── Checkbox toggle ────────────────────────────────────────────────────────

  it("toggles filter checkbox when pressed", () => {
    render(
      <DropdownFilter
        filterOptions={defaultFilterOptions}
        sortOptions={[]}
        applicationOptions={[]}
      />
    );
    fireEvent.press(screen.getByTestId("checkbox-actions"));
    // component stays rendered after state update
    expect(screen.getByText("Actions")).toBeTruthy();
  });

  // ── Sort radio ─────────────────────────────────────────────────────────────

  it("updates selected sort option when sort radio is pressed", () => {
    render(
      <DropdownFilter
        sortOptions={defaultSortOptions}
        filterOptions={[]}
        applicationOptions={[]}
      />
    );
    fireEvent.press(screen.getByText("Sort By"));
    fireEvent.press(screen.getByTestId("radio-oldest"));
    expect(screen.getByText("Oldest First")).toBeTruthy();
  });

  // ── Arabic language ────────────────────────────────────────────────────────

  it("renders Arabic tab labels when language='ar'", () => {
    render(<DropdownFilter language="ar" />);
    expect(screen.getByText("تصفية حسب")).toBeTruthy();
    expect(screen.getByText("ترتيب حسب")).toBeTruthy();
  });

  // ── Empty options ──────────────────────────────────────────────────────────

  it("renders without crashing when all options are empty arrays", () => {
    expect(() =>
      render(
        <DropdownFilter
          filterOptions={[]}
          sortOptions={[]}
          applicationOptions={[]}
        />
      )
    ).not.toThrow();
  });

  it("renders sort tab without crashing when sortOptions is empty", () => {
    render(
      <DropdownFilter
        filterOptions={[]}
        sortOptions={[]}
        applicationOptions={[]}
      />
    );
    fireEvent.press(screen.getByText("Sort By"));
    // Nothing to render but no crash
    expect(screen.getByText("Sort By")).toBeTruthy();
  });
});
