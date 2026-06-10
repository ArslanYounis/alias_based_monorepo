import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Layout } from "@platform/Layout";

// Mock all heavy sub-components
vi.mock("@platform/Header", () => ({
  Header: ({
    isEditing,
    language,
  }: {
    isEditing?: boolean;
    language?: string;
    menuItems?: unknown[];
    onToggleLanguage?: () => void;
    breadcrumbItems?: unknown[];
  }) => (
    <header data-testid="header" data-editing={isEditing} data-lang={language} />
  ),
}));

vi.mock("@platform/Footer", () => ({
  Footer: ({ language }: { language?: string }) => (
    <footer data-testid="footer" data-lang={language} />
  ),
}));

vi.mock("@platform/MenuColumn", () => ({
  MenuColumn: ({
    language,
    isEditing,
  }: {
    language?: string;
    isEditing?: boolean;
    theme?: string;
  }) => (
    <aside data-testid="menu-column" data-editing={isEditing} data-lang={language} />
  ),
}));

vi.mock("@platform/Container", () => ({
  Container: ({
    children,
    className,
    dir,
    onClick,
    style,
  }: {
    children?: React.ReactNode;
    className?: string;
    dir?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
  }) => (
    <div
      data-testid="container"
      className={className}
      dir={dir}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  ),
}));

vi.mock("@platform/Toast", () => ({
  Toast: ({
    message,
    status,
  }: {
    message?: string;
    status?: string;
  }) => (
    <div data-testid="toast" data-status={status}>
      {message}
    </div>
  ),
}));

describe("Layout (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Children ──────────────────────────────────────────────────────────────

  it("renders children content", () => {
    render(
      <Layout>
        <div data-testid="page-content">Hello World</div>
      </Layout>
    );
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  // ── Header visibility ─────────────────────────────────────────────────────

  it("renders Header by default (showHeader=true)", () => {
    render(<Layout><span /></Layout>);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("does not render Header when showHeader=false", () => {
    render(<Layout showHeader={false}><span /></Layout>);
    expect(screen.queryByTestId("header")).not.toBeInTheDocument();
  });

  // ── Sidebar visibility ────────────────────────────────────────────────────

  it("renders MenuColumn by default (showSidebar=true)", () => {
    render(<Layout><span /></Layout>);
    expect(screen.getByTestId("menu-column")).toBeInTheDocument();
  });

  it("does not render MenuColumn when showSidebar=false", () => {
    render(<Layout showSidebar={false}><span /></Layout>);
    expect(screen.queryByTestId("menu-column")).not.toBeInTheDocument();
  });

  // ── Footer visibility ─────────────────────────────────────────────────────

  it("renders Footer by default (showFooter=true)", () => {
    render(<Layout><span /></Layout>);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("does not render Footer when showFooter=false", () => {
    render(<Layout showFooter={false}><span /></Layout>);
    expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
  });

  // ── Toast ─────────────────────────────────────────────────────────────────

  it("renders Toast when toast.message has content", () => {
    render(
      <Layout toast={{ message: "Saved!", status: "success" }}>
        <span />
      </Layout>
    );
    expect(screen.getByTestId("toast")).toBeInTheDocument();
    expect(screen.getByTestId("toast")).toHaveTextContent("Saved!");
  });

  it("does not render Toast when toast.message is empty", () => {
    render(
      <Layout toast={{ message: "", status: "success" }}>
        <span />
      </Layout>
    );
    expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
  });

  it("passes toast status to Toast component", () => {
    render(
      <Layout toast={{ message: "Error!", status: "error" }}>
        <span />
      </Layout>
    );
    expect(screen.getByTestId("toast")).toHaveAttribute("data-status", "error");
  });

  // ── isEditing mode ────────────────────────────────────────────────────────

  it("passes isEditing=true to Header", () => {
    render(<Layout isEditing><span /></Layout>);
    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-editing",
      "true"
    );
  });

  it("passes isEditing=true to MenuColumn", () => {
    render(<Layout isEditing><span /></Layout>);
    expect(screen.getByTestId("menu-column")).toHaveAttribute(
      "data-editing",
      "true"
    );
  });

  it("applies blur and pointer-events-none classes to footer wrapper when isEditing=true", () => {
    render(<Layout isEditing><span /></Layout>);
    const footer = screen.getByTestId("footer");
    // The parent div of Footer should have blur-xs
    const footerWrapper = footer.closest("div[class*='absolute']");
    expect(footerWrapper).toHaveClass("blur-xs");
    expect(footerWrapper).toHaveClass("pointer-events-none");
  });

  it("does not apply blur to footer wrapper when isEditing=false", () => {
    render(<Layout isEditing={false}><span /></Layout>);
    const footer = screen.getByTestId("footer");
    const footerWrapper = footer.closest("div[class*='absolute']");
    expect(footerWrapper).not.toHaveClass("blur-xs");
  });

  // ── Language propagation ──────────────────────────────────────────────────

  it("passes language to Header, MenuColumn, and Footer", () => {
    render(<Layout language="ar"><span /></Layout>);
    expect(screen.getByTestId("header")).toHaveAttribute("data-lang", "ar");
    expect(screen.getByTestId("menu-column")).toHaveAttribute("data-lang", "ar");
    expect(screen.getByTestId("footer")).toHaveAttribute("data-lang", "ar");
  });

  // ── Full combination ──────────────────────────────────────────────────────

  it("renders all sections when all show flags are true", () => {
    render(
      <Layout showHeader showSidebar showFooter>
        <p>Content</p>
      </Layout>
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("menu-column")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
