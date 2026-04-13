import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileIconStatus } from "@platform/ProfileIconStatus";

// Mock each SVG icon so we can verify which one is rendered
vi.mock("@/assets/svg/statusSvg/Away", () => ({
  default: ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => (
    <svg
      data-testid="away-svg"
      width={width}
      height={height}
    />
  ),
}));

vi.mock("@/assets/svg/statusSvg/Arrow", () => ({
  default: ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => (
    <svg
      data-testid="arrow-svg"
      width={width}
      height={height}
    />
  ),
}));

vi.mock("@/assets/svg/statusSvg/Online", () => ({
  default: ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => (
    <svg
      data-testid="online-svg"
      width={width}
      height={height}
    />
  ),
}));

vi.mock("@/assets/svg/statusSvg/failed", () => ({
  default: ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => (
    <svg
      data-testid="failed-svg"
      width={width}
      height={height}
    />
  ),
}));

describe("ProfileIconStatus (web)", () => {
  // ── Status-based icon rendering ───────────────────────────────────────────

  it("renders AwaySvg for status='pending'", () => {
    render(<ProfileIconStatus status="pending" />);
    expect(screen.getByTestId("away-svg")).toBeInTheDocument();
  });

  it("renders ArrowSvg for status='inProgress'", () => {
    render(<ProfileIconStatus status="inProgress" />);
    expect(screen.getByTestId("arrow-svg")).toBeInTheDocument();
  });

  it("renders OnlineSvg for status='complete'", () => {
    render(<ProfileIconStatus status="complete" />);
    expect(screen.getByTestId("online-svg")).toBeInTheDocument();
  });

  it("renders FailedSvg for status='failed'", () => {
    render(<ProfileIconStatus status="failed" />);
    expect(screen.getByTestId("failed-svg")).toBeInTheDocument();
  });

  it("renders nothing for unknown status", () => {
    const { container } = render(
      <ProfileIconStatus status={"unknown" as "pending"} />
    );
    // The wrapper div exists but contains no svg
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  // ── Mutually exclusive icons ──────────────────────────────────────────────

  it("only renders one icon for each status", () => {
    render(<ProfileIconStatus status="pending" />);
    expect(screen.queryByTestId("arrow-svg")).not.toBeInTheDocument();
    expect(screen.queryByTestId("online-svg")).not.toBeInTheDocument();
    expect(screen.queryByTestId("failed-svg")).not.toBeInTheDocument();
  });

  // ── Default dimensions ────────────────────────────────────────────────────

  it("passes default width=18 and height=18 to icon", () => {
    render(<ProfileIconStatus status="pending" />);
    const svg = screen.getByTestId("away-svg");
    expect(svg).toHaveAttribute("width", "18");
    expect(svg).toHaveAttribute("height", "18");
  });

  // ── Custom dimensions ─────────────────────────────────────────────────────

  it("passes custom width and height to icon", () => {
    render(<ProfileIconStatus status="complete" width={32} height={32} />);
    const svg = screen.getByTestId("online-svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("passes custom width and height to failed icon", () => {
    render(<ProfileIconStatus status="failed" width={24} height={24} />);
    const svg = screen.getByTestId("failed-svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  // ── Wrapper div styles ────────────────────────────────────────────────────

  it("applies circular border-radius to wrapper div", () => {
    render(<ProfileIconStatus status="pending" />);
    const svg = screen.getByTestId("away-svg");
    const wrapper = svg.closest("div");
    // jsdom stores the inline style value as a string
    expect(wrapper?.style.borderRadius).toBe("50%");
  });

  it("sets wrapper div width and height to match props", () => {
    render(<ProfileIconStatus status="pending" width={40} height={40} />);
    const svg = screen.getByTestId("away-svg");
    const wrapper = svg.closest("div");
    expect(wrapper?.style.width).toBe("40px");
    expect(wrapper?.style.height).toBe("40px");
  });

  it("applies flex centering to wrapper div", () => {
    render(<ProfileIconStatus status="inProgress" />);
    const svg = screen.getByTestId("arrow-svg");
    const wrapper = svg.closest("div");
    expect(wrapper).toHaveStyle({ display: "flex", justifyContent: "center", alignItems: "center" });
  });
});
