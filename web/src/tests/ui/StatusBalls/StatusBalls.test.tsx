import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBalls } from "@platform/StatusBalls";

// The current StatusBalls renders a raw <span data-testid={`status-ball-${status}`}>
// (no @platform/Container). Tests target that real output.

describe("StatusBalls", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing (default pending)", () => {
    const { getByTestId } = render(<StatusBalls />);
    // Default status is "pending"
    expect(getByTestId("status-ball-pending")).toBeInTheDocument();
  });

  it("renders the status ball span for the given status", () => {
    const { getByTestId } = render(<StatusBalls status="pending" />);
    expect(getByTestId("status-ball-pending")).toBeInTheDocument();
  });

  // ── Status variants ────────────────────────────────────────────────────────

  it("renders pending status", () => {
    const { getByTestId } = render(<StatusBalls status="pending" />);
    const ball = getByTestId("status-ball-pending");
    expect(ball).toBeInTheDocument();
    const style = ball.getAttribute("style") || "";
    // jsdom normalises #D0D0D14D → rgba(208, 208, 209, 0.3)
    expect(style).toContain("rgba(208, 208, 209");
  });

  it("renders inProgress status with blue gradient", () => {
    const { getByTestId } = render(<StatusBalls status="inProgress" />);
    const style = getByTestId("status-ball-inProgress").getAttribute("style") || "";
    // jsdom normalises #4DABF7 → rgb(77, 171, 247)
    expect(style).toContain("rgb(77, 171, 247)");
  });

  it("renders complete status with green gradient", () => {
    const { getByTestId } = render(<StatusBalls status="complete" />);
    const style = getByTestId("status-ball-complete").getAttribute("style") || "";
    // jsdom normalises #2F9E44 → rgb(47, 158, 68)
    expect(style).toContain("rgb(47, 158, 68)");
  });

  it("renders failed status with red gradient", () => {
    const { getByTestId } = render(<StatusBalls status="failed" />);
    const style = getByTestId("status-ball-failed").getAttribute("style") || "";
    // jsdom normalises #F69EA1 → rgb(246, 158, 161)
    expect(style).toContain("rgb(246, 158, 161)");
  });

  // ── Special statuses ──────────────────────────────────────────────────────

  it("renders 'fixed' status as a span with a nested inner span", () => {
    const { getByTestId } = render(<StatusBalls status="fixed" />);
    const ball = getByTestId("status-ball-fixed");
    expect(ball).toBeInTheDocument();
    // fixed renders a green outer ball with a red inner span
    expect(ball.querySelectorAll("span").length).toBe(1);
    const outerStyle = ball.getAttribute("style") || "";
    expect(outerStyle).toContain("rgb(47, 158, 68)");
  });

  it("renders 'mixed' status as a span with two half spans", () => {
    const { getByTestId } = render(<StatusBalls status="mixed" />);
    const ball = getByTestId("status-ball-mixed");
    expect(ball).toBeInTheDocument();
    // mixed renders two half spans (red + green)
    expect(ball.querySelectorAll("span").length).toBe(2);
  });

  // ── Size props ────────────────────────────────────────────────────────────

  it("applies default width and height of 16", () => {
    const { getByTestId } = render(<StatusBalls status="pending" />);
    const ball = getByTestId("status-ball-pending");
    const style = ball.getAttribute("style") || "";
    expect(style).toContain("width: 16px");
    expect(style).toContain("height: 16px");
    // also exposed via data attributes
    expect(ball).toHaveAttribute("data-width", "16");
    expect(ball).toHaveAttribute("data-height", "16");
  });

  it("applies custom width and height", () => {
    const { getByTestId } = render(
      <StatusBalls status="pending" width={24} height={24} />
    );
    const ball = getByTestId("status-ball-pending");
    const style = ball.getAttribute("style") || "";
    expect(style).toContain("width: 24px");
    expect(style).toContain("height: 24px");
    expect(ball).toHaveAttribute("data-width", "24");
    expect(ball).toHaveAttribute("data-height", "24");
  });

  // ── Unknown status fallback ───────────────────────────────────────────────

  it("falls back to pending config (background) for unknown status", () => {
    const { getByTestId } = render(
      // @ts-expect-error testing unknown status
      <StatusBalls status="unknown" />
    );
    // testid still reflects the passed status, but styling falls back to pending
    const ball = getByTestId("status-ball-unknown");
    const style = ball.getAttribute("style") || "";
    // Pending uses D0D0D1 → rgba(208, 208, 209, ...) after jsdom normalisation
    expect(style).toContain("rgba(208, 208, 209");
  });

  // ── Classes ───────────────────────────────────────────────────────────────

  it("applies rounded-full class to the status ball", () => {
    const { getByTestId } = render(<StatusBalls status="pending" />);
    expect(getByTestId("status-ball-pending")).toHaveClass("rounded-full");
  });

  it("applies inline-flex class to the status ball", () => {
    const { getByTestId } = render(<StatusBalls status="pending" />);
    expect(getByTestId("status-ball-pending")).toHaveClass("inline-flex");
  });
});
