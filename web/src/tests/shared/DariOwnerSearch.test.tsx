import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Mock ALL hooks BEFORE component imports to prevent network/hangs ──────────
vi.mock("@shared/hooks/useGetSearchByDariOwner", () => ({
  useGetSearchByDariOwner: vi.fn(() => ({
    data: undefined,
    isPending: false,
    isLoading: false,
  })),
  getSearchByDariOwner: vi.fn(() =>
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
  ),
}));

vi.mock("@shared/hooks/useGetDariNationalities", () => ({
  useGetDariNationalities: vi.fn(() => ({
    options: [
      { label: "Emirati", label_ar: "إماراتي", value: "1" },
      { label: "Indian", label_ar: "هندي", value: "2" },
    ],
    isLoading: false,
  })),
}));

vi.mock("@shared/hooks/useGetDariOwnerDetail", () => ({
  default: vi.fn(() => ({ data: undefined, isPending: false })),
}));

vi.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => ({
  default: () => <div data-testid="view-owner-detail">ViewOwnerDetail</div>,
}));

// CustomDrawer (vaul) does not mount children when closed — render them always
// so the search-result flow (onSubmit -> mapping -> result list) is exercised.
vi.mock("@platform/CustomDrawer", () => ({
  CustomDrawer: ({ children }: any) => <div data-testid="drawer">{children}</div>,
}));

// Lightweight MultiSelect: a button that selects every optional field value,
// driving the dynamic-field rendering branches in both search forms.
vi.mock("@platform/MultiSelect", () => ({
  MultiSelect: ({ options, value, onChange }: any) => (
    <div>
      <button
        data-testid="add-all-fields"
        onClick={() => onChange?.(options.map((o: any) => o.value))}
      >
        add-all
      </button>
      <button data-testid="clear-fields" onClick={() => onChange?.([])}>
        clear
      </button>
      <span data-testid="visible-count">{value?.length ?? 0}</span>
    </div>
  ),
}));

vi.mock("axios");

import DariOwnerSearch from "@shared/components/DariOwnerSearch/dariOwnerSearch";
import SearchByOwner from "@shared/components/DariOwnerSearch/searchByOwner";
import SearchByCompanyOwner from "@shared/components/DariOwnerSearch/searchByComapnyOnwer";
import DariOwnerSearchResult from "@shared/components/DariOwnerSearch/dariOwnerSearchResult";
import {
  getSearchByDariOwner,
  type DariOwnerSearchResultProps,
} from "@shared/hooks/useGetSearchByDariOwner";

const mockedSearch = vi.mocked(getSearchByDariOwner);

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

