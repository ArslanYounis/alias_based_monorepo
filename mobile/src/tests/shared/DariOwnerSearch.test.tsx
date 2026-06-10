/**
 * MOBILE tests for the shared DariOwnerSearch module.
 * Mirrors the web logic template (web/src/tests/shared/DariOwnerSearch.test.tsx)
 * using mobile @platform primitives + @testing-library/react-native.
 *
 * Covers: dariOwnerSearch.tsx (tab switch, language, showTabs, title/subtitle),
 * searchByOwner.tsx + searchByComapnyOnwer.tsx (fields, dynamic fields, submit,
 * pagination, error branches), dariOwnerSearchResult.tsx (loading/empty/success,
 * selection, pagination, detail drawer, rtl/ltr).
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Shared hook mocks (BEFORE component imports) ─────────────────────────────
const mockGetSearchByDariOwner = jest.fn(() =>
  Promise.resolve({
    items: [
      {
        ownerID: 11,
        ownerNameEn: "Result Owner",
        ownerNameAr: "مالك النتيجة",
        familyNameEn: "Result Family",
        familyNameAr: "عائلة النتيجة",
        ownerSource: "Dari",
      },
    ],
    pageNumber: 1,
    totalCount: 25,
  })
);

jest.mock("@shared/hooks/useGetSearchByDariOwner", () => ({
  __esModule: true,
  useGetSearchByDariOwner: jest.fn(() => ({
    data: undefined,
    isPending: false,
    isLoading: false,
  })),
  getSearchByDariOwner: (...args: any[]) => mockGetSearchByDariOwner(...args),
}));

jest.mock("@shared/hooks/useGetDariNationalities", () => ({
  __esModule: true,
  useGetDariNationalities: jest.fn(() => ({
    options: [
      { label: "Emirati", label_ar: "إماراتي", value: "1" },
      { label: "Indian", label_ar: "هندي", value: "2" },
    ],
    isLoading: false,
  })),
}));

jest.mock("@shared/hooks/useGetDariOwnerDetail", () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: undefined, isPending: false })),
}));

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

// ── react-form mock: submit invokes onSubmit with default values ─────────────
let formOnSubmit: any;
jest.mock("@tanstack/react-form", () => ({
  useForm: jest.fn((opts: any) => {
    formOnSubmit = opts?.onSubmit;
    return {
      Field: ({ children, name }: any) =>
        children({
          state: { value: "", meta: { errors: [], isTouched: false } },
          handleChange: jest.fn(),
          handleBlur: jest.fn(),
          name,
        }),
      handleSubmit: jest.fn(() =>
        opts?.onSubmit?.({ value: opts?.defaultValues || {} })
      ),
      state: { values: {}, isSubmitted: false },
      resetField: jest.fn(),
    };
  }),
}));

// ── react-query mock: keep real provider, stub useMutation/useQuery ──────────
const mockMutateAsync = jest.fn((p: any) => mockGetSearchByDariOwner(p));
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useMutation: jest.fn(() => ({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })),
    useQuery: jest.fn(() => ({ data: undefined, isPending: false })),
  };
});

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    Container: ({ children, onClick, dir, ...p }: any) =>
      React.createElement(
        onClick ? Pressable : View,
        { onPress: onClick, accessibilityLabel: dir, ...p },
        children
      ),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Text: ({ children, ...p }: any) => React.createElement(Text, p, children) };
});
jest.mock("@platform/RadioCard", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioCard: ({ label, label_ar, language, onClick, id }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: `radio-card-${id}`, onPress: () => onClick?.(id) },
        React.createElement(
          Text,
          null,
          language === "ar" && label_ar ? label_ar : label
        )
      ),
  };
});
jest.mock("@platform/Radio", () => {
  const React = require("react");
  const { TouchableOpacity } = require("react-native");
  return {
    Radio: ({ id, onChange }: any) =>
      React.createElement(TouchableOpacity, {
        testID: `radio-${id}`,
        onPress: onChange,
      }),
  };
});
jest.mock("@platform/Select", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Select: ({ label, label_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "select" },
        language === "ar" && label_ar ? label_ar : label
      ),
  };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    TextInput: ({ label, label_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "text-input" },
        language === "ar" && label_ar ? label_ar : label
      ),
  };
});
jest.mock("@platform/NumberInput", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    NumberInput: ({ label, label_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "number-input" },
        language === "ar" && label_ar ? label_ar : label
      ),
  };
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        View,
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
    Pagination: ({ currentPage, onPageChange }: any) =>
      React.createElement(
        TouchableOpacity,
        {
          testID: "pagination-next",
          onPress: () => onPageChange?.((currentPage ?? 1) + 1),
        },
        React.createElement(Text, null, "Next")
      ),
  };
});
// CustomDrawer (vaul/native) does not mount children when closed — render them
// always so the search-result flow (onSubmit -> mapping -> result list) runs.
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CustomDrawer: ({ children }: any) =>
      React.createElement(View, { testID: "drawer" }, children),
  };
});
// Lightweight MultiSelect: buttons that add/clear every optional field value,
// driving the dynamic-field rendering branches in both search forms.
jest.mock("@platform/MultiSelect", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    MultiSelect: ({ options, onChange }: any) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          TouchableOpacity,
          {
            testID: "add-all-fields",
            onPress: () => onChange?.(options.map((o: any) => o.value)),
          },
          React.createElement(Text, null, "add-all")
        ),
        React.createElement(
          TouchableOpacity,
          { testID: "clear-fields", onPress: () => onChange?.([]) },
          React.createElement(Text, null, "clear")
        )
      ),
  };
});
jest.mock("@platform/icons", () => ({
  OwnerIcon: () => null,
  CompanyIcon: () => null,
  SearchIcon: () => null,
  PersonIcon: () => null,
  UAENationalIcon: () => null,
}));
jest.mock("lodash", () => ({
  some: (arr: any[], pred: any) => arr.some(pred),
}));
jest.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "view-owner-detail" }),
  };
});

jest.mock("axios");

import DariOwnerSearch from "@shared/components/DariOwnerSearch/dariOwnerSearch";
import SearchByOwner from "@shared/components/DariOwnerSearch/searchByOwner";
import SearchByCompanyOwner from "@shared/components/DariOwnerSearch/searchByComapnyOnwer";
import DariOwnerSearchResult from "@shared/components/DariOwnerSearch/dariOwnerSearchResult";
import type { DariOwnerSearchResultProps } from "@shared/hooks/useGetSearchByDariOwner";
import { createDariOwnerSearchConfig } from "@shared/components/DariOwnerSearch/dariOwnerSearch.config";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

const makeResult = (id: string): DariOwnerSearchResultProps => ({
  ownerId: id,
  ownerID: id,
  ownerNameEn: `Owner ${id}`,
  ownerNameAr: `مالك ${id}`,
  familyNameEn: `Family ${id}`,
  familyNameAr: `عائلة ${id}`,
  ownerSource: `Source ${id}`,
});

const EMPTY_SELECTED: DariOwnerSearchResultProps[] = [];

beforeEach(() => {
  const { useMutation } = require("@tanstack/react-query");
  (useMutation as jest.Mock).mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending: false,
  });
  mockMutateAsync.mockClear();
  mockGetSearchByDariOwner.mockClear();
});

// ── DariOwnerSearch (main, tab switcher) ─────────────────────────────────────
describe("DariOwnerSearch", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<DariOwnerSearch />);
  });

  it("renders default owner & company tab labels (en)", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    expect(screen.getByText("By Owner")).toBeTruthy();
    expect(screen.getByText("By Company Owner")).toBeTruthy();
  });

  it("renders Arabic tab labels", () => {
    renderWithQueryClient(<DariOwnerSearch language="ar" />);
    expect(screen.getByText("حسب المالك")).toBeTruthy();
    expect(screen.getByText("حسب مالك الشركة")).toBeTruthy();
  });

  it("renders title when provided", () => {
    renderWithQueryClient(<DariOwnerSearch title="Find Owner" language="en" />);
    expect(screen.getByText("Find Owner")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    renderWithQueryClient(
      <DariOwnerSearch subtitle="Enter details" language="en" />
    );
    expect(screen.getByText("Enter details")).toBeTruthy();
  });

  it("renders Arabic title and subtitle", () => {
    renderWithQueryClient(
      <DariOwnerSearch
        title="Find Owner"
        title_ar="ابحث عن المالك"
        subtitle="Enter details"
        subtitle_ar="أدخل التفاصيل"
        language="ar"
      />
    );
    expect(screen.getByText("ابحث عن المالك")).toBeTruthy();
    expect(screen.getByText("أدخل التفاصيل")).toBeTruthy();
  });

  it("renders owner form by default (Emirates ID present)", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    expect(screen.getByText("Emirates ID")).toBeTruthy();
  });

  it("renders company form when initialOwnerType='company'", () => {
    renderWithQueryClient(
      <DariOwnerSearch language="en" initialOwnerType="company" />
    );
    expect(screen.getByText("Company Name")).toBeTruthy();
  });

  it("switches to company tab on click", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    fireEvent.press(screen.getByTestId("radio-card-company"));
    expect(screen.getByText("Company Name")).toBeTruthy();
  });

  it("switches back to owner tab on click", () => {
    renderWithQueryClient(
      <DariOwnerSearch language="en" initialOwnerType="company" />
    );
    fireEvent.press(screen.getByTestId("radio-card-owner"));
    expect(screen.getByText("Emirates ID")).toBeTruthy();
  });

  it("hides tabs when showTabs=false", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" showTabs={false} />);
    expect(screen.queryByTestId("radio-card-company")).toBeNull();
    expect(screen.getByText("Emirates ID")).toBeTruthy();
  });

  it("applies custom ownerTypeOptions", () => {
    renderWithQueryClient(
      <DariOwnerSearch
        language="en"
        ownerTypeOptions={{
          company: "Companies",
          company_ar: "الشركات",
          owner: "Individuals",
          owner_ar: "الأفراد",
        }}
      />
    );
    expect(screen.getByText("Companies")).toBeTruthy();
    expect(screen.getByText("Individuals")).toBeTruthy();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" platform="mobile" />);
    expect(screen.getByText("Emirates ID")).toBeTruthy();
  });

  it("createDariOwnerSearchConfig builds a DLS component config", () => {
    const config = createDariOwnerSearchConfig(DariOwnerSearch as any, null as any);
    expect(config.id).toBe("dariOwnerSeach");
    expect(config.name).toBe("Dari Owner Search");
    expect(config.Component).toBe(DariOwnerSearch);
    expect(config.controls).toBeTruthy();
  });

  it("default onSubmit noop runs when none provided (full flow)", async () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.getByText("Result Owner")).toBeTruthy();
    fireEvent.press(screen.getByText("Result Owner"));
    fireEvent.press(screen.getByTestId("btn-Select Owner"));
    expect(screen.getAllByText("Search Results").length).toBeGreaterThan(0);
  });
});

// ── SearchByOwner ─────────────────────────────────────────────────────────────
describe("SearchByOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
  });

  it("renders core field labels", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Emirates ID")).toBeTruthy();
    expect(screen.getByText("MOI Unified Number")).toBeTruthy();
    expect(screen.getByText("Passport Number")).toBeTruthy();
    expect(screen.getByText("Match Type")).toBeTruthy();
    expect(screen.getByText("Results to Display")).toBeTruthy();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<SearchByOwner language="ar" />);
    expect(screen.getByText("رقم الهوية الإماراتية")).toBeTruthy();
    expect(screen.getByText("بحث")).toBeTruthy();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<SearchByOwner language="en" platform="mobile" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders with selected prop", () => {
    renderWithQueryClient(
      <SearchByOwner language="en" selected={EMPTY_SELECTED} />
    );
    expect(screen.getByText("Emirates ID")).toBeTruthy();
  });

  it("adding all optional fields renders dynamic field labels", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.press(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Owner Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Mobile Number")).toBeTruthy();
    expect(screen.getByText("Family Number")).toBeTruthy();
    expect(screen.getByText("Family Name")).toBeTruthy();
    expect(screen.getByText("Last Certificate Number")).toBeTruthy();
  });

  it("removing fields resets them (clear path / useEffect resetField)", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.press(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Owner Name")).toBeTruthy();
    fireEvent.press(screen.getByTestId("clear-fields"));
    expect(screen.queryByText("Owner Name")).toBeNull();
  });

  it("submitting runs the search and renders results in the drawer", async () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(<SearchByOwner language="en" onSubmit={onSubmit} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.getByText("Result Owner")).toBeTruthy();
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("pagination next in drawer triggers handlePageChange (refetch)", async () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId("pagination-next"));
    });
    expect(mockMutateAsync.mock.calls.length).toBeGreaterThan(1);
    const lastArg = mockMutateAsync.mock.calls.at(-1)?.[0] as any;
    expect(lastArg.page).toBe(2);
  });

  it("submit error is caught and no results render", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<SearchByOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.queryByText("Result Owner")).toBeNull();
  });

  it("submit error with non-Error value is caught (else branch)", async () => {
    mockMutateAsync.mockRejectedValueOnce("string-error");
    renderWithQueryClient(<SearchByOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.queryByText("Result Owner")).toBeNull();
  });

  it("pagination error is caught (handlePageChange catch)", async () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    mockMutateAsync.mockRejectedValueOnce(new Error("page boom"));
    await act(async () => {
      fireEvent.press(screen.getByTestId("pagination-next"));
    });
    expect(mockMutateAsync.mock.calls.length).toBeGreaterThan(1);
  });

  it("selecting a result then Select Owner fires onSubmit", async () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(<SearchByOwner language="en" onSubmit={onSubmit} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    fireEvent.press(screen.getByText("Result Owner"));
    fireEvent.press(screen.getByTestId("btn-Select Owner"));
    expect(onSubmit).toHaveBeenCalled();
  });
});

// ── SearchByCompanyOwner ──────────────────────────────────────────────────────
describe("SearchByCompanyOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
  });

  it("renders core field labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeTruthy();
    expect(screen.getByText("License No.")).toBeTruthy();
    expect(screen.getByText("Abu Dhabi Owner Archive No.")).toBeTruthy();
    expect(screen.getByText("Al Ain Owner Archive No.")).toBeTruthy();
    expect(screen.getByText("Match Type")).toBeTruthy();
    expect(screen.getByText("Results to Display")).toBeTruthy();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeTruthy();
    expect(screen.getByText("بحث")).toBeTruthy();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" platform="mobile" />
    );
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("adding all optional fields renders dynamic field labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Certificate Number")).toBeTruthy();
    expect(screen.getByText("Western Region Owner Archive")).toBeTruthy();
  });

  it("removing fields resets them (useEffect resetField path)", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Certificate Number")).toBeTruthy();
    fireEvent.press(screen.getByTestId("clear-fields"));
    expect(screen.queryByText("Certificate Number")).toBeNull();
  });

  it("submitting runs the search and renders results in the drawer", async () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.getByText("Result Owner")).toBeTruthy();
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("selecting a result then Select Owner fires onSubmit", async () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    fireEvent.press(screen.getByText("Result Owner"));
    fireEvent.press(screen.getByTestId("btn-Select Owner"));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("pagination next in drawer triggers handlePageChange (refetch)", async () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId("pagination-next"));
    });
    expect(mockMutateAsync.mock.calls.length).toBeGreaterThan(1);
    const lastArg = mockMutateAsync.mock.calls.at(-1)?.[0] as any;
    expect(lastArg.page).toBe(2);
  });

  it("submit error is caught and no results render", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.queryByText("Result Owner")).toBeNull();
  });

  it("submit error with non-Error value is caught (else branch)", async () => {
    mockMutateAsync.mockRejectedValueOnce("string-error");
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.queryByText("Result Owner")).toBeNull();
  });

  it("pagination error is caught (handlePageChange catch)", async () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    mockMutateAsync.mockRejectedValueOnce(new Error("page boom"));
    await act(async () => {
      fireEvent.press(screen.getByTestId("pagination-next"));
    });
    expect(mockMutateAsync.mock.calls.length).toBeGreaterThan(1);
  });
});

// ── DariOwnerSearchResult ─────────────────────────────────────────────────────
describe("DariOwnerSearchResult", () => {
  const baseProps = {
    isLoading: false,
    results: [makeResult("1"), makeResult("2")],
    pageSize: 10,
    totalCount: 2,
    language: "en" as const,
    selected: EMPTY_SELECTED,
  };

  it("renders without crashing", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("renders Arabic heading", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeTruthy();
  });

  it("applies rtl dir for Arabic", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByLabelText("rtl")).toBeTruthy();
  });

  it("applies ltr dir for English", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByLabelText("ltr")).toBeTruthy();
  });

  it("shows loading state (en)", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} isLoading={true} />
    );
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic loading state", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} isLoading={true} language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeTruthy();
  });

  it("does not render cards while loading", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} isLoading={true} />
    );
    expect(screen.queryByText("Owner 1")).toBeNull();
  });

  it("renders a card for each result", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Owner 1")).toBeTruthy();
    expect(screen.getByText("Owner 2")).toBeTruthy();
  });

  it("renders Arabic owner names", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("مالك 1")).toBeTruthy();
  });

  it("renders family name and owner source rows", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Family 1")).toBeTruthy();
    expect(screen.getByText("Source 1")).toBeTruthy();
    expect(screen.getAllByText("Family Name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Owner Source").length).toBeGreaterThan(0);
  });

  it("renders Details button per card", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getAllByTestId("btn-Details").length).toBe(2);
  });

  it("renders Select Owner button when there are results", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByTestId("btn-Select Owner")).toBeTruthy();
  });

  it("renders Edit link and calls onCloseDrawer on click", () => {
    const onCloseDrawer = jest.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.press(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalled();
  });

  it("Arabic Edit click calls onCloseDrawer", () => {
    const onCloseDrawer = jest.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult
        {...baseProps}
        language="ar"
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByText("تعديل"));
    expect(onCloseDrawer).toHaveBeenCalled();
  });

  it("clicking a card selects it (handleRadioSelect)", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    fireEvent.press(screen.getByText("Owner 1"));
    expect(screen.getByTestId("btn-Select Owner").props.disabled).toBeFalsy();
  });

  it("clicking the radio selects it (handleRadioSelect)", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    fireEvent.press(screen.getByTestId("radio-1"));
    expect(screen.getByTestId("btn-Select Owner").props.disabled).toBeFalsy();
  });

  it("Select Owner fires onSubmit + onCloseDrawer with a selection", () => {
    const onSubmit = jest.fn();
    const onCloseDrawer = jest.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult
        {...baseProps}
        selected={[makeResult("1")]}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Select Owner"));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCloseDrawer).toHaveBeenCalled();
  });

  it("Select Owner disabled with no selection (handleSelectOwner no-op)", () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} onSubmit={onSubmit} />
    );
    expect(screen.getByTestId("btn-Select Owner").props.disabled).toBeTruthy();
  });

  it("clicking Details opens owner detail drawer", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    fireEvent.press(screen.getAllByTestId("btn-Details")[0]);
    expect(screen.getByTestId("view-owner-detail")).toBeTruthy();
  });

  it("shows loading in detail drawer when owner detail is pending", () => {
    const useGetDariOwnerDetail =
      require("@shared/hooks/useGetDariOwnerDetail").default as jest.Mock;
    useGetDariOwnerDetail.mockReturnValue({ data: undefined, isPending: true });
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    fireEvent.press(screen.getAllByTestId("btn-Details")[0]);
    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
    useGetDariOwnerDetail.mockReturnValue({ data: undefined, isPending: false });
  });

  it("empty results keep heading, no Select Owner", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} results={[]} totalCount={0} />
    );
    expect(screen.getByText("Search Results")).toBeTruthy();
    expect(screen.queryByTestId("btn-Select Owner")).toBeNull();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} platform="mobile" />
    );
    expect(screen.getByText("Search Results")).toBeTruthy();
  });

  it("returns results directly when no pageSize provided", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} pageSize={undefined} />
    );
    expect(screen.getByText("Owner 1")).toBeTruthy();
  });

  it("paginates locally when results exceed pageSize", () => {
    const many = Array.from({ length: 15 }, (_, i) => makeResult(String(i + 1)));
    renderWithQueryClient(
      <DariOwnerSearchResult
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

  it("pagination next button calls onPageChange", () => {
    const onPageChange = jest.fn();
    const many = Array.from({ length: 5 }, (_, i) => makeResult(String(i + 1)));
    renderWithQueryClient(
      <DariOwnerSearchResult
        {...baseProps}
        results={many}
        totalCount={25}
        pageSize={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.press(screen.getByTestId("pagination-next"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("re-syncs selectedIds when selected prop changes (useEffect)", () => {
    const { rerender } = renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} />
    );
    rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <DariOwnerSearchResult {...baseProps} selected={[makeResult("2")]} />
      </QueryClientProvider>
    );
    expect(screen.getByText("Owner 2")).toBeTruthy();
  });
});
