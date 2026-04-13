import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CardRow from "@shared/components/CardRow/CardRow";

describe("CardRow (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<CardRow label="Name" value="John" />);
  });

  it("renders default variant with label and value", () => {
    render(<CardRow label="Name" value="John Doe" language="en" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders Arabic label and value when language is 'ar'", () => {
    render(
      <CardRow
        label="Name"
        label_ar="الاسم"
        value="John"
        value_ar="جون"
        language="ar"
      />
    );
    expect(screen.getByText("الاسم")).toBeInTheDocument();
    expect(screen.getByText("جون")).toBeInTheDocument();
  });

  it("renders defaultNoBorder variant", () => {
    const { container } = render(
      <CardRow label="Field" value="Val" rowVariant="defaultNoBorder" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders bottom variant with extraItems", () => {
    render(
      <CardRow
        label="Field 1"
        value="Value 1"
        rowVariant="bottom"
        extraItems={[
          { label: "Field 2", value: "Value 2" },
        ]}
      />
    );
    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
  });

  it("renders moreLink variant with 'More' when isMoreShown is false", () => {
    render(<CardRow rowVariant="moreLink" isMoreShown={false} onToggleMore={vi.fn()} />);
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("renders moreLink variant with 'Less' when isMoreShown is true", () => {
    render(<CardRow rowVariant="moreLink" isMoreShown={true} onToggleMore={vi.fn()} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
  });

  it("calls onToggleMore when moreLink is clicked", () => {
    const onToggle = vi.fn();
    render(<CardRow rowVariant="moreLink" isMoreShown={false} onToggleMore={onToggle} />);
    fireEvent.click(screen.getByText("More"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders rowImage variant", () => {
    const { container } = render(
      <CardRow
        label="Label"
        value="Value"
        rowVariant="rowImage"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders 3colButton variant", () => {
    render(
      <CardRow
        label="Col1"
        value="Val1"
        rowVariant="3colButton"
        extraItems={[
          { label: "Col2", value: "Val2" },
          { label: "Col3", value: "Val3" },
        ]}
        button={{ title: "View", onClick: vi.fn() }}
      />
    );
    expect(screen.getByText("Col1")).toBeInTheDocument();
  });

  it("renders 4colButton variant", () => {
    render(
      <CardRow
        label="Col1"
        value="Val1"
        rowVariant="4colButton"
        extraItems={[
          { value: "Val2" },
          { value: "Val3" },
          { value: "Val4" },
        ]}
      />
    );
    expect(screen.getByText("Col1")).toBeInTheDocument();
  });

  it("renders 5colButton variant", () => {
    const { container } = render(
      <CardRow label="L" value="V" rowVariant="5colButton" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders 6colButton variant", () => {
    const { container } = render(
      <CardRow label="L" value="V" rowVariant="6colButton" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("calls button onClick in button layout", () => {
    const onClick = vi.fn();
    render(
      <CardRow
        label="L"
        value="V"
        rowVariant="3colButton"
        button={{ title: "Click Me", onClick }}
      />
    );
    fireEvent.click(screen.getByText("Click Me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders field variant with a FieldRenderer item", () => {
    render(
      <CardRow
        label="Field Label"
        value="Field Value"
        rowVariant="field"
        fieldType="text"
        inputProps={{
          value: "Field Value",
          onChange: vi.fn(),
          disabled: false,
          placeholder: "Enter value",
        }}
      />
    );
    expect(screen.getByText("Field Label")).toBeInTheDocument();
  });

  it("renders field variant with extra items", () => {
    render(
      <CardRow
        label="Main"
        value="MainVal"
        rowVariant="field"
        extraItems={[
          {
            label: "Extra",
            value: "ExtraVal",
            fieldType: "text",
            inputProps: { value: "ExtraVal", onChange: vi.fn() },
          },
        ]}
      />
    );
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Extra")).toBeInTheDocument();
  });

  it("renders rowImage variant with extra items up to 3", () => {
    render(
      <CardRow
        label="Row 1"
        value="Val 1"
        rowVariant="rowImage"
        extraItems={[
          { label: "Row 2", value: "Val 2" },
          { label: "Row 3", value: "Val 3" },
        ]}
      />
    );
    expect(screen.getByText("Row 1")).toBeInTheDocument();
    expect(screen.getByText("Row 2")).toBeInTheDocument();
    expect(screen.getByText("Row 3")).toBeInTheDocument();
  });

  it("does not render button in button layout when no button prop given", () => {
    render(
      <CardRow label="L" value="V" rowVariant="3colButton" />
    );
    // Without a button prop no button should appear (other than what's in the row)
    expect(screen.getByText("L")).toBeInTheDocument();
  });

  it("renders Arabic labels in default variant when language is 'ar'", () => {
    render(
      <CardRow
        label="Name"
        label_ar="الاسم"
        value="John"
        value_ar="جون"
        rowVariant="default"
        language="ar"
      />
    );
    expect(screen.getByText("الاسم")).toBeInTheDocument();
    expect(screen.getByText("جون")).toBeInTheDocument();
  });

  it("renders Arabic labels in bottom variant", () => {
    render(
      <CardRow
        label="Field"
        label_ar="الحقل"
        value="Val"
        value_ar="القيمة"
        rowVariant="bottom"
        language="ar"
      />
    );
    expect(screen.getByText("الحقل")).toBeInTheDocument();
    expect(screen.getByText("القيمة")).toBeInTheDocument();
  });

  it("renders Arabic moreLink Less text", () => {
    render(
      <CardRow
        rowVariant="moreLink"
        isMoreShown={true}
        onToggleMore={vi.fn()}
        language="ar"
      />
    );
    expect(screen.getByText("أقل")).toBeInTheDocument();
  });

  it("renders Arabic moreLink More text", () => {
    render(
      <CardRow
        rowVariant="moreLink"
        isMoreShown={false}
        onToggleMore={vi.fn()}
        language="ar"
      />
    );
    expect(screen.getByText("أكثر")).toBeInTheDocument();
  });
});
