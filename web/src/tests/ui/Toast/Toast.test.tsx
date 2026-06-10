import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Toast } from "@platform/Toast";

// Mock all SVG assets
vi.mock("@/assets/icons/crossIconSvg", () => ({
  default: ({ onClick, className }: { onClick?: () => void; className?: string }) => (
    <button data-testid="close-btn" className={className} onClick={onClick} aria-label="close" />
  ),
}));

vi.mock("@/assets/svg/toast/action", () => ({
  default: ({ className }: { className?: string }) => <svg data-testid="icon-action" className={className} />,
}));

vi.mock("@/assets/svg/toast/information", () => ({
  default: ({ className }: { className?: string }) => <svg data-testid="icon-information" className={className} />,
}));

vi.mock("@/assets/svg/toast/error", () => ({
  default: ({ className }: { className?: string }) => <svg data-testid="icon-error" className={className} />,
}));

vi.mock("@/assets/svg/toast/success", () => ({
  default: ({ className }: { className?: string }) => <svg data-testid="icon-success" className={className} />,
}));

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  // ── Default render ─────────────────────────────────────────────────────────

  it("renders the message text", () => {
    render(<Toast message="Operation successful" status="success" />);
    expect(screen.getByText("Operation successful")).toBeInTheDocument();
  });

  it("renders a close button", () => {
    render(<Toast message="Test" status="success" />);
    expect(screen.getByTestId("close-btn")).toBeInTheDocument();
  });

  // ── Status variants ────────────────────────────────────────────────────────

  it("renders success icon for success status", () => {
    render(<Toast message="OK" status="success" />);
    expect(screen.getByTestId("icon-success")).toBeInTheDocument();
  });

  it("applies success background for success status", () => {
    const { container } = render(<Toast message="OK" status="success" />);
    expect(container.firstChild).toHaveClass("bg-status-success-light");
  });

  it("renders error icon for error status", () => {
    render(<Toast message="Error" status="error" />);
    expect(screen.getByTestId("icon-error")).toBeInTheDocument();
  });

  it("applies error background for error status", () => {
    const { container } = render(<Toast message="Error" status="error" />);
    expect(container.firstChild).toHaveClass("bg-status-failed-light");
  });

  it("renders information icon for information status", () => {
    render(<Toast message="Info" status="information" />);
    expect(screen.getByTestId("icon-information")).toBeInTheDocument();
  });

  it("applies information background for information status", () => {
    const { container } = render(<Toast message="Info" status="information" />);
    expect(container.firstChild).toHaveClass("bg-status-pending-light");
  });

  it("renders action icon for action status", () => {
    render(<Toast message="Action needed" status="action" />);
    expect(screen.getByTestId("icon-action")).toBeInTheDocument();
  });

  it("applies action background for action status", () => {
    const { container } = render(<Toast message="Action" status="action" />);
    expect(container.firstChild).toHaveClass("bg-status-action-light");
  });

  it("applies gray background for unknown status", () => {
    const { container } = render(
      // @ts-expect-error testing unknown status
      <Toast message="Unknown" status="unknown" />
    );
    expect(container.firstChild).toHaveClass("bg-gray-100");
  });

  // ── Auto-hide ─────────────────────────────────────────────────────────────

  it("is visible initially", () => {
    render(<Toast message="Visible" status="success" />);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("hides automatically after 5000ms", () => {
    render(<Toast message="Auto hide" status="success" />);
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByText("Auto hide")).not.toBeInTheDocument();
  });

  it("does not hide before 5000ms", () => {
    render(<Toast message="Still visible" status="success" />);
    act(() => { vi.advanceTimersByTime(4999); });
    expect(screen.getByText("Still visible")).toBeInTheDocument();
  });

  // ── Manual close ──────────────────────────────────────────────────────────

  it("hides when close button is clicked", () => {
    render(<Toast message="Close me" status="success" />);
    act(() => {
      fireEvent.click(screen.getByTestId("close-btn"));
    });
    expect(screen.queryByText("Close me")).not.toBeInTheDocument();
  });

  // ── Re-mount resets visibility ─────────────────────────────────────────────

  it("becomes visible again when message changes after manual close", () => {
    const { rerender } = render(<Toast message="First" status="success" />);
    act(() => {
      fireEvent.click(screen.getByTestId("close-btn"));
    });
    expect(screen.queryByText("First")).not.toBeInTheDocument();

    act(() => {
      rerender(<Toast message="Second" status="success" />);
    });
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
