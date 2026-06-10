import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GenericTableCard from "@shared/components/GenericTableCard/GenericTableCard";

const baseRowsData = [
  { label: "Plot 1", value: "Area A" },
  { label: "Plot 2", value: "Area B" },
  { label: "Plot 3", value: "Area C" },
];

const baseProps = {
  title: "Plots",
  title_ar: "القطع",
  rowsData: baseRowsData,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  onPageChange: vi.fn(),
};

describe("GenericTableCard (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<GenericTableCard {...baseProps} />);
  });

  it("renders the title in English", () => {
    render(<GenericTableCard {...baseProps} language="en" />);
    expect(screen.getByText("Plots")).toBeInTheDocument();
  });

  it("renders the title in Arabic when language is 'ar'", () => {
    render(<GenericTableCard {...baseProps} language="ar" />);
    expect(screen.getByText("القطع")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<GenericTableCard {...baseProps} language="en" />);
    expect(screen.getByText("Plot 1")).toBeInTheDocument();
  });

  it("renders columns header when columnsData is provided", () => {
    render(
      <GenericTableCard
        {...baseProps}
        columnsData={[
          { label: "Name", label_ar: "الاسم" },
          { label: "Area", label_ar: "المساحة" },
        ]}
        rowVariant="3colButton"
      />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Area")).toBeInTheDocument();
  });

  it("renders collapsed state with cardTitleLabel", () => {
    render(
      <GenericTableCard
        {...baseProps}
        isExpanded={false}
        cardTitleLabel="Plots Summary"
        cardTitleValue="3 plots"
        onToggleExpand={vi.fn()}
      />
    );
    expect(screen.getByText("Plots Summary")).toBeInTheDocument();
    expect(screen.getByText("3 plots")).toBeInTheDocument();
  });

  it("calls onToggleExpand when collapsed card is clicked", () => {
    const onToggle = vi.fn();
    render(
      <GenericTableCard
        {...baseProps}
        isExpanded={false}
        onToggleExpand={onToggle}
      />
    );
    const collapsedCard = screen
      .getAllByRole("generic")
      .find((el) => el.classList.contains("cursor-pointer"));
    if (collapsedCard) fireEvent.click(collapsedCard);
    expect(onToggle).toHaveBeenCalled();
  });

  it("renders footer buttons when showFooterButtons is true", () => {
    render(
      <GenericTableCard
        {...baseProps}
        showFooterButtons={true}
        footerButton={[{ title: "Export", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders header action buttons when showButtons is true", () => {
    render(
      <GenericTableCard
        {...baseProps}
        showButtons={true}
        buttons={[{ title: "Add Row", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByText("Add Row")).toBeInTheDocument();
  });

  it("renders pagination when showPagination is true", () => {
    const manyRows = Array.from({ length: 10 }, (_, i) => ({
      label: `Row ${i}`,
      value: `Val ${i}`,
    }));
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={manyRows}
        showPagination={true}
        handlePaginationInternally={true}
      />
    );
    // Pagination component should be in DOM
    expect(screen.getByText("Row 0")).toBeInTheDocument();
    expect(screen.queryByText("Row 3")).not.toBeInTheDocument(); // Only 3 shown per page
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <GenericTableCard {...baseProps} language="ar" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("hides title section when showTitleSection is false", () => {
    render(<GenericTableCard {...baseProps} showTitleSection={false} />);
    expect(screen.queryByText("Plots")).not.toBeInTheDocument();
  });

  it("renders mobile platform layout without crashing", () => {
    render(<GenericTableCard {...baseProps} platform="mobile" />);
  });
});
