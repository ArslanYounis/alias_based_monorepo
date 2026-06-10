import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OwnerSearch from "@shared/components/OwnerSearch/OwnerSearch";
import OwnerSearchResult from "@shared/components/OwnerSearch/OwnerSearchResult";
import OwnerSearchByOwner from "@shared/components/OwnerSearch/OwnerSearchByOwner";
import OwnerSearchByCompanyOwner from "@shared/components/OwnerSearch/OwnerSearchByCompanyOwner";

vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  useGetSearchByOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByOwner: vi.fn(),
}));

vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  useGetSearchByCompanyOwner: vi.fn(() => ({ data: undefined, isPending: false, isLoading: false })),
  getSearchByCompanyOwner: vi.fn(),
}));

vi.mock("@shared/hooks/useRanchRecipient", () => ({
  useRanchRecipient: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isLoading: false,
  })),
}));

vi.mock("@shared/components/ViewOwnerDetail/ViewOwnerDetail", () => ({
  default: () => <div data-testid="view-owner-detail">ViewOwnerDetail</div>,
}));

vi.mock("axios");

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

const sampleResults = [
  {
    ownerId: "1",
    ownerName_E: "John Smith",
    ownerName_A: "جون سميث",
    nationalNumber: "784-1990-1234567-1",
    cityName: "Dubai",
  },
  {
    ownerId: "2",
    ownerName_E: "Jane Doe",
    ownerName_A: "جين دو",
    nationalNumber: "784-1985-7654321-1",
    cityName: "Abu Dhabi",
  },
];

describe("OwnerSearch", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<OwnerSearch />);
  });

  it("renders By Company Owner tab by default", () => {
    renderWithQueryClient(<OwnerSearch language="en" />);
    expect(screen.getByText("By Company Owner")).toBeInTheDocument();
  });

  it("renders By Owner tab", () => {
    renderWithQueryClient(<OwnerSearch language="en" />);
    expect(screen.getByText("By Owner")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    renderWithQueryClient(
      <OwnerSearch title="Search Owner" language="en" />
    );
    expect(screen.getByText("Search Owner")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderWithQueryClient(
      <OwnerSearch subtitle="Enter owner details" language="en" />
    );
    expect(screen.getByText("Enter owner details")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = renderWithQueryClient(<OwnerSearch language="ar" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = renderWithQueryClient(<OwnerSearch language="en" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "ltr");
  });

  it("renders Arabic tab labels", () => {
    renderWithQueryClient(<OwnerSearch language="ar" />);
    expect(screen.getByText("حسب المالك")).toBeInTheDocument();
  });

  it("renders with initialOwnerType='owner'", () => {
    renderWithQueryClient(<OwnerSearch language="en" initialOwnerType="owner" />);
    expect(screen.getByText("By Owner")).toBeInTheDocument();
  });

  it("applies custom ownerTypeOptions", () => {
    renderWithQueryClient(
      <OwnerSearch
        ownerTypeOptions={{
          company: "Company",
          owner: "Individual",
        }}
        language="en"
      />
    );
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Individual")).toBeInTheDocument();
  });
});

describe("OwnerSearchResult", () => {
  const baseProps = {
    ownerName: "John",
    isLoading: false,
    results: sampleResults,
    pageSize: 10,
    totalCount: 2,
    language: "en" as const,
  };

  it("renders without crashing", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
  });

  it("shows Search Results heading", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("shows Arabic heading", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("نتائج البحث")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} isLoading={true} language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("renders owner names", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders Arabic owner names", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} language="ar" />);
    expect(screen.getByText("جون سميث")).toBeInTheDocument();
  });

  it("renders Select Owner button", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Select Owner")).toBeInTheDocument();
  });

  it("shows nationalNumber and cityName", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("784-1990-1234567-1")).toBeInTheDocument();
    expect(screen.getByText("Dubai")).toBeInTheDocument();
  });

  it("renders empty results without crash", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} results={[]} />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("applies rtl dir for Arabic", () => {
    const { container } = renderWithQueryClient(
      <OwnerSearchResult {...baseProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("renders Details button per result", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getAllByText("Details").length).toBe(2);
  });

  it("renders Edit link", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<OwnerSearchResult {...baseProps} platform="mobile" />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("pre-selects result via selected prop", () => {
    renderWithQueryClient(
      <OwnerSearchResult {...baseProps} selected={[sampleResults[0]]} />
    );
    const btn = screen.getByText("Select Owner").closest("button");
    expect(btn).not.toBeDisabled();
  });
});

describe("OwnerSearchByOwner", () => {
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

  it("renders Results to Display", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    expect(screen.getByText("الرقم الوطني")).toBeInTheDocument();
    expect(screen.getByText("اسم المالك")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="en" platform="mobile" />);
  });

  it("renders Arabic Search button", () => {
    renderWithQueryClient(<OwnerSearchByOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });
});

describe("OwnerSearchByCompanyOwner", () => {
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

  it("renders Results to Display", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  it("renders Search button", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="en" platform="mobile" />);
  });

  it("renders Arabic Search button", () => {
    renderWithQueryClient(<OwnerSearchByCompanyOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });
});
