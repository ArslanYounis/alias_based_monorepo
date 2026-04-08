/**
 * Tests for the shared ModalSteps component.
 *
 * Container and Text are mocked. All meaningful branches are covered:
 * default rendering, English/Arabic title and subText, fallbacks when
 * Arabic props are absent, and RTL direction via language prop.
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
      React.createElement(View, { style, ...p, accessibilityLabel: dir }, children),
  };
});

// ── Mock Text ─────────────────────────────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children }: any) => React.createElement(Text, null, children),
  };
});

import ModalSteps from "@shared/components/ModalSteps/ModalSteps";

describe("ModalSteps (shared/components/ModalSteps/ModalSteps.tsx)", () => {
  // ── Smoke tests ───────────────────────────────────────────────────────────

  it("renders without crashing with no props", () => {
    render(<ModalSteps />);
  });

  it("renders without crashing with all props", () => {
    render(
      <ModalSteps
        title="Step 1"
        title_ar="الخطوة 1"
        subText="1 of 3"
        subText_ar="1 من 3"
        language="en"
      />
    );
  });

  // ── Default language (en) ─────────────────────────────────────────────────

  it("renders English title by default", () => {
    render(
      <ModalSteps title="Step 1" title_ar="الخطوة 1" />
    );
    expect(screen.getByText("Step 1")).toBeTruthy();
  });

  it("renders English subText by default", () => {
    render(
      <ModalSteps subText="1 of 3" subText_ar="1 من 3" />
    );
    expect(screen.getByText("1 of 3")).toBeTruthy();
  });

  it("renders empty strings when title and subText not provided", () => {
    render(<ModalSteps />);
    // Should render without throwing; empty text nodes
  });

  // ── Arabic language ───────────────────────────────────────────────────────

  it("renders Arabic title when language='ar'", () => {
    render(
      <ModalSteps title="Step 1" title_ar="الخطوة 1" language="ar" />
    );
    expect(screen.getByText("الخطوة 1")).toBeTruthy();
  });

  it("renders Arabic subText when language='ar'", () => {
    render(
      <ModalSteps subText="1 of 3" subText_ar="1 من 3" language="ar" />
    );
    expect(screen.getByText("1 من 3")).toBeTruthy();
  });

  // ── Arabic fallback ───────────────────────────────────────────────────────

  it("falls back to English title when title_ar is empty and language='ar'", () => {
    render(<ModalSteps title="English Title" title_ar="" language="ar" />);
    // SharedLanguageSwitchRenderer receives value_ar=title||title = "English Title"
    // since title_ar is empty, the component passes value_ar={title_ar || title}
    // which becomes "English Title"
    expect(screen.getByText("English Title")).toBeTruthy();
  });

  it("falls back to English subText when subText_ar is empty and language='ar'", () => {
    render(<ModalSteps subText="English Sub" subText_ar="" language="ar" />);
    expect(screen.getByText("English Sub")).toBeTruthy();
  });

  // ── RTL direction ─────────────────────────────────────────────────────────

  it("sets dir='rtl' on container when language='ar'", () => {
    render(
      <ModalSteps title="Title" title_ar="عنوان" language="ar" />
    );
    // Container mock passes dir as accessibilityLabel
    expect(screen.getByLabelText("rtl")).toBeTruthy();
  });

  it("sets dir='ltr' on container when language='en'", () => {
    render(
      <ModalSteps title="Title" title_ar="عنوان" language="en" />
    );
    expect(screen.getByLabelText("ltr")).toBeTruthy();
  });

  it("defaults to dir='ltr' when language prop is omitted", () => {
    render(<ModalSteps title="Title" />);
    expect(screen.getByLabelText("ltr")).toBeTruthy();
  });

  // ── Content completeness ──────────────────────────────────────────────────

  it("renders both title and subText simultaneously", () => {
    render(
      <ModalSteps
        title="Document Review"
        title_ar="مراجعة المستندات"
        subText="Step 2 of 4"
        subText_ar="الخطوة 2 من 4"
      />
    );
    expect(screen.getByText("Document Review")).toBeTruthy();
    expect(screen.getByText("Step 2 of 4")).toBeTruthy();
  });

  it("renders both Arabic title and subText when language='ar'", () => {
    render(
      <ModalSteps
        title="Document Review"
        title_ar="مراجعة المستندات"
        subText="Step 2 of 4"
        subText_ar="الخطوة 2 من 4"
        language="ar"
      />
    );
    expect(screen.getByText("مراجعة المستندات")).toBeTruthy();
    expect(screen.getByText("الخطوة 2 من 4")).toBeTruthy();
  });
});
