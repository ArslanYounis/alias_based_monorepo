/**
 * Tests for the shared SearchTenancyContractResults component (mobile platform).
 *
 * Platform Container/Text/Radio/Buttons/Pagination, lodash, and
 * SharedLanguageSwitchRenderer are mocked so the result-card rendering,
 * selection, loading, pagination and getCurrentPageResults branches can be
 * tested without Expo native modules.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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

// ── lodash ───────────────────────────────────────────────────────────────────
jest.mock("lodash", () => ({
  some: (arr: any[], pred: any) => arr.some(pred),
}));

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    Container: ({ children, onClick, ...p }: any) =>
      React.createElement(
        onClick ? Pressable : View,
        { onPress: onClick, ...p },
        children
      ),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...p }: any) => React.createElement(Text, p, children),
  };
});
jest.mock("@platform/Radio", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Radio: ({ id, checked, onChange }: any) =>
      React.createElement(View, {
        testID: `radio-${id}`,
        accessibilityState: { checked },
        onChange,
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
        {
          testID: `btn-${title}`,
          onPress: onClick,
          disabled,
          accessibilityState: { disabled },
        },
        React.createElement(Text, null, label)
      );
    },
  };
});
jest.mock("@platform/Pagination", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Pagination: ({ currentPage, onPageChange }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: "next-page", onPress: () => onPageChange?.(currentPage + 1) },
        React.createElement(Text, null, "Next page")
      ),
  };
});

import SearchTenancyContractResults from "@shared/components/SearchTenancyContract/searchTenancyContractResult";
import type { TenancyContractItem } from "@shared/hooks/useGetTenancyContracts";

const makeItem = (
  id: string,
  overrides?: Partial<TenancyContractItem>
): TenancyContractItem => ({
  tenancyContractId: id,
  contractNumber: `CN-${id}`,
  startDate: `2026-01-0${id}`,
  isRenew: 0,
  ...overrides,
});

const EMPTY_SELECTED: TenancyContractItem[] = [];

const baseProps = {
  results: [makeItem("1"), makeItem("2", { isRenew: 1 })],
  isLoading: false,
  pageSize: 5,
  totalCount: 2,
  selected: EMPTY_SELECTED,
  language: "en" as const,
};

describe("SearchTenancyContractResults (shared component – mobile platform)", () => {
  afterEach(() => jest.clearAllMocks());

  // ── Render / heading ───────────────────────────────────────────────────────
  it("renders the Search Results heading", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders Arabic heading when language=ar", () => {
    render(<SearchTenancyContractResults {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  // ── Loading ─────────────────────────────────────────────────────────────────
  it("shows loading text when isLoading=true", () => {
    render(<SearchTenancyContractResults {...baseProps} isLoading />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic loading text", () => {
    render(<SearchTenancyContractResults {...baseProps} isLoading language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeTruthy();
  });

  it("does not render cards while loading", () => {
    render(<SearchTenancyContractResults {...baseProps} isLoading />);
    expect(screen.queryByText("CN-1")).toBeNull();
  });

  // ── Result cards ─────────────────────────────────────────────────────────────
  it("renders a card per result with contract number", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("CN-1")).toBeTruthy();
    expect(screen.getByText("CN-2")).toBeTruthy();
  });

  it("renders New Tenancy / Renew Tenancy based on isRenew", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("New Tenancy")).toBeTruthy();
    expect(screen.getByText("Renew Tenancy")).toBeTruthy();
  });

  it("renders contract dates", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("2026-01-01")).toBeTruthy();
    expect(screen.getByText("2026-01-02")).toBeTruthy();
  });

  it("renders Plots and Details buttons for each card", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getAllByTestId("btn-Plots").length).toBe(2);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("renders the result count text", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    // pageSize (5) is rendered as a fragment alongside whitespace inside a Text.
    expect(screen.getByText(/5/)).toBeTruthy();
    expect(screen.getByText("results")).toBeTruthy();
  });

  // ── Edit link ─────────────────────────────────────────────────────────────────
  it("calls onCloseDrawer when Edit is pressed", () => {
    const onCloseDrawer = jest.fn();
    render(
      <SearchTenancyContractResults {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Arabic Edit label", () => {
    render(<SearchTenancyContractResults {...baseProps} language="ar" />);
    expect(screen.getByText("تعديل")).toBeTruthy();
  });

  // ── Selection ───────────────────────────────────────────────────────────────
  it("Select button disabled when nothing selected", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(
      screen.getByTestId("btn-Select Tenancy Agreement").props.accessibilityState
        .disabled
    ).toBe(true);
  });

  it("selecting a card enables the Select button", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    fireEvent.press(screen.getByText("CN-1"));
    expect(
      screen.getByTestId("btn-Select Tenancy Agreement").props.accessibilityState
        .disabled
    ).toBe(false);
  });

  it("calls onSubmit, onSelectResult and onCloseDrawer on selection submit", () => {
    const onSubmit = jest.fn();
    const onSelectResult = jest.fn();
    const onCloseDrawer = jest.fn();
    render(
      <SearchTenancyContractResults
        {...baseProps}
        selected={[makeItem("1")]}
        onSubmit={onSubmit}
        onSelectResult={onSelectResult}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Select Tenancy Agreement"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0][0]).toMatchObject({ tenancyContractId: "1" });
    expect(onSelectResult).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not call onSubmit when no selection (button disabled)", () => {
    const onSubmit = jest.fn();
    render(<SearchTenancyContractResults {...baseProps} onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("btn-Select Tenancy Agreement"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("re-selecting another card switches the selection", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    fireEvent.press(screen.getByText("CN-1"));
    fireEvent.press(screen.getByText("CN-2"));
    expect(
      screen.getByTestId("btn-Select Tenancy Agreement").props.accessibilityState
        .disabled
    ).toBe(false);
  });

  // ── Pagination ────────────────────────────────────────────────────────────────
  it("calls onPageChange when next page is used (server paginated)", () => {
    const onPageChange = jest.fn();
    render(
      <SearchTenancyContractResults
        {...baseProps}
        results={Array.from({ length: 5 }, (_, i) => makeItem(String(i + 1)))}
        totalCount={25}
        pageSize={5}
        isServerPaginated
        onPageChange={onPageChange}
      />
    );
    fireEvent.press(screen.getByTestId("next-page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  // ── getCurrentPageResults branches ─────────────────────────────────────────────
  it("returns all results when isServerPaginated", () => {
    const results = Array.from({ length: 8 }, (_, i) => makeItem(String(i + 1)));
    render(
      <SearchTenancyContractResults
        {...baseProps}
        results={results}
        totalCount={20}
        pageSize={5}
        isServerPaginated
      />
    );
    expect(screen.getByText("CN-8")).toBeTruthy();
  });

  it("slices client-side when results exceed pageSize and not server paginated", () => {
    const results = Array.from({ length: 12 }, (_, i) => makeItem(String(i + 1)));
    render(
      <SearchTenancyContractResults
        {...baseProps}
        results={results}
        totalCount={12}
        pageSize={5}
      />
    );
    expect(screen.getByText("CN-1")).toBeTruthy();
    expect(screen.getByText("CN-5")).toBeTruthy();
    expect(screen.queryByText("CN-6")).toBeNull();
  });

  it("returns results unchanged when pageSize is 0", () => {
    const results = [makeItem("1"), makeItem("2")];
    render(
      <SearchTenancyContractResults
        {...baseProps}
        results={results}
        totalCount={2}
        pageSize={0}
      />
    );
    expect(screen.getByText("CN-1")).toBeTruthy();
    expect(screen.getByText("CN-2")).toBeTruthy();
  });

  // ── Arabic card rendering (exercises value_ar/label_ar fallbacks) ────────────
  it("renders cards in Arabic, using Arabic row labels", () => {
    render(<SearchTenancyContractResults {...baseProps} language="ar" />);
    expect(screen.getAllByText("نوع عقد الإيجار").length).toBe(2); // Tenancy Contract Type
    expect(screen.getAllByText("تاريخ العقد").length).toBe(2); // Contract Date
  });

  it("renders the English row labels in English mode", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getAllByText("Tenancy Contract Type").length).toBe(2);
    expect(screen.getAllByText("Contract Date").length).toBe(2);
  });

  // ── Selecting via the radio control ──────────────────────────────────────────
  it("selecting via card click marks the radio as checked", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    fireEvent.press(screen.getByText("CN-1"));
    expect(screen.getByTestId("radio-1").props.accessibilityState.checked).toBe(true);
  });

  // ── pre-selected via prop syncs through useEffect ────────────────────────────
  it("reflects an externally provided selected item via the radio", () => {
    render(
      <SearchTenancyContractResults {...baseProps} selected={[makeItem("2", { isRenew: 1 })]} />
    );
    expect(screen.getByTestId("radio-2").props.accessibilityState.checked).toBe(true);
  });

  // ── Optional/missing fields (exercises ?. and ?? fallbacks) ──────────────────
  it("renders a card when optional fields are missing", () => {
    const partial = {
      // tenancyContractId omitted → falls back to "" for the radio id
      contractNumber: undefined,
      startDate: undefined,
      isRenew: 1,
    } as unknown as TenancyContractItem;
    expect(() =>
      render(
        <SearchTenancyContractResults
          {...baseProps}
          results={[partial]}
          totalCount={1}
        />
      )
    ).not.toThrow();
    expect(screen.getByText("Renew Tenancy")).toBeTruthy();
  });

  // ── Submit without the optional onSelectResult callback ──────────────────────
  it("submits selection without an onSelectResult handler", () => {
    const onSubmit = jest.fn();
    const onCloseDrawer = jest.fn();
    render(
      <SearchTenancyContractResults
        {...baseProps}
        selected={[makeItem("1")]}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Select Tenancy Agreement"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  // ── results length <= pageSize (returns directly, no client slice) ───────────
  it("returns results directly when results length is <= pageSize (no slice)", () => {
    const results = [makeItem("1"), makeItem("2", { isRenew: 1 })];
    render(
      <SearchTenancyContractResults
        {...baseProps}
        results={results}
        totalCount={2}
        pageSize={5}
      />
    );
    expect(screen.getByText("CN-1")).toBeTruthy();
    expect(screen.getByText("CN-2")).toBeTruthy();
  });

  // ── Platform ────────────────────────────────────────────────────────────────
  it("renders on mobile platform", () => {
    render(<SearchTenancyContractResults {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });
});
