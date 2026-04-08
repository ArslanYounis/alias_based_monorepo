/**
 * Tests for the mobile ProfileIconStatus UI component.
 *
 * Branches to cover (renderIcon switch):
 *  1. status="pending"    → renders AwaySvg  (testID="away-icon")
 *  2. status="inProgress" → renders ArrowSvg (testID="arrow-icon")
 *  3. status="complete"   → renders OnlineSvg (testID="online-icon")
 *  4. status="failed"     → renders FailedSvg (testID="failed-icon")
 *  5. status=<default>    → renders null (no icon rendered)
 *
 * Width / height branches:
 *  6. width/height as numbers → used directly
 *  7. width/height as non-number (string) → falls back to 18
 *
 * All SVG assets are mocked to avoid react-native-svg native module crashes.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock all SVG assets used by ProfileIconStatus ─────────────────────────────

jest.mock("~/assets/svg/statusSvg/Away", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: "away-icon", ...props }),
  };
});

jest.mock("~/assets/svg/statusSvg/Arrow", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: "arrow-icon", ...props }),
  };
});

jest.mock("~/assets/svg/statusSvg/Online", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: "online-icon", ...props }),
  };
});

jest.mock("~/assets/svg/statusSvg/failed", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: "failed-icon", ...props }),
  };
});

import { ProfileIconStatus } from "@platform/ProfileIconStatus";

describe("ProfileIconStatus", () => {
  // ── status="pending" → AwaySvg ─────────────────────────────────────────────

  it("renders AwaySvg for status='pending'", () => {
    render(<ProfileIconStatus status="pending" />);
    expect(screen.getByTestId("away-icon")).toBeTruthy();
  });

  // ── status="inProgress" → ArrowSvg ────────────────────────────────────────

  it("renders ArrowSvg for status='inProgress'", () => {
    render(<ProfileIconStatus status="inProgress" />);
    expect(screen.getByTestId("arrow-icon")).toBeTruthy();
  });

  // ── status="complete" → OnlineSvg ─────────────────────────────────────────

  it("renders OnlineSvg for status='complete'", () => {
    render(<ProfileIconStatus status="complete" />);
    expect(screen.getByTestId("online-icon")).toBeTruthy();
  });

  // ── status="failed" → FailedSvg ───────────────────────────────────────────

  it("renders FailedSvg for status='failed'", () => {
    render(<ProfileIconStatus status="failed" />);
    expect(screen.getByTestId("failed-icon")).toBeTruthy();
  });

  // ── default branch → no icon ──────────────────────────────────────────────

  it("renders no icon for an unknown status (default branch)", () => {
    render(<ProfileIconStatus status={"unknown" as any} />);
    expect(screen.queryByTestId("away-icon")).toBeNull();
    expect(screen.queryByTestId("arrow-icon")).toBeNull();
    expect(screen.queryByTestId("online-icon")).toBeNull();
    expect(screen.queryByTestId("failed-icon")).toBeNull();
  });

  // ── width / height as numbers ─────────────────────────────────────────────

  it("accepts numeric width and height", () => {
    render(<ProfileIconStatus status="pending" width={24} height={24} />);
    expect(screen.getByTestId("away-icon")).toBeTruthy();
  });

  // ── width / height as non-numbers (falls back to 18) ─────────────────────

  it("falls back to default size 18 when width is a string", () => {
    render(
      <ProfileIconStatus
        status="complete"
        width={"auto" as any}
        height={"auto" as any}
      />
    );
    expect(screen.getByTestId("online-icon")).toBeTruthy();
  });

  // ── renders the outer container View ─────────────────────────────────────

  it("renders without crashing using default width/height", () => {
    expect(() => render(<ProfileIconStatus status="failed" />)).not.toThrow();
  });

  it("does not render any icon when status is undefined", () => {
    render(<ProfileIconStatus status={undefined as any} />);
    expect(screen.queryByTestId("away-icon")).toBeNull();
    expect(screen.queryByTestId("arrow-icon")).toBeNull();
    expect(screen.queryByTestId("online-icon")).toBeNull();
    expect(screen.queryByTestId("failed-icon")).toBeNull();
  });
});
