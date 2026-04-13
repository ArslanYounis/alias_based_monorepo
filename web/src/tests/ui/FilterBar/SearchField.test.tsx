import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchField from "@platform/FilterBar/SearchField";

// Mock SearchIcon SVG
vi.mock("@/assets/svg/SearchIcon", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="search-icon" className={className} />
  ),
}));

// Mock SharedLanguageSwitchRenderer
vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({
    language,
    value,
    value_ar,
  }: {
    language?: string;
    value?: string;
    value_ar?: string;
  }) => <span>{language === "ar" ? value_ar || value : value}</span>,
}));

// Mock CheckboxField
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
    onChange?: () => void;
    language?: string;
  }) => (
    <div
      data-testid={`checkbox-${id}`}
      data-checked={checked}
      onClick={onChange}
    >
      {language === "ar" && label_ar ? label_ar : label}
    </div>
  ),
}));

describe("SearchField", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders input with default English placeholder", () => {
    render(<SearchField {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("renders input with custom placeholder", () => {
    render(<SearchField {...defaultProps} placeholder="Find items" />);
    expect(screen.getByPlaceholderText("Find items")).toBeInTheDocument();
  });

  it("renders Arabic placeholder when language is ar", () => {
    render(
      <SearchField
        {...defaultProps}
        language="ar"
        placeholder_ar="ابحث هنا"
      />
    );
    expect(screen.getByPlaceholderText("ابحث هنا")).toBeInTheDocument();
  });

  it("renders default Arabic placeholder when language is ar", () => {
    render(<SearchField {...defaultProps} language="ar" />);
    expect(screen.getByPlaceholderText("بحث")).toBeInTheDocument();
  });

  it("renders the SearchIcon", () => {
    render(<SearchField {...defaultProps} />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders with the provided value", () => {
    render(<SearchField {...defaultProps} value="test query" />);
    const input = screen.getByDisplayValue("test query");
    expect(input).toBeInTheDocument();
  });

  // ── onChange fires ────────────────────────────────────────────────────────

  it("calls onChange when input value changes", () => {
    const onChange = vi.fn();
    render(<SearchField {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "hello" },
    });
    expect(onChange).toHaveBeenCalled();
  });

  // ── Focus/blur state ─────────────────────────────────────────────────────

  it("expands width on focus (active state)", () => {
    const { container } = render(
      <SearchField {...defaultProps} columnsToSearch={["Col1"]} />
    );
    const input = screen.getByPlaceholderText("Search");
    fireEvent.focus(input);
    // After focus, the wrapper should have the selected-bg class (wider)
    const wrapper = container.querySelector(".w-\\[360px\\]");
    expect(wrapper).toBeInTheDocument();
  });

  it("collapses width on blur (inactive state without dropdown)", () => {
    const { container } = render(<SearchField {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.focus(input);
    fireEvent.blur(input);
    // Without columnsToSearch, dropdown never opens, so blur resets active to false
    const wrapper = container.querySelector(".w-\\[212px\\]");
    expect(wrapper).toBeInTheDocument();
  });

  // ── Dropdown open/close ───────────────────────────────────────────────────

  it("shows dropdown when input is focused with columnsToSearch", () => {
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name", "Email"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(screen.getByText("Choose columns to search")).toBeInTheDocument();
  });

  it("does not show dropdown when columnsToSearch is empty", () => {
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={[]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(
      screen.queryByText("Choose columns to search")
    ).not.toBeInTheDocument();
  });

  it("does not show dropdown when columnsToSearch is not provided", () => {
    render(<SearchField {...defaultProps} />);
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(
      screen.queryByText("Choose columns to search")
    ).not.toBeInTheDocument();
  });

  it("closes dropdown on click outside", () => {
    render(
      <div>
        <SearchField
          {...defaultProps}
          columnsToSearch={["Name"]}
          selectedColumns={[]}
          setSelectedColumns={vi.fn()}
        />
        <div data-testid="outside">outside</div>
      </div>
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(screen.getByText("Choose columns to search")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(
      screen.queryByText("Choose columns to search")
    ).not.toBeInTheDocument();
  });

  // ── Checkbox column selection ─────────────────────────────────────────────

  it("renders checkbox for each column in columnsToSearch", () => {
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name", "Email", "Phone"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(screen.getByTestId("checkbox-Name")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-Email")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-Phone")).toBeInTheDocument();
  });

  it("calls setSelectedColumns to add column when unchecked checkbox is clicked", () => {
    const setSelectedColumns = vi.fn();
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name", "Email"]}
        selectedColumns={[]}
        setSelectedColumns={setSelectedColumns}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    fireEvent.click(screen.getByTestId("checkbox-Name"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["Name"]);
  });

  it("calls setSelectedColumns to remove column when checked checkbox is clicked", () => {
    const setSelectedColumns = vi.fn();
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name", "Email"]}
        selectedColumns={["Name"]}
        setSelectedColumns={setSelectedColumns}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    fireEvent.click(screen.getByTestId("checkbox-Name"));
    expect(setSelectedColumns).toHaveBeenCalledWith([]);
  });

  it("does not throw when setSelectedColumns is not provided", () => {
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name"]}
        selectedColumns={[]}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(() =>
      fireEvent.click(screen.getByTestId("checkbox-Name"))
    ).not.toThrow();
  });

  // ── Arabic column chooser text ────────────────────────────────────────────

  it("renders Arabic column chooser text when language is ar", () => {
    render(
      <SearchField
        {...defaultProps}
        language="ar"
        columnsToSearch={["Name"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
        chooseColumnsText_ar="اختر الاعمدة"
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("بحث"));
    expect(screen.getByText("اختر الاعمدة")).toBeInTheDocument();
  });

  it("renders custom English column chooser text", () => {
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
        chooseColumnsText="Pick columns"
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    expect(screen.getByText("Pick columns")).toBeInTheDocument();
  });

  // ── RTL direction ────────────────────────────────────────────────────────

  it("applies rtl direction for Arabic language", () => {
    const { container } = render(
      <SearchField {...defaultProps} language="ar" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("dir")).toBe("rtl");
  });

  it("applies ltr direction for English language", () => {
    const { container } = render(
      <SearchField {...defaultProps} language="en" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("dir")).toBe("ltr");
  });

  // ── Dropdown alignment for Arabic ─────────────────────────────────────────

  it("positions dropdown to the right for Arabic language", () => {
    const { container } = render(
      <SearchField
        {...defaultProps}
        language="ar"
        columnsToSearch={["Name"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("بحث"));
    const dropdown = container.querySelector(".right-0");
    expect(dropdown).toBeInTheDocument();
  });

  it("positions dropdown to the left for English language", () => {
    const { container } = render(
      <SearchField
        {...defaultProps}
        language="en"
        columnsToSearch={["Name"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    const dropdown = container.querySelector(".left-0");
    expect(dropdown).toBeInTheDocument();
  });

  // ── SearchIcon active state ──────────────────────────────────────────────

  it("shows active icon class when focused", () => {
    render(<SearchField {...defaultProps} />);
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    const icon = screen.getByTestId("search-icon");
    expect(icon).toHaveClass("text-filter-search-selected-icon");
  });

  it("shows inactive icon class when not focused", () => {
    render(<SearchField {...defaultProps} />);
    const icon = screen.getByTestId("search-icon");
    expect(icon).toHaveClass("text-filter-search-icon");
  });

  // ── className prop ───────────────────────────────────────────────────────

  it("applies custom className to the wrapper", () => {
    const { container } = render(
      <SearchField {...defaultProps} className="custom-class" />
    );
    const inner = container.querySelector(".custom-class");
    expect(inner).toBeInTheDocument();
  });

  // ── Clicking the wrapper also opens dropdown ─────────────────────────────

  it("opens dropdown on wrapper click when columnsToSearch provided", () => {
    const { container } = render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    const clickableArea = container.querySelector(".flex.items-center") as HTMLElement;
    fireEvent.click(clickableArea);
    expect(screen.getByText("Choose columns to search")).toBeInTheDocument();
  });

  // ── Dropdown click does not propagate ─────────────────────────────────────

  it("stops propagation on dropdown click", () => {
    render(
      <SearchField
        {...defaultProps}
        columnsToSearch={["Name"]}
        selectedColumns={[]}
        setSelectedColumns={vi.fn()}
      />
    );
    fireEvent.focus(screen.getByPlaceholderText("Search"));
    const dropdown = screen.getByText("Choose columns to search").closest("div.absolute");
    expect(dropdown).toBeInTheDocument();
    // Clicking inside dropdown should not close it
    fireEvent.click(dropdown!);
    expect(screen.getByText("Choose columns to search")).toBeInTheDocument();
  });
});
