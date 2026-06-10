import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "@platform/Avatar";

describe("Avatar", () => {
  // ── Image variant ─────────────────────────────────────────────────────────

  it("renders an img with the provided imageUrl", () => {
    render(<Avatar imageUrl="https://example.com/photo.jpg" />);
    const img = screen.getByAltText("avatar") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("photo.jpg");
  });

  it("does not render initials when imageUrl is provided", () => {
    render(<Avatar imageUrl="https://example.com/photo.jpg" initials="AB" />);
    expect(screen.queryByText("AB")).not.toBeInTheDocument();
  });

  it("does not render placeholder img when imageUrl is provided", () => {
    render(<Avatar imageUrl="https://example.com/photo.jpg" />);
    const imgs = screen.getAllByRole("img");
    // Only one img — the avatar one
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toHaveAttribute("alt", "avatar");
  });

  // ── Initials variant ──────────────────────────────────────────────────────

  it("renders initials when no imageUrl but initials are provided", () => {
    render(<Avatar initials="jd" />);
    // Slices first 2 and uppercases
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders only first 2 characters of initials", () => {
    render(<Avatar initials="ABCD" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("does not render placeholder when initials are present", () => {
    render(<Avatar initials="AB" />);
    expect(screen.queryByAltText("Placeholder Image")).not.toBeInTheDocument();
  });

  it("applies border when no image and initials are provided (showBorder)", () => {
    const initialsBorderColor = "#A0A0A4";
    render(<Avatar initials="AB" initialsBorderColor={initialsBorderColor} />);
    // jsdom serialises #A0A0A4 as rgb(160, 160, 164) in computed style
    const { container } = render(<Avatar initials="AB" initialsBorderColor={initialsBorderColor} />);
    const innerDivs = container.querySelectorAll("div");
    // One of the inner divs must carry a non-"none" border style
    const hasBorder = Array.from(innerDivs).some((div) => {
      const s = (div as HTMLElement).style.border;
      return s && s !== "none" && s !== "";
    });
    expect(hasBorder).toBe(true);
  });

  // ── Placeholder variant ───────────────────────────────────────────────────

  it("renders placeholder image when no imageUrl and no initials", () => {
    render(<Avatar />);
    const img = screen.getByAltText("Placeholder Image") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("DefaultImg.png");
  });

  it("renders placeholder when imageUrl is empty string", () => {
    render(<Avatar imageUrl="" />);
    expect(screen.getByAltText("Placeholder Image")).toBeInTheDocument();
  });

  it("renders placeholder when imageUrl is whitespace", () => {
    render(<Avatar imageUrl="   " />);
    expect(screen.getByAltText("Placeholder Image")).toBeInTheDocument();
  });

  // ── Status badge ──────────────────────────────────────────────────────────

  it("renders a status badge when status is provided", () => {
    const { container } = render(<Avatar status="complete" />);
    // ProfileIconStatus wraps in a div; check it's added
    const badge = container.querySelector('[style*="position: absolute"]');
    expect(badge).toBeInTheDocument();
  });

  it("does not render a status badge when status is not provided", () => {
    const { container } = render(<Avatar />);
    const badge = container.querySelector('[style*="position: absolute"]');
    expect(badge).not.toBeInTheDocument();
  });

  // ── Custom sizing ─────────────────────────────────────────────────────────

  it("applies custom avatarSize via inline style", () => {
    render(<Avatar avatarSize={64} />);
    const inner = document.querySelector('[style*="width: 64px"]');
    expect(inner).toBeInTheDocument();
  });

  it("applies custom initialsFontSize via span style", () => {
    render(<Avatar initials="AB" initialsFontSize={16} />);
    const span = document.querySelector('[style*="font-size: 16px"]');
    expect(span).toBeInTheDocument();
  });

  it("applies custom initialsTextColor via span style", () => {
    render(<Avatar initials="AB" initialsTextColor="#ff0000" />);
    const span = document.querySelector('[style*="color: rgb(255, 0, 0)"]');
    expect(span).toBeInTheDocument();
  });

  // ── Container class ───────────────────────────────────────────────────────

  it("outer wrapper has relative and inline-block classes", () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).toHaveClass("relative", "inline-block");
  });
});
