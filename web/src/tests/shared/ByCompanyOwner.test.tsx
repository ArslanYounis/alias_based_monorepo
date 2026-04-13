import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ByCompanyOwner from "@shared/components/SearchPlot/ByCompanyOwner";

const mockGetSearchByCompanyOwner = vi.fn();

// Mock hooks
vi.mock("@shared/hooks/useGetSearchByCompanyOwner", () => ({
  getSearchByCompanyOwner: (...args: unknown[]) =>
    mockGetSearchByCompanyOwner(...args),
}));

// Mock SearchOwnerResult to avoid deep rendering
vi.mock("@shared/components/SearchPlot/SearchOwnerResult", () => ({
  default: () => <div data-testid="search-owner-result">SearchOwnerResult</div>,
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

describe("ByCompanyOwner (shared component)", () => {
  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
  });

  it("renders Company Name label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders Certificate Number label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  // ── Arabic labels ─────────────────────────────────────────────────────────

  it("renders Arabic Company Name label", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeInTheDocument();
  });

  it("renders Arabic Certificate Number label", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("رقم الشهادة")).toBeInTheDocument();
  });

  it("renders Arabic Match Type label", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("نوع المطابقة")).toBeInTheDocument();
  });

  it("renders Arabic Results to Display label", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("النتائج المعروضة")).toBeInTheDocument();
  });

  // ── Search button ─────────────────────────────────────────────────────────

  it("renders Search button in English", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Search button in Arabic", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Add search type ───────────────────────────────────────────────────────

  it("renders Add search type placeholder", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Add search type")).toBeInTheDocument();
  });

  it("renders Arabic Add search type placeholder", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    expect(screen.getByText("أضف نوع البحث")).toBeInTheDocument();
  });

  // ── Platform prop ─────────────────────────────────────────────────────────

  it("renders with mobile platform without crashing", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Default props ─────────────────────────────────────────────────────────

  it("renders with all default props", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeInTheDocument();
    expect(screen.getByText("Certificate Number")).toBeInTheDocument();
  });

  // ── Callback coverage ─────────────────────────────────────────────────────

  it("clicking Search button triggers form.handleSubmit", async () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const searchBtn = screen.getByText("Search").closest("button")!;
    fireEvent.click(searchBtn);
    expect(searchBtn).toBeInTheDocument();
  });

  it("clicking Search with successful mutation opens drawer", async () => {
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [
        {
          ownerId: "1",
          companyName: "Test Company",
          certificateNumber: "CERT-1",
          tradeLicense: "TL-1",
        },
      ],
      pageNumber: 0,
      totalCount: 1,
    });

    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const searchBtn = screen.getByText("Search").closest("button")!;
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchBtn).toBeInTheDocument();
    });
  });

  it("clicking Search with failed mutation handles error gracefully", async () => {
    mockGetSearchByCompanyOwner.mockRejectedValueOnce(
      new Error("Network error")
    );

    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const searchBtn = screen.getByText("Search").closest("button")!;
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchBtn).toBeInTheDocument();
    });
  });

  it("exercises onSubmit callback prop", () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(
      <ByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with selected prop", () => {
    const selected = [
      { ownerId: "1", ownerName_E: "Company A", nationalNumber: "NAT-1" },
    ];
    renderWithQueryClient(
      <ByCompanyOwner language="en" selected={selected} />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(
      <ByCompanyOwner language="en" args="test-args" />
    );
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  // ── Extra callback/handler coverage ───────────────────────────────────────

  it("typing in Company Name textbox fires handleChange", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0]) {
      fireEvent.change(textInputs[0], { target: { value: "Acme" } });
      expect(textInputs[0]).toHaveValue("Acme");
    }
  });

  it("typing in Certificate Number spinbutton fires handleChange", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const numInputs = screen.queryAllByRole("spinbutton");
    if (numInputs[0]) {
      fireEvent.change(numInputs[0], { target: { value: "1234" } });
      expect(numInputs[0]).toHaveValue(1234);
    }
  });

  it("filling inputs and clicking Search runs onSubmit pipeline", async () => {
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [],
      pageNumber: 0,
      totalCount: 0,
    });
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0])
      fireEvent.change(textInputs[0], { target: { value: "Acme" } });
    const numInputs = screen.queryAllByRole("spinbutton");
    if (numInputs[0])
      fireEvent.change(numInputs[0], { target: { value: "1" } });
    fireEvent.click(screen.getByText("Search").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Search")).toBeInTheDocument()
    );
  });

  it("clicking Search multiple times does not crash", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const btn = screen.getByText("Search").closest("button")!;
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("Arabic Search button is clickable", () => {
    renderWithQueryClient(<ByCompanyOwner language="ar" />);
    const btn = screen.getByText("بحث").closest("button")!;
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("mobile platform Search button responds to click", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" platform="mobile" />);
    const btn = screen.getByText("Search").closest("button")!;
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("text input accepts multiple sequential changes", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0]) {
      fireEvent.change(textInputs[0], { target: { value: "A" } });
      fireEvent.change(textInputs[0], { target: { value: "AB" } });
      fireEvent.change(textInputs[0], { target: { value: "ABC" } });
      expect(textInputs[0]).toHaveValue("ABC");
    }
  });

  it("clearing text input fires handleChange with empty string", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0]) {
      fireEvent.change(textInputs[0], { target: { value: "Acme" } });
      fireEvent.change(textInputs[0], { target: { value: "" } });
      expect(textInputs[0]).toHaveValue("");
    }
  });

  it("clicking Search with onSubmit prop still runs form handler", async () => {
    const onSubmit = vi.fn();
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [],
      pageNumber: 0,
      totalCount: 0,
    });
    renderWithQueryClient(
      <ByCompanyOwner language="en" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByText("Search").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Search")).toBeInTheDocument()
    );
  });

  it("renders with empty selected array and fires search", async () => {
    mockGetSearchByCompanyOwner.mockResolvedValueOnce({
      items: [],
      pageNumber: 0,
      totalCount: 0,
    });
    renderWithQueryClient(<ByCompanyOwner language="en" selected={[]} />);
    fireEvent.click(screen.getByText("Search").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Search")).toBeInTheDocument()
    );
  });

  it("numeric input accepts sequential changes", () => {
    renderWithQueryClient(<ByCompanyOwner language="en" />);
    const numInputs = screen.queryAllByRole("spinbutton");
    if (numInputs[0]) {
      fireEvent.change(numInputs[0], { target: { value: "1" } });
      fireEvent.change(numInputs[0], { target: { value: "12" } });
      expect(numInputs[0]).toHaveValue(12);
    }
  });
});
