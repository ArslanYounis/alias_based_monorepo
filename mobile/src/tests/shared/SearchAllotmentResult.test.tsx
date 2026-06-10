/**
 * Mobile tests for the shared SearchAllotmentResult component.
 * Covers: heading (en/ar), rtl/ltr dir, loading/empty/success states,
 * result cards, selection + Select Allotment submit + onCloseDrawer,
 * Edit link, Details/Decree drawers, pagination, decree loading, mobile platform.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Language switch mock ─────────────────────────────────────────────────────
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

jest.mock("lodash", () => ({
  some: (arr: any[], pred: any) => arr.some(pred),
}));

// Mock decree detail hook to avoid network / hangs
const mockUseDecreeDetails = jest.fn(() => ({
  data: {
    decree: {
      decreeNumber: "DCR-100",
      decreeDateFormat: "2024-01-01",
      decreeSourceNameE: "Source E",
      decreeSourceNameA: "Source A",
      decreeSourceTypeNameE: "Type E",
      decreeSourceTypeNameA: "Type A",
      comments: "Some remarks",
    },
  },
  isLoading: false,
}));

jest.mock("@shared/hooks/useDecreeDetail", () => ({
  useDecreeDetails: (id?: string) => mockUseDecreeDetails(id as never),
}));

jest.mock("axios");

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    Container: ({ children, onClick, dir, ...p }: any) =>
      React.createElement(
        onClick ? Pressable : View,
        { onPress: onClick, accessibilityLabel: dir ? `dir-${dir}` : undefined, ...p },
        children
      ),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Text: ({ children, ...p }: any) => React.createElement(Text, p, children) };
});
jest.mock("@platform/Radio", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Radio: ({ id, checked }: any) =>
      React.createElement(View, { testID: `radio-${id}`, accessibilityState: { checked } }),
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
        { testID: `btn-${title}`, onPress: onClick, disabled },
        React.createElement(Text, null, label)
      );
    },
  };
});
jest.mock("@platform/Pagination", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Pagination: ({ onPageChange, currentPage }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: "next-page", onPress: () => onPageChange?.((currentPage ?? 1) + 1) },
        React.createElement(Text, null, "Next page")
      ),
  };
});
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CustomDrawer: ({ children, open }: any) =>
      open ? React.createElement(View, { testID: "custom-drawer" }, children) : null,
  };
});

// Mock ViewOwnerDetail to avoid deep rendering
jest.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "view-owner-detail" }),
  };
});

import SearchAllotmentResult, {
  ISearchAllotmentResult,
} from "@shared/components/SearchAllotment/searchAllotmentResult";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const makeResult = (
  id: string,
  overrides?: Partial<ISearchAllotmentResult>
): ISearchAllotmentResult => ({
  id,
  allotmentNameId: id,
  decreeOrder: `DO-${id}`,
  ownerName: `Owner ${id}`,
  landUse: `Use ${id}`,
  familyBookNumber: `FB-${id}`,
  cityNo: `C-${id}`,
  ...overrides,
});

// Stable empty reference to avoid the `selected = []` re-render loop
const EMPTY_SELECTED: ISearchAllotmentResult[] = [];

const baseProps = {
  results: [makeResult("1"), makeResult("2")],
  isLoading: false,
  pageSize: 10,
  totalCount: 2,
  language: "en" as const,
  selected: EMPTY_SELECTED,
};

describe("SearchAllotmentResult", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders Search Results heading", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders Arabic heading when language=ar", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  it("applies rtl direction for Arabic", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByLabelText("dir-rtl")).toBeTruthy();
  });

  it("applies ltr direction for English", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="en" />);
    expect(screen.getByLabelText("dir-ltr")).toBeTruthy();
  });

  it("shows loading text when isLoading=true", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} isLoading />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic loading text", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} isLoading language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeTruthy();
  });

  it("does not render result cards while loading", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} isLoading />);
    expect(screen.queryByText("Owner 1")).toBeNull();
  });

  it("renders a card per result with owner name and land use", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("Owner 1")).toBeTruthy();
    expect(screen.getByText("Owner 2")).toBeTruthy();
    expect(screen.getByText("Use 1")).toBeTruthy();
  });

  it("renders decree order text", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("DO-1")).toBeTruthy();
  });

  it("renders result count and criteria labels", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("We returned")).toBeTruthy();
    expect(screen.getByText("results")).toBeTruthy();
    expect(screen.getByText("for the following search criteria:")).toBeTruthy();
  });

  it("renders Full Name and Land Use labels", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getAllByText("Full Name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Land Use").length).toBeGreaterThan(0);
  });

  it("renders Decree and Details buttons per card", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getAllByTestId("btn-Decree").length).toBe(2);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("renders Select Allotment button", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByTestId("btn-Select Allotment")).toBeTruthy();
  });

  it("renders Arabic Select Allotment button", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByText("حدد التخصيص")).toBeTruthy();
  });

  it("selects a card on press then submits via Select Allotment", () => {
    const onSubmit = jest.fn();
    const onCloseDrawer = jest.fn();
    renderWithQueryClient(
      <SearchAllotmentResult
        {...baseProps}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByText("Owner 1"));
    fireEvent.press(screen.getByTestId("btn-Select Allotment"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not submit when nothing is selected", () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} onSubmit={onSubmit} />
    );
    fireEvent.press(screen.getByTestId("btn-Select Allotment"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("pre-selects a result via selected prop (button enabled)", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} selected={[makeResult("1")]} />
    );
    expect(screen.getByTestId("btn-Select Allotment").props.disabled).toBeFalsy();
  });

  it("calls onCloseDrawer when Edit is pressed", () => {
    const onCloseDrawer = jest.fn();
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Arabic Edit link", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByText("تعديل")).toBeTruthy();
  });

  it("opens owner detail drawer when Details is pressed", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    fireEvent.press(screen.getAllByTestId("btn-Details")[0]);
    expect(screen.getAllByTestId("view-owner-detail").length).toBeGreaterThan(0);
  });

  it("opens decree drawer when Decree is pressed", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    fireEvent.press(screen.getAllByTestId("btn-Decree")[0]);
    expect(screen.getAllByTestId("view-owner-detail").length).toBeGreaterThan(0);
  });

  it("renders empty results without the Select Allotment button", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} results={[]} totalCount={0} />
    );
    expect(screen.getByText("Search Results")).toBeTruthy();
    expect(screen.queryByTestId("btn-Select Allotment")).toBeNull();
  });

  it("paginates locally when results exceed pageSize", () => {
    const many = Array.from({ length: 15 }, (_, i) => makeResult(String(i + 1)));
    renderWithQueryClient(
      <SearchAllotmentResult
        {...baseProps}
        results={many}
        totalCount={15}
        pageSize={5}
      />
    );
    expect(screen.getByText("Owner 1")).toBeTruthy();
    expect(screen.getByText("Owner 5")).toBeTruthy();
    expect(screen.queryByText("Owner 6")).toBeNull();
  });

  it("calls onPageChange via Next page button", () => {
    const onPageChange = jest.fn();
    const many = Array.from({ length: 15 }, (_, i) => makeResult(String(i + 1)));
    renderWithQueryClient(
      <SearchAllotmentResult
        {...baseProps}
        results={many}
        totalCount={15}
        pageSize={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.press(screen.getByTestId("next-page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders cards in Arabic with rtl labels", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getAllByText("الاسم الكامل").length).toBeGreaterThan(0);
    expect(screen.getAllByText("استخدام الأراضي").length).toBeGreaterThan(0);
  });

  it("renders cards with missing optional fields", () => {
    const sparse: ISearchAllotmentResult[] = [
      { allotmentNameId: "9", familyBookNumber: "FB9" },
    ];
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} results={sparse} totalCount={1} />
    );
    expect(screen.getByTestId("btn-Select Allotment")).toBeTruthy();
  });

  it("shows decree drawer loading state when decree is loading", () => {
    mockUseDecreeDetails.mockReturnValue({
      data: undefined as never,
      isLoading: true,
    });
    try {
      renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
      fireEvent.press(screen.getAllByTestId("btn-Decree")[0]);
      expect(screen.getByText("Loading")).toBeTruthy();
    } finally {
      mockUseDecreeDetails.mockReset();
      mockUseDecreeDetails.mockReturnValue({
        data: {
          decree: {
            decreeNumber: "DCR-100",
            decreeDateFormat: "2024-01-01",
            decreeSourceNameE: "Source E",
            decreeSourceNameA: "Source A",
            decreeSourceTypeNameE: "Type E",
            decreeSourceTypeNameA: "Type A",
            comments: "Some remarks",
          },
        },
        isLoading: false,
      });
    }
  });

  it("opens decree drawer in Arabic", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    fireEvent.press(screen.getAllByTestId("btn-Decree")[0]);
    expect(screen.getAllByTestId("view-owner-detail").length).toBeGreaterThan(0);
  });

  it("returns all results when pageSize is 0", () => {
    renderWithQueryClient(
      <SearchAllotmentResult
        {...baseProps}
        pageSize={0}
        results={[makeResult("1"), makeResult("2"), makeResult("3")]}
        totalCount={3}
      />
    );
    expect(screen.getByText("Owner 3")).toBeTruthy();
  });
});
