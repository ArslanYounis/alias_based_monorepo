/**
 * Tests for the Toast UI component.
 *
 * Exercises: message rendering, all status variants, X button dismiss,
 * auto-hide timer (fake timers), and re-show on message/status change.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";

// ── Mock SVG toast icons ──────────────────────────────────────────────────
jest.mock("~/assets/svg/icons/toast/Success", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "toast-success-icon" }),
  };
});

jest.mock("~/assets/svg/icons/toast/Error", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "toast-error-icon" }),
  };
});

jest.mock("~/assets/svg/icons/toast/Information", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () =>
      React.createElement(View, { testID: "toast-information-icon" }),
  };
});

jest.mock("~/assets/svg/icons/toast/Action", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "toast-action-icon" }),
  };
});

import { Toast } from "@platform/Toast";

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Toast message="Operation successful" />);
  });

  it("renders the message text", () => {
    render(<Toast message="Operation successful" />);
    expect(screen.getByText("Operation successful")).toBeTruthy();
  });

  it("is visible immediately on mount", () => {
    render(<Toast message="Hello" status="success" />);
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  // ── Status variants ───────────────────────────────────────────────────────

  it("renders success icon for status='success'", () => {
    render(<Toast message="Done" status="success" />);
    expect(screen.getByTestId("toast-success-icon")).toBeTruthy();
  });

  it("renders error icon for status='error'", () => {
    render(<Toast message="Failed" status="error" />);
    expect(screen.getByTestId("toast-error-icon")).toBeTruthy();
  });

  it("renders information icon for status='information'", () => {
    render(<Toast message="Note" status="information" />);
    expect(screen.getByTestId("toast-information-icon")).toBeTruthy();
  });

  it("renders action icon for status='action'", () => {
    render(<Toast message="Action needed" status="action" />);
    expect(screen.getByTestId("toast-action-icon")).toBeTruthy();
  });

  it("defaults to success when no status provided", () => {
    render(<Toast message="Hello" />);
    expect(screen.getByTestId("toast-success-icon")).toBeTruthy();
  });

  // ── X button dismiss ──────────────────────────────────────────────────────

  it("hides the toast when X button is pressed", () => {
    render(<Toast message="Goodbye" status="success" />);
    expect(screen.getByText("Goodbye")).toBeTruthy();

    fireEvent.press(screen.getByText("×"));

    expect(screen.queryByText("Goodbye")).toBeNull();
  });

  it("X button removes the icon too", () => {
    render(<Toast message="Goodbye" status="success" />);
    fireEvent.press(screen.getByText("×"));
    expect(screen.queryByTestId("toast-success-icon")).toBeNull();
  });

  // ── Auto-hide after 5000ms ────────────────────────────────────────────────

  it("auto-hides after 5000ms", () => {
    render(<Toast message="Auto hide" status="success" />);
    expect(screen.getByText("Auto hide")).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Auto hide")).toBeNull();
  });

  it("is still visible before 5000ms has elapsed", () => {
    render(<Toast message="Still here" status="success" />);

    act(() => {
      jest.advanceTimersByTime(4999);
    });

    expect(screen.getByText("Still here")).toBeTruthy();
  });

  // ── Re-show when props change ─────────────────────────────────────────────

  it("re-shows the toast when message changes after being dismissed", () => {
    const { rerender } = render(<Toast message="First" status="success" />);

    // Dismiss via X
    fireEvent.press(screen.getByText("×"));
    expect(screen.queryByText("First")).toBeNull();

    // Change message — should re-show
    rerender(<Toast message="Second" status="success" />);
    expect(screen.getByText("Second")).toBeTruthy();
  });

  it("re-shows the toast when status changes", () => {
    const { rerender } = render(<Toast message="Hello" status="success" />);

    // Dismiss via X
    fireEvent.press(screen.getByText("×"));
    expect(screen.queryByText("Hello")).toBeNull();

    // Change status — should re-show
    rerender(<Toast message="Hello" status="error" />);
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("resets the auto-hide timer when message changes", () => {
    const { rerender } = render(<Toast message="First" status="success" />);

    // Advance partway into the timer
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText("First")).toBeTruthy();

    // Change message — timer resets
    rerender(<Toast message="Second" status="success" />);

    // Another 3000ms — should still be visible because timer reset
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText("Second")).toBeTruthy();

    // Full 5000ms from reset — now hidden
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText("Second")).toBeNull();
  });
});
