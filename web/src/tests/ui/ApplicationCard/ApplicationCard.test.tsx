import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ApplicationCard } from "@platform/ApplicationCard";

vi.mock("@platform/Container", () => ({
  Container: ({
    children,
    className,
    style,
  }: {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div className={className} style={style} data-testid="container">
      {children}
    </div>
  ),
}));

vi.mock("@platform/Text", () => ({
  Text: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => (
    <span className={className} data-testid="text">
      {children}
    </span>
  ),
}));

vi.mock("@platform/StatusBalls", () => ({
  StatusBalls: ({
    status,
    width,
    height,
  }: {
    status: string;
    width?: number;
    height?: number;
  }) => (
    <span
      data-testid="status-ball"
      data-status={status}
      style={{ width, height }}
    />
  ),
}));

const makeCardsData = (
  overrides: Partial<{
    id: string;
    title: string;
    location: string;
    date: string;
    stage: { complete: number; approval: number; inprogress: number };
    remaining: string;
  }> = {},
) => ({
  id: "APP-001",
  title: "Building Permit",
  location: "Riyadh",
  date: "2025-01-15",
  stage: { complete: 2, approval: 1, inprogress: 1 },
  remaining: "3 days",
  ...overrides,
});

describe("ApplicationCard", () => {
  // -- Text content rendering -------------------------------------------------

  it("renders title, id, location, date, and remaining text", () => {
    render(<ApplicationCard cardsData={makeCardsData()} />);
    expect(screen.getByText("Building Permit")).toBeInTheDocument();
    expect(screen.getByText("APP-001")).toBeInTheDocument();
    expect(screen.getByText("Riyadh")).toBeInTheDocument();
    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
    expect(screen.getByText("3 days")).toBeInTheDocument();
  });

  // -- StatusBalls count ------------------------------------------------------

  it("renders exactly totalDots status balls (default 6)", () => {
    render(<ApplicationCard cardsData={makeCardsData()} />);
    const balls = screen.getAllByTestId("status-ball");
    expect(balls).toHaveLength(6);
  });

  it("renders correct number of status balls with custom totalDots", () => {
    render(<ApplicationCard cardsData={makeCardsData()} totalDots={10} />);
    const balls = screen.getAllByTestId("status-ball");
    expect(balls).toHaveLength(10);
  });

  // -- Stage value clamping ---------------------------------------------------

  it("clamps stage values that overflow totalDots", () => {
    const cardsData = makeCardsData({
      stage: { complete: 5, approval: 5, inprogress: 5 },
    });
    render(<ApplicationCard cardsData={cardsData} totalDots={6} />);
    const balls = screen.getAllByTestId("status-ball");
    expect(balls).toHaveLength(6);
  });

  // -- All zeros => all pending -----------------------------------------------

  it("renders all pending balls when stage values are all zero", () => {
    const cardsData = makeCardsData({
      stage: { complete: 0, approval: 0, inprogress: 0 },
    });
    render(<ApplicationCard cardsData={cardsData} totalDots={6} />);
    const balls = screen.getAllByTestId("status-ball");
    expect(balls).toHaveLength(6);
    balls.forEach((ball) => {
      expect(ball).toHaveAttribute("data-status", "pending");
    });
  });

  // -- Correct fill order: complete, approval (inProgress), inprogress (failed), pending

  it("fills status balls in correct order: complete, inProgress, failed, pending", () => {
    const cardsData = makeCardsData({
      stage: { complete: 2, approval: 1, inprogress: 1 },
    });
    render(<ApplicationCard cardsData={cardsData} totalDots={6} />);
    const balls = screen.getAllByTestId("status-ball");

    // 2 complete
    expect(balls[0]).toHaveAttribute("data-status", "complete");
    expect(balls[1]).toHaveAttribute("data-status", "complete");
    // 1 approval => mapped to "inProgress"
    expect(balls[2]).toHaveAttribute("data-status", "inProgress");
    // 1 inprogress => mapped to "failed"
    expect(balls[3]).toHaveAttribute("data-status", "failed");
    // 2 remaining => pending
    expect(balls[4]).toHaveAttribute("data-status", "pending");
    expect(balls[5]).toHaveAttribute("data-status", "pending");
  });

  it("fills all dots as complete when complete equals totalDots", () => {
    const cardsData = makeCardsData({
      stage: { complete: 6, approval: 0, inprogress: 0 },
    });
    render(<ApplicationCard cardsData={cardsData} totalDots={6} />);
    const balls = screen.getAllByTestId("status-ball");
    balls.forEach((ball) => {
      expect(ball).toHaveAttribute("data-status", "complete");
    });
  });

  it("clamps approval after complete is filled", () => {
    const cardsData = makeCardsData({
      stage: { complete: 4, approval: 5, inprogress: 5 },
    });
    render(<ApplicationCard cardsData={cardsData} totalDots={6} />);
    const balls = screen.getAllByTestId("status-ball");
    expect(balls).toHaveLength(6);

    // 4 complete
    for (let i = 0; i < 4; i++) {
      expect(balls[i]).toHaveAttribute("data-status", "complete");
    }
    // Only 2 remaining slots, approval clamped to 2
    expect(balls[4]).toHaveAttribute("data-status", "inProgress");
    expect(balls[5]).toHaveAttribute("data-status", "inProgress");
  });

  it("renders without crashing", () => {
    const { container } = render(
      <ApplicationCard cardsData={makeCardsData()} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
