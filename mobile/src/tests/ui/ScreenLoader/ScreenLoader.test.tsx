/**
 * Tests for the mobile ScreenLoader UI component.
 *
 * Branches to cover:
 *  1. isLoading=false           → component returns null (nothing rendered)
 *  2. isLoading=true + gifSrc   → renders Modal with Image (gifSrc branch)
 *  3. isLoading=true + no gifSrc (empty string) → renders Modal with ActivityIndicator
 *  4. alt prop forwarded as accessibilityLabel on the Image
 *  5. default alt value "Loading..."
 *  6. gifSrc defaults to the ADREC trailing gif (truthy default → Image rendered)
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// The moduleNameMapper resolves @platform/ScreenLoader → mobile/src/ui/ScreenLoader (index.ts)
// which re-exports as a named export.
import { ScreenLoader } from "@platform/ScreenLoader";

describe("ScreenLoader", () => {
  // ── isLoading=false → renders nothing ────────────────────────────────────

  it("renders nothing when isLoading=false", () => {
    const { toJSON } = render(<ScreenLoader isLoading={false} />);
    expect(toJSON()).toBeNull();
  });

  it("renders nothing when isLoading is omitted (default false)", () => {
    const { toJSON } = render(<ScreenLoader />);
    expect(toJSON()).toBeNull();
  });

  // ── isLoading=true + gifSrc → Image rendered ──────────────────────────────

  it("renders an Image when isLoading=true and gifSrc is provided", () => {
    render(
      <ScreenLoader
        isLoading
        gifSrc="https://example.com/loading.gif"
        alt="Spinning"
      />
    );
    // Image has accessibilityLabel matching alt
    expect(screen.getByLabelText("Spinning")).toBeTruthy();
  });

  it("uses the provided alt as accessibilityLabel on the Image", () => {
    render(
      <ScreenLoader
        isLoading
        gifSrc="https://example.com/loading.gif"
        alt="Please wait"
      />
    );
    expect(screen.getByLabelText("Please wait")).toBeTruthy();
  });

  it("uses default alt='Loading...' when alt is not provided", () => {
    render(
      <ScreenLoader isLoading gifSrc="https://example.com/loading.gif" />
    );
    expect(screen.getByLabelText("Loading...")).toBeTruthy();
  });

  // ── isLoading=true + no gifSrc → ActivityIndicator rendered ───────────────

  it("renders ActivityIndicator when isLoading=true and gifSrc is empty string", () => {
    const { UNSAFE_getByType } = render(<ScreenLoader isLoading gifSrc="" />);
    const { ActivityIndicator } = require("react-native");
    // ActivityIndicator is present in the tree when gifSrc is falsy
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    // Image (accessibilityLabel) is NOT rendered
    expect(screen.queryByLabelText("Loading...")).toBeNull();
  });

  it("does not render an Image when gifSrc is empty string", () => {
    render(<ScreenLoader isLoading gifSrc="" alt="Loading..." />);
    expect(screen.queryByLabelText("Loading...")).toBeNull();
  });

  // ── Modal visibility ──────────────────────────────────────────────────────

  it("renders the Modal when isLoading=true (gifSrc provided)", () => {
    render(
      <ScreenLoader isLoading gifSrc="https://example.com/loading.gif" />
    );
    // The Image inside the Modal is accessible in the tree
    expect(screen.getByLabelText("Loading...")).toBeTruthy();
  });

  // ── gifSrc default (truthy URL) → Image rendered ─────────────────────────

  it("renders Image with default gifSrc when isLoading=true and gifSrc is omitted", () => {
    render(<ScreenLoader isLoading />);
    // Default gifSrc is a truthy URL string → Image branch
    expect(screen.getByLabelText("Loading...")).toBeTruthy();
  });
});
