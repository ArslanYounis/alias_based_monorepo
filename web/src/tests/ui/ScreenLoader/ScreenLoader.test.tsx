import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScreenLoader } from "@platform/ScreenLoader";

describe("ScreenLoader", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders nothing when isLoading=false (default)", () => {
    const { container } = render(<ScreenLoader />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when isLoading=false explicitly", () => {
    const { container } = render(<ScreenLoader isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  // ── Visible state ──────────────────────────────────────────────────────────

  it("renders an img element when isLoading=true", () => {
    render(<ScreenLoader isLoading />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders the default gif when no gifSrc is provided", () => {
    render(<ScreenLoader isLoading />);
    const img = screen.getByRole("img");
    // Default gif is `${IMAGE_URL}TrailLoading.gif`; IMAGE_URL comes from
    // VITE_IMAGE_URL env, so assert on the stable filename suffix.
    expect(img.getAttribute("src")).toMatch(/TrailLoading\.gif$/);
  });

  it("renders custom gifSrc when provided", () => {
    render(<ScreenLoader isLoading gifSrc="/custom-loader.gif" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/custom-loader.gif");
  });

  it("renders default alt text", () => {
    render(<ScreenLoader isLoading />);
    expect(screen.getByAltText("Loading...")).toBeInTheDocument();
  });

  it("renders custom alt text when provided", () => {
    render(<ScreenLoader isLoading alt="Please wait" />);
    expect(screen.getByAltText("Please wait")).toBeInTheDocument();
  });

  // ── Layout classes ─────────────────────────────────────────────────────────

  it("renders a full-screen overlay when loading", () => {
    render(<ScreenLoader isLoading />);
    const overlay = document.querySelector(".fixed");
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("inset-0", "z-50", "w-screen", "h-screen");
  });

  it("applies backdrop-blur class to overlay", () => {
    render(<ScreenLoader isLoading />);
    const overlay = document.querySelector(".fixed");
    expect(overlay).toHaveClass("backdrop-blur-xs");
  });

  it("applies size classes to the img", () => {
    render(<ScreenLoader isLoading />);
    const img = screen.getByRole("img");
    expect(img).toHaveClass("w-20", "h-20");
  });
});
