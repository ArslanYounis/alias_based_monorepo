/**
 * Tests for the mobile platform PaymentCard component.
 *
 * ProcessStatusRows, Avatar, ProfileIconStatus, Container, and Text are mocked
 * to isolate the component. All 4 rendering branches are covered:
 *   - type="pending" && version="hybrid"
 *   - type="success" && version="hybrid"
 *   - version="hybrid" with other types (two-column layout)
 *   - default "multi-row" layout
 * Also covers all type values, onCardClick, and Arabic language rendering.
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

// ── Mock ProcessStatusRows ────────────────────────────────────────────────
jest.mock("@shared/components/ProcessStatusRows", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () =>
      React.createElement(View, { testID: "process-status-rows" }),
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

import { PaymentCard } from "@platform/PaymentCard/PaymentCard";

const baseProps = {
  action: "Review Application",
  action_ar: "مراجعة الطلب",
  stepName: "Step 1",
  stepName_ar: "الخطوة 1",
  userName: "John Doe",
  userName_ar: "جون دو",
  role: "Owner",
  role_ar: "المالك",
  totalSteps: 3,
  completedSteps: 1,
  currentStep: 1,
};

describe("PaymentCard (mobile/src/ui/PaymentCard/PaymentCard.tsx)", () => {
  // ── type="pending" && version="hybrid" ────────────────────────────────────

  describe('type="pending" version="hybrid"', () => {
    it("renders without crashing", () => {
      render(<PaymentCard {...baseProps} type="pending" version="hybrid" />);
    });

    it("renders ProcessStatusRows", () => {
      render(<PaymentCard {...baseProps} type="pending" version="hybrid" />);
      expect(screen.getByTestId("process-status-rows")).toBeTruthy();
    });

    it("renders action text", () => {
      render(<PaymentCard {...baseProps} type="pending" version="hybrid" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("calls onCardClick when pressed", () => {
      const onCardClick = jest.fn();
      render(
        <PaymentCard
          {...baseProps}
          type="pending"
          version="hybrid"
          onCardClick={onCardClick}
        />
      );
      const touchables = screen.UNSAFE_getAllByType(
        require("react-native").TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(onCardClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── type="success" && version="hybrid" ────────────────────────────────────

  describe('type="success" version="hybrid"', () => {
    it("renders without crashing", () => {
      render(<PaymentCard {...baseProps} type="success" version="hybrid" />);
    });

    it("renders ProcessStatusRows", () => {
      render(<PaymentCard {...baseProps} type="success" version="hybrid" />);
      expect(screen.getByTestId("process-status-rows")).toBeTruthy();
    });

    it("renders action text", () => {
      render(<PaymentCard {...baseProps} type="success" version="hybrid" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("renders Arabic action text when language='ar'", () => {
      render(
        <PaymentCard
          {...baseProps}
          type="success"
          version="hybrid"
          language="ar"
        />
      );
      expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
    });
  });

  // ── version="hybrid" with non-pending/success type (two-column layout) ────

  describe('version="hybrid" with type="action" (two-column layout)', () => {
    it("renders without crashing", () => {
      render(<PaymentCard {...baseProps} type="action" version="hybrid" />);
    });

    it("renders action text", () => {
      render(<PaymentCard {...baseProps} type="action" version="hybrid" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("renders userName text", () => {
      render(<PaymentCard {...baseProps} type="action" version="hybrid" />);
      expect(screen.getByText("John Doe")).toBeTruthy();
    });

    it("renders ProcessStatusRows in the right column", () => {
      render(<PaymentCard {...baseProps} type="action" version="hybrid" />);
      expect(screen.getByTestId("process-status-rows")).toBeTruthy();
    });

    it("renders step info text", () => {
      render(
        <PaymentCard
          {...baseProps}
          type="action"
          version="hybrid"
          currentStep={1}
          totalSteps={3}
        />
      );
      expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    });

    it("renders Arabic step info when language='ar'", () => {
      render(
        <PaymentCard
          {...baseProps}
          type="action"
          version="hybrid"
          language="ar"
          currentStep={1}
          totalSteps={3}
        />
      );
      expect(screen.getByText("الخطوة 1 من 3")).toBeTruthy();
    });

    it("calls onCardClick when pressed", () => {
      const onCardClick = jest.fn();
      render(
        <PaymentCard
          {...baseProps}
          type="action"
          version="hybrid"
          onCardClick={onCardClick}
        />
      );
      const touchables = screen.UNSAFE_getAllByType(
        require("react-native").TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(onCardClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('version="hybrid" with type="failed" (two-column layout)', () => {
    it("renders without crashing", () => {
      render(<PaymentCard {...baseProps} type="failed" version="hybrid" />);
    });

    it("renders ProcessStatusRows", () => {
      render(<PaymentCard {...baseProps} type="failed" version="hybrid" />);
      expect(screen.getByTestId("process-status-rows")).toBeTruthy();
    });
  });

  describe('version="hybrid" with type="action-other" (two-column layout)', () => {
    it("renders without crashing", () => {
      render(
        <PaymentCard {...baseProps} type="action-other" version="hybrid" />
      );
    });

    it("renders action text", () => {
      render(
        <PaymentCard {...baseProps} type="action-other" version="hybrid" />
      );
      expect(screen.getByText("Review Application")).toBeTruthy();
    });
  });

  // ── default "multi-row" layout ────────────────────────────────────────────

  describe('version="multi-row" (default layout)', () => {
    it("renders without crashing", () => {
      render(<PaymentCard {...baseProps} type="pending" />);
    });

    it("renders ProfileIconStatus", () => {
      render(<PaymentCard {...baseProps} type="pending" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("renders action text", () => {
      render(<PaymentCard {...baseProps} type="pending" />);
      expect(screen.getByText("Review Application")).toBeTruthy();
    });

    it("renders stepName text", () => {
      render(<PaymentCard {...baseProps} type="pending" />);
      expect(screen.getByText("Step 1")).toBeTruthy();
    });

    it("renders userName text", () => {
      render(<PaymentCard {...baseProps} type="pending" />);
      expect(screen.getByText("John Doe")).toBeTruthy();
    });

    it("renders role text", () => {
      render(<PaymentCard {...baseProps} type="pending" />);
      expect(screen.getByText("Owner")).toBeTruthy();
    });

    it("renders Avatar (always rendered in multi-row layout)", () => {
      render(
        <PaymentCard
          {...baseProps}
          type="pending"
          imageURL="https://example.com/img.jpg"
        />
      );
      expect(screen.getByTestId("avatar")).toBeTruthy();
    });

    it("calls onCardClick when pressed", () => {
      const onCardClick = jest.fn();
      render(
        <PaymentCard {...baseProps} type="pending" onCardClick={onCardClick} />
      );
      const touchables = screen.UNSAFE_getAllByType(
        require("react-native").TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(onCardClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── All type values ───────────────────────────────────────────────────────

  describe("all type values — getStateStyles coverage", () => {
    it('renders without crash for type="pending"', () => {
      render(<PaymentCard {...baseProps} type="pending" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it('renders without crash for type="failed"', () => {
      render(<PaymentCard {...baseProps} type="failed" />);
      expect(screen.getByTestId("profile-failed")).toBeTruthy();
    });

    it('renders without crash for type="success"', () => {
      render(<PaymentCard {...baseProps} type="success" />);
      expect(screen.getByTestId("profile-complete")).toBeTruthy();
    });

    it('renders without crash for type="action"', () => {
      render(<PaymentCard {...baseProps} type="action" />);
      expect(screen.getByTestId("profile-inProgress")).toBeTruthy();
    });

    it('renders without crash for type="action-other"', () => {
      render(<PaymentCard {...baseProps} type="action-other" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("renders without crash for unknown/default type", () => {
      render(<PaymentCard {...baseProps} type="unknown" />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });

    it("renders without crash when type is undefined (defaults to pending)", () => {
      render(<PaymentCard {...baseProps} />);
      expect(screen.getByTestId("profile-pending")).toBeTruthy();
    });
  });

  // ── Arabic language rendering ─────────────────────────────────────────────

  describe("language='ar'", () => {
    it("shows Arabic action text in multi-row", () => {
      render(<PaymentCard {...baseProps} type="pending" language="ar" />);
      expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
    });

    it("shows Arabic stepName in multi-row", () => {
      render(<PaymentCard {...baseProps} type="pending" language="ar" />);
      expect(screen.getByText("الخطوة 1")).toBeTruthy();
    });

    it("shows Arabic userName in multi-row", () => {
      render(<PaymentCard {...baseProps} type="pending" language="ar" />);
      expect(screen.getByText("جون دو")).toBeTruthy();
    });

    it("shows Arabic role in multi-row", () => {
      render(<PaymentCard {...baseProps} type="pending" language="ar" />);
      expect(screen.getByText("المالك")).toBeTruthy();
    });

    it("falls back to English when Arabic text is not provided", () => {
      render(
        <PaymentCard
          action="English Only"
          type="pending"
          language="ar"
        />
      );
      expect(screen.getByText("English Only")).toBeTruthy();
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders with only required action prop", () => {
    render(<PaymentCard action="Minimal" />);
    expect(screen.getByText("Minimal")).toBeTruthy();
  });

  it("uses default currentStep=0 and totalSteps=0 in hybrid layout", () => {
    render(
      <PaymentCard
        action="Action"
        type="action"
        version="hybrid"
        currentStep={0}
        totalSteps={0}
      />
    );
    expect(screen.getByText("Step 0 of 0")).toBeTruthy();
  });
});
