import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CardTitle from "@shared/components/CardTitle/CardTitle";

describe("CardTitle (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<CardTitle title="Test" title_ar="اختبار" />);
  });

  it("renders English title", () => {
    render(<CardTitle title="My Card" title_ar="بطاقتي" language="en" />);
    expect(screen.getByText("My Card")).toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(<CardTitle title="My Card" title_ar="بطاقتي" language="ar" />);
    expect(screen.getByText("بطاقتي")).toBeInTheDocument();
  });

  it("renders description in English", () => {
    render(
      <CardTitle title="T" title_ar="ت" description="Some desc" description_ar="وصف" language="en" />
    );
    expect(screen.getByText("Some desc")).toBeInTheDocument();
  });

  it("renders description in Arabic", () => {
    render(
      <CardTitle title="T" title_ar="ت" description="Some desc" description_ar="وصف" language="ar" />
    );
    expect(screen.getByText("وصف")).toBeInTheDocument();
  });

  it("renders subText in English", () => {
    render(
      <CardTitle title="T" title_ar="ت" subText="Sub info" subText_ar="معلومات فرعية" language="en" />
    );
    expect(screen.getByText("Sub info")).toBeInTheDocument();
  });

  it("renders status badge when status prop is provided", () => {
    render(
      <CardTitle title="T" title_ar="ت" status="Active" language="en" />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders Arabic status when language is 'ar'", () => {
    render(
      <CardTitle title="T" title_ar="ت" status="Active" status_ar="نشط" language="ar" />
    );
    expect(screen.getByText("نشط")).toBeInTheDocument();
  });

  it("renders expand/collapse button when isExpandable is true", () => {
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        isExpandable={true}
        isExpanded={true}
        platform="web"
      />
    );
    expect(screen.getByRole("button", { name: /collapse/i })).toBeInTheDocument();
  });

  it("calls onToggleExpand when expand button is clicked", () => {
    const onToggle = vi.fn();
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        isExpandable={true}
        isExpanded={false}
        onToggleExpand={onToggle}
        platform="web"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders buttons when showButtons is true", () => {
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        showButtons={true}
        buttons={[{ title: "Edit", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("calls button onClick", () => {
    const onClick = vi.fn();
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        showButtons={true}
        buttons={[{ title: "Edit", onClick }]}
      />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders titleButtons when showTitleButtons is true and not expandable", () => {
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        isExpandable={false}
        showTitleButtons={true}
        titleButtons={[{ title: "Save", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renders large variant title class", () => {
    const { container } = render(
      <CardTitle title="T" title_ar="ت" variant="large" />
    );
    const el = container.querySelector(".text-heading-h3");
    expect(el).toBeInTheDocument();
  });

  it("renders small variant title class", () => {
    const { container } = render(
      <CardTitle title="T" title_ar="ت" variant="small" />
    );
    const el = container.querySelector(".text-bold-ml");
    expect(el).toBeInTheDocument();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <CardTitle title="T" title_ar="ت" language="ar" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("renders expandable toggle on mobile platform", () => {
    const onToggle = vi.fn();
    const { container } = render(
      <CardTitle
        title="T"
        title_ar="ت"
        isExpandable={true}
        isExpanded={false}
        onToggleExpand={onToggle}
        platform="mobile"
      />
    );
    // On mobile the chevron is rendered inside a clickable Container (div), not a
    // native <button>. The chevron icon is an svg; click its wrapping div.
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    fireEvent.click(svg!.parentElement!);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders mobile expanded state", () => {
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        isExpandable={true}
        isExpanded={true}
        platform="mobile"
      />
    );
    // Should render without crash
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("calls titleButtons onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        isExpandable={false}
        showTitleButtons={true}
        titleButtons={[{ title: "Action", onClick }]}
      />
    );
    fireEvent.click(screen.getByText("Action"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders description with subText together", () => {
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        description="A description"
        description_ar="وصف"
        subText="Sub info"
        subText_ar="فرعي"
        language="en"
      />
    );
    expect(screen.getByText("A description")).toBeInTheDocument();
    expect(screen.getByText("Sub info")).toBeInTheDocument();
  });

  it("renders border when subText present and showBorder true", () => {
    const { container } = render(
      <CardTitle
        title="T"
        title_ar="ت"
        subText="Some sub"
        showBorder={true}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("border-b");
  });

  it("does not render border when showBorder is false", () => {
    const { container } = render(
      <CardTitle
        title="T"
        title_ar="ت"
        subText="Some sub"
        showBorder={false}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain("border-b-border-dimmed");
  });

  it("renders medium variant title class by default", () => {
    const { container } = render(
      <CardTitle title="T" title_ar="ت" />
    );
    const el = container.querySelector(".text-bold-l");
    expect(el).toBeInTheDocument();
  });

  it("renders multiple buttons when showButtons is true", () => {
    const onClick1 = vi.fn();
    const onClick2 = vi.fn();
    render(
      <CardTitle
        title="T"
        title_ar="ت"
        showButtons={true}
        buttons={[
          { title: "Btn1", onClick: onClick1 },
          { title: "Btn2", onClick: onClick2 },
        ]}
      />
    );
    expect(screen.getByText("Btn1")).toBeInTheDocument();
    expect(screen.getByText("Btn2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Btn1"));
    fireEvent.click(screen.getByText("Btn2"));
    expect(onClick1).toHaveBeenCalled();
    expect(onClick2).toHaveBeenCalled();
  });
});