// ── DariOwnerSearch (main, tab switcher) ──────────────────────────────────────
describe("DariOwnerSearch", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<DariOwnerSearch />);
  });

  it("renders default owner & company tab labels (en)", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    expect(screen.getByText("By Owner")).toBeInTheDocument();
    expect(screen.getByText("By Company Owner")).toBeInTheDocument();
  });

  it("renders Arabic tab labels", () => {
    renderWithQueryClient(<DariOwnerSearch language="ar" />);
    expect(screen.getByText("حسب المالك")).toBeInTheDocument();
    expect(screen.getByText("حسب مالك الشركة")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    renderWithQueryClient(<DariOwnerSearch title="Find Owner" language="en" />);
    expect(screen.getByText("Find Owner")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderWithQueryClient(
      <DariOwnerSearch subtitle="Enter details" language="en" />
    );
    expect(screen.getByText("Enter details")).toBeInTheDocument();
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
    expect(screen.getByText("ابحث عن المالك")).toBeInTheDocument();
    expect(screen.getByText("أدخل التفاصيل")).toBeInTheDocument();
  });

  it("renders owner form by default (Emirates ID present)", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
  });

  it("renders company form when initialOwnerType='company'", () => {
    renderWithQueryClient(
      <DariOwnerSearch language="en" initialOwnerType="company" />
    );
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("switches to company tab on click", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    fireEvent.click(screen.getByText("By Company Owner"));
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("switches back to owner tab on click", () => {
    renderWithQueryClient(
      <DariOwnerSearch language="en" initialOwnerType="company" />
    );
    fireEvent.click(screen.getByText("By Owner"));
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
  });

  it("hides tabs when showTabs=false", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" showTabs={false} />);
    expect(screen.queryByText("By Company Owner")).not.toBeInTheDocument();
    // owner form still shows
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
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
    expect(screen.getByText("Companies")).toBeInTheDocument();
    expect(screen.getByText("Individuals")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<DariOwnerSearch language="en" platform="mobile" />);
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
  });

  it("default onSubmit noop runs when none provided (full flow)", async () => {
    mockedSearch.mockClear();
    renderWithQueryClient(<DariOwnerSearch language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    fireEvent.click(screen.getByText("Result Owner"));
    // No onSubmit passed -> default () => {} is exercised
    fireEvent.click(screen.getByText("Select Owner"));
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });
});

// ── SearchByOwner ─────────────────────────────────────────────────────────────
describe("SearchByOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
  });

  it("renders core field labels", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
    expect(screen.getByText("MOI Unified Number")).toBeInTheDocument();
    expect(screen.getByText("Passport Number")).toBeInTheDocument();
    expect(screen.getByText("Nationality")).toBeInTheDocument();
    expect(screen.getByText("Match Type")).toBeInTheDocument();
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<SearchByOwner language="ar" />);
    expect(screen.getByText("رقم الهوية الإماراتية")).toBeInTheDocument();
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<SearchByOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with selected prop", () => {
    renderWithQueryClient(
      <SearchByOwner language="en" selected={EMPTY_SELECTED} />
    );
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
  });

  it("adding all optional fields renders dynamic field labels", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Mobile Number")).toBeInTheDocument();
    expect(screen.getByText("Family Number")).toBeInTheDocument();
    expect(screen.getByText("Family Name")).toBeInTheDocument();
    expect(screen.getByText("Last Certificate Number")).toBeInTheDocument();
  });

  it("removing fields resets them (clear path / useEffect resetField)", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("clear-fields"));
    expect(screen.queryByText("Owner Name")).not.toBeInTheDocument();
  });

  it("submitting runs the search and renders results in the drawer", async () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(<SearchByOwner language="en" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Search"));
    expect(await screen.findByText("Result Owner")).toBeInTheDocument();
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("pagination next in drawer triggers handlePageChange (refetch)", async () => {
    mockedSearch.mockClear();
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    fireEvent.click(screen.getByLabelText("Next page"));
    await waitFor(() =>
      expect(mockedSearch.mock.calls.length).toBeGreaterThan(1)
    );
    // second call carries page=2
    const lastArg = mockedSearch.mock.calls.at(-1)?.[0] as any;
    expect(lastArg.page).toBe(2);
  });

  it("submit error is caught and no results render", async () => {
    mockedSearch.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(screen.queryByText("Result Owner")).not.toBeInTheDocument()
    );
  });

  it("submit error with non-Error value is caught (else branch)", async () => {
    mockedSearch.mockRejectedValueOnce("string-error");
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(screen.queryByText("Result Owner")).not.toBeInTheDocument()
    );
  });

  it("pagination error is caught (handlePageChange catch)", async () => {
    mockedSearch.mockClear();
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    mockedSearch.mockRejectedValueOnce(new Error("page boom"));
    fireEvent.click(screen.getByLabelText("Next page"));
    await waitFor(() =>
      expect(mockedSearch.mock.calls.length).toBeGreaterThan(1)
    );
  });

  it("selecting a result then Select Owner fires onSubmit", async () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(<SearchByOwner language="en" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    fireEvent.click(screen.getByText("Result Owner"));
    fireEvent.click(screen.getByText("Select Owner"));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});

