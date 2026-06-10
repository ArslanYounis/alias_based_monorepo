import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OwnerSearch from "@shared/components/OwnerSearch/OwnerSearch";
import OwnerSearchResult from "@shared/components/OwnerSearch/OwnerSearchResult";
import OwnerSearchByOwner from "@shared/components/OwnerSearch/OwnerSearchByOwner";
import OwnerSearchByCompanyOwner from "@shared/components/OwnerSearch/OwnerSearchByCompanyOwner";

vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  useGetSearchByOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByOwner: vi.fn(),
}));

const mockGetSearchByCompanyOwner = vi.fn(() =>
  Promise.resolve({
    items: [
      { ownerId: 1, companyName: "ACME Co" },
    ],
    pageNumber: 0,
    totalCount: 1,
  })
);
vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  useGetSearchByCompanyOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByCompanyOwner: (...args: unknown[]) =>
    mockGetSearchByCompanyOwner(...(args as [])),
}));

vi.mock("@shared/hooks/useRanchRecipient", () => ({
  useRanchRecipient: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isLoading: false,
  })),
}));

vi.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => ({
  default: () => <div data-testid="view-owner-detail">ViewOwnerDetail</div>,
}));

vi.mock("axios");

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

const sampleResults = [
  {
    ownerId: "1",
    ownerName_E: "John Smith",
    ownerName_A: "جون سميث",
    nationalNumber: "784-1990-1234567-1",
    cityName: "Dubai",
  },
  {
    ownerId: "2",
    ownerName_E: "Jane Doe",
    ownerName_A: "جين دو",
    nationalNumber: "784-1985-7654321-1",
    cityName: "Abu Dhabi",
  },
];

// Stable empty selected array shared across the OwnerSearch flow test.
const SEARCH_EMPTY: typeof sampleResults = [];

