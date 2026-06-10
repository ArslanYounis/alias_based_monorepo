import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Mock axios ───────────────────────────────────────────────────────────────
vi.mock("axios", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

// ── Mock data hooks ──────────────────────────────────────────────────────────
const municipalityData = [
  {
    municipalityID: 1,
    municipalityNameEn: "Abu Dhabi",
    municipalityNameAr: "أبوظبي",
    districtID: 10,
    districtNameEn: "District 10",
    districtNameAr: "حي 10",
    communityID: 100,
    communityNameEn: "Community 100",
    communityNameAr: "مجتمع 100",
    roadID: 1000,
    roadNameEn: "Road 1000",
    roadNameAr: "طريق 1000",
  },
];

vi.mock("@shared/hooks/useGetDariMunicipality", () => ({
  useGetDariMunicipality: vi.fn(() => ({
    data: municipalityData,
    isPending: false,
  })),
}));

vi.mock("@shared/hooks/useGetDariLanduses", () => ({
  useGetDariLanduses: vi.fn(() => ({
    data: [{ landUseID: 5, landUseNameEn: "Residential", landUseNameAr: "سكني" }],
    isPending: false,
  })),
}));

// getSearchByDariPlot is the mutationFn; resolve a paginated result.
const getSearchByDariPlot = vi.fn(() =>
  Promise.resolve({
    result: {
      properties: [
        {
          plotID: 1,
          plotNumber: "PN-1",
          landUseNameEn: "Residential",
          communityNameEn: "Community 100",
        },
      ],
      totalCount: 1,
      pageNumber: 0,
    },
  })
);

vi.mock("@shared/hooks/useGetSearchByDariPlot", () => ({
  getSearchByDariPlot: (...args: any[]) => getSearchByDariPlot(...args),
  useGetSearchByDariPlot: vi.fn(() => ({
    data: undefined,
    isPending: false,
    isLoading: false,
  })),
}));

// Mock the result drawer body to avoid deep rendering.
vi.mock("@shared/components/DariPlotSearch/dariPlotSearchResult", () => ({
  default: (props: any) => (
    <div data-testid="dari-results">
      <span data-testid="results-count">{props.results?.length ?? 0}</span>
      <button
        data-testid="trigger-page-change"
        onClick={() => props.onPageChange?.(2)}
      >
        Page 2
      </button>
      <button
        data-testid="trigger-select"
        onClick={() => props.onSelectResult?.({ plotID: 1 })}
      >
        Select
      </button>
    </div>
  ),
}));

import ByPlot from "@shared/components/DariPlotSearch/byPlot";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("DariPlotSearch ByPlot", () => {
  beforeEach(() => {
    getSearchByDariPlot.mockClear();
  });

  // ── Render & labels ──────────────────────────────────────────────────────

  it("renders without crashing", () => {
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

  it("renders the add-search-type multiselect placeholder", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Add search type")).toBeInTheDocument();
  });

  // ── Arabic ───────────────────────────────────────────────────────────────

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<ByPlot language="ar" />);
    expect(screen.getByText("البلدية")).toBeInTheDocument();
    expect(screen.getByText("المنطقة")).toBeInTheDocument();
  });

  it("renders Arabic search button", () => {
    renderWithQueryClient(<ByPlot language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  it("renders Arabic match type label", () => {
    renderWithQueryClient(<ByPlot language="ar" />);
    expect(screen.getByText("نوع المطابقة")).toBeInTheDocument();
  });

  // ── Platform ─────────────────────────────────────────────────────────────

  it("renders on mobile platform without crashing", () => {
    renderWithQueryClient(<ByPlot language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Default & selected props ─────────────────────────────────────────────

  it("renders with default props", () => {
    renderWithQueryClient(<ByPlot language="en" />);
    expect(screen.getByText("Municipality")).toBeInTheDocument();
  });

  it("passes selected prop without crash", () => {
    renderWithQueryClient(
      <ByPlot
        language="en"
        selected={[{ plotID: 1, plotNumber: "PN-1" }]}
      />
    );
    expect(screen.getByText("Municipality")).toBeInTheDocument();
  });

  // ── Submit (validation blocks without required municipality/zone) ─────────

  it("does not call the search API when required fields are empty", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(getSearchByDariPlot).not.toHaveBeenCalled();
    });
  });

  // ── Dynamic optional fields via MultiSelect ──────────────────────────────

  it("adds a dynamic Plot Number field when selected in the multiselect", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    // Open the multiselect dropdown
    fireEvent.click(screen.getByText("Add search type"));
    // Pick the "Plot Number" optional field
    const option = await screen.findByText("Plot Number");
    fireEvent.click(option);
    await waitFor(() => {
      // The dynamic TextInput with the same label should now be on screen
      expect(screen.getAllByText("Plot Number").length).toBeGreaterThan(0);
    });
  });

  it("adds a dynamic Land Use field when selected in the multiselect", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    fireEvent.click(screen.getByText("Add search type"));
    const option = await screen.findByText("Land Use");
    fireEvent.click(option);
    await waitFor(() => {
      expect(screen.getAllByText("Land Use").length).toBeGreaterThan(0);
    });
  });

  it("adds a dynamic Plot Address field when selected", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    fireEvent.click(screen.getByText("Add search type"));
    const option = await screen.findByText("Plot Address");
    fireEvent.click(option);
    await waitFor(() => {
      expect(screen.getAllByText("Plot Address").length).toBeGreaterThan(0);
    });
  });

  it("adds a dynamic Public House Number field when selected", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    fireEvent.click(screen.getByText("Add search type"));
    const option = await screen.findByText("Public House Number");
    fireEvent.click(option);
    await waitFor(() => {
      expect(screen.getAllByText("Public House Number").length).toBeGreaterThan(
        0
      );
    });
  });

  it("adds a dynamic Plot File Number field when selected", async () => {
    renderWithQueryClient(<ByPlot language="en" />);
    fireEvent.click(screen.getByText("Add search type"));
    const option = await screen.findByText("Plot File Number");
    fireEvent.click(option);
    await waitFor(() => {
      expect(screen.getAllByText("Plot File Number").length).toBeGreaterThan(0);
    });
  });

  // ── Full submit flow (exercises onSubmit handler + drawer + results) ──────

  /** Open a Select combobox (by its visible label) and click the option. */
  async function selectOption(comboboxLabel: string, optionText: string) {
    // The label text and the combobox button live in the same Select block.
    const labelEl = screen.getByText(comboboxLabel);
    // Walk up to the Select wrapper and find the combobox button within it.
    const wrapper = labelEl.closest("div.w-full") as HTMLElement;
    const combobox = wrapper.querySelector(
      '[role="combobox"]'
    ) as HTMLElement;
    fireEvent.click(combobox);
    const option = await screen.findByText(optionText);
    fireEvent.click(option);
  }

  it("submits the form, calls the search API and opens the results drawer", async () => {
    renderWithQueryClient(<ByPlot language="en" />);

    await selectOption("Municipality", "Abu Dhabi");
    await selectOption("Zone/District", "District 10");

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(getSearchByDariPlot).toHaveBeenCalled();
    });

    // Drawer body (mocked) should render with the mapped result.
    await waitFor(() => {
      expect(screen.getByTestId("dari-results")).toBeInTheDocument();
    });
    expect(screen.getByTestId("results-count")).toHaveTextContent("1");
  });

  it("sends municipalityID and districtID in the search payload", async () => {
    renderWithQueryClient(<ByPlot language="en" />);

    await selectOption("Municipality", "Abu Dhabi");
    await selectOption("Zone/District", "District 10");
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(getSearchByDariPlot).toHaveBeenCalled();
    });
    const payload = getSearchByDariPlot.mock.calls[0][0] as any;
    expect(payload.municipalityID).toBe(1);
    expect(payload.districtID).toBe(10);
    expect(payload.propertyType).toBe(1);
    expect(payload.page).toBe(0);
  });

  it("forwards a selected result via onSelectResult", async () => {
    const onSelectResult = vi.fn();
    renderWithQueryClient(
      <ByPlot language="en" onSelectResult={onSelectResult} />
    );

    await selectOption("Municipality", "Abu Dhabi");
    await selectOption("Zone/District", "District 10");
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.getByTestId("dari-results")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("trigger-select"));
    expect(onSelectResult).toHaveBeenCalledWith({ plotID: 1 });
  });

  it("handles pagination via the results onPageChange (refetches page)", async () => {
    renderWithQueryClient(<ByPlot language="en" />);

    await selectOption("Municipality", "Abu Dhabi");
    await selectOption("Zone/District", "District 10");
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.getByTestId("dari-results")).toBeInTheDocument();
    });

    getSearchByDariPlot.mockClear();
    fireEvent.click(screen.getByTestId("trigger-page-change"));

    await waitFor(() => {
      expect(getSearchByDariPlot).toHaveBeenCalled();
    });
    const payload = getSearchByDariPlot.mock.calls[0][0] as any;
    // page 2 -> 0-based page index 1
    expect(payload.page).toBe(1);
  });

  it("swallows search API errors without crashing", async () => {
    getSearchByDariPlot.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<ByPlot language="en" />);

    await selectOption("Municipality", "Abu Dhabi");
    await selectOption("Zone/District", "District 10");
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(getSearchByDariPlot).toHaveBeenCalled();
    });
    // Drawer should NOT open on error.
    expect(screen.queryByTestId("dari-results")).not.toBeInTheDocument();
  });

  it("includes an optional plot number in the payload when that field is filled", async () => {
    renderWithQueryClient(<ByPlot language="en" />);

    // Add the Plot Number optional field.
    fireEvent.click(screen.getByText("Add search type"));
    fireEvent.click(await screen.findByText("Plot Number"));

    await selectOption("Municipality", "Abu Dhabi");
    await selectOption("Zone/District", "District 10");

    // Fill the Plot Number text input.
    const plotInput = screen.getByPlaceholderText("Your Plot Number");
    fireEvent.change(plotInput, { target: { value: "PN-9" } });

    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(getSearchByDariPlot).toHaveBeenCalled();
    });
    const payload = getSearchByDariPlot.mock.calls.at(-1)![0] as any;
    expect(payload.plotNumber).toBe("PN-9");
  });

  it("submits in Arabic with Arabic match/result defaults", async () => {
    renderWithQueryClient(<ByPlot language="ar" />);

    await selectOption("البلدية", "أبوظبي");
    await selectOption("المنطقة", "حي 10");
    fireEvent.click(screen.getByText("بحث"));

    await waitFor(() => {
      expect(getSearchByDariPlot).toHaveBeenCalled();
    });
    expect(screen.getByTestId("dari-results")).toBeInTheDocument();
  });
});
