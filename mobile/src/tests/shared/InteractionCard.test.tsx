/**
 * Tests for the shared InteractionCard component.
 *
 * CardTitle and icon components are mocked to cut the deep dependency chain.
 * ProcessStatusRows is also mocked because it renders StatusBalls.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mock CardTitle ─────────────────────────────────────────────────────────
jest.mock("@shared/components/CardTitle/CardTitle", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title, title_ar, language }: { title: string; title_ar: string; language?: string }) =>
      React.createElement(Text, { testID: "card-title" }, language === "ar" ? title_ar : title),
  };
});

// ── Mock ProcessStatusRows ─────────────────────────────────────────────────
jest.mock("@shared/components/ProcessStatusRows/ProcessStatusRows", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "process-status-rows" }),
  };
});

// ── Mock icons ─────────────────────────────────────────────────────────────
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CheckIcon: () => React.createElement(View, { testID: "check-icon" }),
    SendIcon: () => React.createElement(View, { testID: "send-icon" }),
  };
});

import InteractionCard from "@shared/components/InteractionCard/InteractionCard";
import type { WfiStep } from "@shared/components/InteractionCard/InteractionCard";

const completedStep: WfiStep = {
  isCompleted: true,
  title: "Application Submitted",
  title_ar: "تقديم الطلب",
  completedByCustomerNameE: "John Doe",
  completedByCustomerNameA: "جون دو",
  completeDate: "2024-01-15",
  comments: "All documents submitted",
};

const pendingStep: WfiStep = {
  isCompleted: false,
  title: "Review",
  title_ar: "مراجعة",
};

describe("InteractionCard (shared component)", () => {
  // ── Default rendering ─────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<InteractionCard />);
  });

  it("renders the Interaction History card title", () => {
    render(<InteractionCard />);
    expect(screen.getByTestId("card-title")).toBeTruthy();
    expect(screen.getByText("Interaction History")).toBeTruthy();
  });

  it("renders Arabic card title when language is 'ar'", () => {
    render(<InteractionCard language="ar" />);
    expect(screen.getByText("سجل التفاعلات")).toBeTruthy();
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it("renders 'No interaction history available.' when wfiStepList is empty", () => {
    render(<InteractionCard wfiStepList={[]} />);
    expect(screen.getByText("No interaction history available.")).toBeTruthy();
  });

  it("renders Arabic empty state when language is 'ar' and list is empty", () => {
    render(<InteractionCard wfiStepList={[]} language="ar" />);
    expect(screen.getByText("لا يوجد سجل تفاعلات.")).toBeTruthy();
  });

  // ── Steps rendering ───────────────────────────────────────────────────────

  it("renders step titles when wfiStepList is provided", () => {
    render(<InteractionCard wfiStepList={[pendingStep]} />);
    expect(screen.getByText("Review")).toBeTruthy();
  });

  it("renders Arabic step title when language is 'ar'", () => {
    render(<InteractionCard wfiStepList={[pendingStep]} language="ar" />);
    expect(screen.getByText("مراجعة")).toBeTruthy();
  });

  it("renders the CheckIcon for completed steps", () => {
    render(<InteractionCard wfiStepList={[completedStep]} />);
    expect(screen.getByTestId("check-icon")).toBeTruthy();
  });

  it("renders the SendIcon for pending/in-progress steps", () => {
    render(<InteractionCard wfiStepList={[pendingStep]} />);
    expect(screen.getByTestId("send-icon")).toBeTruthy();
  });

  it("renders 'Completed' badge for completed steps (English)", () => {
    render(<InteractionCard wfiStepList={[completedStep]} language="en" />);
    expect(screen.getByText("Completed")).toBeTruthy();
  });

  it("renders 'مكتمل' badge for completed steps (Arabic)", () => {
    render(<InteractionCard wfiStepList={[completedStep]} language="ar" />);
    expect(screen.getByText("مكتمل")).toBeTruthy();
  });

  it("renders ProcessStatusRows for non-completed steps", () => {
    render(<InteractionCard wfiStepList={[pendingStep]} />);
    expect(screen.getByTestId("process-status-rows")).toBeTruthy();
  });

  // ── Standard toggleType ────────────────────────────────────────────────────

  it("renders 'By' label in Standard mode when completedByCustomerNameE is provided", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="en"
      />
    );
    expect(screen.getByText("By")).toBeTruthy();
  });

  it("renders 'بواسطة' label in Standard mode with Arabic language", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="ar"
      />
    );
    expect(screen.getByText("بواسطة")).toBeTruthy();
  });

  it("renders completedByCustomerNameE in Standard mode", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="en"
      />
    );
    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("renders Arabic name in Standard mode when language is 'ar'", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="ar"
      />
    );
    expect(screen.getByText("جون دو")).toBeTruthy();
  });

  it("renders 'Date' label in Standard mode when completeDate is provided", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="en"
      />
    );
    expect(screen.getByText("Date")).toBeTruthy();
  });

  it("renders 'التاريخ' in Standard mode with Arabic language", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="ar"
      />
    );
    expect(screen.getByText("التاريخ")).toBeTruthy();
  });

  it("renders completeDate in Standard mode", () => {
    render(
      <InteractionCard wfiStepList={[completedStep]} toggleType="Standard" />
    );
    expect(screen.getByText("2024-01-15")).toBeTruthy();
  });

  it("renders comments with 'Remark' label when present", () => {
    render(
      <InteractionCard wfiStepList={[completedStep]} toggleType="Standard" />
    );
    expect(screen.getByText("Remark")).toBeTruthy();
    expect(screen.getByText("All documents submitted")).toBeTruthy();
  });

  it("renders 'ملاحظة' remark label in Arabic", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="ar"
      />
    );
    expect(screen.getByText("ملاحظة")).toBeTruthy();
  });

  it("does not render 'By' section in Standard mode when completedByCustomerNameE is absent", () => {
    const stepWithoutBy: WfiStep = {
      isCompleted: true,
      title: "Review",
      title_ar: "مراجعة",
    };
    render(
      <InteractionCard wfiStepList={[stepWithoutBy]} toggleType="Standard" />
    );
    expect(screen.queryByText("By")).toBeNull();
  });

  it("does not render Standard details in Compact mode", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Compact"
        language="en"
      />
    );
    expect(screen.queryByText("By")).toBeNull();
  });

  // ── Platform layout ───────────────────────────────────────────────────────

  it("renders correctly on mobile platform", () => {
    render(
      <InteractionCard wfiStepList={[pendingStep]} platform="mobile" />
    );
    expect(screen.getByText("Review")).toBeTruthy();
  });

  it("renders correctly on web platform", () => {
    render(
      <InteractionCard wfiStepList={[pendingStep]} platform="web" />
    );
    expect(screen.getByText("Review")).toBeTruthy();
  });

  // ── Multiple steps ────────────────────────────────────────────────────────

  it("renders multiple steps", () => {
    render(
      <InteractionCard wfiStepList={[completedStep, pendingStep]} />
    );
    expect(screen.getByText("Application Submitted")).toBeTruthy();
    expect(screen.getByText("Review")).toBeTruthy();
  });
});
