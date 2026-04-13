import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "@platform/Header";

// Mock all sub-components so Header can render in isolation
vi.mock("@platform/Avatar", () => ({
  Avatar: ({
    imageUrl,
    status,
  }: {
    imageUrl?: string;
    status?: string;
    badgeSize?: number;
  }) => <img data-testid="avatar" src={imageUrl} alt={status} />,
}));

vi.mock("@platform/Buttons", () => ({
  Buttons: ({
    title,
    title_ar,
    language,
    onClick,
    type,
  }: {
    title?: string;
    title_ar?: string;
    language?: string;
    onClick?: () => void;
    type?: string;
    size?: string;
  }) => (
    <button data-testid={`btn-${type}`} onClick={onClick}>
      {language === "ar" ? title_ar ?? title : title}
    </button>
  ),
}));

vi.mock("@platform/IconButton", () => ({
  IconButton: ({ icon }: { icon?: React.ReactNode }) => (
    <button data-testid="icon-btn">{icon}</button>
  ),
}));

vi.mock("@platform/Breadcrumb", () => ({
  Breadcrumb: ({
    items,
  }: {
    language?: string;
    items?: Array<{ label: string; label_ar?: string; onClick?: () => void }>;
  }) => (
    <nav data-testid="breadcrumb">
      {items?.map((item, idx) => (
        <span key={idx} onClick={item.onClick}>{item.label}</span>
      ))}
    </nav>
  ),
}));

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({
    value,
    value_ar,
    language,
  }: {
    value?: string;
    value_ar?: string;
    language?: string;
  }) => <span>{language === "ar" ? value_ar ?? value : value}</span>,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({
    children,
    align,
    className,
  }: {
    children: React.ReactNode;
    align?: string;
    className?: string;
  }) => (
    <div data-testid="dropdown-content" data-align={align}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    className,
    dir,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    dir?: string;
  }) => (
    <div
      data-testid="dropdown-item"
      onClick={onClick}
      className={className}
      dir={dir}
    >
      {children}
    </div>
  ),
}));

vi.mock("@/assets/svg/statusUp", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="status-up" className={className} />
  ),
}));

vi.mock("@/assets/IconoirSettings", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="settings-icon" className={className} />
  ),
}));

vi.mock("@/assets/icons/SelectDownArrow", () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="down-arrow" className={className} />
  ),
}));

