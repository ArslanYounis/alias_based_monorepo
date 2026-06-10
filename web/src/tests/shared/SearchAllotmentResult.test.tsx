import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock decree detail hook to avoid network / hangs
const useDecreeDetailsMock = vi.fn(() => ({
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

vi.mock("@shared/hooks/useDecreeDetail", () => ({
  useDecreeDetails: (id?: string) => useDecreeDetailsMock(id as never),
}));

// Mock ViewOwnerDetail to avoid deep rendering
vi.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => ({
  default: () => <div data-testid="view-owner-detail">ViewOwnerDetail</div>,
}));

vi.mock("axios");

import SearchAllotmentResult, {
  ISearchAllotmentResult,
} from "@shared/components/SearchAllotment/searchAllotmentResult";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
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
  it("renders Search Results heading", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("renders Arabic heading when language=ar", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} language="en" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it("shows loading text when isLoading=true", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} isLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} isLoading language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("does not render result cards while loading", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} isLoading />);
    expect(screen.queryByText("Owner 1")).not.toBeInTheDocument();
  });

  // ── Result cards ───────────────────────────────────────────────────────────

  it("renders a card per result with owner name and land use", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("Owner 1")).toBeInTheDocument();
    expect(screen.getByText("Owner 2")).toBeInTheDocument();
    expect(screen.getByText("Use 1")).toBeInTheDocument();
  });

  it("renders decree order text", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("DO-1")).toBeInTheDocument();
  });

  it("renders result count and labels", () => {
    const { container } = renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} />
    );
    expect(container.textContent).toContain("2");
    expect(container.textContent).toContain("results");
    expect(container.textContent).toContain("We returned");
    expect(container.textContent).toContain(
      "for the following search criteria:"
    );
  });

  it("renders Full Name and Land Use labels", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getAllByText("Full Name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Land Use").length).toBeGreaterThan(0);
  });

  it("renders Decree and Details buttons per card", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getAllByText("Decree").length).toBe(2);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  it("renders Select Allotment button", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    expect(screen.getByText("Select Allotment")).toBeInTheDocument();
  });

  it("renders Arabic Select Allotment button", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByText("حدد التخصيص")).toBeInTheDocument();
  });

  // ── Selection / submit ─────────────────────────────────────────────────────

  it("selects a card on click then submits via Select Allotment", () => {
    const onSubmit = vi.fn();
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <SearchAllotmentResult
        {...baseProps}
        onSubmit={onSubmit}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(screen.getByText("Owner 1"));
    fireEvent.click(screen.getByText("Select Allotment"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not submit when nothing is selected", () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Select Allotment"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("pre-selects a result via selected prop (button enabled)", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} selected={[makeResult("1")]} />
    );
    const btn = screen.getByText("Select Allotment").closest("button");
    expect(btn).not.toBeDisabled();
  });

  // ── Edit link ──────────────────────────────────────────────────────────────

  it("calls onCloseDrawer when Edit is clicked", () => {
    const onCloseDrawer = vi.fn();
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Arabic Edit link", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} language="ar" />);
    expect(screen.getByText("تعديل")).toBeInTheDocument();
  });

  // ── Drawers (Details / Decree buttons) ─────────────────────────────────────

  it("opens owner detail drawer when Details is clicked", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    fireEvent.click(screen.getAllByText("Details")[0]);
    expect(screen.getAllByTestId("view-owner-detail").length).toBeGreaterThan(0);
  });

  it("opens decree drawer when Decree is clicked", () => {
    renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
    fireEvent.click(screen.getAllByText("Decree")[0]);
    expect(screen.getAllByTestId("view-owner-detail").length).toBeGreaterThan(0);
  });

  // ── Empty / pagination / mobile ────────────────────────────────────────────

  it("renders empty results without the Select Allotment button", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} results={[]} totalCount={0} />
    );
    expect(screen.getByText("Search Results")).toBeInTheDocument();
    expect(screen.queryByText("Select Allotment")).not.toBeInTheDocument();
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
    expect(screen.getByText("Owner 1")).toBeInTheDocument();
    expect(screen.getByText("Owner 5")).toBeInTheDocument();
    expect(screen.queryByText("Owner 6")).not.toBeInTheDocument();
  });

  it("calls onPageChange via Next page button", () => {
    const onPageChange = vi.fn();
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
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} platform="mobile" />
    );
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  // ── Branch coverage: Arabic content & decree loading ───────────────────────

  it("renders cards in Arabic with rtl labels", () => {
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} language="ar" />
    );
    expect(screen.getAllByText("الاسم الكامل").length).toBeGreaterThan(0);
    expect(screen.getAllByText("استخدام الأراضي").length).toBeGreaterThan(0);
  });

  it("renders cards with missing optional fields", () => {
    const sparse: ISearchAllotmentResult[] = [
      { allotmentNameId: "9", familyBookNumber: "FB9" },
    ];
    renderWithQueryClient(
      <SearchAllotmentResult
        {...baseProps}
        results={sparse}
        totalCount={1}
      />
    );
    expect(screen.getByText("Select Allotment")).toBeInTheDocument();
  });

  it("shows decree drawer loading state when decree is loading", () => {
    useDecreeDetailsMock.mockReturnValue({
      data: undefined as never,
      isLoading: true,
    });
    try {
      renderWithQueryClient(<SearchAllotmentResult {...baseProps} />);
      fireEvent.click(screen.getAllByText("Decree")[0]);
      expect(screen.getByText("Loading")).toBeInTheDocument();
    } finally {
      useDecreeDetailsMock.mockReset();
      useDecreeDetailsMock.mockReturnValue({
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
    renderWithQueryClient(
      <SearchAllotmentResult {...baseProps} language="ar" />
    );
    fireEvent.click(screen.getAllByText("مرسوم")[0]);
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
    expect(screen.getByText("Owner 3")).toBeInTheDocument();
  });
});
