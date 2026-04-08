/**
 * Tests for the shared SharedLanguageSwitchRenderer component.
 *
 * This component conditionally renders English or Arabic text.
 * Wrapped in a <Text> from react-native so getByText can locate the output.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import SharedLanguageSwitchRenderer from "@shared/components/SharedLanguageSwitchRenderer";

describe("SharedLanguageSwitchRenderer", () => {
  // ── English rendering ────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(
      <Text>
        <SharedLanguageSwitchRenderer language="en" value="Hello" value_ar="مرحبا" />
      </Text>
    );
  });

  it("renders the English value when language is 'en'", () => {
    render(
      <Text>
        <SharedLanguageSwitchRenderer language="en" value="Hello" value_ar="مرحبا" />
      </Text>
    );
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  // ── Arabic rendering ─────────────────────────────────────────────────────

  it("renders the Arabic value when language is 'ar'", () => {
    render(
      <Text>
        <SharedLanguageSwitchRenderer language="ar" value="Hello" value_ar="مرحبا" />
      </Text>
    );
    expect(screen.getByText("مرحبا")).toBeTruthy();
  });

  it("falls back to English value when language is 'ar' but value_ar is undefined", () => {
    render(
      <Text>
        <SharedLanguageSwitchRenderer language="ar" value="Fallback" />
      </Text>
    );
    expect(screen.getByText("Fallback")).toBeTruthy();
  });

  it("does not render Arabic value when language is 'en'", () => {
    render(
      <Text>
        <SharedLanguageSwitchRenderer language="en" value="English" value_ar="Arabic" />
      </Text>
    );
    expect(screen.queryByText("Arabic")).toBeNull();
  });

  it("does not render English value when language is 'ar' and value_ar is provided", () => {
    render(
      <Text>
        <SharedLanguageSwitchRenderer language="ar" value="English" value_ar="Arabic" />
      </Text>
    );
    expect(screen.queryByText("English")).toBeNull();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders empty string when value is empty and language is 'en'", () => {
    const { toJSON } = render(
      <Text>
        <SharedLanguageSwitchRenderer language="en" value="" value_ar="" />
      </Text>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("does not throw when both value and value_ar are undefined", () => {
    expect(() =>
      render(
        <Text>
          <SharedLanguageSwitchRenderer language="en" />
        </Text>
      )
    ).not.toThrow();
  });

  it("renders value_ar as empty string when it's an empty string and language is 'ar'", () => {
    const { toJSON } = render(
      <Text>
        <SharedLanguageSwitchRenderer language="ar" value="English" value_ar="" />
      </Text>
    );
    expect(toJSON()).toBeTruthy();
  });
});
