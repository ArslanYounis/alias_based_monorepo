import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Logo } from "@platform/Logo";

// Mock the OneHubsvg component used for the "hub" type
vi.mock("@/assets/icons/oneHubsvg", () => ({
  default: ({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <svg
      data-testid="one-hub-svg"
      className={className}
      style={style}
    />
  ),
}));

describe("Logo (web)", () => {
  // ── type='full' ───────────────────────────────────────────────────────────

  it("renders an img with 'DMT logo' alt text for type='full'", () => {
    render(<Logo type="full" />);
    expect(screen.getByAltText("DMT logo")).toBeInTheDocument();
  });

  it("applies default width 300px for type='full'", () => {
    render(<Logo type="full" />);
    const img = screen.getByAltText("DMT logo");
    expect(img).toHaveAttribute("width", "300px");
  });

  it("applies default height 66px for type='full'", () => {
    render(<Logo type="full" />);
    const img = screen.getByAltText("DMT logo");
    expect(img).toHaveAttribute("height", "66px");
  });

  it("overrides width when width prop is provided for type='full'", () => {
    render(<Logo type="full" width="200px" />);
    expect(screen.getByAltText("DMT logo")).toHaveAttribute("width", "200px");
  });

  it("overrides height when height prop is provided for type='full'", () => {
    render(<Logo type="full" height="50px" />);
    expect(screen.getByAltText("DMT logo")).toHaveAttribute("height", "50px");
  });

  it("applies className to img for type='full'", () => {
    render(<Logo type="full" className="my-logo" />);
    expect(screen.getByAltText("DMT logo")).toHaveClass("my-logo");
  });

  // ── type='icon' ───────────────────────────────────────────────────────────

  it("renders an img with 'DMT icon' alt text for type='icon'", () => {
    render(<Logo type="icon" />);
    expect(screen.getByAltText("DMT icon")).toBeInTheDocument();
  });

  it("applies default width 32.54px for type='icon'", () => {
    render(<Logo type="icon" />);
    expect(screen.getByAltText("DMT icon")).toHaveAttribute("width", "32.54px");
  });

  it("applies default height 37px for type='icon'", () => {
    render(<Logo type="icon" />);
    expect(screen.getByAltText("DMT icon")).toHaveAttribute("height", "37px");
  });

  it("overrides dimensions for type='icon' when provided", () => {
    render(<Logo type="icon" width="40px" height="45px" />);
    const img = screen.getByAltText("DMT icon");
    expect(img).toHaveAttribute("width", "40px");
    expect(img).toHaveAttribute("height", "45px");
  });

  // ── type='hub' ────────────────────────────────────────────────────────────

  it("renders OneHubsvg for type='hub'", () => {
    render(<Logo type="hub" />);
    expect(screen.getByTestId("one-hub-svg")).toBeInTheDocument();
  });

  it("applies default width 52px and height 34px for type='hub'", () => {
    render(<Logo type="hub" />);
    const svg = screen.getByTestId("one-hub-svg");
    expect(svg).toHaveStyle({ width: "52px", height: "34px" });
  });

  it("overrides dimensions for type='hub' when provided", () => {
    render(<Logo type="hub" width="80px" height="60px" />);
    const svg = screen.getByTestId("one-hub-svg");
    expect(svg).toHaveStyle({ width: "80px", height: "60px" });
  });

  it("passes className to OneHubsvg for type='hub'", () => {
    render(<Logo type="hub" className="hub-class" />);
    expect(screen.getByTestId("one-hub-svg")).toHaveClass("hub-class");
  });

  // ── default / unknown type ────────────────────────────────────────────────

  it("renders nothing for an unknown type", () => {
    const { container } = render(<Logo type={"unknown" as "full"} />);
    // No img, no svg should be rendered
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders nothing when type is undefined", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