describe("Header (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Default rendering ─────────────────────────────────────────────────────
  it("renders a nav element", () => {
    render(<Header />);
    // Breadcrumb mock also renders a <nav>, so multiple navigation roles exist
    expect(screen.getAllByRole("navigation").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the avatar", () => {
    render(<Header avatarUrl="https://example.com/avatar.png" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute(
      "src",
      "https://example.com/avatar.png"
    );
  });

  it("renders user name in English by default", () => {
    render(<Header userName="Farzana" />);
    expect(screen.getByText("Farzana")).toBeInTheDocument();
  });

  it("renders Arabic user name when language=ar", () => {
    render(<Header language="ar" userName="Farzana" userName_ar="فرزانه" />);
    expect(screen.getByText("فرزانه")).toBeInTheDocument();
  });

  // ── Language button ───────────────────────────────────────────────────────
  it("renders the language toggle button with English text by default", () => {
    render(<Header languageText="Language:" />);
    expect(screen.getByTestId("btn-primary")).toHaveTextContent("Language:");
  });

  it("calls onToggleLanguage when language button is clicked", () => {
    const onToggleLanguage = vi.fn();
    render(<Header onToggleLanguage={onToggleLanguage} />);
    fireEvent.click(screen.getByTestId("btn-primary"));
    expect(onToggleLanguage).toHaveBeenCalledTimes(1);
  });

  // ── Checkin button ────────────────────────────────────────────────────────
  it("renders the checkin button in English", () => {
    render(<Header checkinButtonText="Checkin" />);
    expect(screen.getByTestId("btn-secondary")).toHaveTextContent("Checkin");
  });

  it("renders Arabic checkin text when language=ar", () => {
    render(
      <Header
        language="ar"
        checkinButtonText="Checkin"
        checkinButtonText_ar="تسجيل الحضور"
      />
    );
    expect(screen.getByTestId("btn-secondary")).toHaveTextContent("تسجيل الحضور");
  });

  // ── Editing mode ──────────────────────────────────────────────────────────
  it("applies blur class when isEditing=true", () => {
    render(<Header isEditing />);
    // The Header's own <nav> is the one with blur — find it by class
    const navs = screen.getAllByRole("navigation");
    const headerNav = navs.find((n) => n.tagName === "NAV" && n.className.includes("h-[92px]"));
    expect(headerNav).toHaveClass("blur-xs");
  });

  it("applies pointer-events-none when isEditing=true", () => {
    render(<Header isEditing />);
    const navs = screen.getAllByRole("navigation");
    const headerNav = navs.find((n) => n.tagName === "NAV" && n.className.includes("h-[92px]"));
    expect(headerNav).toHaveClass("pointer-events-none");
  });

  it("does not apply blur class when isEditing=false", () => {
    render(<Header isEditing={false} />);
    const navs = screen.getAllByRole("navigation");
    const headerNav = navs.find((n) => n.tagName === "NAV" && n.className.includes("h-[92px]"));
    expect(headerNav).not.toHaveClass("blur-xs");
  });

  // ── Menu items ────────────────────────────────────────────────────────────
  it("renders menu items in dropdown", () => {
    const menuItems = [
      { label: "Profile", onClick: vi.fn() },
      { label: "Logout", onClick: vi.fn() },
    ];
    render(<Header menuItems={menuItems} />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("renders Arabic menu item label when language=ar", () => {
    const menuItems = [
      { label: "Profile", label_ar: "الملف الشخصي", onClick: vi.fn() },
    ];
    render(<Header language="ar" menuItems={menuItems} />);
    expect(screen.getByText("الملف الشخصي")).toBeInTheDocument();
  });

  it("calls menu item onClick when item is clicked", () => {
    const onProfileClick = vi.fn();
    const menuItems = [{ label: "Profile", onClick: onProfileClick }];
    render(<Header menuItems={menuItems} />);
    fireEvent.click(screen.getByTestId("dropdown-item"));
    expect(onProfileClick).toHaveBeenCalledTimes(1);
  });

  it("renders menu item with custom className", () => {
    const menuItems = [
      { label: "Delete", onClick: vi.fn(), className: "text-red-500" },
    ];
    render(<Header menuItems={menuItems} />);
    expect(screen.getByTestId("dropdown-item")).toHaveClass("text-red-500");
  });

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  it("renders breadcrumb with provided items", () => {
    const breadcrumbItems = [
      { label: "Home", onClick: vi.fn() },
      { label: "Applications", onClick: vi.fn() },
    ];
    render(<Header breadcrumbItems={breadcrumbItems} />);
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
  });

  // ── RTL direction ─────────────────────────────────────────────────────────
  it("sets dir=rtl on root div when language=ar", () => {
    const { container } = render(<Header language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("sets dir=ltr on root div when language=en", () => {
    const { container } = render(<Header language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── Default breadcrumb onClick callbacks (lines 32-36) ────────────────────
  // Render with no breadcrumbItems so the default array (with onClick callbacks)
  // is instantiated, then simulate clicking each breadcrumb item to invoke those
  // inline onClick: () => null functions and bring lines 32-36 into coverage.
  it("invokes default breadcrumb item onClick without error", () => {
    // Render with breadcrumb mock that calls onClick when items are clicked
    const { unmount } = render(<Header />);
    // The Breadcrumb mock renders <span> elements — find them and verify
    // the default items ("Home", "Level 1") are present via the mock
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    unmount();
  });

  it("calls default breadcrumb Home onClick without throwing", () => {
    // Override Breadcrumb mock to expose an onClick trigger
    render(<Header />);
    // The default breadcrumbItems have onClick: () => null — clicking the
    // Home span exercises that callback via the Breadcrumb mock
    const homeSpan = screen.getByText("Home");
    expect(() => fireEvent.click(homeSpan)).not.toThrow();
  });

  it("calls default breadcrumb Level 1 onClick without throwing", () => {
    render(<Header />);
    const level1Span = screen.getByText("Level 1");
    expect(() => fireEvent.click(level1Span)).not.toThrow();
  });
});
