import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IconButton } from "@platform/IconButton";

describe("IconButton (web)", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders a button element", () => {
    render(<IconButton icon={<svg />} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the provided icon inside the button", () => {
    render(<IconButton icon={<svg data-testid="test-icon" />} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders with text node as icon", () => {
    render(<IconButton icon={<span>X</span>} />);
    expect(screen.getByRole("button")).toHaveTextContent("X");
  });

  it("renders without icon without crashing", () => {
    render(<IconButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // ── Classes ───────────────────────────────────────────────────────────────

  it("applies text-text-default class", () => {
    render(<IconButton icon={<svg />} />);
    expect(screen.getByRole("button")).toHaveClass("text-text-default");
  });

  it("applies text-l class for icon sizing", () => {
    render(<IconButton icon={<svg />} />);
    expect(screen.getByRole("button")).toHaveClass("text-l");
  });

  // ── Interaction ───────────────────────────────────────────────────────────

  it("is clickable and does not throw when clicked", () => {
    render(<IconButton icon={<svg />} />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  it("renders multiple different icons correctly", () => {
    const { rerender } = render(
      <IconButton icon={<svg data-testid="icon-a" />} />
    );
    expect(screen.getByTestId("icon-a")).toBeInTheDocument();

    rerender(<IconButton icon={<svg data-testid="icon-b" />} />);
    expect(screen.getByTestId("icon-b")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-a")).not.toBeInTheDocument();
  });
});
