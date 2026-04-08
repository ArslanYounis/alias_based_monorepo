/**
 * Tests for the Logo UI component.
 *
 * Exercises: type="full" / "icon" renders SvgUri, type="hub" renders OneHub,
 * unknown type renders nothing, and custom width/height numeric props override
 * the per-type defaults.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock react-native-svg ─────────────────────────────────────────────────────
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, p),
    SvgUri: (p: any) => React.createElement(View, { testID: "svg-uri", ...p }),
  };
});

// ── Mock ~/assets/svg/icons/OneHub ────────────────────────────────────────────
jest.mock("~/assets/svg/icons/OneHub", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) =>
      React.createElement(View, { testID: "one-hub", ...p }),
  };
});

import { Logo } from "@platform/Logo/Logo";

describe("Logo", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing with type='full'", () => {
    render(<Logo type="full" />);
  });

  // ── type="full" ───────────────────────────────────────────────────────────

  it("renders SvgUri for type='full'", () => {
    render(<Logo type="full" />);
    expect(screen.getByTestId("svg-uri")).toBeTruthy();
  });

  it("passes the dmtLogo.svg URI for type='full'", () => {
    render(<Logo type="full" />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.uri).toContain("dmtLogo.svg");
  });

  it("uses default width=300 for type='full'", () => {
    render(<Logo type="full" />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.width).toBe(300);
  });

  it("uses default height=66 for type='full'", () => {
    render(<Logo type="full" />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.height).toBe(66);
  });

  // ── type="icon" ───────────────────────────────────────────────────────────

  it("renders SvgUri for type='icon'", () => {
    render(<Logo type="icon" />);
    expect(screen.getByTestId("svg-uri")).toBeTruthy();
  });

  it("passes the dmtIocn.svg URI for type='icon'", () => {
    render(<Logo type="icon" />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.uri).toContain("dmtIocn.svg");
  });

  it("uses default width=33 for type='icon'", () => {
    render(<Logo type="icon" />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.width).toBe(33);
  });

  it("uses default height=37 for type='icon'", () => {
    render(<Logo type="icon" />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.height).toBe(37);
  });

  // ── type="hub" ────────────────────────────────────────────────────────────

  it("renders OneHub for type='hub'", () => {
    render(<Logo type="hub" />);
    expect(screen.getByTestId("one-hub")).toBeTruthy();
  });

  it("does not render SvgUri for type='hub'", () => {
    render(<Logo type="hub" />);
    expect(screen.queryByTestId("svg-uri")).toBeNull();
  });

  it("uses default width=52 for type='hub'", () => {
    render(<Logo type="hub" />);
    const oneHub = screen.getByTestId("one-hub");
    expect(oneHub.props.width).toBe(52);
  });

  it("uses default height=34 for type='hub'", () => {
    render(<Logo type="hub" />);
    const oneHub = screen.getByTestId("one-hub");
    expect(oneHub.props.height).toBe(34);
  });

  // ── Unknown / undefined type ──────────────────────────────────────────────

  it("renders no svg/icon for an unknown type", () => {
    render(<Logo type={"unknown" as any} />);
    expect(screen.queryByTestId("svg-uri")).toBeNull();
    expect(screen.queryByTestId("one-hub")).toBeNull();
  });

  it("renders no svg/icon when type is undefined", () => {
    render(<Logo type={undefined as any} />);
    expect(screen.queryByTestId("svg-uri")).toBeNull();
    expect(screen.queryByTestId("one-hub")).toBeNull();
  });

  // ── Custom width and height override ─────────────────────────────────────

  it("overrides default width with a numeric width prop for type='full'", () => {
    render(<Logo type="full" width={150} />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.width).toBe(150);
  });

  it("overrides default height with a numeric height prop for type='full'", () => {
    render(<Logo type="full" height={40} />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.height).toBe(40);
  });

  it("overrides width and height for type='icon'", () => {
    render(<Logo type="icon" width={20} height={25} />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.width).toBe(20);
    expect(svgUri.props.height).toBe(25);
  });

  it("overrides width and height for type='hub'", () => {
    render(<Logo type="hub" width={80} height={60} />);
    const oneHub = screen.getByTestId("one-hub");
    expect(oneHub.props.width).toBe(80);
    expect(oneHub.props.height).toBe(60);
  });

  it("ignores non-numeric width and uses the default", () => {
    // Logo.tsx: (typeof width === "number" ? width : undefined) ?? defaultWidth
    render(<Logo type="full" width={"auto" as any} />);
    const svgUri = screen.getByTestId("svg-uri");
    expect(svgUri.props.width).toBe(300);
  });
});
