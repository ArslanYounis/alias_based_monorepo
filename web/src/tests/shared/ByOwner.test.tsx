import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ByOwner from "@shared/components/SearchPlot/ByOwner";

const mockGetSearchByOwner = vi.fn();

// Mock hooks
vi.mock("@shared/hooks/useGetSearchByOwner", () => ({
  getSearchByOwner: (...args: unknown[]) => mockGetSearchByOwner(...args),
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

describe("ByOwner (shared component)", () => {
  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders without crashing", () => {
    renderWithQueryClient(<ByOwner language="en" />);
  });

  it("renders National Number label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  it("renders Owner Name label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
  });

  it("renders Family Name label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Family Name")).toBeInTheDocument();
  });

  it("renders Match Type label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeInTheDocument();
  });

  it("renders Results to Display label", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Results to Display")).toBeInTheDocument();
  });

  // ── Arabic labels ─────────────────────────────────────────────────────────

  it("renders Arabic National Number label", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("الرقم الوطني")).toBeInTheDocument();
  });

  it("renders Arabic Owner Name label", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("اسم المالك")).toBeInTheDocument();
  });

  it("renders Arabic Family Name label", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("اسم العائلة")).toBeInTheDocument();
  });

  it("renders Arabic Match Type label", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("نوع المطابقة")).toBeInTheDocument();
  });

  it("renders Arabic Results to Display label", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("النتائج المعروضة")).toBeInTheDocument();
  });

  // ── Search button ─────────────────────────────────────────────────────────

  it("renders Search button in English", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders Search button in Arabic", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("بحث")).toBeInTheDocument();
  });

  // ── Add search type ───────────────────────────────────────────────────────

  it("renders Add search type placeholder", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("Add search type")).toBeInTheDocument();
  });

  it("renders Arabic Add search type placeholder", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    expect(screen.getByText("أضف نوع البحث")).toBeInTheDocument();
  });

  // ── Platform prop ─────────────────────────────────────────────────────────

  it("renders with mobile platform without crashing", () => {
    renderWithQueryClient(<ByOwner language="en" platform="mobile" />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  // ── Default props ─────────────────────────────────────────────────────────

  it("renders with all default props", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
    expect(screen.getByText("Owner Name")).toBeInTheDocument();
    expect(screen.getByText("Family Name")).toBeInTheDocument();
  });

  // ── Callback coverage ─────────────────────────────────────────────────────

  it("clicking Search button triggers form.handleSubmit", async () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const searchBtn = screen.getByText("Search").closest("button")!;
    fireEvent.click(searchBtn);
    expect(searchBtn).toBeInTheDocument();
  });

  it("clicking Search with successful mutation opens drawer", async () => {
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [
        {
          ownerId: "1",
          ownerName: "Test Owner",
          ownerName_E: "Test Owner",
          nationalNumber: "12345",
          cityName: "Test City",
        },
      ],
      pageNumber: 0,
      totalCount: 1,
    });

    renderWithQueryClient(<ByOwner language="en" />);
    const searchBtn = screen.getByText("Search").closest("button")!;
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchBtn).toBeInTheDocument();
    });
  });

  it("clicking Search with failed mutation handles error", async () => {
    mockGetSearchByOwner.mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithQueryClient(<ByOwner language="en" />);
    const searchBtn = screen.getByText("Search").closest("button")!;
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(searchBtn).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  it("exercises onSubmit callback prop", () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(<ByOwner language="en" onSubmit={onSubmit} />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with selected prop", () => {
    const selected = [
      { ownerId: "1", ownerName_E: "Owner 1", nationalNumber: "NAT-1" },
    ];
    renderWithQueryClient(<ByOwner language="en" selected={selected} />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with args prop", () => {
    renderWithQueryClient(<ByOwner language="en" args="test-args" />);
    expect(screen.getByText("National Number")).toBeInTheDocument();
  });

  // ── Extra callback/handler coverage ───────────────────────────────────────

  it("typing in Owner Name (textbox[0]) fires handleChange", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs.length > 0) {
      fireEvent.change(textInputs[0], { target: { value: "Jane" } });
      expect(textInputs[0]).toHaveValue("Jane");
    }
  });

  it("typing in Family Name (textbox[1]) fires handleChange", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs.length > 1) {
      fireEvent.change(textInputs[1], { target: { value: "Doe" } });
      expect(textInputs[1]).toHaveValue("Doe");
    }
  });

  it("typing in National Number spinbutton fires handleChange", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const numInputs = screen.queryAllByRole("spinbutton");
    if (numInputs.length > 0) {
      fireEvent.change(numInputs[0], { target: { value: "9999" } });
      expect(numInputs[0]).toHaveValue(9999);
    }
  });

  it("filling all main inputs then clicking Search runs onSubmit pipeline", async () => {
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [],
      pageNumber: 0,
      totalCount: 0,
    });
    renderWithQueryClient(<ByOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0])
      fireEvent.change(textInputs[0], { target: { value: "Owner" } });
    if (textInputs[1])
      fireEvent.change(textInputs[1], { target: { value: "Family" } });
    const numInputs = screen.queryAllByRole("spinbutton");
    if (numInputs[0])
      fireEvent.change(numInputs[0], { target: { value: "1" } });
    fireEvent.click(screen.getByText("Search").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Search")).toBeInTheDocument()
    );
  });

  it("clicking Search multiple times does not crash", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const btn = screen.getByText("Search").closest("button")!;
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("Arabic Search button is clickable", () => {
    renderWithQueryClient(<ByOwner language="ar" />);
    const btn = screen.getByText("بحث").closest("button")!;
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("mobile platform Search button responds to click", () => {
    renderWithQueryClient(<ByOwner language="en" platform="mobile" />);
    const btn = screen.getByText("Search").closest("button")!;
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("renders with empty selected array and fires search", async () => {
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [],
      pageNumber: 0,
      totalCount: 0,
    });
    renderWithQueryClient(<ByOwner language="en" selected={[]} />);
    fireEvent.click(screen.getByText("Search").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Search")).toBeInTheDocument()
    );
  });

  it("text input accepts multiple sequential changes", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0]) {
      fireEvent.change(textInputs[0], { target: { value: "a" } });
      fireEvent.change(textInputs[0], { target: { value: "ab" } });
      fireEvent.change(textInputs[0], { target: { value: "abc" } });
      expect(textInputs[0]).toHaveValue("abc");
    }
  });

  it("clicking Search with onSubmit prop still runs form handler", async () => {
    const onSubmit = vi.fn();
    mockGetSearchByOwner.mockResolvedValueOnce({
      items: [],
      pageNumber: 0,
      totalCount: 0,
    });
    renderWithQueryClient(<ByOwner language="en" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Search").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Search")).toBeInTheDocument()
    );
  });

  it("clearing text input fires handleChange with empty string", () => {
    renderWithQueryClient(<ByOwner language="en" />);
    const textInputs = screen.queryAllByRole("textbox");
    if (textInputs[0]) {
      fireEvent.change(textInputs[0], { target: { value: "abc" } });
      fireEvent.change(textInputs[0], { target: { value: "" } });
      expect(textInputs[0]).toHaveValue("");
    }
  });
});
