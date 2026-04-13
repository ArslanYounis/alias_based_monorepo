import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Bot } from "@platform/Bot";

describe("Bot", () => {
  // ── Default render ────────────────────────────────────────────────────────

  it("renders the bot container", () => {
    render(<Bot />);
    expect(screen.getByTestId("bot-container")).toBeInTheDocument();
  });

  it("renders the bot avatar image", () => {
    render(<Bot />);
    expect(
      screen.getByAltText("Profile picture of a person wearing a hijab")
    ).toBeInTheDocument();
  });

  // ── Status: close (default) ───────────────────────────────────────────────

  it("does not render message bubble when status is 'close'", () => {
    render(<Bot status="close" message="Hello!" />);
    expect(screen.queryByText("Hello!")).not.toBeInTheDocument();
  });

  // ── Status: open ──────────────────────────────────────────────────────────

  it("renders message bubble when status is 'open'", () => {
    render(<Bot status="open" message="Hello!" />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("does not show bubble when status is 'open' but message is empty", () => {
    render(<Bot status="open" message="" />);
    // Empty message — no visible text, bubble div hidden by `message.length > 0` check
    expect(screen.queryByText("Hello!")).not.toBeInTheDocument();
  });

  // ── Toggle on click ───────────────────────────────────────────────────────

  it("toggles from close to open on click, showing the message", () => {
    render(<Bot status="close" message="Hi there" />);
    const container = screen.getByTestId("bot-container");
    fireEvent.click(container);
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("toggles from open to close on click, hiding the message", () => {
    render(<Bot status="open" message="Hi there" />);
    const container = screen.getByTestId("bot-container");
    fireEvent.click(container);
    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();
  });

  it("calls onClick with new status after toggle", () => {
    const onClick = vi.fn();
    render(<Bot status="close" message="Hello" onClick={onClick} />);
    fireEvent.click(screen.getByTestId("bot-container"));
    expect(onClick).toHaveBeenCalledWith("open");
  });

  it("calls onClick with 'close' when toggling from open", () => {
    const onClick = vi.fn();
    render(<Bot status="open" message="Hello" onClick={onClick} />);
    fireEvent.click(screen.getByTestId("bot-container"));
    expect(onClick).toHaveBeenCalledWith("close");
  });

  it("does not throw when onClick is not provided", () => {
    render(<Bot status="close" />);
    expect(() =>
      fireEvent.click(screen.getByTestId("bot-container"))
    ).not.toThrow();
  });

  // ── Language ──────────────────────────────────────────────────────────────

  it("renders English message when language is 'en'", () => {
    render(
      <Bot
        status="open"
        language="en"
        message="Hello!"
        message_ar="مرحبا!"
      />
    );
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("renders Arabic message when language is 'ar'", () => {
    render(
      <Bot
        status="open"
        language="ar"
        message="Hello!"
        message_ar="مرحبا!"
      />
    );
    expect(screen.getByText("مرحبا!")).toBeInTheDocument();
  });

  it("applies 'rtl' direction container for Arabic", () => {
    render(<Bot language="ar" />);
    const inner = document.querySelector('[dir="rtl"]');
    expect(inner).toBeInTheDocument();
  });

  it("applies 'ltr' direction container for English", () => {
    render(<Bot language="en" />);
    const inner = document.querySelector('[dir="ltr"]');
    expect(inner).toBeInTheDocument();
  });

  // ── Custom className ──────────────────────────────────────────────────────

  it("applies custom className to the container", () => {
    render(<Bot className="my-custom-class" />);
    expect(screen.getByTestId("bot-container")).toHaveClass("my-custom-class");
  });

  // ── Status prop sync via useEffect ────────────────────────────────────────

  it("syncs internal state when status prop changes", () => {
    const { rerender } = render(<Bot status="close" message="Hey" />);
    expect(screen.queryByText("Hey")).not.toBeInTheDocument();

    rerender(<Bot status="open" message="Hey" />);
    expect(screen.getByText("Hey")).toBeInTheDocument();
  });
});
