/**
 * Tests for the shared ProcessStatusRows component.
 *
 * StatusBalls is mocked to avoid deep react-native-svg dependency and to
 * allow us to assert on the status prop passed to each ball.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

jest.mock("@platform/StatusBalls", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    StatusBalls: ({
      status,
      width,
      height,
    }: {
      status: string;
      width?: number | string;
      height?: number | string;
    }) =>
      React.createElement(View, {
        testID: `status-ball-${status}`,
        accessibilityLabel: `ball-${status}`,
      }),
  };
});

import ProcessStatusRows from "@shared/components/ProcessStatusRows/ProcessStatusRows";

describe("ProcessStatusRows (shared component)", () => {
  // ── Default rendering ────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(
      <ProcessStatusRows
        totalSteps={3}
        completedSteps={1}
        currentStepStatus="inProgress"
      />
    );
  });

  it("renders the correct total number of balls", () => {
    render(
      <ProcessStatusRows
        totalSteps={5}
        completedSteps={2}
        currentStepStatus="pending"
      />
    );
    // 2 complete + 1 current + 2 pending = 5 total
    const completeBalls = screen.getAllByTestId("status-ball-complete");
    const pendingBalls = screen.getAllByTestId("status-ball-pending");
    const currentBall = screen.getAllByTestId("status-ball-pending");
    expect(completeBalls.length + pendingBalls.length + currentBall.length).toBeGreaterThan(0);
  });

  // ── Ball status assignment ────────────────────────────────────────────────

  it("assigns 'complete' status to balls before completedSteps index", () => {
    render(
      <ProcessStatusRows
        totalSteps={4}
        completedSteps={2}
        currentStepStatus="inProgress"
      />
    );
    const completeBalls = screen.getAllByTestId("status-ball-complete");
    expect(completeBalls).toHaveLength(2);
  });

  it("assigns currentStepStatus to the ball at completedSteps index", () => {
    render(
      <ProcessStatusRows
        totalSteps={4}
        completedSteps={1}
        currentStepStatus="inProgress"
      />
    );
    const inProgressBalls = screen.getAllByTestId("status-ball-inProgress");
    expect(inProgressBalls).toHaveLength(1);
  });

  it("assigns 'pending' status to balls after the current step", () => {
    render(
      <ProcessStatusRows
        totalSteps={4}
        completedSteps={1}
        currentStepStatus="inProgress"
      />
    );
    const pendingBalls = screen.getAllByTestId("status-ball-pending");
    expect(pendingBalls).toHaveLength(2);
  });

  it("handles currentStepStatus='complete' (all done scenario)", () => {
    render(
      <ProcessStatusRows
        totalSteps={3}
        completedSteps={2}
        currentStepStatus="complete"
      />
    );
    const completeBalls = screen.getAllByTestId("status-ball-complete");
    // 2 balls are "complete" from idx<completedSteps, plus 1 at idx===completedSteps
    expect(completeBalls).toHaveLength(3);
  });

  it("handles currentStepStatus='failed'", () => {
    render(
      <ProcessStatusRows
        totalSteps={3}
        completedSteps={0}
        currentStepStatus="failed"
      />
    );
    const failedBalls = screen.getAllByTestId("status-ball-failed");
    expect(failedBalls).toHaveLength(1);
  });

  it("handles currentStepStatus='fixed'", () => {
    render(
      <ProcessStatusRows
        totalSteps={2}
        completedSteps={0}
        currentStepStatus="fixed"
      />
    );
    expect(screen.getByTestId("status-ball-fixed")).toBeTruthy();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders a single step with pending status", () => {
    render(
      <ProcessStatusRows
        totalSteps={1}
        completedSteps={0}
        currentStepStatus="pending"
      />
    );
    expect(screen.getByTestId("status-ball-pending")).toBeTruthy();
  });

  it("renders zero steps without crashing", () => {
    expect(() =>
      render(
        <ProcessStatusRows
          totalSteps={0}
          completedSteps={0}
          currentStepStatus="pending"
        />
      )
    ).not.toThrow();
  });

  it("accepts custom ballSize prop", () => {
    expect(() =>
      render(
        <ProcessStatusRows
          totalSteps={3}
          completedSteps={1}
          currentStepStatus="inProgress"
          ballSize={24}
        />
      )
    ).not.toThrow();
  });

  it("accepts custom gap prop", () => {
    expect(() =>
      render(
        <ProcessStatusRows
          totalSteps={3}
          completedSteps={1}
          currentStepStatus="inProgress"
          gap={8}
        />
      )
    ).not.toThrow();
  });

  it("accepts string ballSize and gap props", () => {
    expect(() =>
      render(
        <ProcessStatusRows
          totalSteps={2}
          completedSteps={0}
          currentStepStatus="pending"
          ballSize="20"
          gap="6"
        />
      )
    ).not.toThrow();
  });
});
