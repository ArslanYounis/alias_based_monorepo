import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ColumnButton from "@platform/FilterBar/ColumnButton";

// Mock RadioField to avoid deep dependencies
vi.mock("@/ui/RadioField", () => ({
  RadioField: ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string;
    label: string;
    checked?: string;
    onChange?: (value: string) => void;
    theme?: string;
  }) => (
    <div
      data-testid={`radio-${id}`}
      data-checked={checked === id}
      onClick={() => onChange?.(id)}
    >
      {label}
    </div>
  ),
}));

// Mock CheckboxField to avoid deep dependencies
vi.mock("@/ui/CheckboxField", () => ({
  CheckboxField: ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string;
    label: string;
    checked?: boolean;
    onChange?: (id: string, checked: boolean) => void;
    theme?: string;
  }) => (
    <div
      data-testid={`checkbox-${id}`}
      data-checked={checked}
      onClick={() => onChange?.(id, !checked)}
    >
      {label}
    </div>
  ),
}));

describe("ColumnButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic rendering ───────────────────────────────────────────────────────

  it("renders the label text", () => {
    render(<ColumnButton label="Select Column" />);
    expect(screen.getByText("Select Column")).toBeInTheDocument();
  });

  it("renders the default label when no label prop is given", () => {
    render(<ColumnButton />);
    expect(screen.getByText("Column 1 Name")).toBeInTheDocument();
  });

  it("renders a button element", () => {
    render(<ColumnButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // ── Dropdown open/close behaviour ────────────────────────────────────────

  it("does not show dropdown initially", () => {
    render(<ColumnButton columns={["A", "B"]} />);
    expect(screen.queryByText("View Column")).not.toBeInTheDocument();
  });

  it("opens dropdown when button is clicked with columns provided", () => {
    render(<ColumnButton columns={["Col1", "Col2"]} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("View Column")).toBeInTheDocument();
  });

  it("renders the custom title inside dropdown", () => {
    render(<ColumnButton columns={["X"]} title="Choose Column" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Choose Column")).toBeInTheDocument();
  });

  it("does NOT open dropdown when columns is empty", () => {
    render(<ColumnButton columns={[]} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("View Column")).not.toBeInTheDocument();
  });

  it("does NOT open dropdown when columns prop is undefined", () => {
    render(<ColumnButton />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("View Column")).not.toBeInTheDocument();
  });

  it("toggles dropdown closed when button is clicked again", () => {
    render(<ColumnButton columns={["A"]} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(screen.getByText("View Column")).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByText("View Column")).not.toBeInTheDocument();
  });

  // ── singleSelect mode ─────────────────────────────────────────────────────

  it("renders RadioField items for singleSelect mode (default)", () => {
    render(<ColumnButton columns={["Alpha", "Beta"]} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("radio-Alpha")).toBeInTheDocument();
    expect(screen.getByTestId("radio-Beta")).toBeInTheDocument();
  });

  it("calls setSelectedColumns with single-item array on RadioField click", () => {
    const setSelectedColumns = vi.fn();
    render(
      <ColumnButton
        columns={["A", "B"]}
        type="singleSelect"
        setSelectedColumns={setSelectedColumns}
        selectedColumns={[]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("radio-A"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["A"]);
  });

  it("does not throw when setSelectedColumns is not provided (singleSelect)", () => {
    render(
      <ColumnButton
        columns={["A"]}
        type="singleSelect"
        selectedColumns={[]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(() => fireEvent.click(screen.getByTestId("radio-A"))).not.toThrow();
  });

  // ── multiSelect mode ──────────────────────────────────────────────────────

  it("renders CheckboxField items for multiSelect mode", () => {
    render(<ColumnButton columns={["X", "Y"]} type="multiSelect" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("checkbox-X")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-Y")).toBeInTheDocument();
  });

  it("adds column to selection when unchecked checkbox is clicked (multiSelect)", () => {
    const setSelectedColumns = vi.fn();
    render(
      <ColumnButton
        columns={["X", "Y"]}
        type="multiSelect"
        setSelectedColumns={setSelectedColumns}
        selectedColumns={[]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("checkbox-X"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["X"]);
  });

  it("removes column from selection when checked checkbox is clicked (multiSelect)", () => {
    const setSelectedColumns = vi.fn();
    render(
      <ColumnButton
        columns={["X", "Y"]}
        type="multiSelect"
        setSelectedColumns={setSelectedColumns}
        selectedColumns={["X"]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("checkbox-X"));
    expect(setSelectedColumns).toHaveBeenCalledWith([]);
  });

  it("does not throw when setSelectedColumns is not provided (multiSelect)", () => {
    render(
      <ColumnButton
        columns={["X"]}
        type="multiSelect"
        selectedColumns={[]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(() => fireEvent.click(screen.getByTestId("checkbox-X"))).not.toThrow();
  });

  // ── Click outside closes dropdown ─────────────────────────────────────────

  it("closes dropdown on click outside the component", () => {
    render(
      <div>
        <ColumnButton columns={["A"]} />
        <div data-testid="outside">outside</div>
      </div>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("View Column")).toBeInTheDocument();

    // Simulate mousedown outside
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("View Column")).not.toBeInTheDocument();
  });

  // ── isDark theme ──────────────────────────────────────────────────────────

  it("renders without error when isDark=true (dark theme)", () => {
    render(<ColumnButton columns={["A"]} isDark />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("radio-A")).toBeInTheDocument();
  });

  it("renders without error when isDark=false (light theme)", () => {
    render(<ColumnButton columns={["A"]} isDark={false} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("radio-A")).toBeInTheDocument();
  });

  // ── singleSelect replaces previous selection ─────────────────────────────

  it("replaces selection in singleSelect mode (only one item at a time)", () => {
    const setSelectedColumns = vi.fn();
    render(
      <ColumnButton
        columns={["A", "B"]}
        type="singleSelect"
        setSelectedColumns={setSelectedColumns}
        selectedColumns={["A"]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("radio-B"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["B"]);
  });

  // ── multiSelect accumulates selections ────────────────────────────────────

  it("accumulates selections in multiSelect mode", () => {
    const setSelectedColumns = vi.fn();
    render(
      <ColumnButton
        columns={["A", "B", "C"]}
        type="multiSelect"
        setSelectedColumns={setSelectedColumns}
        selectedColumns={["A"]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("checkbox-B"));
    expect(setSelectedColumns).toHaveBeenCalledWith(["A", "B"]);
  });

  // ── Click outside closes dropdown (event listener cleanup) ────────────────

  it("cleans up mousedown listener when dropdown closes", () => {
    const removeListenerSpy = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(
      <div>
        <ColumnButton columns={["A"]} />
        <div data-testid="outside">outside</div>
      </div>
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.mouseDown(screen.getByTestId("outside"));
    unmount();
    expect(removeListenerSpy).toHaveBeenCalled();
    removeListenerSpy.mockRestore();
  });

  // ── Renders all columns in dropdown ───────────────────────────────────────

  it("renders all columns when dropdown is open", () => {
    render(<ColumnButton columns={["Alpha", "Beta", "Gamma"]} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("radio-Alpha")).toBeInTheDocument();
    expect(screen.getByTestId("radio-Beta")).toBeInTheDocument();
    expect(screen.getByTestId("radio-Gamma")).toBeInTheDocument();
  });

  // ── Custom label and title ────────────────────────────────────────────────

  it("renders custom label on the button", () => {
    render(<ColumnButton label="Pick One" columns={["A"]} />);
    expect(screen.getByText("Pick One")).toBeInTheDocument();
  });

  it("renders custom title in the dropdown", () => {
    render(<ColumnButton title="Select Option" columns={["A"]} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  // ── multiSelect checkbox checked state reflects selectedColumns ────────────

  it("shows checked state for selected columns in multiSelect", () => {
    render(
      <ColumnButton
        columns={["A", "B"]}
        type="multiSelect"
        selectedColumns={["A"]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("checkbox-A")).toHaveAttribute(
      "data-checked",
      "true"
    );
    expect(screen.getByTestId("checkbox-B")).toHaveAttribute(
      "data-checked",
      "false"
    );
  });

  // ── singleSelect radio checked state reflects selectedColumns ─────────────

  it("shows checked state for selected column in singleSelect", () => {
    render(
      <ColumnButton
        columns={["A", "B"]}
        type="singleSelect"
        selectedColumns={["B"]}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("radio-B")).toHaveAttribute(
      "data-checked",
      "true"
    );
    expect(screen.getByTestId("radio-A")).toHaveAttribute(
      "data-checked",
      "false"
    );
  });
});
