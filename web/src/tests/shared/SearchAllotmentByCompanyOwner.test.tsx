import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const searchByCompanyOwnerMock = vi.fn(() =>
  Promise.resolve({
    items: [
      {
        allotmentNameId: 1,
        companyName: "Acme",
        tradeNumber: "T1",
        certificateNumber: "C1",
        familyBookNumber: "FB1",
      },
    ],
    pageNumber: 0,
    totalCount: 1,
    pageSize: 5,
  })
);

vi.mock("@shared/hooks/useSearchByCompanyOwner", () => ({
  searchByCompanyOwner: (...args: unknown[]) =>
    searchByCompanyOwnerMock(...(args as [])),
}));

// Mock result sub-component to avoid deep rendering / decree hooks
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

import SearchByCompanyOwner from "@shared/components/SearchAllotment/searchByCompanyOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SearchByCompanyOwner", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Company Name label", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders Certificate Number and Trade License labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
    expect(screen.getByText("Trade License")).toBeInTheDocument();
  });

  it("renders Match Type and Results to Display selects", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
    expect(screen.getByText("رقم الشهادة")).toBeInTheDocument();
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" platform="mobile" />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with selected prop", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" selected={[]} />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("calls searchByCompanyOwner mutation and opens result drawer on Search click", async () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <SearchByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(searchByCompanyOwnerMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toBeInTheDocument();
    });
  });

  it("triggers handlePageChange via result pagination", async () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toBeInTheDocument();
    });
    searchByCompanyOwnerMock.mockClear();
    fireEvent.click(screen.getByTestId("next-page"));
    await waitFor(() => {
      expect(searchByCompanyOwnerMock).toHaveBeenCalledTimes(1);
    });
  });

  it("uses Arabic default values when language=ar", async () => {
    renderWithQueryClient(<SearchByCompanyOwner language="ar" />);
    fireEvent.click(screen.getByText("بحث"));
    await waitFor(() => {
      expect(searchByCompanyOwnerMock).toHaveBeenCalled();
    });
  });

  it("maps items with missing fields (nullish fallbacks)", async () => {
    searchByCompanyOwnerMock.mockResolvedValueOnce({
      items: [
        {
          allotmentNameId: null,
          companyName: null,
          tradeNumber: null,
          certificateNumber: null,
          familyBookNumber: null,
        },
        {},
      ],
      pageNumber: 0,
      totalCount: 2,
      pageSize: 5,
    });
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toHaveTextContent(
        "results:2"
      );
    });
  });

  it("handles empty items response", async () => {
    searchByCompanyOwnerMock.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
      pageSize: 5,
    });
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toHaveTextContent(
        "results:0"
      );
    });
  });

  it("handles pagination fetch error gracefully", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(screen.getByTestId("allotment-result")).toBeInTheDocument();
    });
    searchByCompanyOwnerMock.mockRejectedValueOnce(new Error("page fail"));
    fireEvent.click(screen.getByTestId("next-page"));
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
    });
    errSpy.mockRestore();
  });

  it("handles mutation error gracefully", async () => {
    searchByCompanyOwnerMock.mockRejectedValueOnce(new Error("boom"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => {
      expect(searchByCompanyOwnerMock).toHaveBeenCalled();
    });
    errSpy.mockRestore();
  });
});