// ── SearchByCompanyOwner ──────────────────────────────────────────────────────
describe("SearchByCompanyOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
  });

  it("renders core field labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
    expect(screen.getByText("License No.")).toBeInTheDocument();
    expect(screen.getByText("Abu Dhabi Owner Archive No.")).toBeInTheDocument();
    expect(screen.getByText("Al Ain Owner Archive No.")).toBeInTheDocument();
    expect(screen.getByText("Match Type")).toBeInTheDocument();
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" platform="mobile" />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("adding all optional fields renders dynamic field labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
    expect(screen.getByText("Western Region Owner Archive")).toBeInTheDocument();
  });

  it("removing fields resets them (useEffect resetField path)", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByTestId("add-all-fields"));
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("clear-fields"));
    expect(screen.queryByText("Certificate Number")).not.toBeInTheDocument();
  });

  it("submitting runs the search and renders results in the drawer", async () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Search"));
    expect(await screen.findByText("Result Owner")).toBeInTheDocument();
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("selecting a result then Select Owner fires onSubmit", async () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    fireEvent.click(screen.getByText("Result Owner"));
    fireEvent.click(screen.getByText("Select Owner"));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it("pagination next in drawer triggers handlePageChange (refetch)", async () => {
    mockedSearch.mockClear();
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    fireEvent.click(screen.getByLabelText("Next page"));
    await waitFor(() =>
      expect(mockedSearch.mock.calls.length).toBeGreaterThan(1)
    );
    const lastArg = mockedSearch.mock.calls.at(-1)?.[0] as any;
    expect(lastArg.page).toBe(2);
  });

  it("submit error is caught and no results render", async () => {
    mockedSearch.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(screen.queryByText("Result Owner")).not.toBeInTheDocument()
    );
  });

  it("submit error with non-Error value is caught (else branch)", async () => {
    mockedSearch.mockRejectedValueOnce("string-error");
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(screen.queryByText("Result Owner")).not.toBeInTheDocument()
    );
  });

  it("pagination error is caught (handlePageChange catch)", async () => {
    mockedSearch.mockClear();
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByText("Result Owner");
    mockedSearch.mockRejectedValueOnce(new Error("page boom"));
    fireEvent.click(screen.getByLabelText("Next page"));
    await waitFor(() =>
      expect(mockedSearch.mock.calls.length).toBeGreaterThan(1)
    );
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
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("renders Arabic heading", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} language="ar" />
    );
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("applies rtl dir for Arabic", () => {
    const { container } = renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr dir for English", () => {
    const { container } = renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} />
    );
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("shows loading state (en)", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} isLoading={true} />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading state", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} isLoading={true} language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("does not render cards while loading", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} isLoading={true} />
    );
    expect(screen.queryByText("Owner 1")).not.toBeInTheDocument();
  });

  it("renders a card for each result", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Owner 1")).toBeInTheDocument();
    expect(screen.getByText("Owner 2")).toBeInTheDocument();
  });

  it("renders Arabic owner names", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} language="ar" />
    );
    expect(screen.getByText("مالك 1")).toBeInTheDocument();
  });

  it("renders family name and owner source rows", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Family 1")).toBeInTheDocument();
    expect(screen.getByText("Source 1")).toBeInTheDocument();
    expect(screen.getAllByText("Family Name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Owner Source").length).toBeGreaterThan(0);
  });

  it("renders Details button per card", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  it("renders Select Owner button when there are results", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Select Owner")).toBeInTheDocument();
  });

  it("renders Edit link and calls onCloseDrawer on click", () => {
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalled();
  });

  it("Arabic Edit click calls onCloseDrawer", () => {
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult
        {...baseProps}
        language="ar"
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(screen.getByText("تعديل"));
    expect(onCloseDrawer).toHaveBeenCalled();
  });

  it("clicking a card selects it (handleRadioSelect)", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    fireEvent.click(screen.getByText("Owner 1"));
    const btn = screen.getByText("Select Owner").closest("button");
    expect(btn).not.toBeDisabled();
  });

  it("Select Owner fires onSubmit + onCloseDrawer with a selection", () => {
    const onSubmit = vi.fn();
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult
        {...baseProps}
        selected={[makeResult("1")]}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(screen.getByText("Select Owner"));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCloseDrawer).toHaveBeenCalled();
  });

  it("Select Owner disabled with no selection (handleSelectOwner no-op)", () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} onSubmit={onSubmit} />
    );
    const btn = screen.getByText("Select Owner").closest("button");
    expect(btn).toBeDisabled();
  });

  it("clicking Details opens owner detail drawer", () => {
    renderWithQueryClient(<DariOwnerSearchResult {...baseProps} />);
    fireEvent.click(screen.getAllByText("Details")[0]);
    expect(screen.getByTestId("view-owner-detail")).toBeInTheDocument();
  });

  it("empty results keep heading, no Select Owner", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} results={[]} totalCount={0} />
    );
    expect(screen.getByText("Search Results")).toBeInTheDocument();
    expect(screen.queryByText("Select Owner")).not.toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} platform="mobile" />
    );
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("returns results directly when no pageSize provided", () => {
    renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} pageSize={undefined} />
    );
    expect(screen.getByText("Owner 1")).toBeInTheDocument();
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
    expect(screen.getByText("Owner 1")).toBeInTheDocument();
    expect(screen.getByText("Owner 5")).toBeInTheDocument();
    expect(screen.queryByText("Owner 6")).not.toBeInTheDocument();
  });

  it("pagination next button calls onPageChange", () => {
    const onPageChange = vi.fn();
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
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("re-syncs selectedIds when selected prop changes (useEffect)", () => {
    const { rerender } = renderWithQueryClient(
      <DariOwnerSearchResult {...baseProps} />
    );
    rerender(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <DariOwnerSearchResult {...baseProps} selected={[makeResult("2")]} />
      </QueryClientProvider>
    );
    expect(screen.getByText("Owner 2")).toBeInTheDocument();
  });
});
