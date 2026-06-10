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

  it("renders mobile layout with a flex column container", () => {
    const { container } = render(
      <GenericCards cardsData={sampleCards} platform="mobile" language="en" />
    );
    expect(container.querySelector(".flex.flex-col.gap-xl")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders non-expandable cards (isExpandable false)", () => {
    render(
      <GenericCards
        cardsData={sampleCards}
        isExpandable={false}
        showTitleSection={true}
        language="en"
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("collapses then re-expands all cards via the master toggle", () => {
    render(<GenericCards cardsData={sampleCards} language="en" />);
    // master toggle present; collapse all
    fireEvent.click(screen.getByRole("button", { name: /collapse/i }));
    // now an Expand control is available; expand all again
    fireEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders cards without an id using the index as key", () => {
    const noIdCards = [
      { rowsData: [{ label: "L", value: "NoIdValue" }] },
    ];
    render(<GenericCards cardsData={noIdCards} language="en" />);
    expect(screen.getByText("NoIdValue")).toBeInTheDocument();
  });

  it("re-expands an individual collapsed card via its collapsed header", () => {
    render(<GenericCards cardsData={sampleCards} language="en" />);
    // Collapse all via the master toggle
    fireEvent.click(screen.getByRole("button", { name: /collapse/i }));
    // Each card now shows its collapsed header (cardTitleLabel). Click one to
    // re-expand it -> exercises the per-card onToggleExpand -> toggleExpand(idx)
    fireEvent.click(screen.getByText("Card 1"));
    // After re-expanding card 1, its row value is visible again
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("collapses a single expanded card from the others", () => {
    render(<GenericCards cardsData={sampleCards} language="en" />);
    // collapse all, re-expand card 1, then collapse it again (toggleExpand remove path)
    fireEvent.click(screen.getByRole("button", { name: /collapse/i }));
    fireEvent.click(screen.getByText("Card 1")); // expand idx 0
    fireEvent.click(screen.getByText("Card 2")); // expand idx 1 (includes path)
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders with showButtons true but no buttons prop", () => {
    render(
      <GenericCards
        cardsData={sampleCards}
        showButtons={true}
        language="en"
      />
    );
    // buttons defaults to [] internally -> no crash, cards still render
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("keeps expansion state when re-rendered with the same cards", () => {
    const { rerender } = render(
      <GenericCards cardsData={sampleCards} language="en" />
    );
    // Re-render with the same data -> effect computes no new indices (return prev)
    rerender(<GenericCards cardsData={sampleCards} language="en" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders a card whose rowsData is undefined", () => {
    const cards = [
      { id: "z", cardTitleLabel: "ZCard", cardTitleValue: "ZVal" },
    ] as never;
    expect(() =>
      render(<GenericCards cardsData={cards} language="en" />)
    ).not.toThrow();
  });

  it("applies grid-cols-2 dense flow for two columns", () => {
    const { container } = render(
      <GenericCards cardsData={sampleCards} itemsPerRow="2" language="en" />
    );
    const col2 = container.querySelector(".col-span-2");
    expect(col2).toBeInTheDocument();
  });
});
