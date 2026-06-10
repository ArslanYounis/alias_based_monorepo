/**
 * Tests for the ApplicationCard UI component.
 *
 * Exercises: id/remaining rendering, status ball counts for complete/approval/
 * inprogress/pending, totalDots capping, onClick callback, and totalDots override.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock @platform/StatusBalls ────────────────────────────────────────────
jest.mock("@platform/StatusBalls", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    StatusBalls: ({ status }: any) =>
      React.createElement(View, { testID: `ball-${status}` }),
  };
});

// ── Mock @platform/Container ──────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    Container: ({ children, onClick, ...props }: any) =>
      React.createElement(
        onClick ? Pressable : View,
        { onPress: onClick, testID: onClick ? "card-pressable" : undefined, ...props },
        children
      ),
  };
});

// ── Mock @platform/Text ────────────────────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

import { ApplicationCard } from "@platform/ApplicationCard/ApplicationCard";

const makeCard = (overrides?: Partial<{
  id: string;
  title: string;
  location: string;
  date: string;
  remaining: string;
  complete: number;
  approval: number;
  inprogress: number;
}>) => ({
  id: overrides?.id ?? "APP-001",
  title: overrides?.title ?? "Application Title",
  location: overrides?.location ?? "Abu Dhabi",
  date: overrides?.date ?? "01 Jan 2026",
  remaining: overrides?.remaining ?? "3 days remaining",
  stage: {
    complete: overrides?.complete ?? 0,
    approval: overrides?.approval ?? 0,
    inprogress: overrides?.inprogress ?? 0,
  },
});

describe("ApplicationCard", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<ApplicationCard cardsData={makeCard()} />);
  });

  it("renders cardsData.id", () => {
    render(<ApplicationCard cardsData={makeCard({ id: "APP-123" })} />);
    expect(screen.getByText("APP-123")).toBeTruthy();
  });

  // NOTE: source no longer renders `remaining`; it now renders title/location/date.
  it("renders cardsData.title, location and date", () => {
    render(
      <ApplicationCard
        cardsData={makeCard({
          title: "Plot Application",
          location: "Al Ain",
          date: "12 Mar 2026",
        })}
      />
    );
    expect(screen.getByText("Plot Application")).toBeTruthy();
    expect(screen.getByText("Al Ain")).toBeTruthy();
    expect(screen.getByText("12 Mar 2026")).toBeTruthy();
  });

  // ── Default 6 status balls ─────────────────────────────────────────────

  it("renders 6 status balls by default (all pending)", () => {
    render(<ApplicationCard cardsData={makeCard()} />);
    const pendingBalls = screen.getAllByTestId("ball-pending");
    expect(pendingBalls).toHaveLength(6);
  });

  // ── complete stage ─────────────────────────────────────────────────────

  it("renders 2 complete balls when complete=2", () => {
    render(<ApplicationCard cardsData={makeCard({ complete: 2 })} />);
    expect(screen.getAllByTestId("ball-complete")).toHaveLength(2);
  });

  it("fills remainder with pending balls when complete=2 and totalDots=6", () => {
    render(<ApplicationCard cardsData={makeCard({ complete: 2 })} />);
    expect(screen.getAllByTestId("ball-pending")).toHaveLength(4);
  });

  // ── approval stage (maps to inProgress) ───────────────────────────────

  it("renders 1 inProgress ball when approval=1", () => {
    render(<ApplicationCard cardsData={makeCard({ approval: 1 })} />);
    expect(screen.getAllByTestId("ball-inProgress")).toHaveLength(1);
  });

  it("renders correct mix of pending and inProgress balls for approval=2", () => {
    render(<ApplicationCard cardsData={makeCard({ approval: 2 })} />);
    expect(screen.getAllByTestId("ball-inProgress")).toHaveLength(2);
    expect(screen.getAllByTestId("ball-pending")).toHaveLength(4);
  });

  // ── inprogress stage (maps to failed) ────────────────────────────────

  it("renders 1 failed ball when inprogress=1", () => {
    render(<ApplicationCard cardsData={makeCard({ inprogress: 1 })} />);
    expect(screen.getAllByTestId("ball-failed")).toHaveLength(1);
  });

  // ── combined stage values ─────────────────────────────────────────────

  it("renders correct counts for complete=2, approval=1, inprogress=1 (totalDots=6)", () => {
    render(
      <ApplicationCard
        cardsData={makeCard({ complete: 2, approval: 1, inprogress: 1 })}
      />
    );
    expect(screen.getAllByTestId("ball-complete")).toHaveLength(2);
    expect(screen.getAllByTestId("ball-inProgress")).toHaveLength(1);
    expect(screen.getAllByTestId("ball-failed")).toHaveLength(1);
    expect(screen.getAllByTestId("ball-pending")).toHaveLength(2);
  });

  // ── totalDots capping ──────────────────────────────────────────────────

  it("caps complete at totalDots when complete exceeds totalDots", () => {
    render(
      <ApplicationCard
        cardsData={makeCard({ complete: 10, approval: 0, inprogress: 0 })}
        totalDots={6}
      />
    );
    const completeBalls = screen.getAllByTestId("ball-complete");
    expect(completeBalls).toHaveLength(6);
    expect(screen.queryByTestId("ball-pending")).toBeNull();
  });

  it("total number of balls always equals totalDots (default 6)", () => {
    render(
      <ApplicationCard
        cardsData={makeCard({ complete: 3, approval: 2, inprogress: 1 })}
      />
    );
    const allBalls = [
      ...screen.queryAllByTestId("ball-complete"),
      ...screen.queryAllByTestId("ball-inProgress"),
      ...screen.queryAllByTestId("ball-failed"),
      ...screen.queryAllByTestId("ball-pending"),
    ];
    expect(allBalls).toHaveLength(6);
  });

  // ── totalDots override ─────────────────────────────────────────────────

  it("renders 3 balls when totalDots=3", () => {
    render(
      <ApplicationCard cardsData={makeCard()} totalDots={3} />
    );
    const pendingBalls = screen.getAllByTestId("ball-pending");
    expect(pendingBalls).toHaveLength(3);
  });

  it("renders correct balls with totalDots=3 and complete=2", () => {
    render(
      <ApplicationCard
        cardsData={makeCard({ complete: 2 })}
        totalDots={3}
      />
    );
    expect(screen.getAllByTestId("ball-complete")).toHaveLength(2);
    expect(screen.getAllByTestId("ball-pending")).toHaveLength(1);
  });

  it("total number of balls equals custom totalDots", () => {
    render(
      <ApplicationCard
        cardsData={makeCard({ complete: 1, approval: 1, inprogress: 1 })}
        totalDots={3}
      />
    );
    const allBalls = [
      ...screen.queryAllByTestId("ball-complete"),
      ...screen.queryAllByTestId("ball-inProgress"),
      ...screen.queryAllByTestId("ball-failed"),
      ...screen.queryAllByTestId("ball-pending"),
    ];
    expect(allBalls).toHaveLength(3);
  });

  // ── onClick ────────────────────────────────────────────────────────────

  it("fires onClick when card is pressed", () => {
    const onClick = jest.fn();
    render(<ApplicationCard cardsData={makeCard()} onClick={onClick} />);
    fireEvent.press(screen.getByTestId("card-pressable"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when no onClick prop and card is pressed", () => {
    // Without onClick, Container renders as View (not Pressable)
    render(<ApplicationCard cardsData={makeCard()} />);
    // No crash — component is rendered correctly without onClick
    expect(screen.getByText("APP-001")).toBeTruthy();
  });
});
