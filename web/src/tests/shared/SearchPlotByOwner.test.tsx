import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  useGetSearchByOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByOwner: vi.fn(() => Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })),
}));

// Mock sub-components to avoid deep rendering
vi.mock("@shared/components/SearchPlot/SearchOwnerResult", () => ({
  default: (props: any) => <div data-testid="search-owner-result">OwnerResult</div>,
}));

import ByOwner from "@shared/components/SearchPlot/ByOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchPlot ByOwner", () => {
  // ── Render ────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByOwner language="en" />);
  });

  it("renders National Number label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders Owner Name label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
  });

  it("renders Family Name label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Family Name")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("الرقم الوطني")).toBeInTheDocument();
    expect(screen.getByText("اسم المالك")).toBeInTheDocument();
    expect(screen.getByText("اسم العائلة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<ByOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Props ─────────────────────────────────────────────────────────────────

  it("renders with selected prop", () => {
    renderWithQueryClient(<ByOwner language="en" selected={[]} />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<ByOwner language="en" args="test" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });
});
