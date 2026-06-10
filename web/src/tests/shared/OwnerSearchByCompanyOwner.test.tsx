import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  useGetSearchByCompanyOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByCompanyOwner: vi.fn(() => Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })),
}));

vi.mock("@shared/hooks/useRanchRecipient", () => ({
  useRanchRecipient: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isLoading: false,
  })),
}));

// Mock sub-components to avoid deep rendering
vi.mock("@shared/components/OwnerSearch/OwnerSearchResult", () => ({
  default: (props: any) => <div data-testid="owner-search-result">OwnerSearchResult</div>,
}));

vi.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => ({
  default: () => <div data-testid="view-owner-detail">ViewOwnerDetail</div>,
}));

import OwnerSearchByCompanyOwner from "@shared/components/OwnerSearch/OwnerSearchByCompanyOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("OwnerSearchByCompanyOwner", () => {
  // ── Render ────────────────────────────────────────────────────────────────

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

  it("renders Results to Display label", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
    expect(screen.getByText("رقم الشهادة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Props ─────────────────────────────────────────────────────────────────

  it("renders with selected prop", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" selected={[]} />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" args="test" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });
});
