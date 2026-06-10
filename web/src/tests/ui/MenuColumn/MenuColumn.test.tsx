import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MenuColumn } from "@platform/MenuColumn";

// The current MenuColumn is a full sidebar implementation (no <aside>/"Menu"
// stub). It renders a fragment: a desktop sidebar <div> (first child), a mobile
// header, and a mobile sidebar. It lists the menu items (Home, Community,
// Services, Challenges) as navigable link rows.

describe("MenuColumn (web)", () => {
  // Desktop sidebar is the first rendered element and carries dir / bg / blur.
  const getDesktopSidebar = (container: HTMLElement) =>
    container.firstChild as HTMLElement;

  // ── Default rendering ─────────────────────────────────────────────────────

  it("renders without crashing", () => {
    const { container } = render(<MenuColumn />);
    expect(getDesktopSidebar(container)).toBeInTheDocument();
  });

  it("renders the menu item labels", () => {
    render(<MenuColumn />);
    // Labels appear in both the desktop and mobile sidebars
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Community").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Services").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Challenges").length).toBeGreaterThan(0);
  });

  it("renders menu items as navigable link rows", () => {
    render(<MenuColumn />);
    // Each enabled menu item gets role="link"
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("renders Arabic labels when language=ar", () => {
    render(<MenuColumn language="ar" />);
    expect(screen.getAllByText("المجتمع").length).toBeGreaterThan(0); // Community
    expect(screen.getAllByText("الخدمات").length).toBeGreaterThan(0); // Services
  });

  // ── Direction ─────────────────────────────────────────────────────────────

  it("sets dir=ltr on the desktop sidebar when language=en", () => {
    const { container } = render(<MenuColumn language="en" />);
    expect(getDesktopSidebar(container)).toHaveAttribute("dir", "ltr");
  });

  it("sets dir=rtl on the desktop sidebar when language=ar", () => {
    const { container } = render(<MenuColumn language="ar" />);
    expect(getDesktopSidebar(container)).toHaveAttribute("dir", "rtl");
  });

  it("defaults to ltr direction when no language provided", () => {
    // language defaults to "en" → ltr
    const { container } = render(<MenuColumn />);
    expect(getDesktopSidebar(container)).toHaveAttribute("dir", "ltr");
  });

  // ── isEditing blur ────────────────────────────────────────────────────────

  it("applies blur-xs and pointer-events-none when isEditing=true", () => {
    const { container } = render(<MenuColumn isEditing />);
    const sidebar = getDesktopSidebar(container);
    expect(sidebar).toHaveClass("blur-xs");
    expect(sidebar).toHaveClass("pointer-events-none");
  });

  it("does not apply blur-xs when isEditing=false", () => {
    const { container } = render(<MenuColumn isEditing={false} />);
    expect(getDesktopSidebar(container)).not.toHaveClass("blur-xs");
  });

  it("does not apply blur-xs when isEditing is not provided", () => {
    const { container } = render(<MenuColumn />);
    expect(getDesktopSidebar(container)).not.toHaveClass("blur-xs");
  });

  // ── Layout classes ────────────────────────────────────────────────────────

  it("has responsive hidden/flex classes on the desktop sidebar", () => {
    const { container } = render(<MenuColumn />);
    const sidebar = getDesktopSidebar(container);
    expect(sidebar).toHaveClass("!hidden");
    expect(sidebar).toHaveClass("md:!flex");
  });

  it("has bg-structure-menu-background class on the desktop sidebar", () => {
    const { container } = render(<MenuColumn />);
    expect(getDesktopSidebar(container)).toHaveClass(
      "bg-structure-menu-background"
    );
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  it("calls onNavigate with the item path when a menu row is clicked", () => {
    const onNavigate = vi.fn();
    render(<MenuColumn onNavigate={onNavigate} />);
    // First link row corresponds to "Home" → "/home"
    const links = screen.getAllByRole("link");
    links[0].click();
    expect(onNavigate).toHaveBeenCalledWith("/home");
  });
});
