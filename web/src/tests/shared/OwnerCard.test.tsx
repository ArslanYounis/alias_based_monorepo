import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OwnerCard from "@shared/components/OwnerCard/OwnerCard";

const sampleOwners = [
  {
    ownerId: "1",
    ownerArgs: "args-1",
    name: "John Smith",
    name_ar: "جون سميث",
    fields: [
      { label: "Emirates ID", label_ar: "الهوية", value: "784-xxxx-xxxx", value_ar: "784-xxxx-xxxx" },
      { label: "Phone", label_ar: "الهاتف", value: "+971501234567", value_ar: "+971501234567" },
    ],
  },
];

describe("OwnerCard (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" />);
  });

  it("renders owner fields in English", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  it("renders owner fields labels in Arabic", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" title_ar="الملاك" language="ar" />);
    expect(screen.getByText("الهوية")).toBeInTheDocument();
    expect(screen.getByText("الهاتف")).toBeInTheDocument();
  });

  it("renders View button by default", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("renders Plots button by default", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    expect(screen.getByText("Plots")).toBeInTheDocument();
  });

  it("renders Edit button by default", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("does not render Delete button by default", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("renders Delete button when showDeleteButton is true", () => {
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        showDeleteButton={true}
        language="en"
      />
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onPressAction with 'view' action on View click", () => {
    const onPressAction = vi.fn();
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        onPressAction={onPressAction}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("View"));
    expect(onPressAction).toHaveBeenCalledWith({
      action: "view",
      owner: sampleOwners[0],
    });
  });

  it("calls onPressAction with 'plot' action on Plots click", () => {
    const onPressAction = vi.fn();
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        onPressAction={onPressAction}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Plots"));
    expect(onPressAction).toHaveBeenCalledWith({
      action: "plot",
      owner: sampleOwners[0],
    });
  });

  it("calls onPressAction with 'edit' action on Edit click", () => {
    const onPressAction = vi.fn();
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        onPressAction={onPressAction}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onPressAction).toHaveBeenCalledWith({
      action: "edit",
      owner: sampleOwners[0],
    });
  });

  it("calls onPressAction with 'delete' action on Delete click", () => {
    const onPressAction = vi.fn();
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        showDeleteButton={true}
        onPressAction={onPressAction}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onPressAction).toHaveBeenCalledWith({
      action: "delete",
      owner: sampleOwners[0],
    });
  });

  it("hides all buttons when all show*Button are false", () => {
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        showViewButton={false}
        showPlotsButton={false}
        showEditButton={false}
        language="en"
      />
    );
    expect(screen.queryByText("View")).not.toBeInTheDocument();
    expect(screen.queryByText("Plots")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("renders 2-column layout when itemsPerRow is '2'", () => {
    const { container } = render(
      <OwnerCard owners={sampleOwners} title="Owners" itemsPerRow="2" />
    );
    const grid = container.querySelector(".grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("renders multiple owners", () => {
    const multiOwners = [
      ...sampleOwners,
      {
        ownerId: "2",
        ownerArgs: "args-2",
        name: "Jane Doe",
        fields: [{ label: "Phone", value: "+971509876543" }],
      },
    ];
    render(<OwnerCard owners={multiOwners} title="Owners" language="en" />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders with isExpandable false", () => {
    render(
      <OwnerCard owners={sampleOwners} title="Owners" language="en" isExpandable={false} />
    );
    // Should still render fields
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
  });

  it("renders with defaultShowMore true and many fields", () => {
    const ownerWithManyFields = [
      {
        ownerId: "1",
        ownerArgs: "args-1",
        name: "John Smith",
        fields: Array.from({ length: 5 }, (_, i) => ({
          label: `Field ${i}`,
          value: `Value ${i}`,
        })),
      },
    ];
    render(
      <OwnerCard owners={ownerWithManyFields} title="Owners" defaultShowMore={true} language="en" />
    );
    expect(screen.getByText("Field 4")).toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    render(
      <OwnerCard owners={sampleOwners} title="Owners" language="en" platform="mobile" />
    );
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });
});
