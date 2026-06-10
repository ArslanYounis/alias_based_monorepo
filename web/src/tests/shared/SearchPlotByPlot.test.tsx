import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByPlot", () => ({
  useGetSearchByPlot: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByPlot: vi.fn(() => Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })),
}));
vi.mock("@shared/hooks/useGetMunicipality", () => ({
  useGetMunicipality: vi.fn(() => ({ options: [], isPending: false })),
}));
vi.mock("@shared/hooks/useGetDistrict", () => ({
  useGetDistrict: vi.fn(() => ({ options: [], isPending: false })),
}));
vi.mock("@shared/hooks/useGetCommunity", () => ({
  useGetCommunity: vi.fn(() => ({ options: [], isPending: false })),
}));
vi.mock("@shared/hooks/useGetRoads", () => ({
  useGetRoads: vi.fn(() => ({ options: [], isPending: false })),
}));
vi.mock("@shared/hooks/useGetLandUsage", () => ({
  useGetLandUsage: vi.fn(() => ({ options: [], isPending: false })),
}));

// Mock sub-components to avoid deep rendering
vi.mock("@shared/components/SearchPlot/SearchPlotResults", () => ({
  default: (props: any) => <div data-testid="search-plot-results">Results</div>,
}));

import ByPlot from "@shared/components/SearchPlot/ByPlot";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchPlot ByPlot", () => {
  // ── Render ────────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByPlot language="en" />);
  });

  it("renders Municipality label", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Municipality")).toBeInTheDocument();
  });

  it("renders Zone/District label", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Zone/District")).toBeInTheDocument();
  });

  it("renders Sector/Community label", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Sector/Community")).toBeInTheDocument();
  });

  it("renders Road label", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Road")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Arabic ────────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<ByPlot language="ar" />);
    expect(screen.getByText("البلدية")).toBeInTheDocument();
    expect(screen.getByText("المنطقة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<ByPlot language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Mobile platform ───────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<ByPlot language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Default props ─────────────────────────────────────────────────────────

  it("renders with default props", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Municipality")).toBeInTheDocument();
  });

  it("passes selected prop without crash", () => {
    renderWithQueryClient(
      <ByPlot language="en" selected={[{ plotId: "1", plotNumber: "PN-1", landUseName: "Res", code: "C1", hasMortgage: false }]} />
    );
    expect(screen.getByText("Municipality")).toBeInTheDocument();
  });
});
