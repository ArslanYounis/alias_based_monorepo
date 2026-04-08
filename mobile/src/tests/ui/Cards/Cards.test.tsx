/**
 * Tests for the mobile platform Cards component.
 *
 * PaymentCard, Avatar, ProfileIconStatus, Container, and Text are mocked to
 * cut deep dependency chains. All major branches are covered: image-row,
 * hybrid, multi-row, default (with and without imageURL), all type values,
 * onCardClick, and Arabic language rendering.
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

import { Cards } from "@platform/Cards/Cards";

const baseProps = {
  action: "Review Application",
  action_ar: "مراجعة الطلب",
  stepName: "Step 1",
  stepName_ar: "الخطوة 1",
};

describe("Cards (mobile/src/ui/Cards/Cards.tsx)", () => {
  // ── version="image-row" ───────────────────────────────────────────────────

  describe('version="image-row"', () => {
    it("renders without crashing", () => {
      render(<Cards {...baseProps} version="image-row" />);
    });

    it("renders action text in the text section", () => {
      render(<Cards {...baseProps} version="image-row" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("renders stepName text in the text section", () => {
      render(<Cards {...baseProps} version="image-row" />);
      expect(screen.getByText("Step 1")).toBeTruthy();
    });

    it("renders Arabic action when language='ar'", () => {
      render(<Cards {...baseProps} version="image-row" language="ar" />);
      expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
    });

    it("renders Arabic stepName when language='ar'", () => {
      render(
        <Cards {...baseProps} version="image-row" language="ar" />
      );
      expect(screen.getByText("الخطوة 1")).toBeTruthy();
    });

    it("calls onCardClick when pressed", () => {
      const onCardClick = jest.fn();
      render(
        <Cards {...baseProps} version="image-row" onCardClick={onCardClick} />
      );
      // The outer Container gets onClick; fire press on any pressable ancestor
      const touchables = screen.UNSAFE_getAllByType(
        require("react-native").TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(onCardClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── version="hybrid" ─────────────────────────────────────────────────────

  describe('version="hybrid"', () => {
    it("renders PaymentCard", () => {
      render(<Cards {...baseProps} version="hybrid" />);
      expect(screen.getByTestId("payment-card")).toBeTruthy();
    });

    it("does not render ProfileIconStatus or Avatar directly", () => {
      render(<Cards {...baseProps} version="hybrid" />);
      expect(screen.queryByTestId("profile-pending")).toBeNull();
      expect(screen.queryByTestId("avatar")).toBeNull();
    });
  });

  // ── version="multi-row" ───────────────────────────────────────────────────

  describe('version="multi-row"', () => {
    it("renders PaymentCard", () => {
      render(<Cards {...baseProps} version="multi-row" />);
      expect(screen.getByTestId("payment-card")).toBeTruthy();
    });

    it("does not render ProfileIconStatus or Avatar directly", () => {
      render(<Cards {...baseProps} version="multi-row" />);
      expect(screen.queryByTestId("profile-pending")).toBeNull();
      expect(screen.queryByTestId("avatar")).toBeNull();
    });
  });

  // ── default version (no imageURL) ─────────────────────────────────────────

  describe("default version without imageURL", () => {
    it("renders ProfileIconStatus when no imageURL provided", () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("renders action text", () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("renders stepName text", () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.getByText("Step 1")).toBeTruthy();
    });
  });

  // ── default version (with imageURL) ──────────────────────────────────────

  describe("default version with imageURL", () => {
    it("renders Avatar when imageURL is provided", () => {
      render(<Cards {...baseProps} imageURL="https://example.com/img.jpg" />);
      expect(screen.getByTestId("avatar")).toBeTruthy();
    });

    it("does not render ProfileIconStatus when imageURL is provided", () => {
      render(<Cards {...baseProps} imageURL="https://example.com/img.jpg" />);
      expect(screen.queryByTestId("profile-pending")).toBeNull();
    });
  });

  // ── type / getStateStyles ─────────────────────────────────────────────────

  describe("type values — getStateStyles coverage", () => {
    it('renders without crash for type="pending"', () => {
      render(<Cards {...baseProps} type="pending" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it('renders without crash for type="failed"', () => {
      render(<Cards {...baseProps} type="failed" />);
      expect(screen.getByTestId("profile-failed")).toBeTruthy();
    });

    it('renders without crash for type="success"', () => {
      render(<Cards {...baseProps} type="success" />);
      expect(screen.getByTestId("profile-complete")).toBeTruthy();
    });

    it('renders without crash for type="action"', () => {
      render(<Cards {...baseProps} type="action" />);
      expect(screen.getByTestId("profile-inProgress")).toBeTruthy();
    });

    it('renders without crash for type="action-other"', () => {
      render(<Cards {...baseProps} type="action-other" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("renders without crash for unknown/default type", () => {
      render(<Cards {...baseProps} type="unknown-type" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });
  });

  // ── onCardClick ───────────────────────────────────────────────────────────

  describe("onCardClick", () => {
    it("calls onCardClick when default card is pressed", () => {
      const onCardClick = jest.fn();
      render(<Cards {...baseProps} onCardClick={onCardClick} />);
      const touchables = screen.UNSAFE_getAllByType(
        require("react-native").TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(onCardClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── Arabic language rendering ─────────────────────────────────────────────

  describe("language='ar'", () => {
    it("shows Arabic action text", () => {
      render(<Cards {...baseProps} language="ar" />);
      expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
    });

    it("shows Arabic stepName text", () => {
      render(<Cards {...baseProps} language="ar" />);
      expect(screen.getByText("الخطوة 1")).toBeTruthy();
    });

    it("falls back to English when Arabic is not provided", () => {
      render(
        <Cards
          action="English Action"
          stepName="English Step"
          language="ar"
        />
      );
      expect(screen.getByText("English Action")).toBeTruthy();
    });
  });

  // ── Default prop values ───────────────────────────────────────────────────

  it("renders with minimal required props", () => {
    render(<Cards action="Minimal Action" />);
    expect(screen.getByText("Minimal Action")).toBeTruthy();
  });
});