describe("OwnerSearch", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<OwnerSearch />);
  });

  it("renders By Company Owner tab by default", () => {
    renderWithQueryClient(<OwnerSearch language="en" />);
    expect(screen.getByText("By Company Owner")).toBeInTheDocument();
  });

  it("renders By Owner tab", () => {
    renderWithQueryClient(<OwnerSearch language="en" />);
    expect(screen.getByText("By Owner")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    renderWithQueryClient(
      <OwnerSearch title="Search Owner" language="en" />
    );
    expect(screen.getByText("Search Owner")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderWithQueryClient(
      <OwnerSearch subtitle="Enter owner details" language="en" />
    );
    expect(screen.getByText("Enter owner details")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = renderWithQueryClient(<OwnerSearch language="ar" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = renderWithQueryClient(<OwnerSearch language="en" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "ltr");
  });

  it("renders Arabic tab labels", () => {
    renderWithQueryClient(<OwnerSearch language="ar" />);
    expect(screen.getByText("حسب المالك")).toBeInTheDocument();
  });

  it("renders with initialOwnerType='owner'", () => {
    renderWithQueryClient(<OwnerSearch language="en" initialOwnerType="owner" />);
    expect(screen.getByText("By Owner")).toBeInTheDocument();
  });

  it("switches to the Owner form when the By Owner tab is clicked", () => {
    renderWithQueryClient(<OwnerSearch language="en" />);
    // default shows the company form (Company Name label)
    expect(screen.getByText("Company Name")).toBeInTheDocument();
    const ownerTab = screen.getByText("By Owner").closest("button")!;
    fireEvent.click(ownerTab);
    // now the owner form is shown (Owner Name label, no Company Name)
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
    expect(screen.queryByText("Company Name")).not.toBeInTheDocument();
  });

  it("switches back to the Company form when the By Company Owner tab is clicked", () => {
    renderWithQueryClient(
      <OwnerSearch language="en" initialOwnerType="owner" />
    );
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
    const companyTab = screen.getByText("By Company Owner").closest("button")!;
    fireEvent.click(companyTab);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("hides tabs when showTabs is false", () => {
    renderWithQueryClient(<OwnerSearch language="en" showTabs={false} />);
    expect(screen.queryByText("By Owner")).not.toBeInTheDocument();
    // company form still rendered by default
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders Arabic title and subtitle", () => {
    renderWithQueryClient(
      <OwnerSearch
        language="ar"
        title="Search"
        title_ar="بحث المالك"
        subtitle="Sub"
        subtitle_ar="عنوان فرعي"
      />
    );
    expect(screen.getByText("بحث المالك")).toBeInTheDocument();
    expect(screen.getByText("عنوان فرعي")).toBeInTheDocument();
  });

  it("applies custom ownerTypeOptions", () => {
    renderWithQueryClient(
      <OwnerSearch
        ownerTypeOptions={{
          company: "Company",
          owner: "Individual",
        }}
        language="en"
      />
    );
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Individual")).toBeInTheDocument();
  });

  it("runs a company search and selects an owner (default onSubmit path)", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    // Pass a STABLE selected array to avoid the result view's infinite
    // re-render; omit onSubmit so the component's default handler is exercised.
    renderWithQueryClient(<OwnerSearch language="en" selected={SEARCH_EMPTY} />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(mockGetSearchByCompanyOwner).toHaveBeenCalled()
    );
    const company = await screen.findByText("ACME Co");
    fireEvent.click(company);
    const selectBtn = await screen.findByText("Select Owner");
    // Clicking Select Owner invokes the component's default onSubmit handler
    // (no onSubmit prop passed). It must not throw.
    expect(() => fireEvent.click(selectBtn)).not.toThrow();
  });
});

// Stable empty array avoids the infinite re-render that a fresh `[]` default
// triggers via OwnerSearchResult's `useEffect(..., [selected])` once selection
// state diverges (e.g. after clicking a result card / paginating).
const STABLE_EMPTY: typeof sampleResults = [];

describe("OwnerSearchResult", () => {
  const baseProps = {
    ownerName: "John",
    isLoading: false,
    results: sampleResults,
    pageSize: 10,
    totalCount: 2,
    language: "en" as const,
    selected: STABLE_EMPTY,
  };

  it("renders without crashing", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
  });

  it("shows Search Results heading", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("shows Arabic heading", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} isLoading={true} language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("renders owner names", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders Arabic owner names", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("جون سميث")).toBeInTheDocument();
  });

  it("renders Select Owner button", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Select Owner")).toBeInTheDocument();
  });

  it("shows nationalNumber and cityName", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("784-1990-1234567-1")).toBeInTheDocument();
    expect(screen.getByText("Dubai")).toBeInTheDocument();
  });

  it("renders empty results without crash", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} results={[]} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("applies rtl dir for Arabic", () => {
    const { container } = renderWithQueryClient(
      <OwnerSearchResult {...baseProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("renders Details button per result", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  it("renders Edit link", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("pre-selects result via selected prop", () => {
    renderWithQueryClient(
      <OwnerSearchResult {...baseProps} selected={[sampleResults[0]]} />
    );
    const btn = screen.getByText("Select Owner").closest("button");
    expect(btn).not.toBeDisabled();
  });

  it("selects a result when its card is clicked and enables Select Owner", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    const selectBtn = screen.getByText("Select Owner").closest("button")!;
    expect(selectBtn).toBeDisabled();
    fireEvent.click(screen.getByText("John Smith"));
    expect(selectBtn).not.toBeDisabled();
  });

  it("fires onSubmit and onCloseDrawer when Select Owner is clicked", () => {
    const onSubmit = vi.fn();
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <OwnerSearchResult
        {...baseProps}
        selected={[sampleResults[0]]}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(screen.getByText("Select Owner"));
    expect(onSubmit).toHaveBeenCalledWith([sampleResults[0]]);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does nothing when Select Owner clicked with no selection", () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <OwnerSearchResult {...baseProps} onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Select Owner"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onCloseDrawer when Edit is clicked", () => {
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <OwnerSearchResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("opens the owner detail drawer when Details is clicked", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    fireEvent.click(screen.getAllByText("Details")[0]);
    expect(screen.getByTestId("view-owner-detail")).toBeInTheDocument();
  });

  it("calls onPageChange via pagination next button", () => {
    const onPageChange = vi.fn();
    const many = Array.from({ length: 5 }, (_, i) => ({
      ownerId: String(i + 1),
      ownerName_E: `Owner ${i + 1}`,
      ownerName_A: `مالك ${i + 1}`,
      nationalNumber: `NAT-${i + 1}`,
      cityName: `City ${i + 1}`,
    }));
    renderWithQueryClient(
      <OwnerSearchResult
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

  it("paginates results locally when results exceed pageSize", () => {
    const many = Array.from({ length: 15 }, (_, i) => ({
      ownerId: String(i + 1),
      ownerName_E: `Owner ${i + 1}`,
      ownerName_A: `مالك ${i + 1}`,
      nationalNumber: `NAT-${i + 1}`,
      cityName: `City ${i + 1}`,
    }));
    renderWithQueryClient(
      <OwnerSearchResult
        {...baseProps}
        results={many}
        totalCount={15}
        pageSize={5}
      />
    );
    expect(screen.getByText("Owner 1")).toBeInTheDocument();
    expect(screen.queryByText("Owner 6")).not.toBeInTheDocument();
  });

  it("returns all results when pageSize is 0", () => {
    renderWithQueryClient(
      <OwnerSearchResult {...baseProps} pageSize={0} />
    );
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("opens detail drawer in Arabic (covers getLanguageSwitchText ar)", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} language="ar" />);
    fireEvent.click(screen.getAllByText("التفاصيل")[0]);
    expect(screen.getByTestId("view-owner-detail")).toBeInTheDocument();
  });
});

describe("OwnerSearchByOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
  });

  it("renders National Number label", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders Owner Name label", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
  });

  it("renders Family Name label", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Family Name")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    expect(screen.getByText("الرقم الوطني")).toBeInTheDocument();
    expect(screen.getByText("اسم المالك")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" platform="mobile" />);
  });

  it("renders Arabic Search button", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });
});

describe("OwnerSearchByCompanyOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
  });

  it("renders Company Name label", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders Certificate Number label", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" platform="mobile" />);
  });

  it("renders Arabic Search button", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });
});
