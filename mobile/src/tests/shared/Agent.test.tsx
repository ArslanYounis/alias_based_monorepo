/**
 * Tests for the shared Agent component in the **mobile** platform context.
 *
 * The jest moduleNameMapper (jest.config.js) resolves:
 *   @platform/*  →  mobile/src/ui/*   (React Native components)
 *   @shared/*    →  shared/*
 *   ~/           →  mobile/
 *
 * CardTitle is mocked here because its sub-tree (Buttons → useRenderIcon →
 * lib-index → iconRegistry) would require a full Expo build environment.
 * The mock still accepts and forwards the relevant props so we can assert on
 * them. All other components (Container, Text, Avatar) use the real mobile
 * implementations, exercised through jest-expo's React Native test environment.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Lightweight mock for CardTitle to cut the deep Buttons/icon dep-tree ─────
jest.mock("@shared/components/CardTitle/CardTitle", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({
      title,
      title_ar,
      language,
    }: {
      title: string;
      title_ar: string;
      language?: string;
    }) => (
      <Text testID="card-title">
        {language === "ar" ? title_ar : title}
      </Text>
    ),
  };
});

import Agent from "@shared/components/Agent/Agent";

const baseAgent = {
  name: "John Smith",
  name_ar: "جون سميث",
  email: "john@example.com",
  phone: "+1-800-000-0000",
};

describe("Agent (shared component – mobile platform)", () => {
  // ── Default rendering ────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
  });

  it("renders the default English title 'Customer Agent'", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
    expect(screen.getByTestId("card-title")).toBeTruthy();
    expect(screen.getByText("Customer Agent")).toBeTruthy();
  });

  it("accepts a custom title prop", () => {
    render(
      <Agent
        agent={baseAgent}
        platform="mobile"
        title="Support Agent"
        title_ar="وكيل الدعم"
      />
    );
    expect(screen.getByText("Support Agent")).toBeTruthy();
  });

  // ── Agent data ────────────────────────────────────────────────────────────

  it("displays the agent's name in English", () => {
    render(<Agent agent={baseAgent} platform="mobile" language="en" />);
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  it("displays the agent's email", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
    expect(screen.getByText("john@example.com")).toBeTruthy();
  });

  it("displays the agent's phone number", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
    expect(screen.getByText("+1-800-000-0000")).toBeTruthy();
  });

  // ── Language switching ─────────────────────────────────────────────────────

  it("displays Arabic agent name when language is 'ar'", () => {
    render(<Agent agent={baseAgent} platform="mobile" language="ar" />);
    expect(screen.getByText("جون سميث")).toBeTruthy();
  });

  it("displays Arabic title when language is 'ar'", () => {
    render(<Agent agent={baseAgent} platform="mobile" language="ar" />);
    expect(screen.getByText("وكيل العميل")).toBeTruthy();
  });

  it("defaults to English when language prop is omitted", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  // ── Platform layout ────────────────────────────────────────────────────────

  it("does not crash when platform is 'web' (shared component is cross-platform)", () => {
    render(<Agent agent={baseAgent} platform="web" />);
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  // ── Avatar rendering ──────────────────────────────────────────────────────

  it("renders without error when agent has an image URL", () => {
    const agentWithImage = {
      ...baseAgent,
      image: "https://example.com/avatar.jpg",
    };
    render(<Agent agent={agentWithImage} platform="mobile" />);
    // Avatar renders without throwing; verify other content is intact
    expect(screen.getByText("john@example.com")).toBeTruthy();
  });

  it("renders without error when no image is provided (uses fallback)", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
    expect(screen.getByText("+1-800-000-0000")).toBeTruthy();
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  it("uses default title when title prop is omitted", () => {
    render(<Agent agent={baseAgent} platform="mobile" />);
    expect(screen.getByText("Customer Agent")).toBeTruthy();
  });

  it("uses default platform='web' when platform prop is omitted", () => {
    render(<Agent agent={baseAgent} />);
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  it("does not throw when Arabic name is an empty string", () => {
    const agentNoAr = { ...baseAgent, name_ar: "" };
    expect(() =>
      render(<Agent agent={agentNoAr} platform="mobile" language="ar" />)
    ).not.toThrow();
  });
});
