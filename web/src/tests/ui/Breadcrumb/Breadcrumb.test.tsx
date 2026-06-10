import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Breadcrumb } from "@platform/Breadcrumb";

const defaultItems = [
  { label: "Home", label_ar: "الرئيسية", onClick: vi.fn() },
  { label: "Category", label_ar: "الفئة", onClick: vi.fn() },
  { label: "Detail", label_ar: "التفاصيل", onClick: vi.fn() },
];

describe("Breadcrumb", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders a <nav> element", () => {
    render(<Breadcrumb items={defaultItems} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders all item labels in English", () => {
    render(<Breadcrumb items={defaultItems} language="en" />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("renders all item labels in Arabic", () => {
    render(<Breadcrumb items={defaultItems} language="ar" />);
    expect(screen.getByText("الرئيسية")).toBeInTheDocument();
    expect(screen.getByText("الفئة")).toBeInTheDocument();
    expect(screen.getByText("التفاصيل")).toBeInTheDocument();
  });

  it("renders separators between items", () => {
    render(<Breadcrumb items={defaultItems} />);
    const separators = screen.getAllByText("/");
    // 3 items → 2 separators
    expect(separators).toHaveLength(2);
  });

  // ── Selected item (default = last) ────────────────────────────────────────

  it("the last item is selected by default when selectedItemIndex is not provided", () => {
    render(<Breadcrumb items={defaultItems} />);
    const selectedSpan = document.querySelector(".text-text-default.cursor-default");
    expect(selectedSpan).toBeInTheDocument();
    expect(selectedSpan?.textContent).toBe("Detail");
  });

  it("selects the correct item when selectedItemIndex is provided", () => {
    render(<Breadcrumb items={defaultItems} selectedItemIndex={1} />);
    const selectedSpan = document.querySelector(".text-text-default.cursor-default");
    expect(selectedSpan?.textContent).toBe("Category");
  });

  // ── Click handlers ────────────────────────────────────────────────────────

  it("calls onClick for a non-selected item when clicked", () => {
    const onClick = vi.fn();
    const items = [
      { label: "Home", label_ar: "الرئيسية", onClick },
      { label: "Current", label_ar: "الحالي", onClick: vi.fn() },
    ];
    render(<Breadcrumb items={items} />);
    fireEvent.click(screen.getByText("Home"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick for the selected item when clicked", () => {
    const onClick = vi.fn();
    const items = [
      { label: "Home", label_ar: "الرئيسية", onClick: vi.fn() },
      { label: "Current", label_ar: "الحالي", onClick },
    ];
    render(<Breadcrumb items={items} />);
    fireEvent.click(screen.getByText("Current"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── isSelectedHover ───────────────────────────────────────────────────────

  it("selected item has cursor-default when isSelectedHover is false", () => {
    render(
      <Breadcrumb items={defaultItems} isSelectedHover={false} />
    );
    const span = document.querySelector(".cursor-default");
    expect(span).toBeInTheDocument();
  });

  it("selected item gets text-text-link on mouseenter when isSelectedHover is true", () => {
    render(
      <Breadcrumb items={defaultItems} isSelectedHover={true} />
    );
    const selected = document.querySelector(".cursor-default");
    fireEvent.mouseEnter(selected!);
    // After hover the class changes to text-text-link
    expect(selected).toHaveClass("text-text-link");
  });

  it("selected item reverts to text-text-default on mouseleave", () => {
    render(
      <Breadcrumb items={defaultItems} isSelectedHover={true} />
    );
    const selected = document.querySelector(".cursor-default");
    fireEvent.mouseEnter(selected!);
    fireEvent.mouseLeave(selected!);
    expect(selected).toHaveClass("text-text-default");
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders single item with no separator", () => {
    render(
      <Breadcrumb
        items={[{ label: "Only", label_ar: "فقط", onClick: vi.fn() }]}
      />
    );
    expect(screen.queryByText("/")).not.toBeInTheDocument();
  });

  it("uses default items when none provided", () => {
    render(<Breadcrumb />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Level 1")).toBeInTheDocument();
  });

  it("does not throw when clicking default items (default onClick no-op)", () => {
    render(<Breadcrumb />);
    expect(() => fireEvent.click(screen.getByText("Home"))).not.toThrow();
    expect(() => fireEvent.click(screen.getByText("Level 1"))).not.toThrow();
  });

  it("triggers mouseEnter/mouseLeave on selected item hover", () => {
    render(<Breadcrumb items={defaultItems} isSelectedHover />);
    const selected = screen.getByText("Detail");
    fireEvent.mouseEnter(selected);
    fireEvent.mouseLeave(selected);
    expect(selected).toBeInTheDocument();
  });
});
