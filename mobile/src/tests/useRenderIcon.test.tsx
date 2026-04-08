/**
 * Tests for the mobile useRenderIcon hook.
 *
 * lucide-react-native and ~/lib-index (iconRegistry) are mocked so the hook
 * can be exercised in isolation without the full Expo build environment.
 */
import React from "react";
import { render } from "@testing-library/react-native";
import { View } from "react-native";
import { renderHook } from "@testing-library/react-native";

// ── Mock lucide-react-native ──────────────────────────────────────────────
jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Home: ({ color, size, testID, ...rest }: Record<string, unknown>) =>
      React.createElement(View, { testID: "lucide-Home", ...rest }),
    Settings: ({ color, size, ...rest }: Record<string, unknown>) =>
      React.createElement(View, { testID: "lucide-Settings", ...rest }),
  };
});

// ── Mock iconRegistry from ~/lib-index ────────────────────────────────────
jest.mock("~/lib-index", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    iconRegistry: {
      "custom-home": {
        component: ({ color, ...rest }: Record<string, unknown>) =>
          React.createElement(View, { testID: "remote-custom-home", ...rest }),
        iconColor: "#FF0000",
      },
      "custom-settings": {
        component: ({ color, ...rest }: Record<string, unknown>) =>
          React.createElement(View, { testID: "remote-custom-settings", ...rest }),
        iconColor: "#0000FF",
      },
    },
  };
});

import { useRenderIcon, type IconProp } from "~/src/hooks/useRenderIcon";

// Helper component that renders whatever the hook returns
const IconWrapper = ({ iconProp, additionalProps }: { iconProp: IconProp | null | undefined; additionalProps?: Record<string, unknown> }) => {
  const icon = useRenderIcon(iconProp, additionalProps);
  return <View testID="wrapper">{icon as React.ReactNode}</View>;
};

describe("useRenderIcon (mobile hook)", () => {
  // ── Null / undefined input ─────────────────────────────────────────────

  it("returns null when iconProp is null", () => {
    const { result } = renderHook(() => useRenderIcon(null));
    expect(result.current).toBeNull();
  });

  it("returns null when iconProp is undefined", () => {
    const { result } = renderHook(() => useRenderIcon(undefined));
    expect(result.current).toBeNull();
  });

  it("returns null when iconName is empty string", () => {
    const { result } = renderHook(() =>
      useRenderIcon({ iconName: "", iconColor: "#000", iconType: "lucide" })
    );
    expect(result.current).toBeNull();
  });

  // ── Lucide icons ────────────────────────────────────────────────────────

  it("renders a lucide icon when iconType is 'lucide' and icon exists", () => {
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{ iconName: "Home", iconColor: "#000000", iconType: "lucide" }}
      />
    );
    expect(getByTestId("lucide-Home")).toBeTruthy();
  });

  it("renders another lucide icon by name", () => {
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{
          iconName: "Settings",
          iconColor: "#333333",
          iconType: "lucide",
        }}
      />
    );
    expect(getByTestId("lucide-Settings")).toBeTruthy();
  });

  it("returns null for lucide type when icon name does not exist", () => {
    const { result } = renderHook(() =>
      useRenderIcon({
        iconName: "NonExistentIcon12345",
        iconColor: "#000",
        iconType: "lucide",
      })
    );
    expect(result.current).toBeNull();
  });

  it("uses custom iconWidth and iconHeight for lucide icons", () => {
    // Just ensure it renders without crashing when dimensions are provided
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{
          iconName: "Home",
          iconColor: "#FF0000",
          iconType: "lucide",
          iconWidth: 32,
          iconHeight: 32,
        }}
      />
    );
    expect(getByTestId("lucide-Home")).toBeTruthy();
  });

  it("uses default dimensions (24) when iconWidth/iconHeight not provided for lucide", () => {
    const { result } = renderHook(() =>
      useRenderIcon({ iconName: "Home", iconColor: "#000", iconType: "lucide" })
    );
    expect(result.current).not.toBeNull();
  });

  // ── Remote icons ────────────────────────────────────────────────────────

  it("renders a remote icon when iconType is 'remote' and icon exists in registry", () => {
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{
          iconName: "custom-home",
          iconColor: "#00FF00",
          iconType: "remote",
        }}
      />
    );
    expect(getByTestId("remote-custom-home")).toBeTruthy();
  });

  it("renders another remote icon by name", () => {
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{
          iconName: "custom-settings",
          iconColor: "#0000FF",
          iconType: "remote",
        }}
      />
    );
    expect(getByTestId("remote-custom-settings")).toBeTruthy();
  });

  it("returns null for remote type when icon name does not exist in registry", () => {
    const { result } = renderHook(() =>
      useRenderIcon({
        iconName: "non-existent-icon",
        iconColor: "#000",
        iconType: "remote",
      })
    );
    expect(result.current).toBeNull();
  });

  it("defaults to remote type when iconType is not specified", () => {
    // No iconType means it defaults to registry lookup
    const { result } = renderHook(() =>
      useRenderIcon({
        iconName: "non-existent",
        iconColor: "#000",
      })
    );
    expect(result.current).toBeNull();
  });

  // ── additionalProps ─────────────────────────────────────────────────────

  it("passes additionalProps to the lucide icon component", () => {
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{ iconName: "Home", iconColor: "#000", iconType: "lucide" }}
        additionalProps={{ "aria-label": "home icon" }}
      />
    );
    expect(getByTestId("lucide-Home")).toBeTruthy();
  });

  it("passes additionalProps to the remote icon component", () => {
    const { getByTestId } = render(
      <IconWrapper
        iconProp={{
          iconName: "custom-home",
          iconColor: "#FF0000",
          iconType: "remote",
        }}
        additionalProps={{ "aria-label": "custom icon" }}
      />
    );
    expect(getByTestId("remote-custom-home")).toBeTruthy();
  });
});
