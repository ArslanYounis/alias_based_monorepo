import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CustomDrawer } from "@platform/CustomDrawer";

// Mock the vaul-backed Drawer primitives to avoid portal/animation issues in jsdom
vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="drawer-root">{children}</div> : null,
  DrawerContent: ({
    children,
    className,
    style,
  }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div data-testid="drawer-content" className={className} style={style}>
      {children}
    </div>
  ),
}));

// Mock SVG assets
vi.mock("@/assets/svg/crossIcon", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="cross-icon" className={className} />
  ),
}));

vi.mock("@/assets/svg/backDrawer", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="back-drawer-icon" className={className} />
  ),
}));

describe("CustomDrawer", () => {
  // ── open=false → renders nothing ─────────────────────────────────────────

  it("does not render drawer content when open is false", () => {
    render(
      <CustomDrawer open={false} onOpenChange={vi.fn()}>
        <p>Content</p>
      </CustomDrawer>
    );
    expect(screen.queryByTestId("drawer-root")).not.toBeInTheDocument();
  });

  // ── open=true → renders content ───────────────────────────────────────────

  it("renders drawer content when open is true", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()}>
        <p>Drawer Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("drawer-content")).toBeInTheDocument();
    expect(screen.getByText("Drawer Body")).toBeInTheDocument();
  });

  // ── Close button ──────────────────────────────────────────────────────────

  it("renders close button when showCloseButton is true (default)", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()}>
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByRole("button", { name: /close drawer/i })).toBeInTheDocument();
  });

  it("does not render close button when showCloseButton is false", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} showCloseButton={false}>
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.queryByRole("button", { name: /close drawer/i })).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) when close button is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <CustomDrawer open={true} onOpenChange={onOpenChange}>
        <p>Body</p>
      </CustomDrawer>
    );
    fireEvent.click(screen.getByRole("button", { name: /close drawer/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── CrossIcon vs BackDrawer ───────────────────────────────────────────────

  it("uses CrossIcon for layer1", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer1">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
  });

  it("uses BackDrawer icon for layer2", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer2">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("back-drawer-icon")).toBeInTheDocument();
  });

  it("uses BackDrawer icon for layer3", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer3">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("back-drawer-icon")).toBeInTheDocument();
  });

  // ── Arabic: rotated BackDrawer ────────────────────────────────────────────

  it("applies rotate-180 to BackDrawer icon for Arabic language", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer2" language="ar">
        <p>Body</p>
      </CustomDrawer>
    );
    const icon = screen.getByTestId("back-drawer-icon");
    expect(icon).toHaveClass("rotate-180");
  });

  it("does not apply rotate-180 for English language", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer2" language="en">
        <p>Body</p>
      </CustomDrawer>
    );
    const icon = screen.getByTestId("back-drawer-icon");
    expect(icon).not.toHaveClass("rotate-180");
  });

  // ── Close button position: Arabic ─────────────────────────────────────────

  it("applies mr-auto to close button for Arabic", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} language="ar">
        <p>Body</p>
      </CustomDrawer>
    );
    const btn = screen.getByRole("button", { name: /close drawer/i });
    expect(btn).toHaveClass("mr-auto");
  });

  it("applies ml-auto to close button for English", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} language="en">
        <p>Body</p>
      </CustomDrawer>
    );
    const btn = screen.getByRole("button", { name: /close drawer/i });
    expect(btn).toHaveClass("ml-auto");
  });

  // ── Header ────────────────────────────────────────────────────────────────

  it("renders header when provided", () => {
    render(
      <CustomDrawer
        open={true}
        onOpenChange={vi.fn()}
        header={<h2>Drawer Header</h2>}
      >
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByText("Drawer Header")).toBeInTheDocument();
  });

  it("does not render header section when header is not provided", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()}>
        <p>Body</p>
      </CustomDrawer>
    );
    // Header wrapper has px-xxxl class only if header provided
    expect(document.querySelector(".px-xxxl.pb-lg")).not.toBeInTheDocument();
  });

  // ── DrawerContent width via style ─────────────────────────────────────────

  it("applies layer1 width of 720px", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer1">
        <p>Body</p>
      </CustomDrawer>
    );
    const content = screen.getByTestId("drawer-content");
    expect(content).toHaveStyle({ width: "720px" });
  });

  it("applies layer2 width of 672px", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer2">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("drawer-content")).toHaveStyle({ width: "672px" });
  });

  // ── backgroundClassName override ──────────────────────────────────────────

  it("uses backgroundClassName over default background when provided", () => {
    render(
      <CustomDrawer
        open={true}
        onOpenChange={vi.fn()}
        backgroundClassName="bg-custom-bg"
      >
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("drawer-content")).toHaveClass("bg-custom-bg");
  });

  // ── className override ────────────────────────────────────────────────────

  it("applies className to DrawerContent", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} className="extra-class">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("drawer-content")).toHaveClass("extra-class");
  });

  // ── Close button icon: BackDrawer for non-layer1 ─────────────────────────

  it("does NOT show CrossIcon for layer2", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer2">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.queryByTestId("cross-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("back-drawer-icon")).toBeInTheDocument();
  });

  it("does NOT show CrossIcon for layer3", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer3">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.queryByTestId("cross-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("back-drawer-icon")).toBeInTheDocument();
  });

  it("does NOT show BackDrawer icon for layer1", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer1">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.queryByTestId("back-drawer-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
  });

  // ── Arabic close button offset ───────────────────────────────────────────

  it("applies default Arabic close button offset (ml-12!) when no custom offset", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} language="ar">
        <p>Body</p>
      </CustomDrawer>
    );
    const btn = screen.getByRole("button", { name: /close drawer/i });
    expect(btn).toHaveClass("ml-12!");
  });

  it("applies default English close button offset (me-8) when no custom offset", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} language="en">
        <p>Body</p>
      </CustomDrawer>
    );
    const btn = screen.getByRole("button", { name: /close drawer/i });
    expect(btn).toHaveClass("me-8");
  });

  it("applies custom closeButtonOffsetClass when provided", () => {
    render(
      <CustomDrawer
        open={true}
        onOpenChange={vi.fn()}
        language="ar"
        closeButtonOffsetClass="mx-4"
      >
        <p>Body</p>
      </CustomDrawer>
    );
    const btn = screen.getByRole("button", { name: /close drawer/i });
    expect(btn).toHaveClass("mx-4");
    expect(btn).not.toHaveClass("ml-12!");
  });

  // ── Header rendering variants ────────────────────────────────────────────

  it("renders complex header content", () => {
    render(
      <CustomDrawer
        open={true}
        onOpenChange={vi.fn()}
        header={
          <div>
            <h2>Title</h2>
            <p>Subtitle</p>
          </div>
        }
      >
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  // ── layer3 width ─────────────────────────────────────────────────────────

  it("applies layer3 width of 642px", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()} size="layer3">
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("drawer-content")).toHaveStyle({ width: "642px" });
  });

  // ── Default border-none when no className ────────────────────────────────

  it("applies border-none by default when className is not provided", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()}>
        <p>Body</p>
      </CustomDrawer>
    );
    expect(screen.getByTestId("drawer-content")).toHaveClass("border-none");
  });

  // ── Direction defaults based on language ──────────────────────────────────

  it("renders children content correctly", () => {
    render(
      <CustomDrawer open={true} onOpenChange={vi.fn()}>
        <p>Child 1</p>
        <p>Child 2</p>
      </CustomDrawer>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });
});
