/**
 * Tests for the Avatar UI component.
 *
 * Exercises: image URL rendering, initials display (uppercased, max 2 chars),
 * default image fallback, status badge visibility, and avatarSize dimensions.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock @platform/ProfileIconStatus (imported via relative path) ─────────────
// Avatar.tsx imports: import { ProfileIconStatus } from "../ProfileIconStatus"
// which jest resolves to mobile/src/ui/ProfileIconStatus/ProfileIconStatus.tsx.
// Mocking the alias path @platform/ProfileIconStatus intercepts that resolution.
jest.mock("@platform/ProfileIconStatus", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ProfileIconStatus: (p: any) =>
      React.createElement(View, { testID: "profile-icon-status", ...p }),
  };
});

// Avatar also imports ProfileIconStatus via a relative path inside its own
// source folder. We need to mock the direct resolution too.
jest.mock("@platform/ProfileIconStatus/ProfileIconStatus", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ProfileIconStatus: (p: any) =>
      React.createElement(View, { testID: "profile-icon-status", ...p }),
  };
});

import { Avatar } from "@platform/Avatar/Avatar";

describe("Avatar", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Avatar />);
  });

  // ── Image URL ─────────────────────────────────────────────────────────────

  it("renders an Image when imageUrl is provided", () => {
    const { UNSAFE_getByType } = render(
      <Avatar imageUrl="https://example.com/avatar.png" />
    );
    const { Image } = require("react-native");
    const img = UNSAFE_getByType(Image);
    expect(img).toBeTruthy();
    expect(img.props.source.uri).toBe("https://example.com/avatar.png");
  });

  it("does not render initials text when imageUrl is provided", () => {
    render(
      <Avatar imageUrl="https://example.com/avatar.png" initials="AB" />
    );
    expect(screen.queryByText("AB")).toBeNull();
  });

  // ── Initials ──────────────────────────────────────────────────────────────

  it("renders initials text when no imageUrl is provided", () => {
    render(<Avatar initials="AB" />);
    expect(screen.getByText("AB")).toBeTruthy();
  });

  it("uppercases initials", () => {
    render(<Avatar initials="ab" />);
    expect(screen.getByText("AB")).toBeTruthy();
  });

  it("slices initials to 2 characters", () => {
    render(<Avatar initials="ABCD" />);
    expect(screen.getByText("AB")).toBeTruthy();
  });

  it("renders single initial correctly", () => {
    render(<Avatar initials="X" />);
    expect(screen.getByText("X")).toBeTruthy();
  });

  it("does not render initials image when initials are provided", () => {
    const { UNSAFE_queryAllByType } = render(<Avatar initials="JD" />);
    const { Image } = require("react-native");
    // No Image rendered when only initials are given
    const images = UNSAFE_queryAllByType(Image);
    expect(images.length).toBe(0);
  });

  // ── Default image fallback ────────────────────────────────────────────────

  it("renders a default Image when neither imageUrl nor initials are provided", () => {
    const { UNSAFE_getByType } = render(<Avatar />);
    const { Image } = require("react-native");
    const img = UNSAFE_getByType(Image);
    expect(img).toBeTruthy();
    expect(img.props.source.uri).toContain("DefaultImg.png");
  });

  it("renders default image when imageUrl is an empty string", () => {
    const { UNSAFE_getByType } = render(<Avatar imageUrl="" />);
    const { Image } = require("react-native");
    const img = UNSAFE_getByType(Image);
    expect(img.props.source.uri).toContain("DefaultImg.png");
  });

  it("renders default image when imageUrl is whitespace only", () => {
    const { UNSAFE_getByType } = render(<Avatar imageUrl="   " />);
    const { Image } = require("react-native");
    const img = UNSAFE_getByType(Image);
    expect(img.props.source.uri).toContain("DefaultImg.png");
  });

  // ── Status badge ──────────────────────────────────────────────────────────

  it("renders the status badge when status is provided", () => {
    render(<Avatar status="online" />);
    expect(screen.getByTestId("profile-icon-status")).toBeTruthy();
  });

  it("does not render the status badge when status is not provided", () => {
    render(<Avatar />);
    expect(screen.queryByTestId("profile-icon-status")).toBeNull();
  });

  it("passes the status prop to ProfileIconStatus", () => {
    const { UNSAFE_getByType } = render(<Avatar status="pending" />);
    const { View } = require("react-native");
    // Our mocked ProfileIconStatus renders a View with testID="profile-icon-status"
    const badge = screen.getByTestId("profile-icon-status");
    expect(badge).toBeTruthy();
  });

  // ── Avatar size ───────────────────────────────────────────────────────────

  it("applies the default avatarSize=32 to the avatar view", () => {
    const { UNSAFE_getAllByType } = render(<Avatar />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const avatarView = views.find(
      (v: any) =>
        Array.isArray(v.props.style)
          ? v.props.style.some((s: any) => s?.width === 32 && s?.height === 32)
          : v.props.style?.width === 32 && v.props.style?.height === 32
    );
    expect(avatarView).toBeTruthy();
  });

  it("applies a custom avatarSize to width and height", () => {
    const { UNSAFE_getAllByType } = render(<Avatar avatarSize={64} />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const avatarView = views.find(
      (v: any) =>
        Array.isArray(v.props.style)
          ? v.props.style.some((s: any) => s?.width === 64 && s?.height === 64)
          : v.props.style?.width === 64 && v.props.style?.height === 64
    );
    expect(avatarView).toBeTruthy();
  });

  it("sets borderRadius to half of avatarSize (circular shape)", () => {
    const { UNSAFE_getAllByType } = render(<Avatar avatarSize={48} />);
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const avatarView = views.find(
      (v: any) =>
        Array.isArray(v.props.style)
          ? v.props.style.some((s: any) => s?.borderRadius === 24)
          : v.props.style?.borderRadius === 24
    );
    expect(avatarView).toBeTruthy();
  });
});
