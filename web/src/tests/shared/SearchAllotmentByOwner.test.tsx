import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const searchByOwnerMock = vi.fn(() =>
  Promise.resolve({
    items: [
      { allotmentNameId: 1, fullName: "John", familyBookNumber: "FB1" },
    ],
    pageNumber: 0,
    totalCount: 1,
    pageSize: 5,
  })
);

vi.mock("@shared/hooks/useSearchByOwner", () => ({
  searchByOwner: (...args: unknown[]) => searchByOwnerMock(...(args as [])),
}));

// Mock the result sub-component to avoid deep rendering / decree hooks
vi.mock("@shared/components/SearchAllotment/searchAllotmentResult", () => ({
  __esModule: true,
  default: (props: {
    results?: unknown[];
    onPageChange?: (p: number) => void;
  }) => (
    <div data-testid="allotment-result">
      results:{props.results?.length ?? 0}
      <button
        data-testid="next-page"
        onClick={() => props.onPageChange?.(2)}
      >
        next
      </button>
    </div>
  ),
}));

vi.mock("axios");

import SearchByOwner from "@shared/components/SearchAllotment/searchByOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchByOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Full Name label", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("renders Family Number, National ID, Tribe, City Number labels", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Family Number")).toBeInTheDocument();
    expect(screen.getByText("National ID")).toBeInTheDocument();
    expect(screen.getByText("Tribe")).toBeInTheDocument();
    expect(screen.getByText("City Number")).toBeInTheDocument();
  });

  it("renders Match Type and Results to Display selects", () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<SearchByOwner language="ar" />);
    expect(screen.getByText("اسم العائلة")).toBeInTheDocument();
    expect(screen.getByText("الهوية الوطنية")).toBeInTheDocument();
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<SearchByOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with selected prop", () => {
    renderWithQueryClient(<SearchByOwner language="en" selected={[]} />);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("calls searchByOwner mutation and opens result drawer on Search click", async () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <SearchByOwner language="en" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(searchByOwnerMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toBeInTheDocument();
    });
  });

  it("triggers handlePageChange via result pagination", async () => {
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toBeInTheDocument();
    });
    searchByOwnerMock.mockClear();
    fireEvent.click(screen.getByTestId("next-page"));
    await waitFor(() => {
      expect(searchByOwnerMock).toHaveBeenCalledTimes(1);
    });
  });

  it("uses Arabic default values when language=ar", async () => {
    renderWithQueryClient(<SearchByOwner language="ar" />);
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => {
      expect(searchByOwnerMock).toHaveBeenCalled();
    });
  });

  it("maps items with missing fields (nullish fallbacks)", async () => {
    searchByOwnerMock.mockResolvedValueOnce({
      items: [
        { allotmentNameId: null, fullName: null, familyBookNumber: null },
        {},
      ],
      pageNumber: 0,
      totalCount: 2,
      pageSize: 5,
    });
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toHaveTextContent(
        "results:2"
      );
    });
  });

  it("handles empty items response", async () => {
    searchByOwnerMock.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
      pageSize: 5,
    });
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toHaveTextContent(
        "results:0"
      );
    });
  });

  it("handles pagination fetch error gracefully", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toBeInTheDocument();
    });
    searchByOwnerMock.mockRejectedValueOnce(new Error("page fail"));
    fireEvent.click(screen.getByTestId("next-page"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
    });
    errSpy.mockRestore();
  });

  it("handles mutation error gracefully", async () => {
    searchByOwnerMock.mockRejectedValueOnce(new Error("boom"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(searchByOwnerMock).toHaveBeenCalled();
    });
    errSpy.mockRestore();
  });
});
