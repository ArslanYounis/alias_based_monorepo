import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DropdownFilter from "@platform/FilterBar/DropdownFilter";

// Mock FilterIcon SVG asset
vi.mock("@/assets/svg/filterIcon", () => ({
  default: () => <svg data-testid="filter-icon" />,
}));

// Mock RadioField to avoid deep component dependencies
vi.mock("@/ui/RadioField", () => ({
  RadioField: ({
    id,
    label,
    label_ar,
    checked,
    onChange,
    language,
  }: {
    id: string;
    label: string;
    label_ar?: string;
    checked?: string;
    onChange?: (value: string) => void;
    language?: string;
  }) => (
    <div
      data-testid={`radio-${id}`}
      data-checked={checked === id}
      onClick={() => onChange?.(id)}
    >
      {language === "ar" && label_ar ? label_ar : label}
    </div>
  ),
}));

// Mock CheckboxField to avoid deep component dependencies
vi.mock("@/ui/CheckboxField", () => ({
  CheckboxField: ({
    id,
    label,
    label_ar,
    checked,
    onChange,
    language,
  }: {
    id: string;
    label: string;
    label_ar?: string;
    checked?: boolean;
    onChange?: (id: string, checked: boolean) => void;
    language?: string;
  }) => (
    <div
      data-testid={`checkbox-${id}`}
      data-checked={checked}
      onClick={() => onChange?.(id, !checked)}
    >
      {language === "ar" && label_ar ? label_ar : label}
    </div>
  ),
}));

