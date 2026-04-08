/**
 * Tests for the Header UI component.
 *
 * Exercises: default rendering, Avatar presence, two IconButtons, onAvatarPress
 * callback, isEditing opacity class, and normal (non-editing) render.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock @platform/Avatar ─────────────────────────────────────────────────
jest.mock("@platform/Avatar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Avatar: ({ imageUrl }: any) =>
      React.createElement(View, { testID: "avatar" }),
  };
});

// ── Mock @platform/IconButton ─────────────────────────────────────────────
jest.mock("@platform/IconButton", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    IconButton: ({ icon }: any) =>
      React.createElement(View, { testID: "icon-button" }, icon),
  };
});

// ── Mock @platform/Container ──────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, className, ...p }: any) =>
      React.createElement(View, { className, ...p }, children),
  };
});

// ── Mock SVG icon assets ───────────────────────────────────────────────────
jest.mock("~/assets/svg/icons/StatusUp", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, { testID: "status-up", ...p }),
  };
});

jest.mock("~/assets/svg/icons/Settings", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, { testID: "settings", ...p }),
  };
});

import { Header } from "@platform/Header/Header";

describe("Header", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Header />);
  });

  it("renders the Avatar component", () => {
    render(<Header avatarUrl="https://example.com/avatar.png" />);
    expect(screen.getByTestId("avatar")).toBeTruthy();
  });

  it("renders Avatar without avatarUrl prop", () => {
    render(<Header />);
    expect(screen.getByTestId("avatar")).toBeTruthy();
  });

  // ── IconButtons ────────────────────────────────────────────────────────

  it("renders 2 IconButton components (Settings + StatusUp)", () => {
    render(<Header />);
    const iconButtons = screen.getAllByTestId("icon-button");
    expect(iconButtons).toHaveLength(2);
  });

  it("renders the Settings SVG icon", () => {
    render(<Header />);
    expect(screen.getByTestId("settings")).toBeTruthy();
  });

  it("renders the StatusUp SVG icon", () => {
    render(<Header />);
    expect(screen.getByTestId("status-up")).toBeTruthy();
  });

  // ── onAvatarPress ──────────────────────────────────────────────────────

  it("calls onAvatarPress when avatar area is pressed", () => {
    const onAvatarPress = jest.fn();
    render(<Header onAvatarPress={onAvatarPress} />);
    // The Avatar is wrapped in a Pressable — press the avatar testID
    fireEvent.press(screen.getByTestId("avatar"));
    expect(onAvatarPress).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onAvatarPress is not provided and avatar is pressed", () => {
    render(<Header />);
    expect(() => fireEvent.press(screen.getByTestId("avatar"))).not.toThrow();
  });

  // ── isEditing ──────────────────────────────────────────────────────────

  it("applies opacity-50 className when isEditing=true", () => {
    const { UNSAFE_getAllByType } = render(<Header isEditing />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    // The outermost Container View should have className containing "opacity-50"
    const editingView = views.find((v: any) =>
      typeof v.props.className === "string" &&
      v.props.className.includes("opacity-50")
    );
    expect(editingView).toBeTruthy();
  });

  it("does not apply opacity-50 className when isEditing=false", () => {
    const { UNSAFE_getAllByType } = render(<Header isEditing={false} />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const editingView = views.find((v: any) =>
      typeof v.props.className === "string" &&
      v.props.className.includes("opacity-50")
    );
    expect(editingView).toBeFalsy();
  });

  it("renders normally without isEditing prop", () => {
    expect(() => render(<Header />)).not.toThrow();
  });

  it("renders normally with isEditing=false (default)", () => {
    const { UNSAFE_getAllByType } = render(<Header />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const editingView = views.find((v: any) =>
      typeof v.props.className === "string" &&
      v.props.className.includes("opacity-50")
    );
    expect(editingView).toBeFalsy();
  });
});
