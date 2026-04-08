/**
 * Tests for the Layout UI component.
 *
 * Exercises: rendering children, show/hide header and footer, toast message
 * display, topMargin/bottomMargin style, onProfileClick callback, active
 * menu item, and Arabic language support.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("react-native-keyboard-aware-scroll-view", () => {
  const React = require("react");
  const { ScrollView } = require("react-native");
  return {
    KeyboardAwareScrollView: ({ children }: any) =>
      React.createElement(ScrollView, null, children),
  };
});

// Header is imported via "../Header" from Layout.tsx → resolves to @platform/Header
jest.mock("@platform/Header", () => {
  const React = require("react");
  const { View, TouchableOpacity } = require("react-native");
  return {
    Header: ({ onAvatarPress, isEditing }: any) =>
      React.createElement(
        View,
        { testID: "header" },
        React.createElement(
          TouchableOpacity,
          { testID: "avatar-press", onPress: onAvatarPress },
          null
        )
      ),
  };
});

// Footer is imported via "../Footer" from Layout.tsx → resolves to @platform/Footer
jest.mock("@platform/Footer", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    Footer: ({ language, active, onPressMenu }: any) =>
      React.createElement(
        View,
        { testID: "footer" },
        React.createElement(
          TouchableOpacity,
          { testID: "footer-home", onPress: () => onPressMenu?.("Home") },
          React.createElement(Text, null, "Home")
        )
      ),
  };
});

// Toast is imported via "../Toast" from Layout.tsx → resolves to @platform/Toast
jest.mock("@platform/Toast", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Toast: ({ message, status }: any) =>
      React.createElement(
        View,
        { testID: "toast" },
        React.createElement(Text, null, message)
      ),
  };
});

jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, className }: any) =>
      React.createElement(View, { testID: "container" }, children),
  };
});

import { Layout } from "@platform/Layout/Layout";

describe("Layout", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Layout />);
  });

  it("renders children inside the scroll view", () => {
    render(
      <Layout>
        <Text testID="child-content">Hello World</Text>
      </Layout>
    );
    expect(screen.getByTestId("child-content")).toBeTruthy();
  });

  // ── Header visibility ──────────────────────────────────────────────────────

  it("renders header by default (showHeader=true)", () => {
    render(<Layout />);
    expect(screen.getByTestId("header")).toBeTruthy();
  });

  it("hides header when showHeader=false", () => {
    render(<Layout showHeader={false} />);
    expect(screen.queryByTestId("header")).toBeNull();
  });

  // ── Footer visibility ──────────────────────────────────────────────────────

  it("renders footer by default (showFooter=true)", () => {
    render(<Layout />);
    expect(screen.getByTestId("footer")).toBeTruthy();
  });

  it("hides footer when showFooter=false", () => {
    render(<Layout showFooter={false} />);
    expect(screen.queryByTestId("footer")).toBeNull();
  });

  // ── Toast display ──────────────────────────────────────────────────────────

  it("renders toast when message is non-empty", () => {
    render(<Layout toast={{ message: "Saved successfully", status: "success" }} />);
    expect(screen.getByTestId("toast")).toBeTruthy();
    expect(screen.getByText("Saved successfully")).toBeTruthy();
  });

  it("does not render toast when message is empty string", () => {
    render(<Layout toast={{ message: "", status: "success" }} />);
    expect(screen.queryByTestId("toast")).toBeNull();
  });

  it("does not render toast when message is only whitespace", () => {
    render(<Layout toast={{ message: "   ", status: "success" }} />);
    expect(screen.queryByTestId("toast")).toBeNull();
  });

  it("uses default empty message when toast prop is not provided", () => {
    render(<Layout />);
    expect(screen.queryByTestId("toast")).toBeNull();
  });

  // ── topMargin / bottomMargin ───────────────────────────────────────────────

  it("applies topMargin to the root View", () => {
    const { UNSAFE_getAllByType } = render(<Layout topMargin={20} />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const rootView = views.find(
      (v: any) => v.props.style?.marginTop === 20
    );
    expect(rootView).toBeTruthy();
  });

  it("applies bottomMargin to the root View", () => {
    const { UNSAFE_getAllByType } = render(<Layout bottomMargin={30} />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const rootView = views.find(
      (v: any) => v.props.style?.marginBottom === 30
    );
    expect(rootView).toBeTruthy();
  });

  // ── onProfileClick callback ────────────────────────────────────────────────

  it("calls onProfileClick when avatar is pressed", () => {
    const onProfileClick = jest.fn();
    render(<Layout onProfileClick={onProfileClick} />);
    fireEvent.press(screen.getByTestId("avatar-press"));
    expect(onProfileClick).toHaveBeenCalledTimes(1);
  });

  // ── onPressMenu / active ───────────────────────────────────────────────────

  it("calls onPressMenu with correct key when footer item is pressed", () => {
    const onPressMenu = jest.fn();
    render(<Layout onPressMenu={onPressMenu} />);
    fireEvent.press(screen.getByTestId("footer-home"));
    expect(onPressMenu).toHaveBeenCalledWith("Home");
  });

  it("renders with active prop without crashing", () => {
    expect(() => render(<Layout active="Community" />)).not.toThrow();
  });

  // ── isEditing ─────────────────────────────────────────────────────────────

  it("renders header in editing mode without crashing", () => {
    expect(() => render(<Layout isEditing />)).not.toThrow();
  });

  // ── Language ───────────────────────────────────────────────────────────────

  it("renders without crashing when language='ar'", () => {
    expect(() => render(<Layout language="ar" />)).not.toThrow();
  });

  // ── Both header and footer hidden ─────────────────────────────────────────

  it("renders only children when both header and footer are hidden", () => {
    render(
      <Layout showHeader={false} showFooter={false}>
        <Text testID="only-child">Content</Text>
      </Layout>
    );
    expect(screen.getByTestId("only-child")).toBeTruthy();
    expect(screen.queryByTestId("header")).toBeNull();
    expect(screen.queryByTestId("footer")).toBeNull();
  });
});
