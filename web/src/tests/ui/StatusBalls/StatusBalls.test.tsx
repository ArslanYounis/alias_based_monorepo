import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatusBalls } from "@platform/StatusBalls";

vi.mock("@platform/Container", () => ({
  Container: ({ children, className, style }: {
    children?: React.ReactNode; className?: string; style?: React.CSSProperties;
  }) => (
    <div className={className} style={style} data-testid="container">
      {children}
    </div>
  ),
}));

describe("StatusBalls", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing (default pending)", () => {
    const { container } = render(<StatusBalls />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a container element", () => {
    const { getAllByTestId } = render(<StatusBalls status="pending" />);
    expect(getAllByTestId("container").length).toBeGreaterThan(0);
  });

  // ── Status variants ────────────────────────────────────────────────────────

  it("renders pending status", () => {
    const { getAllByTestId } = render(<StatusBalls status="pending" />);
    const container = getAllByTestId("container")[0];
    expect(container).toBeInTheDocument();
    const style = container.getAttribute("style") || "";
    // jsdom normalises #D0D0D14D → rgba(208, 208, 209, 0.3)
    expect(style).toContain("rgba(208, 208, 209");
  });

  it("renders inProgress status with blue gradient", () => {
    const { getAllByTestId } = render(<StatusBalls status="inProgress" />);
    const container = getAllByTestId("container")[0];
    const style = container.getAttribute("style") || "";
    // jsdom normalises #4DABF7 → rgb(77, 171, 247)
    expect(style).toContain("rgb(77, 171, 247)");
  });

  it("renders complete status with green gradient", () => {
    const { getAllByTestId } = render(<StatusBalls status="complete" />);
    const container = getAllByTestId("container")[0];
    const style = container.getAttribute("style") || "";
    // jsdom normalises #2F9E44 → rgb(47, 158, 68)
    expect(style).toContain("rgb(47, 158, 68)");
  });

  it("renders failed status with red gradient", () => {
    const { getAllByTestId } = render(<StatusBalls status="failed" />);
    const container = getAllByTestId("container")[0];
    const style = container.getAttribute("style") || "";
    // jsdom normalises #F69EA1 → rgb(246, 158, 161)
    expect(style).toContain("rgb(246, 158, 161)");
  });

  // ── Special statuses ──────────────────────────────────────────────────────

  it("renders 'fixed' status with two nested containers", () => {
    const { getAllByTestId } = render(<StatusBalls status="fixed" />);
    expect(getAllByTestId("container").length).toBeGreaterThanOrEqual(2);
  });

  it("renders 'mixed' status with two half containers", () => {
    const { getAllByTestId } = render(<StatusBalls status="mixed" />);
    expect(getAllByTestId("container").length).toBeGreaterThanOrEqual(3);
  });

  // ── Size props ────────────────────────────────────────────────────────────

  it("applies default width and height of 16", () => {
    const { getAllByTestId } = render(<StatusBalls status="pending" />);
    const container = getAllByTestId("container")[0];
    const style = container.getAttribute("style") || "";
    expect(style).toContain("width: 16px");
    expect(style).toContain("height: 16px");
  });

  it("applies custom width and height", () => {
    const { getAllByTestId } = render(<StatusBalls status="pending" width={24} height={24} />);
    const container = getAllByTestId("container")[0];
    const style = container.getAttribute("style") || "";
    expect(style).toContain("width: 24px");
    expect(style).toContain("height: 24px");
  });

  // ── Unknown status fallback ───────────────────────────────────────────────

  it("falls back to pending config for unknown status", () => {
    const { getAllByTestId } = render(
      // @ts-expect-error testing unknown status
      <StatusBalls status="unknown" />
    );
    const container = getAllByTestId("container")[0];
    const style = container.getAttribute("style") || "";
    // Pending uses D0D0D1 → rgba(208, 208, 209, ...) after jsdom normalisation
    expect(style).toContain("rgba(208, 208, 209");
  });

  // ── Classes ───────────────────────────────────────────────────────────────

  it("applies rounded-full class to the main container", () => {
    const { getAllByTestId } = render(<StatusBalls status="pending" />);
    expect(getAllByTestId("container")[0]).toHaveClass("rounded-full");
  });
});
