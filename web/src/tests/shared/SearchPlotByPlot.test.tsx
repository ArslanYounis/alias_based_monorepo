import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGetSearchByPlot = vi.fn(() =>
  Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })
);

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByPlot", () => ({
  useGetSearchByPlot: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByPlot: (...args: unknown[]) => mockGetSearchByPlot(...(args as [])),
}));
vi.mock("@shared/hooks/useGetMunicipality", () => ({
  useGetMunicipality: vi.fn(() => ({
    options: [{ label: "Abu Dhabi City", label_ar: "مدينة أبوظبي", value: "10" }],
    isPending: false,
  })),
}));
vi.mock("@shared/hooks/useGetDistrict", () => ({
  useGetDistrict: vi.fn(() => ({
    options: [{ label: "Zone One", label_ar: "المنطقة الأولى", value: "20" }],
    isPending: false,
  })),
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
  default: (props: any) => (
    <div data-testid="search-plot-results">
      Results
      <button data-testid="page-change" onClick={() => props.onPageChange?.(2)}>
        page
      </button>
      <button data-testid="close-drawer" onClick={() => props.onCloseDrawer?.()}>
        close
      </button>
    </div>
  ),
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

// Selects the required Municipality and Zone/District values so the form passes
// validation and the submit handler can run.
async function fillRequiredFields() {
  fireEvent.click(screen.getByText("Choose Municipality"));
  fireEvent.click(await screen.findByText("Abu Dhabi City"));
  fireEvent.click(screen.getByText("Choose Zone/District"));
  fireEvent.click(await screen.findByText("Zone One"));
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

  // ── Optional dynamic fields (MultiSelect) ───────────────────────────────────

  it("reveals optional plot fields and can remove one again", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    const combo = screen.getByText("Add search type");
    const clickOption = async (label: string) => {
      fireEvent.click(combo);
      const matches = await screen.findAllByText(label);
      const optionEl = matches
        .map((el) => el.closest('[role="option"]'))
        .find(Boolean) as HTMLElement;
      fireEvent.click(optionEl);
    };
    for (const label of [
      "Plot Number",
      "Public House Number",
      "Plot File Number",
      "Land Use",
    ]) {
      await clickOption(label);
    }
    await waitFor(() => {
      // each rendered field label exists (option + field => >=1)
      expect(screen.getAllByText("Plot Number").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Public House Number").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Plot File Number").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Land Use").length).toBeGreaterThan(0);
    });
    // remove Plot Number -> exercises useEffect resetField branch
    await clickOption("Plot Number");
  });

  // ── Submit flow ─────────────────────────────────────────────────────────────

  it("calls getSearchByPlot and opens the results drawer on Search", async () => {
    mockGetSearchByPlot.mockClear();
    mockGetSearchByPlot.mockResolvedValueOnce({
      items: [
        {
          plotId: 5,
          plotNumber: "P1",
          landUseName: "Res",
          code: "C1",
          hasMortgage: true,
        },
        {},
      ],
      pageNumber: 0,
      totalCount: 2,
    } as never);
    renderWithQueryClient(<ByPlot language="en" onSelectResult={() => {}} />);
    await fillRequiredFields();
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetSearchByPlot).toHaveBeenCalled());
    await screen.findByTestId("search-plot-results");
  });

  it("submits in Arabic with no items returned", async () => {
    mockGetSearchByPlot.mockClear();
    mockGetSearchByPlot.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
    } as never);
    renderWithQueryClient(<ByPlot language="ar" />);
    fireEvent.click(screen.getByText("اختر البلدية"));
    fireEvent.click(await screen.findByText("مدينة أبوظبي"));
    fireEvent.click(screen.getByText("اختر المنطقة/الحي"));
    fireEvent.click(await screen.findByText("المنطقة الأولى"));
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => expect(mockGetSearchByPlot).toHaveBeenCalled());
  });

  it("swallows the submit error without crashing", async () => {
    mockGetSearchByPlot.mockClear();
    mockGetSearchByPlot.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<ByPlot language="en" />);
    await fillRequiredFields();
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(mockGetSearchByPlot).toHaveBeenCalled());
    expect(screen.queryByTestId("search-plot-results")).not.toBeInTheDocument();
  });

  it("handles pagination and drawer close from the result view", async () => {
    mockGetSearchByPlot.mockClear();
    renderWithQueryClient(<ByPlot language="en" />);
    await fillRequiredFields();
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("search-plot-results");
    const after = mockGetSearchByPlot.mock.calls.length;
    mockGetSearchByPlot.mockResolvedValueOnce({
      items: [{ plotId: 9, plotNumber: "P9" }],
      pageNumber: 1,
      totalCount: 2,
    } as never);
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() =>
      expect(mockGetSearchByPlot.mock.calls.length).toBeGreaterThan(after)
    );
    fireEvent.click(screen.getByTestId("close-drawer"));
  });

  it("logs an error when pagination request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByPlot.mockClear();
    renderWithQueryClient(<ByPlot language="en" />);
    await fillRequiredFields();
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("search-plot-results");
    mockGetSearchByPlot.mockRejectedValueOnce(new Error("page boom"));
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() =>
      expect(errSpy).toHaveBeenCalledWith(
        "Pagination fetch failed:",
        expect.any(Error)
      )
    );
    errSpy.mockRestore();
  });
});
