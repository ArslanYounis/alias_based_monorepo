import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signature from "@platform/Signature";

// Mock TitleBar
vi.mock("@/ui/TitleBar", () => ({
  default: ({ title }: { title?: string }) => (
    <div data-testid="titlebar">{title}</div>
  ),
}));

// Mock Buttons
vi.mock("@/ui/Buttons", () => ({
  Buttons: ({ title, disabled, onClick }: {
    title?: string; disabled?: boolean; onClick?: () => void;
  }) => (
    <button data-testid="approve-btn" disabled={disabled} onClick={onClick}>
      {title}
    </button>
  ),
}));

// Mock canvas context
const mockBeginPath = vi.fn();
const mockMoveTo = vi.fn();
const mockLineTo = vi.fn();
const mockStroke = vi.fn();
const mockGetContext = vi.fn(() => ({
  beginPath: mockBeginPath,
  moveTo: mockMoveTo,
  lineTo: mockLineTo,
  stroke: mockStroke,
  lineWidth: 0,
  lineCap: "",
  lineJoin: "",
  strokeStyle: "",
}));
const mockToDataURL = vi.fn(() => "data:image/png;base64,abc123");

// Patch HTMLCanvasElement
beforeEach(() => {
  vi.clearAllMocks();
  HTMLCanvasElement.prototype.getContext = mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toDataURL = mockToDataURL;
});

describe("Signature", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders the TitleBar with default title", () => {
    render(<Signature />);
    expect(screen.getByTestId("titlebar")).toHaveTextContent("Sign to Approve");
  });

  it("renders a canvas element", () => {
    render(<Signature />);
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  it("renders the Approve button disabled by default (no signature)", () => {
    render(<Signature />);
    expect(screen.getByTestId("approve-btn")).toBeDisabled();
  });

  it("renders the button with custom buttonText", () => {
    render(<Signature buttonText="Submit" />);
    expect(screen.getByTestId("approve-btn")).toHaveTextContent("Submit");
  });

  // ── Custom title ───────────────────────────────────────────────────────────

  it("renders custom title", () => {
    render(<Signature title="Custom Title" />);
    expect(screen.getByTestId("titlebar")).toHaveTextContent("Custom Title");
  });

  // ── Drawing interaction ────────────────────────────────────────────────────

  it("enables the button after drawing (mousedown + mousemove + mouseup)", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    expect(screen.getByTestId("approve-btn")).not.toBeDisabled();
  });

  it("stops drawing on mouseLeave", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseLeave(canvas);
    // After mouseLeave, further mouseMove should not call lineTo
    const callsBefore = mockLineTo.mock.calls.length;
    fireEvent.mouseMove(canvas, { clientX: 30, clientY: 30 });
    expect(mockLineTo.mock.calls.length).toBe(callsBefore);
  });

  it("calls onSubmit with signature data when Approve is clicked after drawing", () => {
    const onSubmit = vi.fn();
    render(<Signature onSubmit={onSubmit} />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    fireEvent.mouseDown(canvas, { clientX: 5, clientY: 5 });
    fireEvent.mouseMove(canvas, { clientX: 15, clientY: 15 });
    fireEvent.mouseUp(canvas);

    fireEvent.click(screen.getByTestId("approve-btn"));
    expect(onSubmit).toHaveBeenCalledWith({ signature: "data:image/png;base64,abc123" });
  });

  // ── Touch events ───────────────────────────────────────────────────────────

  it("supports touch drawing", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    fireEvent.touchStart(canvas, { touches: [{ clientX: 5, clientY: 5 }] });
    fireEvent.touchMove(canvas, { touches: [{ clientX: 15, clientY: 15 }] });
    fireEvent.touchEnd(canvas);

    expect(screen.getByTestId("approve-btn")).not.toBeDisabled();
  });

  // ── Direction ─────────────────────────────────────────────────────────────

  it("renders ltr container by default", () => {
    const { container } = render(<Signature />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "ltr");
  });

  it("renders rtl container when language=ar", () => {
    const { container } = render(<Signature language="ar" />);
    const div = container.querySelector("[dir]");
    expect(div).toHaveAttribute("dir", "rtl");
  });

  // ── Canvas context methods ────────────────────────────────────────────────

  it("calls beginPath and moveTo on mouseDown", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    expect(mockBeginPath).toHaveBeenCalled();
    expect(mockMoveTo).toHaveBeenCalled();
  });

  it("calls lineTo and stroke on mouseMove while drawing", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    expect(mockLineTo).toHaveBeenCalled();
    expect(mockStroke).toHaveBeenCalled();
  });

  it("does not draw when mouseMove fires without mouseDown", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    mockLineTo.mockClear();
    fireEvent.mouseMove(canvas, { clientX: 30, clientY: 30 });
    expect(mockLineTo).not.toHaveBeenCalled();
  });

  // ── Touch events coordinate handling ──────────────────────────────────────

  it("handles touchStart + touchMove + touchEnd correctly", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    fireEvent.touchStart(canvas, { touches: [{ clientX: 50, clientY: 50 }] });
    expect(mockBeginPath).toHaveBeenCalled();
    fireEvent.touchMove(canvas, { touches: [{ clientX: 60, clientY: 60 }] });
    expect(mockLineTo).toHaveBeenCalled();
    fireEvent.touchEnd(canvas);
    // After touchEnd, further moves should not draw
    mockLineTo.mockClear();
    fireEvent.touchMove(canvas, { touches: [{ clientX: 70, clientY: 70 }] });
    expect(mockLineTo).not.toHaveBeenCalled();
  });

  // ── Canvas dimensions ─────────────────────────────────────────────────────

  it("sets canvas dimensions to 544x408", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas).toHaveAttribute("width", "544");
    expect(canvas).toHaveAttribute("height", "408");
  });

  // ── Approve without signing ───────────────────────────────────────────────

  it("does not call onSubmit when approve is clicked without drawing", () => {
    const onSubmit = vi.fn();
    render(<Signature onSubmit={onSubmit} />);
    // Button is disabled, click should not fire
    fireEvent.click(screen.getByTestId("approve-btn"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // ── Default onSubmit ──────────────────────────────────────────────────────

  it("does not throw when approve is clicked with no onSubmit prop", () => {
    render(<Signature />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    fireEvent.mouseDown(canvas, { clientX: 5, clientY: 5 });
    fireEvent.mouseMove(canvas, { clientX: 15, clientY: 15 });
    fireEvent.mouseUp(canvas);
    expect(() => fireEvent.click(screen.getByTestId("approve-btn"))).not.toThrow();
  });

  // ── MutationObserver for theme ────────────────────────────────────────────

  it("sets up MutationObserver on document.documentElement", () => {
    const observeSpy = vi.spyOn(MutationObserver.prototype, "observe");
    render(<Signature />);
    expect(observeSpy).toHaveBeenCalledWith(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observeSpy.mockRestore();
  });

  it("disconnects MutationObserver on unmount", () => {
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, "disconnect");
    const { unmount } = render(<Signature />);
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();
  });
});
