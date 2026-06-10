import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AddMoreButton } from "@platform/AddMoreButton";

// lucide-react icons render fine in jsdom; no mock needed.

describe("AddMoreButton", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders without crashing with no props", () => {
    render(<AddMoreButton />);
    // The clickable container is a div, not a button – query by its wrapper
    const container = document.querySelector(".cursor-pointer");
    expect(container).toBeInTheDocument();
  });

  it("renders the Plus icon by default", () => {
    render(<AddMoreButton />);
    // lucide renders an <svg>
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  // ── Title rendering ───────────────────────────────────────────────────────

  it("renders English title when language is 'en'", () => {
    render(<AddMoreButton title="Add Item" title_ar="إضافة عنصر" language="en" />);
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(<AddMoreButton title="Add Item" title_ar="إضافة عنصر" language="ar" />);
    expect(screen.getByText("إضافة عنصر")).toBeInTheDocument();
  });

  it("falls back to English title when title_ar is empty and language is 'ar'", () => {
    render(<AddMoreButton title="Add Item" title_ar="" language="ar" />);
    // SharedLanguageSwitchRenderer falls back to value when value_ar is falsy
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  // ── Custom plusIcon ───────────────────────────────────────────────────────

  it("renders a custom plusIcon when provided", () => {
    render(<AddMoreButton plusIcon={<span data-testid="custom-icon">★</span>} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  // ── Click handler ─────────────────────────────────────────────────────────

  it("calls onClick when the container is clicked", () => {
    const onClick = vi.fn();
    render(<AddMoreButton title="Click me" onClick={onClick} />);
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when no onClick is provided and the element is clicked", () => {
    render(<AddMoreButton title="No handler" />);
    expect(() => fireEvent.click(screen.getByText("No handler"))).not.toThrow();
  });

  // ── Layout classes ────────────────────────────────────────────────────────

  it("outer wrapper has flex class", () => {
    const { container } = render(<AddMoreButton />);
    expect(container.firstChild).toHaveClass("flex");
  });

  it("inner clickable div has cursor-pointer class", () => {
    render(<AddMoreButton />);
    const clickable = document.querySelector(".cursor-pointer");
    expect(clickable).toHaveClass("cursor-pointer");
  });

  it("inner clickable div has h-12 class", () => {
    render(<AddMoreButton />);
    const clickable = document.querySelector(".h-12");
    expect(clickable).toBeInTheDocument();
  });
});
