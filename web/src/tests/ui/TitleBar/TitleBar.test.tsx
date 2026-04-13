import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TitleBar from "@platform/TitleBar";

vi.mock("@/ui/Buttons", () => ({
  Buttons: ({ title, onClick, disabled, type, leftIcon, rightIcon }: {
    title?: string; onClick?: () => void; disabled?: boolean; type?: string;
    leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
  }) => (
    <button
      data-testid="titlebar-btn"
      data-btn-type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon}
      {title}
      {rightIcon}
    </button>
  ),
}));

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({ value, value_ar, language }: { value?: string; value_ar?: string; language: string }) =>
    language === "ar" ? (value_ar || value || "") : (value || ""),
}));

describe("TitleBar", () => {
  beforeEach(() => {
    // Reset window.innerWidth before each test
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1024 });
  });

  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    const { container } = render(<TitleBar title="Dashboard" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // ── Title ──────────────────────────────────────────────────────────────────

  it("renders title text when showTitle=true (default)", () => {
    render(<TitleBar title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("does not render title when showTitle=false", () => {
    render(<TitleBar title="Dashboard" showTitle={false} />);
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("does not render title when title is empty", () => {
    render(<TitleBar title="" />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders title in h1 element", () => {
    render(<TitleBar title="My Title" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  // ── Acronym ────────────────────────────────────────────────────────────────

  it("renders acronym box when showAcronym=true (default)", () => {
    render(<TitleBar title="Dashboard" />);
    expect(screen.getByText("DAS")).toBeInTheDocument();
  });

  it("uses first 3 chars of title as acronym (uppercased)", () => {
    render(<TitleBar title="hello world" />);
    expect(screen.getByText("HEL")).toBeInTheDocument();
  });

  it("uses explicit acronym prop when provided", () => {
    render(<TitleBar title="Dashboard" acronym="DBD" />);
    expect(screen.getByText("DBD")).toBeInTheDocument();
  });

  it("slices acronym to 3 chars when longer", () => {
    render(<TitleBar title="Dashboard" acronym="ABCDEF" />);
    expect(screen.getByText("ABC")).toBeInTheDocument();
  });

  it("does not render acronym when showAcronym=false", () => {
    render(<TitleBar title="Dashboard" showAcronym={false} />);
    expect(screen.queryByText("DAS")).not.toBeInTheDocument();
  });

  // ── Button ─────────────────────────────────────────────────────────────────

  it("does not render button by default (showButton=false)", () => {
    render(<TitleBar title="Dashboard" />);
    expect(screen.queryByTestId("titlebar-btn")).not.toBeInTheDocument();
  });

  it("renders button when showButton=true", () => {
    render(<TitleBar title="Dashboard" showButton buttonLabel="Add New" />);
    expect(screen.getByTestId("titlebar-btn")).toBeInTheDocument();
    expect(screen.getByText("Add New")).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    const onClick = vi.fn();
    render(<TitleBar title="Dashboard" showButton buttonLabel="Click Me" onClick={onClick} />);
    fireEvent.click(screen.getByTestId("titlebar-btn"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders button with specified type", () => {
    render(<TitleBar title="Dashboard" showButton buttonLabel="Go" buttonType="secondary" />);
    expect(screen.getByTestId("titlebar-btn")).toHaveAttribute("data-btn-type", "secondary");
  });

  // ── Direction ──────────────────────────────────────────────────────────────

  it("renders ltr direction by default", () => {
    const { container } = render(<TitleBar title="Dashboard" />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "ltr");
  });

  it("renders rtl when language=ar", () => {
    const { container } = render(<TitleBar title="Dashboard" language="ar" />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "rtl");
  });

  // ── Responsive size ────────────────────────────────────────────────────────

  it("updates button size on window resize", () => {
    render(<TitleBar title="Dashboard" showButton buttonLabel="Test" />);
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 500 });
    fireEvent(window, new Event("resize"));
    // Should not crash after resize
    expect(screen.getByTestId("titlebar-btn")).toBeInTheDocument();
  });

  // ── Left / Right Icons ─────────────────────────────────────────────────────

  it("renders leftIcon when showButton and leftIcon provided", () => {
    render(
      <TitleBar
        title="Dashboard"
        showButton
        buttonLabel="Action"
        leftIcon={<span data-testid="left-icon" />}
      />
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon when showButton and rightIcon provided", () => {
    render(
      <TitleBar
        title="Dashboard"
        showButton
        buttonLabel="Action"
        rightIcon={<span data-testid="right-icon" />}
      />
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });
});
