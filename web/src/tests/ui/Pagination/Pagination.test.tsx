import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Pagination } from "@platform/Pagination";

vi.mock("@/assets/svg/arrowLeft", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-left" className={className} />
  ),
}));

vi.mock("@/assets/svg/arrowRight", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-right" className={className} />
  ),
}));

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({
    value,
    value_ar,
    language,
  }: {
    value?: string;
    value_ar?: string;
    language?: string;
  }) => <span>{language === "ar" ? value_ar ?? value : value}</span>,
}));

describe("Pagination (web)", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders a nav element", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders Previous and Next buttons", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
  });

  // ── Page numbers ──────────────────────────────────────────────────────────

  it("renders all page numbers when totalPages <= 5", () => {
    render(<Pagination {...defaultProps} totalPages={5} currentPage={1} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("renders page numbers when showPageNumbers=true (default)", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not render page numbers when showPageNumbers=false", () => {
    render(<Pagination {...defaultProps} showPageNumbers={false} />);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("renders ellipsis for large page counts", () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={5}
        totalPages={20}
        maxVisiblePages={4}
      />
    );
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  // ── Disabled states ───────────────────────────────────────────────────────

  it("disables Previous button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("enables Previous button when not on first page", () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(
      <Pagination {...defaultProps} currentPage={5} totalPages={5} />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("enables Next button when not on last page", () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={5} />);
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  // ── Navigation callbacks ──────────────────────────────────────────────────

  it("calls onPageChange with page-1 when Previous is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with page+1 when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not call onPageChange when Previous is clicked on page 1", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("calls onPageChange with specific page when page button is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not call onPageChange when clicking the current page button", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByText("1"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // ── Bottom text ───────────────────────────────────────────────────────────

  it("renders bottom text by default (showBottomText=true)", () => {
    render(
      <Pagination
        {...defaultProps}
        pageSize={10}
        totalCount={50}
      />
    );
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });

  it("does not render bottom text when showBottomText=false", () => {
    render(
      <Pagination
        {...defaultProps}
        showBottomText={false}
        pageSize={10}
        totalCount={50}
      />
    );
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it("shows 'Showing X items' when totalCount is undefined", () => {
    render(
      <Pagination
        {...defaultProps}
        pageSize={10}
        showBottomText
      />
    );
    expect(screen.getByText("Showing 10 items")).toBeInTheDocument();
  });

  it("shows 'Showing X out of Y items' when totalCount is defined", () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={1}
        pageSize={10}
        totalCount={47}
        showBottomText
      />
    );
    expect(
      screen.getByText("Showing 10 out of 47 items")
    ).toBeInTheDocument();
  });

  it("shows remaining items on last page when totalCount provided", () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={5}
        totalPages={5}
        pageSize={10}
        totalCount={47}
        showBottomText
      />
    );
    // Page 5: min(10, 47 - 4*10) = min(10, 7) = 7
    expect(
      screen.getByText("Showing 7 out of 47 items")
    ).toBeInTheDocument();
  });

  // ── Position ──────────────────────────────────────────────────────────────

  it("applies justify-center class for center position (default)", () => {
    render(<Pagination {...defaultProps} position="center" />);
    expect(screen.getByRole("navigation")).toHaveClass("justify-center");
  });

  it("applies justify-start class for left position", () => {
    render(<Pagination {...defaultProps} position="left" />);
    expect(screen.getByRole("navigation")).toHaveClass("justify-start");
  });

  it("applies justify-end class for right position", () => {
    render(<Pagination {...defaultProps} position="right" />);
    expect(screen.getByRole("navigation")).toHaveClass("justify-end");
  });

  // ── Language / RTL ────────────────────────────────────────────────────────

  it("renders LessThenArrow as prev button in English", () => {
    render(<Pagination {...defaultProps} language="en" />);
    // In English, prev button shows arrow-left (LessThenArrow)
    const prevBtn = screen.getByLabelText("Previous page");
    expect(prevBtn.querySelector("[data-testid='arrow-left']")).toBeInTheDocument();
  });

  it("renders GreaterArrow as prev button in Arabic", () => {
    render(<Pagination {...defaultProps} language="ar" />);
    const prevBtn = screen.getByLabelText("Previous page");
    expect(prevBtn.querySelector("[data-testid='arrow-right']")).toBeInTheDocument();
  });

  it("shows Arabic digit page numbers when language=ar", () => {
    render(<Pagination {...defaultProps} language="ar" totalPages={3} />);
    // Arabic digit for 1 is ١
    expect(screen.getByText("١")).toBeInTheDocument();
  });

  it("sets dir=rtl on root div when language=ar", () => {
    const { container } = render(
      <Pagination {...defaultProps} language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  // ── Zero pages edge case ──────────────────────────────────────────────────

  it("renders empty page list when totalPages=0", () => {
    render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );
    // No numbered page buttons (just prev/next)
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
