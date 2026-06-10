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

  it("renders Change Owner button and fires changeOwner action", () => {
    const onPressAction = vi.fn();
    render(
      <OwnerCard
        owners={sampleOwners}
        title="Owners"
        showChangeOwnerButton={true}
        onPressAction={onPressAction}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Change Owner"));
    expect(onPressAction).toHaveBeenCalledWith({
      action: "changeOwner",
      owner: sampleOwners[0],
    });
  });

  it("collapses and re-expands all cards via the master toggle", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    // Initially all expanded -> master shows a Collapse control
    const collapse = screen.getByLabelText("Collapse");
    fireEvent.click(collapse); // toggleMaster -> collapse all
    // Now master shows Expand
    const expand = screen.getByLabelText("Expand");
    fireEvent.click(expand); // toggleMaster -> expand all again
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("re-expands an individual collapsed owner card via its header", () => {
    const multi = [
      ...sampleOwners,
      {
        ownerId: "2",
        ownerArgs: "args-2",
        name: "Jane Doe",
        fields: [{ label: "Phone", value: "+971509876543" }],
      },
    ];
    render(<OwnerCard owners={multi} title="Owners" language="en" />);
    // Collapse all via master toggle
    fireEvent.click(screen.getByLabelText("Collapse"));
    // Click a collapsed card header (owner name) -> toggleExpand(idx)
    fireEvent.click(screen.getByText("John Smith"));
    // Re-expanded card shows its field
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
    // Collapse it again + toggle the other (covers include/remove branches)
    fireEvent.click(screen.getByText("Jane Doe"));
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("expands newly added owners when the owners array grows", () => {
    const { rerender } = render(
      <OwnerCard owners={sampleOwners} title="Owners" language="en" />
    );
    const more = [
      ...sampleOwners,
      {
        ownerId: "2",
        ownerArgs: "args-2",
        name: "Jane Doe",
        fields: [{ label: "Phone", value: "+971509876543" }],
      },
    ];
    rerender(<OwnerCard owners={more} title="Owners" language="en" />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("uses the default onPressAction (no handler) without crashing on View click", () => {
    render(<OwnerCard owners={sampleOwners} title="Owners" language="en" />);
    expect(() => fireEvent.click(screen.getByText("View"))).not.toThrow();
  });

  it("does nothing on master toggle when there are no owners", () => {
    render(<OwnerCard owners={[]} title="Owners" language="en" />);
    // No master toggle rendered for empty owners
    expect(screen.queryByLabelText("Collapse")).not.toBeInTheDocument();
  });
});
