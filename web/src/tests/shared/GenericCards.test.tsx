import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GenericCards from "@shared/components/GenericCards/GenericCards";

const sampleCards = [
  {
    id: "1",
    rowsData: [
      { label: "Name", label_ar: "الاسم", value: "Alice", value_ar: "أليس" },
    ],
    cardTitleLabel: "Card 1",
    cardTitleValue: "Alice",
  },
  {
    id: "2",
    rowsData: [
      { label: "Name", label_ar: "الاسم", value: "Bob", value_ar: "بوب" },
    ],
    cardTitleLabel: "Card 2",
    cardTitleValue: "Bob",
  },
];

describe("GenericCards (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<GenericCards cardsData={sampleCards} />);
  });

  it("renders all cards", () => {
    render(<GenericCards cardsData={sampleCards} language="en" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders with empty cardsData", () => {
    render(<GenericCards cardsData={[]} />);
  });

  it("renders in Arabic language", () => {
    render(<GenericCards cardsData={sampleCards} language="ar" />);
    expect(screen.getByText("أليس")).toBeInTheDocument();
    expect(screen.getByText("بوب")).toBeInTheDocument();
  });

  it("applies grid-cols-2 when itemsPerRow is '2'", () => {
    const { container } = render(
      <GenericCards cardsData={sampleCards} itemsPerRow="2" />
    );
    const grid = container.querySelector(".grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("applies grid-cols-3 when itemsPerRow is '3'", () => {
    const { container } = render(
      <GenericCards cardsData={sampleCards} itemsPerRow="3" />
    );
    const grid = container.querySelector(".grid-cols-3");
    expect(grid).toBeInTheDocument();
  });

  it("calls buttons onClick with card and index when button is clicked", () => {
    const onClick = vi.fn();
    render(
      <GenericCards
        cardsData={sampleCards}
        showButtons={true}
        buttons={[{ title: "View", onClick }]}
        language="en"
      />
    );
    const viewBtns = screen.getAllByText("View");
    fireEvent.click(viewBtns[0]);
    expect(onClick).toHaveBeenCalledWith(sampleCards[0], 0);
  });

  it("toggles a card's expansion on click", () => {
    const uniqueCards = [
      {
        id: "x1",
        rowsData: [{ label: "FieldX", value: "UniqueValueX" }],
        cardTitleLabel: "CardLabelX",
        cardTitleValue: "CardValX",
      },
    ];
    render(
      <GenericCards
        cardsData={uniqueCards}
        isExpandable={true}
        language="en"
      />
    );
    // FieldX is visible initially (card expanded)
    expect(screen.getByText("FieldX")).toBeInTheDocument();
    // Collapse the card
    const collapseBtns = screen.getAllByRole("button", { name: /collapse/i });
    fireEvent.click(collapseBtns[0]);
    // After collapse, row field should not be visible
    expect(screen.queryByText("FieldX")).not.toBeInTheDocument();
  });

  it("renders showMoreButton for cards with more than 3 rows", () => {
    const cardWithManyRows = [
      {
        id: "1",
        rowsData: Array.from({ length: 5 }, (_, i) => ({
          label: `Label ${i}`,
          value: `Value ${i}`,
        })),
      },
    ];
    render(<GenericCards cardsData={cardWithManyRows} />);
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("applies rtl direction when language is 'ar'", () => {
    const { container } = render(
      <GenericCards cardsData={sampleCards} language="ar" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("renders buttons without onClick gracefully", () => {
    render(
      <GenericCards
        cardsData={sampleCards}
        showButtons={true}
        buttons={[{ title: "NoAction" }]}
        language="en"
      />
    );
    const btns = screen.getAllByText("NoAction");
    expect(btns.length).toBe(2);
    // Clicking should not crash
    fireEvent.click(btns[0]);
  });

  it("applies grid-cols-1 by default", () => {
    const { container } = render(
      <GenericCards cardsData={sampleCards} />
    );
    const grid = container.querySelector(".grid-cols-1");
    expect(grid).toBeInTheDocument();
  });

  it("renders with showTitleSection false", () => {
    render(
      <GenericCards
        cardsData={sampleCards}
        showTitleSection={false}
        language="en"
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders with showBorder true", () => {
    render(
      <GenericCards
        cardsData={sampleCards}
        showBorder={true}
        language="en"
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});
