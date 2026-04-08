/**
 * Tests for the shared PageTitle component.
 *
 * Buttons is mocked to cut the deep icon/lucide dependency chain.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock Buttons to avoid deep dep tree ─────────────────────────────────────
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({
      title,
      onClick,
      testID,
    }: {
      title?: string;
      onClick?: () => void;
      testID?: string;
    }) =>
      React.createElement(
        TouchableOpacity,
        { onPress: onClick, testID: testID || "button" },
        React.createElement(Text, null, title)
      ),
  };
});

import PageTitle from "@shared/components/PageTitle/PageTitle";

const defaultProps = {
  label: "Plot Details",
  label_ar: "تفاصيل القطعة",
};

describe("PageTitle (shared component)", () => {
  // ── Default rendering ────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<PageTitle {...defaultProps} />);
  });

  it("renders the English label by default", () => {
    render(<PageTitle {...defaultProps} />);
    expect(screen.getByText("Plot Details")).toBeTruthy();
  });

  it("renders with empty label without crashing", () => {
    expect(() => render(<PageTitle />)).not.toThrow();
  });

  // ── Language switching ────────────────────────────────────────────────────

  it("renders Arabic label when language is 'ar'", () => {
    render(<PageTitle {...defaultProps} language="ar" />);
    expect(screen.getByText("تفاصيل القطعة")).toBeTruthy();
  });

  it("renders English label when language is 'en'", () => {
    render(<PageTitle {...defaultProps} language="en" />);
    expect(screen.getByText("Plot Details")).toBeTruthy();
  });

  it("falls back to English label when label_ar is not provided and language is 'ar'", () => {
    render(<PageTitle label="Fallback" language="ar" />);
    expect(screen.getByText("Fallback")).toBeTruthy();
  });

  // ── Buttons ───────────────────────────────────────────────────────────────

  it("does not render buttons when showButtons is false (default)", () => {
    render(
      <PageTitle
        {...defaultProps}
        showButtons={false}
        buttons={[{ title: "Action", type: "primary" }]}
      />
    );
    expect(screen.queryByText("Action")).toBeNull();
  });

  it("renders buttons when showButtons is true", () => {
    render(
      <PageTitle
        {...defaultProps}
        showButtons={true}
        buttons={[{ title: "Save", type: "primary" }]}
      />
    );
    expect(screen.getByText("Save")).toBeTruthy();
  });

  it("renders multiple buttons when showButtons is true", () => {
    render(
      <PageTitle
        {...defaultProps}
        showButtons={true}
        buttons={[
          { title: "Save", type: "primary" },
          { title: "Cancel", type: "secondary" },
        ]}
      />
    );
    expect(screen.getByText("Save")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  it("renders no buttons when buttons array is empty and showButtons is true", () => {
    expect(() =>
      render(<PageTitle {...defaultProps} showButtons={true} buttons={[]} />)
    ).not.toThrow();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("does not throw when label is undefined", () => {
    expect(() => render(<PageTitle language="en" />)).not.toThrow();
  });

  it("does not throw when label_ar is undefined and language is 'ar'", () => {
    expect(() =>
      render(<PageTitle label="Test" language="ar" />)
    ).not.toThrow();
  });
});
