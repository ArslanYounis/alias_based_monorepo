/**
 * Tests for the shared Cards component (shared/components/Cards/Cards.tsx).
 *
 * This is the shared default-export version of the status card. PaymentCard,
 * Avatar, ProfileIconStatus, Container, and Text are mocked. All major
 * branches are covered: image-row, hybrid, multi-row, default (with/without
 * imageURL), all type values, onCardClick, and Arabic language.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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

// ── Mock PaymentCard ──────────────────────────────────────────────────────
jest.mock("@platform/PaymentCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    PaymentCard: (props: any) =>
      React.createElement(View, { testID: "payment-card" }),
  };
});

// ── Mock Avatar ───────────────────────────────────────────────────────────
jest.mock("@platform/Avatar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Avatar: () => React.createElement(View, { testID: "avatar" }),
  };
});

// ── Mock ProfileIconStatus ────────────────────────────────────────────────
jest.mock("@platform/ProfileIconStatus", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ProfileIconStatus: ({ status }: any) =>
      React.createElement(View, { testID: `profile-${status}` }),
  };
});

// ── Mock Container ────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, TouchableOpacity } = require("react-native");
  return {
    Container: ({ children, onClick, style, ...p }: any) =>
      React.createElement(
        onClick ? TouchableOpacity : View,
        { onPress: onClick, style, ...p },
        children
      ),
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

import Cards from "@shared/components/Cards/Cards";

const baseProps = {
  action: "Review Application",
  action_ar: "مراجعة الطلب",
  stepName: "Step 1",
  stepName_ar: "الخطوة 1",
};

describe("shared Cards (shared/components/Cards/Cards.tsx)", () => {
  // ── Smoke tests ───────────────────────────────────────────────────────────

  it("renders without crashing with minimal props", () => {
    render(<Cards action="Test Action" />);
  });

  it("renders action text by default", () => {
    render(<Cards {...baseProps} />);
    expect(screen.getByText("Review Application")).toBeTruthy();
  });

  // ── version="image-row" ───────────────────────────────────────────────────

  describe('version="image-row"', () => {
    it("renders without crashing", () => {
      render(<Cards {...baseProps} version="image-row" />);
    });

    it("renders action text", () => {
      render(<Cards {...baseProps} version="image-row" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("renders stepName text", () => {
      render(<Cards {...baseProps} version="image-row" />);
      expect(screen.getByText("Step 1")).toBeTruthy();
    });

    it("renders Arabic texts when language='ar'", () => {
      render(<Cards {...baseProps} version="image-row" language="ar" />);
      expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
      expect(screen.getByText("الخطوة 1")).toBeTruthy();
    });
  });

  // ── version="hybrid" ─────────────────────────────────────────────────────

  describe('version="hybrid"', () => {
    it("renders PaymentCard", () => {
      render(<Cards {...baseProps} version="hybrid" />);
      expect(screen.getByTestId("payment-card")).toBeTruthy();
    });
  });

  // ── version="multi-row" ───────────────────────────────────────────────────

  describe('version="multi-row"', () => {
    it("renders PaymentCard", () => {
      render(<Cards {...baseProps} version="multi-row" />);
      expect(screen.getByTestId("payment-card")).toBeTruthy();
    });
  });

  // ── default version ───────────────────────────────────────────────────────

  describe("default version", () => {
    it("renders ProfileIconStatus when no imageURL", () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("renders Avatar when imageURL is provided", () => {
      render(
        <Cards {...baseProps} imageURL="https://example.com/img.jpg" />
      );
      expect(screen.getByTestId("avatar")).toBeTruthy();
    });

    it("does not render Avatar when imageURL is not provided", () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.queryByTestId("avatar")).toBeNull();
    });

    it("does not render ProfileIconStatus when imageURL is provided", () => {
      render(
        <Cards {...baseProps} imageURL="https://example.com/img.jpg" />
      );
      expect(screen.queryByTestId("profile-pending")).toBeNull();
    });
  });

  // ── type values ───────────────────────────────────────────────────────────

  describe("type values — getStateStyles", () => {
    it('type="pending" → profile-pending', () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it('type="failed" → profile-failed', () => {
      render(<Cards {...baseProps} type="failed" />);
      expect(screen.getByTestId("profile-failed")).toBeTruthy();
    });

    it('type="success" → profile-complete', () => {
      render(<Cards {...baseProps} type="success" />);
      expect(screen.getByTestId("profile-complete")).toBeTruthy();
    });

    it('type="action" → profile-inProgress', () => {
      render(<Cards {...baseProps} type="action" />);
      expect(screen.getByTestId("profile-inProgress")).toBeTruthy();
    });

    it('type="action-other" → profile-pending', () => {
      render(<Cards {...baseProps} type="action-other" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("default/unknown type → profile-pending", () => {
      render(<Cards {...baseProps} type="unknown" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it("handles empty action string gracefully", () => {
    render(<Cards action="" />);
    // Should not throw; renders empty text
  });

  // ── onCardClick ───────────────────────────────────────────────────────────

  it("calls onCardClick when default card is pressed", () => {
    const onCardClick = jest.fn();
    render(<Cards {...baseProps} onCardClick={onCardClick} />);
    const touchables = screen.UNSAFE_getAllByType(
      require("react-native").TouchableOpacity
    );
    fireEvent.press(touchables[0]);
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });

  // ── Arabic language rendering ─────────────────────────────────────────────

  describe("language='ar'", () => {
    it("shows Arabic action text in default view", () => {
      render(<Cards {...baseProps} language="ar" />);
      expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
    });

    it("shows Arabic stepName text in default view", () => {
      render(<Cards {...baseProps} language="ar" />);
      expect(screen.getByText("الخطوة 1")).toBeTruthy();
    });

    it("falls back to English when Arabic text not provided", () => {
      render(
        <Cards action="English Only" stepName="Step" language="ar" />
      );
      expect(screen.getByText("English Only")).toBeTruthy();
    });
  });
});
