import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  useGetSearchByCompanyOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByCompanyOwner: vi.fn(() => Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })),
}));

// Mock sub-components to avoid deep rendering
vi.mock("@shared/components/SearchPlot/SearchOwnerResult", () => ({
  default: (props: any) => <div data-testid="search-owner-result">OwnerResult</div>,
}));

import ByCompanyOwner from "@shared/components/SearchPlot/ByCompanyOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchPlot ByCompanyOwner", () => {
  // ── Render ────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
  });

  it("renders Company Name label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders Certificate Number label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
    expect(screen.getByText("رقم الشهادة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Props ─────────────────────────────────────────────────────────────────

  it("renders with selected prop", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" selected={[]} />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" args="test" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });
});
