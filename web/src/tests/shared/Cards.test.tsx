import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Cards from "@shared/components/Cards/Cards";

const baseProps = {
  action: "Pending Review",
  action_ar: "قيد المراجعة",
  stepName: "Step 1",
  stepName_ar: "الخطوة 1",
};

describe("Cards (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<Cards action="Test" />);
  });

  it("renders action text in English", () => {
    render(<Cards {...baseProps} language="en" />);
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });

  it("renders action text in Arabic when language is 'ar'", () => {
    render(<Cards {...baseProps} language="ar" />);
    expect(screen.getByText("قيد المراجعة")).toBeInTheDocument();
  });

  it("renders stepName", () => {
    render(<Cards {...baseProps} language="en" />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("renders with type='pending'", () => {
    const { container } = render(<Cards {...baseProps} type="pending" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with type='success'", () => {
    const { container } = render(<Cards {...baseProps} type="success" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with type='failed'", () => {
    const { container } = render(<Cards {...baseProps} type="failed" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with type='action'", () => {
    const { container } = render(<Cards {...baseProps} type="action" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with type='action-other'", () => {
    const { container } = render(<Cards {...baseProps} type="action-other" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders image-row version", () => {
    render(
      <Cards
        {...baseProps}
        version="image-row"
        imageURL="https://example.com/img.jpg"
        type="pending"
      />
    );
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });

  it("calls onCardClick when card is clicked", () => {
    const onClick = vi.fn();
    render(<Cards {...baseProps} type="action" onCardClick={onClick} />);
    const card = screen.getByText("Pending Review").closest("div");
    if (card) fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });

  it("renders vertical direction", () => {
    const { container } = render(<Cards {...baseProps} direction="vertical" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders horizontal direction by default", () => {
    const { container } = render(<Cards {...baseProps} direction="horizontal" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with an imageURL (Avatar)", () => {
    render(
      <Cards
        {...baseProps}
        imageURL="https://example.com/avatar.jpg"
        type="action"
      />
    );
    // Avatar renders with an img tag
    const img = screen.queryByAltText("avatar");
    expect(img).toBeInTheDocument();
  });

  it("renders without imageURL (ProfileIconStatus)", () => {
    render(<Cards {...baseProps} type="pending" />);
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });
});
