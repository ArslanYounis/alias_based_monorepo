import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Footer } from "@platform/Footer";

// Mock sub-components
vi.mock("@platform/Bot", () => ({
  Bot: ({
    message,
    onClick,
    status,
  }: {
    language?: string;
    message?: string;
    message_ar?: string;
    status?: string;
    className?: string;
    onClick?: (s: "open" | "close") => void;
  }) => (
    <div
      data-testid="bot"
      data-status={status}
      onClick={() => onClick?.(status === "open" ? "close" : "open")}
    >
      {message}
    </div>
  ),
}));

vi.mock("@platform/Logo", () => ({
  Logo: ({
    type,
    className,
    width,
    height,
  }: {
    type?: string;
    className?: string;
    width?: number | string;
    height?: number | string;
  }) => (
    <img
      data-testid="logo"
      alt={`logo-${type}`}
      className={className}
      style={{ width, height }}
    />
  ),
}));

vi.mock("@/assets/svg/PullyUp", () => ({
  default: () => <svg data-testid="pully-up" />,
}));

vi.mock("@/assets/svg/PullyDown", () => ({
  default: () => <svg data-testid="pully-down" />,
}));

describe("Footer (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Default rendering ─────────────────────────────────────────────────────
  it("renders without crashing", () => {
    render(<Footer />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders Logo by default (showLogo=true)", () => {
    render(<Footer />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("does not render Logo when showLogo=false", () => {
    render(<Footer showLogo={false} />);
    // Logo mocked; if showLogo=false, neither desktop nor mobile logo renders
    const logos = screen.queryAllByTestId("logo");
    expect(logos.length).toBe(0);
  });

  it("renders Bot by default (showBot=true)", () => {
    render(<Footer />);
    // Bot may appear in desktop or mobile section; at least one should be present
    expect(screen.getAllByTestId("bot").length).toBeGreaterThanOrEqual(1);
  });

  it("does not render Bot when showBot=false", () => {
    render(<Footer showBot={false} />);
    expect(screen.queryByTestId("bot")).not.toBeInTheDocument();
  });

  it("passes botMessage to Bot component", () => {
    render(<Footer botMessage="How can I help?" />);
    expect(screen.getAllByText("How can I help?").length).toBeGreaterThanOrEqual(1);
  });

  it("passes logoType to Logo component", () => {
    render(<Footer logoType="icon" />);
    expect(screen.getByTestId("logo")).toHaveAttribute("alt", "logo-icon");
  });

  // ── Mobile pully button ───────────────────────────────────────────────────
  it("renders PullyDown icon initially (mobile section closed)", () => {
    render(<Footer />);
    expect(screen.getByTestId("pully-down")).toBeInTheDocument();
  });

  it("shows PullyUp icon after clicking the pully button (toggles open)", () => {
    render(<Footer />);
    const pullyButton = screen.getByTestId("pully-down").closest("div")!;
    fireEvent.click(pullyButton);
    expect(screen.getByTestId("pully-up")).toBeInTheDocument();
  });

  it("hides PullyUp and returns to PullyDown on second click", () => {
    render(<Footer />);
    const pullyButton = screen.getByTestId("pully-down").closest("div")!;
    fireEvent.click(pullyButton);
    const pullyUpButton = screen.getByTestId("pully-up").closest("div")!;
    fireEvent.click(pullyUpButton);
    expect(screen.getByTestId("pully-down")).toBeInTheDocument();
  });

  // ── Bot status toggling ───────────────────────────────────────────────────
  it("Bot initial status is 'close'", () => {
    render(<Footer />);
    const bots = screen.getAllByTestId("bot");
    bots.forEach((bot) => expect(bot).toHaveAttribute("data-status", "close"));
  });

  it("Bot status changes to 'open' when Bot is clicked", () => {
    render(<Footer />);
    const bot = screen.getAllByTestId("bot")[0];
    fireEvent.click(bot);
    // After click, status should change to "open"
    expect(screen.getAllByTestId("bot")[0]).toHaveAttribute("data-status", "open");
  });

  // ── Language prop ─────────────────────────────────────────────────────────
  it("renders with language=ar without crashing", () => {
    render(<Footer language="ar" />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  // ── className props ───────────────────────────────────────────────────────
  it("passes logoClassName to Logo", () => {
    render(<Footer logoClassName="custom-logo-class" />);
    expect(screen.getByTestId("logo")).toHaveClass("custom-logo-class");
  });
});
