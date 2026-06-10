import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGetSearchByOwner = vi.fn(() =>
  Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })
);

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  useGetSearchByOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByOwner: (...args: unknown[]) => mockGetSearchByOwner(...(args as [])),
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
  default: (props: any) => (
    <div data-testid="owner-search-result">
      OwnerSearchResult
      <button data-testid="page-change" onClick={() => props.onPageChange?.(2)}>
        page
      </button>
      <button data-testid="close-drawer" onClick={() => props.onCloseDrawer?.()}>
        close
      </button>
    </div>
  ),
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

  // ── Optional dynamic fields (MultiSelect) ───────────────────────────────────

  it("reveals optional fields when selected from the search-type multiselect", async () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    // Open the "Add search type" multiselect combobox
    const combo = screen.getByText("Add search type");
    fireEvent.click(combo);
    // Select Passport Number option from the dropdown
    const option = await screen.findByText("Passport Number");
    fireEvent.click(option);
    // The optional Passport Number field should now be rendered
    await waitFor(() => {
      expect(screen.getAllByText("Passport Number").length).toBeGreaterThan(1);
    });
  });

  it("reveals MOI Unified Number optional field and can remove it again", async () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    const combo = screen.getByText("Add search type");
    fireEvent.click(combo);
    const option = await screen.findByText("Moi Unified Number");
    fireEvent.click(option);
    await waitFor(() => {
      expect(screen.getByText("MOI Unified Number")).toBeInTheDocument();
    });
    // Toggle it off again -> exercises useEffect resetField branch
    fireEvent.click(combo);
    const optionAgain = await screen.findByText("Moi Unified Number");
    fireEvent.click(optionAgain);
    await waitFor(() => {
      expect(screen.queryByText("MOI Unified Number")).not.toBeInTheDocument();
    });
  });

  it("reveals all optional fields", async () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    const combo = screen.getByText("Add search type");
    for (const label of [
      "Passport Number",
      "Abu Dhabi Archive No",
      "Family No / City",
      "Western Region Archive No",
      "Moi Unified Number",
      "Al Ain Archive No",
    ]) {
      fireEvent.click(combo);
      const option = await screen.findByText(label);
      fireEvent.click(option);
    }
    await waitFor(() => {
      expect(screen.getByText("Family No/City")).toBeInTheDocument();
      expect(screen.getByText("Western Region Archive No.")).toBeInTheDocument();
      expect(screen.getByText("Al Ain Archive Number")).toBeInTheDocument();
    });
  });

  // ── Submit flow ─────────────────────────────────────────────────────────────

  it("calls getSearchByOwner and opens the results drawer on Search", async () => {
    mockGetSearchByOwner.mockClear();
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 5, ownerName: "Mapped Owner" },
        { ownerId: null, ownerName: null },
      ],
      pageNumber: 0,
      totalCount: 2,
    } as never);
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(mockGetSearchByOwner).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("owner-search-result")).toBeInTheDocument();
    });
  });

  it("submits in Arabic using Arabic default match/results values", async () => {
    mockGetSearchByOwner.mockClear();
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
    } as never);
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => {
      expect(mockGetSearchByOwner).toHaveBeenCalled();
    });
  });

  it("handles pagination and drawer close from the result view", async () => {
    mockGetSearchByOwner.mockClear();
    renderWithQueryClient(<OwnerSearchByOwner language="en" onSubmit={() => {}} />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("owner-search-result");
    const callsAfterSearch = mockGetSearchByOwner.mock.calls.length;
    // Pagination returns mapped items (covers item id/name mapping branches)
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 9, ownerName: "Page Owner" },
        { ownerId: null, ownerName: null },
      ],
      pageNumber: 1,
      totalCount: 2,
    } as never);
    // Trigger pagination -> handlePageChange -> second fetch
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() => {
      expect(mockGetSearchByOwner.mock.calls.length).toBeGreaterThan(
        callsAfterSearch
      );
    });
    // Close the drawer
    fireEvent.click(screen.getByTestId("close-drawer"));
  });

  it("logs an error when pagination request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByOwner.mockClear();
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("owner-search-result");
    mockGetSearchByOwner.mockRejectedValueOnce(new Error("page boom"));
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalledWith(
        "Pagination fetch failed:",
        expect.any(Error)
      );
    });
    errSpy.mockRestore();
  });

  it("logs an error when the search request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByOwner.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
    });
    errSpy.mockRestore();
  });

  it("logs an unknown error when the search rejects with a non-Error", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByOwner.mockRejectedValueOnce("string failure");
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalledWith("Unknown error", "string failure");
    });
    errSpy.mockRestore();
  });
});
