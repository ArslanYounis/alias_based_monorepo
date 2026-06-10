/**
 * Tests for the shared PartialBlockHandler component (mobile platform).
 *
 * useGetWorkflows is mocked to control groups/loading/error state. Platform
 * components and the ModalTitle/CardTitle/ServiceSelectRow sub-components are
 * mocked with lightweight RN elements exposing testIDs so we can drive group
 * expand/collapse, search filtering, selection, and submit-payload assertions
 * without Expo native modules.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── useGetWorkflows hook ─────────────────────────────────────────────────────
const mockUseGetWorkflows = jest.fn();
jest.mock("@shared/hooks/useGetWorkflows", () => ({
  useGetWorkflows: () => mockUseGetWorkflows(),
}));

// ── SharedLanguageSwitchRenderer ─────────────────────────────────────────────
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
  return {
    Container: ({ children, ...p }: any) =>
      React.createElement(View, p, children),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...p }: any) => React.createElement(Text, p, children),
  };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { TextInput: RNTextInput } = require("react-native");
  return {
    TextInput: ({ value, onChange, placeholder, placeholder_ar, language }: any) =>
      React.createElement(RNTextInput, {
        testID: "search-input",
        value,
        placeholder: language === "ar" && placeholder_ar ? placeholder_ar : placeholder,
        onChangeText: (t: string) => onChange?.(t),
      }),
  };
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: "submit-btn", onPress: onClick, disabled, accessibilityState: { disabled } },
        React.createElement(Text, null, label)
      );
    },
  };
});
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SearchIcon: () => React.createElement(View, { testID: "search-icon" }),
  };
});

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/ModalTitle", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ label, label_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "modal-title" },
        language === "ar" && label_ar ? label_ar : label
      ),
  };
});
jest.mock("@shared/components/CardTitle", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title, isExpanded, onToggleExpand }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `group-${title}`, onPress: onToggleExpand },
        React.createElement(Text, null, title),
        React.createElement(Text, null, isExpanded ? "Collapse" : "Expand")
      ),
  };
});
jest.mock("@shared/components/ServiceSelectRow", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ id, label, checked, tag, onChange }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: `row-${id}`,
          accessibilityState: { checked },
          onPress: () => onChange?.(id, !checked),
        },
        React.createElement(Text, null, label),
        tag ? React.createElement(Text, null, tag) : null
      ),
  };
});

import PartialBlockHandler from "@shared/components/PartialBlockHandler/PartialBlockHandler";

const groups = [
  {
    key: "Group One",
    workflows: [
      { workflowID: 1, workflowNameEn: "Alpha", workflowNameAr: "ألفا" },
      { workflowID: 2, workflowNameEn: "Beta", workflowNameAr: "بيتا" },
    ],
  },
  {
    key: "Group Two",
    workflows: [{ workflowID: 3, workflowNameEn: "Gamma", workflowNameAr: "جاما" }],
  },
];

const setHook = (overrides: Record<string, unknown> = {}) => {
  mockUseGetWorkflows.mockReturnValue({
    groups,
    isLoading: false,
    isError: false,
    ...overrides,
  });
};

beforeEach(() => {
  mockUseGetWorkflows.mockReset();
  setHook();
});

describe("PartialBlockHandler (shared component – mobile platform)", () => {
  // ── Header / default render ────────────────────────────────────────────────
  it("renders default title", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Update Partial Blocks")).toBeTruthy();
  });

  it("renders custom title", () => {
    render(<PartialBlockHandler title="My Title" />);
    expect(screen.getByText("My Title")).toBeTruthy();
  });

  it("renders Arabic title when language=ar", () => {
    render(<PartialBlockHandler title_ar="عنوان" language="ar" />);
    expect(screen.getByText("عنوان")).toBeTruthy();
  });

  // ── Loading / error / empty states ─────────────────────────────────────────
  it("shows loading state", () => {
    setHook({ isLoading: true, groups: [] });
    render(<PartialBlockHandler />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic loading state", () => {
    setHook({ isLoading: true, groups: [] });
    render(<PartialBlockHandler language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeTruthy();
  });

  it("shows error state", () => {
    setHook({ isError: true, groups: [] });
    render(<PartialBlockHandler />);
    expect(screen.getByText("Failed to load workflows.")).toBeTruthy();
  });

  it("shows empty state when no groups", () => {
    setHook({ groups: [] });
    render(<PartialBlockHandler />);
    expect(screen.getByText("No workflows found.")).toBeTruthy();
  });

  // ── Groups & expansion ─────────────────────────────────────────────────────
  it("renders group titles", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Group One")).toBeTruthy();
    expect(screen.getByText("Group Two")).toBeTruthy();
  });

  it("expands the first group by default and shows its workflows", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.queryByText("Gamma")).toBeNull();
  });

  it("toggles a group open when its expand control is pressed", () => {
    render(<PartialBlockHandler />);
    fireEvent.press(screen.getByTestId("group-Group Two"));
    expect(screen.getByText("Gamma")).toBeTruthy();
  });

  it("collapses an expanded group when its control is pressed", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    fireEvent.press(screen.getByTestId("group-Group One"));
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  it("respects defaultExpandedGroups prop", () => {
    render(<PartialBlockHandler defaultExpandedGroups={["Group Two"]} />);
    expect(screen.getByText("Gamma")).toBeTruthy();
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  // ── Search ─────────────────────────────────────────────────────────────────
  it("filters workflows by search term (English)", () => {
    render(
      <PartialBlockHandler defaultExpandedGroups={["Group One", "Group Two"]} />
    );
    fireEvent.changeText(screen.getByTestId("search-input"), "Gamma");
    expect(screen.getByText("Gamma")).toBeTruthy();
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.queryByText("Group One")).toBeNull();
  });

  it("filters workflows by Arabic name", () => {
    render(
      <PartialBlockHandler defaultExpandedGroups={["Group One", "Group Two"]} />
    );
    fireEvent.changeText(screen.getByTestId("search-input"), "بيتا");
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  it("shows empty state when search matches nothing", () => {
    render(<PartialBlockHandler />);
    fireEvent.changeText(screen.getByTestId("search-input"), "zzz-nothing");
    expect(screen.getByText("No workflows found.")).toBeTruthy();
  });

  // ── Existing tags ──────────────────────────────────────────────────────────
  it("tags existing blocks with the existing tag label", () => {
    render(<PartialBlockHandler existingBlocks={[1]} />);
    expect(screen.getByText("Existing Block")).toBeTruthy();
  });

  it("uses a custom existing tag label", () => {
    render(
      <PartialBlockHandler existingBlocks={[1]} existingTagLabel="Already Here" />
    );
    expect(screen.getByText("Already Here")).toBeTruthy();
  });

  // ── Selection & submit ─────────────────────────────────────────────────────
  it("submit button is disabled when nothing selected (default)", () => {
    render(<PartialBlockHandler />);
    expect(
      screen.getByTestId("submit-btn").props.accessibilityState.disabled
    ).toBe(true);
  });

  it("submit button enabled when disableSubmitWhenEmpty=false", () => {
    render(<PartialBlockHandler disableSubmitWhenEmpty={false} />);
    expect(
      screen.getByTestId("submit-btn").props.accessibilityState.disabled
    ).toBe(false);
  });

  it("preselects existing blocks and enables submit", () => {
    render(<PartialBlockHandler existingBlocks={[1]} />);
    expect(
      screen.getByTestId("submit-btn").props.accessibilityState.disabled
    ).toBe(false);
  });

  it("does not preselect existing when preselectExisting=false", () => {
    render(<PartialBlockHandler existingBlocks={[1]} preselectExisting={false} />);
    expect(
      screen.getByTestId("submit-btn").props.accessibilityState.disabled
    ).toBe(true);
  });

  it("preselects preselectedBlocks without tagging them existing", () => {
    render(<PartialBlockHandler preselectedBlocks={[2]} />);
    expect(screen.queryByText("Existing Block")).toBeNull();
    expect(
      screen.getByTestId("submit-btn").props.accessibilityState.disabled
    ).toBe(false);
  });

  it("selecting a workflow enables submit and calls onSubmit with the item", () => {
    const onSubmit = jest.fn();
    render(<PartialBlockHandler onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("row-1"));
    expect(
      screen.getByTestId("submit-btn").props.accessibilityState.disabled
    ).toBe(false);
    fireEvent.press(screen.getByTestId("submit-btn"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toHaveLength(1);
    expect(payload[0]).toMatchObject({
      workflowID: 1,
      groupKey: "Group One",
      isExisting: false,
    });
  });

  it("marks isExisting=true in submitted payload for existing blocks", () => {
    const onSubmit = jest.fn();
    render(<PartialBlockHandler existingBlocks={[1]} onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("submit-btn"));
    const payload = onSubmit.mock.calls[0][0];
    expect(payload[0]).toMatchObject({ workflowID: 1, isExisting: true });
  });

  it("renders a custom submit label", () => {
    render(<PartialBlockHandler submitLabel="Save" />);
    expect(screen.getByText("Save")).toBeTruthy();
  });

  it("renders Arabic submit label when language=ar", () => {
    render(
      <PartialBlockHandler submitLabel="Update" submitLabel_ar="تحديث" language="ar" />
    );
    expect(screen.getByText("تحديث")).toBeTruthy();
  });

  // ── Platform ───────────────────────────────────────────────────────────────
  it("renders on mobile platform", () => {
    render(<PartialBlockHandler platform="mobile" />);
    expect(screen.getByText("Update Partial Blocks")).toBeTruthy();
  });
});
