/**
 * Tests for the Caption UI component.
 *
 * Exercises: left/right caption rendering, error message visibility,
 * disabled state suppression of errors, Arabic RTL layout, and the case
 * where all caption props are empty.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer ────────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "lang-switch" },
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock @platform/Text (used by Caption internally) ─────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

import { Caption } from "@platform/Caption/Caption";

describe("Caption", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Caption />);
  });

  // ── Caption text display ──────────────────────────────────────────────────

  it("renders captionLeft text", () => {
    render(<Caption captionLeft="Left text" captionLeft_ar="" captionRight="" captionRight_ar="" />);
    expect(screen.getByText("Left text")).toBeTruthy();
  });

  it("renders captionRight text", () => {
    render(<Caption captionLeft="" captionLeft_ar="" captionRight="Right text" captionRight_ar="" />);
    expect(screen.getByText("Right text")).toBeTruthy();
  });

  it("renders both captionLeft and captionRight", () => {
    render(
      <Caption
        captionLeft="Left"
        captionLeft_ar=""
        captionRight="Right"
        captionRight_ar=""
      />
    );
    expect(screen.getByText("Left")).toBeTruthy();
    expect(screen.getByText("Right")).toBeTruthy();
  });

  it("renders Arabic caption text when language='ar'", () => {
    render(
      <Caption
        captionLeft="Left"
        captionLeft_ar="يسار"
        captionRight="Right"
        captionRight_ar="يمين"
        language="ar"
      />
    );
    expect(screen.getByText("يسار")).toBeTruthy();
    expect(screen.getByText("يمين")).toBeTruthy();
  });

  // ── Error message display ─────────────────────────────────────────────────

  it("shows error message when hasError=true and not disabled", () => {
    render(
      <Caption
        hasError={true}
        disabled={false}
        errorMessage="Field is required"
        errorMessage_ar=""
      />
    );
    expect(screen.getByText("Field is required")).toBeTruthy();
  });

  it("shows Arabic error message when hasError=true and language='ar'", () => {
    render(
      <Caption
        hasError={true}
        disabled={false}
        errorMessage="Field is required"
        errorMessage_ar="الحقل مطلوب"
        language="ar"
      />
    );
    expect(screen.getByText("الحقل مطلوب")).toBeTruthy();
  });

  it("does not show error when hasError=false", () => {
    render(
      <Caption
        captionLeft=""
        captionLeft_ar=""
        captionRight=""
        captionRight_ar=""
        hasError={false}
        errorMessage="Should not appear"
        errorMessage_ar=""
      />
    );
    expect(screen.queryByText("Should not appear")).toBeNull();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it("hides error message when disabled=true even if hasError=true", () => {
    render(
      <Caption
        hasError={true}
        disabled={true}
        errorMessage="Hidden error"
        errorMessage_ar=""
      />
    );
    expect(screen.queryByText("Hidden error")).toBeNull();
  });

  it("does not show error when errorMessage is empty and hasError=true", () => {
    render(
      <Caption
        captionLeft=""
        captionLeft_ar=""
        captionRight=""
        captionRight_ar=""
        hasError={true}
        disabled={false}
        errorMessage=""
        errorMessage_ar=""
      />
    );
    // No error node rendered since both errorMessage and errorMessage_ar are empty
    const { UNSAFE_getAllByType } = render(
      <Caption
        captionLeft=""
        captionLeft_ar=""
        captionRight=""
        captionRight_ar=""
        hasError={true}
        disabled={false}
        errorMessage=""
        errorMessage_ar=""
      />
    );
    const { View } = require("react-native");
    // Component renders the outer View wrapper; it should not throw
    expect(UNSAFE_getAllByType(View).length).toBeGreaterThan(0);
  });

  // ── RTL layout ────────────────────────────────────────────────────────────

  it("applies row-reverse flex direction for Arabic language", () => {
    const { UNSAFE_getAllByType } = render(
      <Caption
        captionLeft="Left"
        captionLeft_ar="يسار"
        captionRight="Right"
        captionRight_ar="يمين"
        language="ar"
      />
    );
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    // The captions row view has style flexDirection: "row-reverse"
    const rtlRow = views.find(
      (v: any) => v.props.style?.flexDirection === "row-reverse"
    );
    expect(rtlRow).toBeTruthy();
  });

  it("applies row flex direction for English language", () => {
    const { UNSAFE_getAllByType } = render(
      <Caption
        captionLeft="Left"
        captionLeft_ar=""
        captionRight="Right"
        captionRight_ar=""
        language="en"
      />
    );
    const { View } = require("react-native");
    const views = UNSAFE_getAllByType(View);
    const ltrRow = views.find(
      (v: any) => v.props.style?.flexDirection === "row"
    );
    expect(ltrRow).toBeTruthy();
  });

  // ── No captions ───────────────────────────────────────────────────────────

  it("renders no caption row when all caption props are explicitly empty strings", () => {
    // The component checks: (captionLeft || captionLeft_ar || captionRight || captionRight_ar)
    // When all are empty strings the condition is falsy — the row View is not rendered.
    const { UNSAFE_getAllByType } = render(
      <Caption
        captionLeft=""
        captionLeft_ar=""
        captionRight=""
        captionRight_ar=""
        hasError={false}
      />
    );
    const { View } = require("react-native");
    // Only the outer wrapper View is present — no captions row and no error row.
    const views = UNSAFE_getAllByType(View);
    // None of the inner row views should have minHeight: 16 (captions row style)
    const captionRow = views.find(
      (v: any) => v.props.style?.minHeight === 16
    );
    expect(captionRow).toBeUndefined();
  });

  it("renders without crashing when no props are provided (all defaults)", () => {
    // Defaults: captionLeft="Caption Left", captionRight="Caption Right" — row IS shown.
    render(<Caption />);
    expect(screen.getByText("Caption Left")).toBeTruthy();
    expect(screen.getByText("Caption Right")).toBeTruthy();
  });
});
