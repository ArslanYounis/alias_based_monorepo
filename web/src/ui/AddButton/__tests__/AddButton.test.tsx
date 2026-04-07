import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AddButton } from "../AddButton";

describe("AddButton (web)", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders a button element", () => {
    render(<AddButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders a PlusIcon SVG inside the button", () => {
    render(<AddButton />);
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with type='button' to avoid accidental form submission", () => {
    render(<AddButton />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  // ── Default state (enabled) ───────────────────────────────────────────────

  it("is not disabled by default", () => {
    render(<AddButton />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("applies enabled border class when not disabled", () => {
    render(<AddButton />);
    expect(screen.getByRole("button")).toHaveClass(
      "border-button-primary-default-bg"
    );
  });

  it("applies cursor-pointer class when not disabled", () => {
    render(<AddButton />);
    expect(screen.getByRole("button")).toHaveClass("cursor-pointer");
  });

  it("applies enabled icon class when not disabled", () => {
    render(<AddButton />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("text-button-primary-default-bg");
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("is disabled when disabled prop is true", () => {
    render(<AddButton disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies disabled border class when disabled", () => {
    render(<AddButton disabled />);
    expect(screen.getByRole("button")).toHaveClass(
      "border-button-primary-disabled"
    );
  });

  it("applies cursor-not-allowed class when disabled", () => {
    render(<AddButton disabled />);
    expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed");
  });

  it("applies disabled icon class when disabled", () => {
    render(<AddButton disabled />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("text-button-primary-disabled");
  });

  // ── Interaction ───────────────────────────────────────────────────────────

  it("calls onClick handler when clicked", () => {
    const onClick = vi.fn();
    render(<AddButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled and clicked", () => {
    const onClick = vi.fn();
    render(<AddButton disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not throw when no onClick prop is provided", () => {
    render(<AddButton />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  // ── Layout classes ────────────────────────────────────────────────────────

  it("has fixed width and height layout classes", () => {
    render(<AddButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-[66px]", "h-[50px]");
  });

  it("uses flex centering layout", () => {
    render(<AddButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("flex", "items-center", "justify-center");
  });
});
