import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGetSearchByCompanyOwner = vi.fn(() =>
  Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })
);

// Mock ALL hooks BEFORE component import to prevent hangs
vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  useGetSearchByCompanyOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByCompanyOwner: (...args: unknown[]) =>
    mockGetSearchByCompanyOwner(...(args as [])),
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

  // ── Optional dynamic fields (MultiSelect) ───────────────────────────────────

  it("reveals an optional field and can remove it again", async () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    const combo = screen.getByText("Add search type");
    fireEvent.click(combo);
    const option = await screen.findByText("Trade License");
    fireEvent.click(option);
    await waitFor(() => {
      // appears as an actual rendered field label (besides the option text)
      expect(screen.getAllByText("Trade License").length).toBeGreaterThan(1);
    });
    fireEvent.click(combo);
    const optionAgain = await screen.findAllByText("Trade License");
    const optionEl = optionAgain
      .map((el) => el.closest('[role="option"]'))
      .find(Boolean) as HTMLElement;
    fireEvent.click(optionEl);
  });

  it("reveals all optional fields", async () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    const combo = screen.getByText("Add search type");
    for (const label of [
      "Trade License",
      "Western Region Archive No",
      "Abu Dhabi Archive No",
      "Al Ain Archive No",
    ]) {
      fireEvent.click(combo);
      const option = await screen.findByText(label);
      fireEvent.click(option);
    }
    await waitFor(() => {
      expect(screen.getByText("Western Region Archive No.")).toBeInTheDocument();
      expect(screen.getByText("Abu Dhabi Archive No.")).toBeInTheDocument();
      expect(screen.getByText("Al Ain Archive No.")).toBeInTheDocument();
    });
  });

  // ── Submit flow ─────────────────────────────────────────────────────────────

  it("calls getSearchByCompanyOwner and opens the results drawer on Search", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 5, companyName: "ACME" },
        { ownerId: null, companyName: null },
      ],
      pageNumber: 0,
      totalCount: 2,
    } as never);
    renderWithQueryClient(
      <OwnerSearchByCompanyOwner language="en" onSubmit={() => {}} />
    );
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(mockGetSearchByCompanyOwner).toHaveBeenCalled();
    });
    await screen.findByTestId("owner-search-result");
  });

  it("submits in Arabic with no items returned", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
    } as never);
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => {
      expect(mockGetSearchByCompanyOwner).toHaveBeenCalled();
    });
  });

  it("handles pagination and drawer close from the result view", async () => {
    mockGetSearchByCompanyOwner.mockClear();
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("owner-search-result");
    const callsAfterSearch = mockGetSearchByCompanyOwner.mock.calls.length;
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [
        { ownerId: 9, companyName: "Page Co" },
        { ownerId: null, companyName: null },
      ],
      pageNumber: 1,
      totalCount: 2,
    } as never);
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() => {
      expect(mockGetSearchByCompanyOwner.mock.calls.length).toBeGreaterThan(
        callsAfterSearch
      );
    });
    fireEvent.click(screen.getByTestId("close-drawer"));
  });

  it("logs an error when the search request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByCompanyOwner.mockRejectedValueOnce(new Error("boom"));
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
    });
    errSpy.mockRestore();
  });

  it("logs an unknown error when the search rejects with a non-Error", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByCompanyOwner.mockRejectedValueOnce("string failure");
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalledWith("Unknown error", "string failure");
    });
    errSpy.mockRestore();
  });

  it("logs an error when pagination request rejects", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetSearchByCompanyOwner.mockClear();
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await screen.findByTestId("owner-search-result");
    mockGetSearchByCompanyOwner.mockRejectedValueOnce(new Error("page boom"));
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalledWith(
        "Pagination fetch failed:",
        expect.any(Error)
      );
    });
    errSpy.mockRestore();
  });
});
