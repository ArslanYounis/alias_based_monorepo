/**
 * Tests for the shared ModalTitle component.
 *
 * Container and Text are mocked. All meaningful branches are covered:
 * default rendering, English/Arabic label, platform-based font size
 * (web vs mobile), fallback when label_ar is empty, and RTL direction.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer (both paths) ────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});
jest.mock("@shared/components/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock Container ────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, dir, style, ...p }: any) =>
      React.createElement(
        View,
        { style, ...p, accessibilityLabel: dir },
        children
      ),
  };
});

// ── Mock Text (captures className for platform assertion) ─────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, className }: any) =>
      React.createElement(
        Text,
        { testID: "modal-title-text", accessibilityHint: className },
        children
      ),
  };
});

import ModalTitle from "@shared/components/ModalTitle/ModalTitle";

describe("ModalTitle (shared/components/ModalTitle/ModalTitle.tsx)", () => {
  // ── Smoke tests ───────────────────────────────────────────────────────────

  it("renders without crashing with no props", () => {
    render(<ModalTitle />);
  });

  it("renders without crashing with all props", () => {
    render(
      <ModalTitle
        label="Application Title"
        label_ar="عنوان الطلب"
        language="en"
        platform="web"
      />
    );
  });

  // ── Label rendering ───────────────────────────────────────────────────────

  it("renders English label by default", () => {
    render(<ModalTitle label="My Title" label_ar="عنواني" />);
    expect(screen.getByText("My Title")).toBeTruthy();
  });

  it("renders empty when label not provided", () => {
    render(<ModalTitle />);
    // Should not throw; renders empty text
    expect(screen.getByTestId("modal-title-text")).toBeTruthy();
  });

  // ── Arabic language ───────────────────────────────────────────────────────

  it("renders Arabic label when language='ar'", () => {
    render(
      <ModalTitle label="My Title" label_ar="عنواني" language="ar" />
    );
    expect(screen.getByText("عنواني")).toBeTruthy();
  });

  it("falls back to English label when label_ar is empty and language='ar'", () => {
    // Component passes value_ar={label_ar || label}, so empty label_ar falls back to label
    render(
      <ModalTitle label="English Fallback" label_ar="" language="ar" />
    );
    expect(screen.getByText("English Fallback")).toBeTruthy();
  });

  it("renders label when both label and label_ar are provided (en)", () => {
    render(
      <ModalTitle
        label="Application Review"
        label_ar="مراجعة الطلب"
        language="en"
      />
    );
    expect(screen.getByText("Application Review")).toBeTruthy();
  });

  // ── Platform-based font size ──────────────────────────────────────────────

  it("applies 'text-heading-h1' class on web platform", () => {
    render(
      <ModalTitle label="Title" platform="web" />
    );
    const textEl = screen.getByTestId("modal-title-text");
    expect(textEl.props.accessibilityHint).toContain("text-heading-h1");
  });

  it("applies 'text-heading-h3' class on mobile platform", () => {
    render(
      <ModalTitle label="Title" platform="mobile" />
    );
    const textEl = screen.getByTestId("modal-title-text");
    expect(textEl.props.accessibilityHint).toContain("text-heading-h3");
  });

  it("defaults to 'text-heading-h1' (web) when platform is not provided", () => {
    render(<ModalTitle label="Title" />);
    const textEl = screen.getByTestId("modal-title-text");
    expect(textEl.props.accessibilityHint).toContain("text-heading-h1");
  });

  // ── RTL direction ─────────────────────────────────────────────────────────

  it("sets dir='rtl' on container when language='ar'", () => {
    render(
      <ModalTitle label="Title" label_ar="عنوان" language="ar" />
    );
    expect(screen.getByLabelText("rtl")).toBeTruthy();
  });

  it("sets dir='ltr' on container when language='en'", () => {
    render(
      <ModalTitle label="Title" label_ar="عنوان" language="en" />
    );
    expect(screen.getByLabelText("ltr")).toBeTruthy();
  });

  it("defaults to dir='ltr' when language prop is omitted", () => {
    render(<ModalTitle label="Title" />);
    expect(screen.getByLabelText("ltr")).toBeTruthy();
  });

  // ── Combined platform + language ──────────────────────────────────────────

  it("renders Arabic label with mobile platform font class", () => {
    render(
      <ModalTitle
        label="Title"
        label_ar="عنوان"
        language="ar"
        platform="mobile"
      />
    );
    expect(screen.getByText("عنوان")).toBeTruthy();
    const textEl = screen.getByTestId("modal-title-text");
    expect(textEl.props.accessibilityHint).toContain("text-heading-h3");
  });

  it("renders Arabic label with web platform font class", () => {
    render(
      <ModalTitle
        label="Title"
        label_ar="عنوان"
        language="ar"
        platform="web"
      />
    );
    expect(screen.getByText("عنوان")).toBeTruthy();
    const textEl = screen.getByTestId("modal-title-text");
    expect(textEl.props.accessibilityHint).toContain("text-heading-h1");
  });
});