describe("DropdownFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<DropdownFilter />);
    expect(screen.getByText("Filter By")).toBeInTheDocument();
  });

  it("renders the 'Filter By' tab button in English by default", () => {
    render(<DropdownFilter />);
    expect(screen.getByText("Filter By")).toBeInTheDocument();
  });

  it("renders the 'Sort By' tab button in English by default", () => {
    render(<DropdownFilter />);
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("renders Arabic tab labels when language=ar", () => {
    render(<DropdownFilter language="ar" />);
    expect(screen.getByText("تصفية حسب")).toBeInTheDocument();
    expect(screen.getByText("ترتيب حسب")).toBeInTheDocument();
  });

  // ── Default filter tab active ─────────────────────────────────────────────

  it("shows filter tab content (application options) by default", () => {
    render(
      <DropdownFilter
        applicationOptions={[
          { label: "My Applications", value: "my" },
          { label: "All Applications", value: "all" },
        ]}
      />
    );
    expect(screen.getByTestId("radio-my")).toBeInTheDocument();
    expect(screen.getByTestId("radio-all")).toBeInTheDocument();
  });

  it("shows filter options (checkboxes) in default filter tab", () => {
    render(
      <DropdownFilter
        filterOptions={[
          { label: "Actions", value: "actions" },
          { label: "Critical", value: "critical" },
        ]}
      />
    );
    expect(screen.getByTestId("checkbox-actions")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-critical")).toBeInTheDocument();
  });

  // ── Tab switching ─────────────────────────────────────────────────────────

  it("switches to sort tab when 'Sort By' button is clicked", () => {
    render(
      <DropdownFilter
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    expect(screen.getByTestId("radio-newest")).toBeInTheDocument();
    expect(screen.getByTestId("radio-oldest")).toBeInTheDocument();
  });

  it("hides filter content when sort tab is active", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    expect(screen.queryByTestId("checkbox-actions")).not.toBeInTheDocument();
  });

  it("switches back to filter tab when 'Filter By' is clicked after sort tab", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Filter By"));
    expect(screen.getByTestId("checkbox-actions")).toBeInTheDocument();
  });

  // ── Application option selection (RadioField) ─────────────────────────────

  it("updates selected application when a radio option is clicked", () => {
    render(
      <DropdownFilter
        applicationOptions={[
          { label: "My Applications", value: "my" },
          { label: "All Applications", value: "all" },
        ]}
      />
    );
    // Initially "my" is selected (first option)
    expect(screen.getByTestId("radio-my")).toHaveAttribute(
      "data-checked",
      "true"
    );
    // Click "all"
    fireEvent.click(screen.getByTestId("radio-all"));
    expect(screen.getByTestId("radio-all")).toHaveAttribute(
      "data-checked",
      "true"
    );
  });

  // ── Filter checkbox selection ─────────────────────────────────────────────

  it("toggles checkbox filter on click", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
      />
    );
    const checkbox = screen.getByTestId("checkbox-actions");
    expect(checkbox).toHaveAttribute("data-checked", "false");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-checked", "true");
  });

  it("can toggle checkbox filter back off", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
      />
    );
    const checkbox = screen.getByTestId("checkbox-actions");
    fireEvent.click(checkbox); // check it
    fireEvent.click(checkbox); // uncheck it
    expect(checkbox).toHaveAttribute("data-checked", "false");
  });

  // ── Sort option selection ─────────────────────────────────────────────────

  it("updates selected sort option when sort radio is clicked", () => {
    render(
      <DropdownFilter
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    expect(screen.getByTestId("radio-newest")).toHaveAttribute(
      "data-checked",
      "true"
    );
    fireEvent.click(screen.getByTestId("radio-oldest"));
    expect(screen.getByTestId("radio-oldest")).toHaveAttribute(
      "data-checked",
      "true"
    );
  });

  // ── Empty options ─────────────────────────────────────────────────────────

  it("renders without error when all options arrays are empty", () => {
    render(
      <DropdownFilter
        filterOptions={[]}
        sortOptions={[]}
        applicationOptions={[]}
      />
    );
    expect(screen.getByText("Filter By")).toBeInTheDocument();
  });

  it("does not render application radios when applicationOptions is empty", () => {
    render(<DropdownFilter applicationOptions={[]} />);
    // No radio-* test ids should exist for application section
    expect(screen.queryByTestId("radio-my")).not.toBeInTheDocument();
  });

  it("does not render sort radios in sort tab when sortOptions is empty", () => {
    render(<DropdownFilter sortOptions={[]} />);
    fireEvent.click(screen.getByText("Sort By"));
    // Nothing rendered in sort section
    expect(screen.queryByTestId(/^radio-/)).not.toBeInTheDocument();
  });

  // ── Arabic labels ─────────────────────────────────────────────────────────

  it("renders Arabic labels for application options when language=ar", () => {
    render(
      <DropdownFilter
        language="ar"
        applicationOptions={[
          { label: "My Applications", value: "my", label_ar: "طلباتي" },
        ]}
      />
    );
    expect(screen.getByText("طلباتي")).toBeInTheDocument();
  });

  it("renders Arabic labels for filter options when language=ar", () => {
    render(
      <DropdownFilter
        language="ar"
        filterOptions={[
          { label: "Actions", value: "actions", label_ar: "إجراءات" },
        ]}
      />
    );
    expect(screen.getByText("إجراءات")).toBeInTheDocument();
  });

  it("renders Arabic labels for sort options when language=ar", () => {
    render(
      <DropdownFilter
        language="ar"
        sortOptions={[
          { label: "Newest First", value: "newest", label_ar: "الأحدث أولاً" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("ترتيب حسب"));
    expect(screen.getByText("الأحدث أولاً")).toBeInTheDocument();
  });

  // ── Custom props ──────────────────────────────────────────────────────────

  it("renders with custom filterOptions provided", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Custom Filter", value: "custom" }]}
      />
    );
    expect(screen.getByText("Custom Filter")).toBeInTheDocument();
  });

  it("initialises selectedSort to first sortOption value", () => {
    render(
      <DropdownFilter
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    expect(screen.getByTestId("radio-newest")).toHaveAttribute(
      "data-checked",
      "true"
    );
    expect(screen.getByTestId("radio-oldest")).toHaveAttribute(
      "data-checked",
      "false"
    );
  });

  // ── Tab switching preserves independent state ─────────────────────────────

  it("preserves checkbox state across tab switches", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
        sortOptions={[{ label: "Newest First", value: "newest" }]}
      />
    );
    // Check the filter checkbox
    fireEvent.click(screen.getByTestId("checkbox-actions"));
    expect(screen.getByTestId("checkbox-actions")).toHaveAttribute(
      "data-checked",
      "true"
    );
    // Switch to sort, then back to filter
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Filter By"));
    // Checkbox state should be preserved
    expect(screen.getByTestId("checkbox-actions")).toHaveAttribute(
      "data-checked",
      "true"
    );
  });

  it("preserves sort selection across tab switches", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
        ]}
      />
    );
    // Switch to sort tab and select oldest
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByTestId("radio-oldest"));
    // Switch to filter tab and back to sort
    fireEvent.click(screen.getByText("Filter By"));
    fireEvent.click(screen.getByText("Sort By"));
    expect(screen.getByTestId("radio-oldest")).toHaveAttribute(
      "data-checked",
      "true"
    );
  });

  // ── Multiple checkbox selections in filter tab ────────────────────────────

  it("allows multiple filter checkboxes to be checked independently", () => {
    render(
      <DropdownFilter
        filterOptions={[
          { label: "Actions", value: "actions" },
          { label: "Critical", value: "critical" },
        ]}
      />
    );
    fireEvent.click(screen.getByTestId("checkbox-actions"));
    fireEvent.click(screen.getByTestId("checkbox-critical"));
    expect(screen.getByTestId("checkbox-actions")).toHaveAttribute(
      "data-checked",
      "true"
    );
    expect(screen.getByTestId("checkbox-critical")).toHaveAttribute(
      "data-checked",
      "true"
    );
  });

  // ── Sort radio is mutually exclusive ──────────────────────────────────────

  it("only one sort radio can be selected at a time", () => {
    render(
      <DropdownFilter
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByTestId("radio-oldest"));
    expect(screen.getByTestId("radio-oldest")).toHaveAttribute(
      "data-checked",
      "true"
    );
    expect(screen.getByTestId("radio-newest")).toHaveAttribute(
      "data-checked",
      "false"
    );
  });

  // ── Application radio is mutually exclusive ───────────────────────────────

  it("only one application radio can be selected at a time", () => {
    render(
      <DropdownFilter
        applicationOptions={[
          { label: "My Applications", value: "my" },
          { label: "All Applications", value: "all" },
        ]}
      />
    );
    // First is selected by default
    expect(screen.getByTestId("radio-my")).toHaveAttribute(
      "data-checked",
      "true"
    );
    fireEvent.click(screen.getByTestId("radio-all"));
    expect(screen.getByTestId("radio-all")).toHaveAttribute(
      "data-checked",
      "true"
    );
    expect(screen.getByTestId("radio-my")).toHaveAttribute(
      "data-checked",
      "false"
    );
  });

  // ── Filter tab does not show sort content, and vice versa ─────────────────

  it("does not show sort options when filter tab is active", () => {
    render(
      <DropdownFilter
        sortOptions={[{ label: "Newest First", value: "newest" }]}
      />
    );
    // Filter tab is active by default
    expect(screen.queryByTestId("radio-newest")).not.toBeInTheDocument();
  });

  it("does not show filter options when sort tab is active", () => {
    render(
      <DropdownFilter
        filterOptions={[{ label: "Actions", value: "actions" }]}
        applicationOptions={[{ label: "My Apps", value: "my" }]}
      />
    );
    fireEvent.click(screen.getByText("Sort By"));
    expect(screen.queryByTestId("checkbox-actions")).not.toBeInTheDocument();
    expect(screen.queryByTestId("radio-my")).not.toBeInTheDocument();
  });

  // ── RTL direction for Arabic ──────────────────────────────────────────────

  it("applies rtl direction to tab bar for Arabic", () => {
    const { container } = render(<DropdownFilter language="ar" />);
    const rtlDiv = container.querySelector('[dir="rtl"]');
    expect(rtlDiv).toBeInTheDocument();
  });

  it("applies ltr direction to tab bar for English", () => {
    const { container } = render(<DropdownFilter language="en" />);
    const ltrDiv = container.querySelector('[dir="ltr"]');
    expect(ltrDiv).toBeInTheDocument();
  });
});
