import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollContainer } from "@platform/ScrollContainer";

describe("ScrollContainer", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders a div container", () => {
    const { container } = render(<ScrollContainer>Content</ScrollContainer>);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders children", () => {
    render(<ScrollContainer><span data-testid="child">child</span></ScrollContainer>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  // ── Scroll direction ───────────────────────────────────────────────────────

  it("applies overflow-y-auto by default (horizontal=false)", () => {
    const { container } = render(<ScrollContainer>Content</ScrollContainer>);
    expect(container.firstChild).toHaveClass("overflow-y-auto");
  });

  it("applies overflow-x-auto when horizontal=true", () => {
    const { container } = render(<ScrollContainer horizontal>Content</ScrollContainer>);
    expect(container.firstChild).toHaveClass("overflow-x-auto");
  });

  it("does not apply overflow-x-auto when horizontal=false", () => {
    const { container } = render(<ScrollContainer horizontal={false}>Content</ScrollContainer>);
    expect(container.firstChild).not.toHaveClass("overflow-x-auto");
  });

  // ── Custom className ───────────────────────────────────────────────────────

  it("applies extra className when provided", () => {
    const { container } = render(
      <ScrollContainer className="custom-class">Content</ScrollContainer>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("combines overflow class with custom className", () => {
    const { container } = render(
      <ScrollContainer className="max-h-64" horizontal>Content</ScrollContainer>
    );
    expect(container.firstChild).toHaveClass("overflow-x-auto", "max-h-64");
  });

  // ── Inline style ───────────────────────────────────────────────────────────

  it("applies style prop when provided", () => {
    const { container } = render(
      <ScrollContainer style={{ maxHeight: 200 }}>Content</ScrollContainer>
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.maxHeight).toBe("200px");
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  it("renders correctly with no children", () => {
    const { container } = render(<ScrollContainer>{null}</ScrollContainer>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <ScrollContainer>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </ScrollContainer>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });
});
