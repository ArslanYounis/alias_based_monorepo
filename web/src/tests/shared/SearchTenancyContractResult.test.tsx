import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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

// Stable reference to avoid the default-param `selected = []` re-render churn.
const EMPTY_SELECTED: TenancyContractItem[] = [];

const baseProps = {
  results: [makeItem("1"), makeItem("2", { isRenew: 1 })],
  isLoading: false,
  pageSize: 5,
  totalCount: 2,
  selected: EMPTY_SELECTED,
  language: "en" as const,
};

describe("SearchTenancyContractResults (shared component – web platform)", () => {
  // ── Render / heading ───────────────────────────────────────────────────────
  it("renders the Search Results heading", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("renders Arabic heading when language=ar", () => {
    render(<SearchTenancyContractResults {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<SearchTenancyContractResults {...baseProps} />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <SearchTenancyContractResults {...baseProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  // ── Loading ─────────────────────────────────────────────────────────────────
  it("shows loading text when isLoading=true", () => {
    render(<SearchTenancyContractResults {...baseProps} isLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text", () => {
    render(<SearchTenancyContractResults {...baseProps} isLoading language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("does not render cards while loading", () => {
    render(<SearchTenancyContractResults {...baseProps} isLoading />);
    expect(screen.queryByText("CN-1")).not.toBeInTheDocument();
  });

  // ── Result cards ─────────────────────────────────────────────────────────────
  it("renders a card per result with contract number", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("CN-1")).toBeInTheDocument();
    expect(screen.getByText("CN-2")).toBeInTheDocument();
  });

  it("renders New Tenancy / Renew Tenancy based on isRenew", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("New Tenancy")).toBeInTheDocument();
    expect(screen.getByText("Renew Tenancy")).toBeInTheDocument();
  });

  it("renders contract dates", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
    expect(screen.getByText("2026-01-02")).toBeInTheDocument();
  });

  it("renders Plots and Details buttons for each card", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(screen.getAllByText("Plots").length).toBe(2);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  it("renders the result count text", () => {
    const { container } = render(<SearchTenancyContractResults {...baseProps} />);
    expect(container.textContent).toContain("5");
    expect(container.textContent).toContain("results");
  });

  // ── Edit link ─────────────────────────────────────────────────────────────────
  it("calls onCloseDrawer when Edit is clicked", () => {
    const onCloseDrawer = vi.fn();
    render(
      <SearchTenancyContractResults {...baseProps} onCloseDrawer={onCloseDrawer} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("renders Arabic Edit label", () => {
    render(<SearchTenancyContractResults {...baseProps} language="ar" />);
    expect(screen.getByText("تعديل")).toBeInTheDocument();
  });

  // ── Selection ───────────────────────────────────────────────────────────────
  it("Select button disabled when nothing selected", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    expect(
      screen.getByRole("button", { name: "Select Tenancy Agreement" })
    ).toBeDisabled();
  });

  it("selecting a card enables the Select button", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    fireEvent.click(screen.getByText("CN-1"));
    expect(
      screen.getByRole("button", { name: "Select Tenancy Agreement" })
    ).not.toBeDisabled();
  });

  it("calls onSubmit, onSelectResult and onCloseDrawer on selection submit", () => {
    const onSubmit = vi.fn();
    const onSelectResult = vi.fn();
    const onCloseDrawer = vi.fn();
    render(
      <SearchTenancyContractResults
        {...baseProps}
        selected={[makeItem("1")]}
        onSubmit={onSubmit}
        onSelectResult={onSelectResult}
        onCloseDrawer={onCloseDrawer}
      />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Select Tenancy Agreement" })
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0][0]).toMatchObject({ tenancyContractId: "1" });
    expect(onSelectResult).toHaveBeenCalledTimes(1);
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  });

  it("does not call onSubmit when no selection (button disabled)", () => {
    const onSubmit = vi.fn();
    render(<SearchTenancyContractResults {...baseProps} onSubmit={onSubmit} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Select Tenancy Agreement" })
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("re-selecting another card switches the selection", () => {
    render(<SearchTenancyContractResults {...baseProps} />);
    fireEvent.click(screen.getByText("CN-1"));
    fireEvent.click(screen.getByText("CN-2"));
    expect(
      screen.getByRole("button", { name: "Select Tenancy Agreement" })
    ).not.toBeDisabled();
  });

  // ── Pagination ────────────────────────────────────────────────────────────────
  it("calls onPageChange when next page is used (server paginated)", () => {
    const onPageChange = vi.fn();
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
    fireEvent.click(screen.getByLabelText("Next page"));
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
    // All 8 rendered despite pageSize 5
    expect(screen.getByText("CN-8")).toBeInTheDocument();
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
    expect(screen.getByText("CN-1")).toBeInTheDocument();
    expect(screen.getByText("CN-5")).toBeInTheDocument();
    expect(screen.queryByText("CN-6")).not.toBeInTheDocument();
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
    expect(screen.getByText("CN-1")).toBeInTheDocument();
    expect(screen.getByText("CN-2")).toBeInTheDocument();
  });

  // ── Platform ────────────────────────────────────────────────────────────────
  it("renders on mobile platform", () => {
    render(<SearchTenancyContractResults {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });
});
