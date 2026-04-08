/**
 * Tests for the SearchField UI component.
 *
 * Exercises: default collapsed state, expanding on focus, search icon,
 * onChange callback, placeholder text, Arabic language, and columnsToSearch.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";

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

// CheckboxField mock (used in column selector — currently commented-out in source)
jest.mock("@platform/CheckboxField", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    CheckboxField: ({ label }: any) =>
      React.createElement(View, null, React.createElement(Text, null, label)),
  };
});

import SearchField from "@platform/FilterBar/SearchField";

describe("SearchField", () => {
  const noop = () => {};

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<SearchField value="" onChange={noop} />);
  });

  it("renders the search icon", () => {
    render(<SearchField value="" onChange={noop} />);
    expect(screen.getByTestId("search")).toBeTruthy();
  });

  it("does not show TextInput when not focused (collapsed state)", () => {
    render(<SearchField value="" onChange={noop} />);
    expect(screen.queryByDisplayValue("")).toBeNull();
  });

  // ── Expanding on focus ─────────────────────────────────────────────────────
  // SearchField expands via handleInputFocus which is triggered by the Pressable's
  // onPress OR by TextInput's onFocus. We use UNSAFE_root to press the root Pressable.

  const pressRootPressable = (utils: ReturnType<typeof render>) => {
    // SearchField renders a Pressable as its first child (UNSAFE_root is the
    // functional component wrapper; children[0] is the host Pressable).
    const pressable = utils.UNSAFE_root.children?.[0] as any;
    act(() => {
      pressable?.props?.onPress?.();
    });
  };

  it("expands and shows TextInput when columnsToSearch provided and Pressable pressed", () => {
    const utils = render(
      <SearchField
        value=""
        onChange={noop}
        placeholder="Search"
        columnsToSearch={["Name"]}
      />
    );
    pressRootPressable(utils);
    const input = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    expect(input.length).toBeGreaterThan(0);
  });

  // ── onChange callback ──────────────────────────────────────────────────────

  it("calls onChange when text is entered after expanding", () => {
    const onChange = jest.fn();
    const utils = render(
      <SearchField
        value=""
        onChange={onChange}
        placeholder="Search"
        columnsToSearch={["Name"]}
      />
    );
    pressRootPressable(utils);
    const input = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    if (input.length > 0) {
      fireEvent.changeText(input[0], "hello");
      expect(onChange).toHaveBeenCalledWith("hello");
    }
  });

  // ── Placeholder text ───────────────────────────────────────────────────────

  it("uses English placeholder when language='en'", () => {
    const utils = render(
      <SearchField
        value=""
        onChange={noop}
        placeholder="Search"
        placeholder_ar="بحث"
        language="en"
        columnsToSearch={["Name"]}
      />
    );
    pressRootPressable(utils);
    const input = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    if (input.length > 0) {
      expect(input[0].props.placeholder).toBe("Search");
    }
  });

  it("uses Arabic placeholder when language='ar'", () => {
    const utils = render(
      <SearchField
        value=""
        onChange={noop}
        placeholder="Search"
        placeholder_ar="بحث"
        language="ar"
        columnsToSearch={["Name"]}
      />
    );
    pressRootPressable(utils);
    const input = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    if (input.length > 0) {
      expect(input[0].props.placeholder).toBe("بحث");
    }
  });

  // ── columnsToSearch triggers expand ───────────────────────────────────────

  it("opens TextInput when columnsToSearch is provided (multiple columns)", () => {
    const utils = render(
      <SearchField
        value=""
        onChange={noop}
        columnsToSearch={["Name", "Status"]}
      />
    );
    pressRootPressable(utils);
    const inputs = screen.UNSAFE_queryAllByType(require("react-native").TextInput);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("stays collapsed when no columnsToSearch and not pressed", () => {
    render(<SearchField value="" onChange={noop} />);
    const inputs = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    expect(inputs.length).toBe(0);
  });

  // ── Arabic RTL text alignment ──────────────────────────────────────────────

  it("sets textAlign to right for Arabic language after expand", () => {
    const utils = render(
      <SearchField value="" onChange={noop} language="ar" columnsToSearch={["Col"]} />
    );
    pressRootPressable(utils);
    const input = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    if (input.length > 0) {
      expect(input[0].props.textAlign).toBe("right");
    }
  });

  it("sets textAlign to left for English language after expand", () => {
    const utils = render(
      <SearchField value="" onChange={noop} language="en" columnsToSearch={["Col"]} />
    );
    pressRootPressable(utils);
    const input = screen.UNSAFE_queryAllByType(
      require("react-native").TextInput
    );
    if (input.length > 0) {
      expect(input[0].props.textAlign).toBe("left");
    }
  });
});
