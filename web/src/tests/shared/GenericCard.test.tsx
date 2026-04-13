import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GenericCard from "@shared/components/GenericCard/GenericCard";

const baseRows = [
  { label: "Name", label_ar: "الاسم", value: "John", value_ar: "جون" },
  { label: "ID", label_ar: "الهوية", value: "12345", value_ar: "١٢٣٤٥" },
];

describe("GenericCard (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<GenericCard title="Test" title_ar="اختبار" rowsData={baseRows} />);
  });

  it("renders the title in English", () => {
    render(<GenericCard title="Owner Info" title_ar="معلومات المالك" rowsData={baseRows} language="en" />);
    expect(screen.getByText("Owner Info")).toBeInTheDocument();
  });

  it("renders the title in Arabic when language is 'ar'", () => {
    render(<GenericCard title="Owner Info" title_ar="معلومات المالك" rowsData={baseRows} language="ar" />);
    expect(screen.getByText("معلومات المالك")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<GenericCard title="T" title_ar="ت" rowsData={baseRows} language="en" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("toggles collapse/expand internally", () => {
    render(
      <GenericCard
        title="T"
        title_ar="ت"
        rowsData={baseRows}
        isExpandable={true}
        handleToggleInternally={true}
      />
    );
    const collapseBtn = screen.getByRole("button", { name: /collapse/i });
    fireEvent.click(collapseBtn);
    // After collapse, rows should not be visible
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
  });

  it("calls external onToggleExpand when handleToggleInternally is false", () => {
    const onToggle = vi.fn();
    render(
      <GenericCard
        title="T"
        title_ar="ت"
        rowsData={baseRows}
        isExpandable={true}
        handleToggleInternally={false}
        isExpanded={true}
        onToggleExpand={onToggle}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /collapse/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders collapsed state with cardTitleLabel", () => {
    render(
      <GenericCard
        title="T"
        title_ar="ت"
        rowsData={baseRows}
        isExpanded={false}
        handleToggleInternally={false}
        cardTitleLabel="CollapseLabel"
        cardTitleValue="CollapsedValue"
        onToggleExpand={vi.fn()}
      />
    );
    // CardTitle + collapsed container both may render the label
    expect(screen.getAllByText("CollapseLabel").length).toBeGreaterThan(0);
    expect(screen.getByText("CollapsedValue")).toBeInTheDocument();
  });

  it("renders show more button when showMoreButton is true", () => {
    const manyRows = Array.from({ length: 5 }, (_, i) => ({
      label: `Label ${i}`,
      value: `Value ${i}`,
    }));
    render(
      <GenericCard
        title="T"
        title_ar="ت"
        rowsData={manyRows}
        showMoreButton={true}
        defaultShowMore={false}
      />
    );
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("renders action buttons when showButtons is true", () => {
    render(
      <GenericCard
        title="T"
        title_ar="ت"
        rowsData={baseRows}
        showButtons={true}
        buttons={[{ title: "Edit", onClick: vi.fn() }]}
        cardTitleLabel="Owner"
      />
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders footer buttons when showFooterButtons is true", () => {
    render(
      <GenericCard
        title="T"
        title_ar="ت"
        rowsData={baseRows}
        showFooterButtons={true}
        footerButton={[{ title: "Submit", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <GenericCard title="T" title_ar="ت" rowsData={baseRows} language="ar" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("renders without title section when showTitleSection is false", () => {
    render(
      <GenericCard
        title="Hidden Title"
        title_ar="عنوان مخفي"
        rowsData={baseRows}
        showTitleSection={false}
      />
    );
    expect(screen.queryByText("Hidden Title")).not.toBeInTheDocument();
  });
});
