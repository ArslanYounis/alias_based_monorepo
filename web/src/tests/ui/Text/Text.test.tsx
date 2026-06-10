import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Text } from "@platform/Text";

describe("Text", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders a span element", () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders children text", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders children nodes", () => {
    render(
      <Text>
        <strong data-testid="inner">bold</strong>
      </Text>
    );
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });

  // ── className prop ─────────────────────────────────────────────────────────

  it("applies className when provided", () => {
    render(<Text className="custom-class">Text</Text>);
    expect(screen.getByText("Text")).toHaveClass("custom-class");
  });

  it("applies multiple classes", () => {
    render(<Text className="class-a class-b">Text</Text>);
    const el = screen.getByText("Text");
    expect(el).toHaveClass("class-a");
    expect(el).toHaveClass("class-b");
  });

  it("renders without className when not provided", () => {
    render(<Text>No class</Text>);
    expect(screen.getByText("No class")).toBeInTheDocument();
  });

  // ── style prop ────────────────────────────────────────────────────────────

  it("applies style when provided", () => {
    render(<Text style={{ color: "red" }}>Styled</Text>);
    const el = screen.getByText("Styled") as HTMLElement;
    expect(el.style.color).toBe("red");
  });

  it("applies multiple style properties", () => {
    render(<Text style={{ fontSize: "16px", fontWeight: "bold" }}>Multi-style</Text>);
    const el = screen.getByText("Multi-style") as HTMLElement;
    expect(el.style.fontSize).toBe("16px");
    expect(el.style.fontWeight).toBe("bold");
  });

  it("renders without style when not provided", () => {
    render(<Text>Plain</Text>);
    expect(screen.getByText("Plain")).toBeInTheDocument();
  });

  // ── Both props together ───────────────────────────────────────────────────

  it("applies both className and style when both provided", () => {
    render(<Text className="my-class" style={{ opacity: 0.5 }}>Combined</Text>);
    const el = screen.getByText("Combined") as HTMLElement;
    expect(el).toHaveClass("my-class");
    expect(el.style.opacity).toBe("0.5");
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  it("renders with no props at all", () => {
    const { container } = render(<Text />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders numeric children", () => {
    render(<Text>{42}</Text>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
