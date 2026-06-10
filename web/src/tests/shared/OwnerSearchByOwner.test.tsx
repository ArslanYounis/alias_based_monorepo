import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  useGetSearchByOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByOwner: vi.fn(() => Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })),
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

import OwnerSearchByOwner from "@shared/components/OwnerSearch/OwnerSearchByOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("OwnerSearchByOwner", () => {
  // ── Render ────────────────────────────────────────────────────────────────

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

  it("renders Results to Display label", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    expect(screen.getByText("الرقم الوطني")).toBeInTheDocument();
    expect(screen.getByText("اسم المالك")).toBeInTheDocument();
    expect(screen.getByText("اسم العائلة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Props ─────────────────────────────────────────────────────────────────

  it("renders with selected prop", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" selected={[]} />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" args="test" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });
});
