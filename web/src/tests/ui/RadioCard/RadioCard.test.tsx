import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadioCard } from "@platform/RadioCard";

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({ value, value_ar, language }: { value?: string; value_ar?: string; language: string }) =>
    language === "ar" ? (value_ar || value || "") : (value || ""),
}));

describe("RadioCard", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders a button element", () => {
    render(<RadioCard id="card1" label="Option A" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<RadioCard id="card1" label="Option A" />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("has type='button'", () => {
    render(<RadioCard id="card1" label="Option A" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders icon when provided", () => {
    render(<RadioCard id="card1" label="Test" icon={<span data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  // ── clicked / disabled states ──────────────────────────────────────────────

  it("data-clicked is 'false' by default", () => {
    render(<RadioCard id="card1" label="Test" />);
    expect(screen.getByRole("button")).toHaveAttribute("data-clicked", "false");
  });

  it("data-clicked is 'true' when clicked=true", () => {
    render(<RadioCard id="card1" label="Test" clicked />);
    expect(screen.getByRole("button")).toHaveAttribute("data-clicked", "true");
  });

  it("button is disabled when disabled=true", () => {
    render(<RadioCard id="card1" label="Test" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies cursor-not-allowed when disabled", () => {
    render(<RadioCard id="card1" label="Test" disabled />);
    expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed");
  });

  it("applies cursor-pointer when not disabled", () => {
    render(<RadioCard id="card1" label="Test" />);
    expect(screen.getByRole("button")).toHaveClass("cursor-pointer");
  });

  // ── Text color ─────────────────────────────────────────────────────────────

  it("uses dimmed text color when disabled", () => {
    render(<RadioCard id="card1" label="Dimmed" disabled />);
    const span = screen.getByText("Dimmed");
    expect(span).toHaveClass("text-text-dimmed");
  });

  it("uses default text color when not disabled", () => {
    render(<RadioCard id="card1" label="Default" />);
    const span = screen.getByText("Default");
    expect(span).toHaveClass("text-text-default");
  });

  // ── Icon direction ─────────────────────────────────────────────────────────

  it("uses flex-row for left icon location (default)", () => {
    render(<RadioCard id="card1" label="Test" iconLocation="left" />);
    const inner = document.querySelector(".flex.items-center.gap-xxs");
    expect(inner).toHaveClass("flex-row");
  });

  it("uses flex-col for top icon location", () => {
    render(<RadioCard id="card1" label="Test" iconLocation="top" />);
    const inner = document.querySelector(".flex.items-center.gap-xxs");
    expect(inner).toHaveClass("flex-col");
  });

  it("uses flex-row-reverse for right icon location", () => {
    render(<RadioCard id="card1" label="Test" iconLocation="right" />);
    const inner = document.querySelector(".flex.items-center.gap-xxs");
    expect(inner).toHaveClass("flex-row-reverse");
  });

  it("uses flex-col-reverse for bottom icon location", () => {
    render(<RadioCard id="card1" label="Test" iconLocation="bottom" />);
    const inner = document.querySelector(".flex.items-center.gap-xxs");
    expect(inner).toHaveClass("flex-col-reverse");
  });

  // ── onClick ────────────────────────────────────────────────────────────────

  it("calls onClick with id when clicked and not disabled", () => {
    const onClick = vi.fn();
    render(<RadioCard id="card1" label="Test" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith("card1");
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<RadioCard id="card1" label="Test" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not throw when no onClick prop is provided", () => {
    render(<RadioCard id="card1" label="Test" />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  // ── Arabic language ────────────────────────────────────────────────────────

  it("renders arabic label when language is ar", () => {
    render(<RadioCard id="card1" label="Option A" label_ar="خيار أ" language="ar" />);
    expect(screen.getByText("خيار أ")).toBeInTheDocument();
  });
});
