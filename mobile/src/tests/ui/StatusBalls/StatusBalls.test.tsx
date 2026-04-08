/**
 * Tests for the mobile StatusBalls UI component.
 *
 * Branches to cover (getGradientColors switch + status early-returns):
 *  1. status="pending"    → grey gradient
 *  2. status="inProgress" → blue gradient
 *  3. status="complete"   → green gradient
 *  4. status="failed"     → red gradient
 *  5. status="fixed"      → nested LinearGradient (early-return branch)
 *  6. status="mixed"      → split LinearGradient (early-return branch)
 *  7. status=<default>    → unknown value falls through to default grey (e.g. "unknown")
 *  8. width/height as string values (parseInt branch)
 *  9. width/height as number values (no parseInt branch)
 *
 * react-native-linear-gradient is mocked to avoid native module crashes.
 * @platform/Container is mocked to a lightweight View wrapper.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock: react-native-linear-gradient → plain View ──────────────────────────
jest.mock("react-native-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, testID, ...props }: any) =>
      React.createElement(
        View,
        { testID: testID ?? "linear-gradient", ...props },
        children
      ),
  };
});

// ── Mock: @platform/Container → lightweight View wrapper ─────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    Container: ({ children, testID, ...props }: any) =>
      React.createElement(View, { testID: testID ?? "container", ...props }, children),
  };
});

import { StatusBalls } from "@platform/StatusBalls";

describe("StatusBalls", () => {
  // ── Default status (pending) ───────────────────────────────────────────────

  it("renders without crashing with default props", () => {
    render(<StatusBalls />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  // ── getGradientColors branches ────────────────────────────────────────────

  it("renders for status='pending'", () => {
    render(<StatusBalls status="pending" />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  it("renders for status='inProgress'", () => {
    render(<StatusBalls status="inProgress" />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  it("renders for status='complete'", () => {
    render(<StatusBalls status="complete" />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  it("renders for status='failed'", () => {
    render(<StatusBalls status="failed" />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  // ── Early-return branches ─────────────────────────────────────────────────

  it("renders nested gradients for status='fixed'", () => {
    render(<StatusBalls status="fixed" />);
    // fixed renders a Container wrapping two nested LinearGradients
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThanOrEqual(2);
  });

  it("renders split gradients for status='mixed'", () => {
    render(<StatusBalls status="mixed" />);
    // mixed renders a Container with two side-by-side LinearGradients
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThanOrEqual(2);
  });

  // ── Default/unknown status falls through to grey ──────────────────────────

  it("renders for an unknown status value (default branch)", () => {
    // "unknown" is not a named case → falls through to default grey gradient
    render(<StatusBalls status={"unknown" as any} />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  // ── width / height as string (parseInt branch) ────────────────────────────

  it("accepts width and height as strings", () => {
    render(<StatusBalls status="pending" width={"20" as any} height={"20" as any} />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  it("accepts width and height as numbers", () => {
    render(<StatusBalls status="pending" width={24} height={24} />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThan(0);
  });

  // ── Combined props ────────────────────────────────────────────────────────

  it("renders 'fixed' with custom numeric dimensions", () => {
    render(<StatusBalls status="fixed" width={32} height={32} />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThanOrEqual(2);
  });

  it("renders 'mixed' with string dimensions", () => {
    render(<StatusBalls status="mixed" width={"32" as any} height={"32" as any} />);
    expect(screen.getAllByTestId("linear-gradient").length).toBeGreaterThanOrEqual(2);
  });
});
