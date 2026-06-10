import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentCard } from "@platform/PaymentCard";

// The current PaymentCard renders raw <div> elements (no @platform/Container /
// @platform/Text). It composes Avatar, ProfileIconStatus, ProcessStatusRows and
// SharedLanguageSwitchRenderer. We mock the leaf sub-components and assert on the
// real DOM output (root div = the rendered card).

vi.mock("@platform/Avatar", () => ({
  Avatar: ({ imageUrl }: { imageUrl?: string; avatarSize?: number }) => (
    <img data-testid="avatar" src={imageUrl} alt="avatar" />
  ),
}));

vi.mock("@platform/ProfileIconStatus", () => ({
  ProfileIconStatus: ({
    status,
    width,
    height,
  }: {
    status?: string;
    width?: number;
    height?: number;
  }) => (
    <div
      data-testid="profile-icon-status"
      data-status={status}
      style={{ width, height }}
    />
  ),
}));

vi.mock("@shared/components/ProcessStatusRows", () => ({
  default: ({
    totalSteps,
    completedSteps,
    currentStepStatus,
  }: {
    totalSteps: number;
    completedSteps: number;
    currentStepStatus?: string;
  }) => (
    <div
      data-testid="process-status-rows"
      data-total={totalSteps}
      data-completed={completedSteps}
      data-current-status={currentStepStatus}
    />
  ),
}));

// PaymentCard imports SharedLanguageSwitchRenderer from "@/components/shared/...".
// Mock that exact path so it renders plain language-switched text.
vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
  default: ({
    value,
    value_ar,
    language,
  }: {
    value?: string;
    value_ar?: string;
    language?: string;
  }) => <>{language === "ar" ? value_ar ?? value : value}</>,
}));

describe("PaymentCard (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = {
    type: "pending" as const,
    action: "Pending Approval",
    action_ar: "في انتظار الموافقة",
    stepName: "Review Step",
    stepName_ar: "خطوة المراجعة",
    userName: "John Doe",
    userName_ar: "جون دو",
    role: "Manager",
    role_ar: "مدير",
    language: "en" as const,
    imageURL: "https://example.com/user.jpg",
    currentStep: 2,
    totalSteps: 5,
    completedSteps: 1,
    currentStepStatus: "pending" as const,
  };

  // The component renders a single root <div> as its card. Helper to grab it.
  const getCard = (container: HTMLElement) => container.firstChild as HTMLElement;

  // ── Default multi-row version ─────────────────────────────────────────────

  it("renders without crashing for type=pending multi-row", () => {
    const { container } = render(<PaymentCard {...baseProps} />);
    expect(getCard(container)).toBeInTheDocument();
  });

  it("renders action text in English", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getAllByText("Pending Approval").length).toBeGreaterThan(0);
  });

  it("renders action text in Arabic when language=ar", () => {
    render(<PaymentCard {...baseProps} language="ar" />);
    expect(screen.getAllByText("في انتظار الموافقة").length).toBeGreaterThan(0);
  });

  it("renders user name", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders Arabic user name when language=ar", () => {
    render(<PaymentCard {...baseProps} language="ar" />);
    expect(screen.getByText("جون دو")).toBeInTheDocument();
  });

  it("renders role text", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  it("renders step name", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getAllByText("Review Step").length).toBeGreaterThan(0);
  });

  it("renders avatar", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getByTestId("avatar")).toHaveAttribute(
      "src",
      "https://example.com/user.jpg"
    );
  });

  it("renders ProfileIconStatus", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getByTestId("profile-icon-status")).toBeInTheDocument();
  });

  it("calls onCardClick when card is clicked", () => {
    const onCardClick = vi.fn();
    const { container } = render(
      <PaymentCard {...baseProps} onCardClick={onCardClick} />
    );
    // onClick is wired on the root card div
    fireEvent.click(getCard(container));
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });

  // ── State-based styles ────────────────────────────────────────────────────

  it("applies pending background class for type=pending", () => {
    const { container } = render(<PaymentCard {...baseProps} type="pending" />);
    expect(getCard(container)).toHaveClass("bg-button-primary-disabled");
  });

  it("applies failed background class for type=failed", () => {
    const { container } = render(<PaymentCard {...baseProps} type="failed" />);
    expect(getCard(container)).toHaveClass("bg-status-failed-light");
  });

  it("applies success background class for type=success", () => {
    const { container } = render(<PaymentCard {...baseProps} type="success" />);
    expect(getCard(container)).toHaveClass("bg-status-success-light");
  });

  it("applies action background class for type=action", () => {
    const { container } = render(<PaymentCard {...baseProps} type="action" />);
    expect(getCard(container)).toHaveClass("bg-status-pending-solid");
  });

  it("applies action-other background class for type=action-other", () => {
    const { container } = render(
      <PaymentCard {...baseProps} type="action-other" />
    );
    expect(getCard(container)).toHaveClass("bg-status-pending-light");
  });

  it("defaults to pending-light styles when type is undefined", () => {
    // getStateStyles default branch → bg-status-pending-light
    const { container } = render(<PaymentCard {...baseProps} type={undefined} />);
    expect(getCard(container)).toHaveClass("bg-status-pending-light");
  });

  // ── ProfileIconStatus status values ──────────────────────────────────────

  it("passes 'pending' status to ProfileIconStatus for type=pending", () => {
    render(<PaymentCard {...baseProps} type="pending" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "pending"
    );
  });

  it("passes 'failed' status to ProfileIconStatus for type=failed", () => {
    render(<PaymentCard {...baseProps} type="failed" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "failed"
    );
  });

  it("passes 'complete' status to ProfileIconStatus for type=success", () => {
    render(<PaymentCard {...baseProps} type="success" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "complete"
    );
  });

  it("passes 'inProgress' status to ProfileIconStatus for type=action", () => {
    render(<PaymentCard {...baseProps} type="action" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "inProgress"
    );
  });

  // ── Hybrid version ────────────────────────────────────────────────────────

  it("renders hybrid layout with process status rows for type=pending hybrid", () => {
    render(<PaymentCard {...baseProps} type="pending" version="hybrid" />);
    expect(screen.getByTestId("process-status-rows")).toBeInTheDocument();
  });

  it("renders hybrid layout for type=success with process status rows", () => {
    render(<PaymentCard {...baseProps} type="success" version="hybrid" />);
    expect(screen.getByTestId("process-status-rows")).toBeInTheDocument();
  });

  it("renders full hybrid layout for type=failed", () => {
    render(<PaymentCard {...baseProps} type="failed" version="hybrid" />);
    // Generic hybrid branch shows the "Step X of Y" label
    expect(
      screen.getByText(`Step ${baseProps.currentStep} of ${baseProps.totalSteps}`)
    ).toBeInTheDocument();
  });

  it("renders full hybrid layout for type=action", () => {
    render(<PaymentCard {...baseProps} type="action" version="hybrid" />);
    expect(
      screen.getByText(`Step ${baseProps.currentStep} of ${baseProps.totalSteps}`)
    ).toBeInTheDocument();
  });

  it("renders full hybrid layout for type=action-other", () => {
    render(<PaymentCard {...baseProps} type="action-other" version="hybrid" />);
    expect(
      screen.getByText(`Step ${baseProps.currentStep} of ${baseProps.totalSteps}`)
    ).toBeInTheDocument();
  });

  // ── Default props ─────────────────────────────────────────────────────────

  it("renders with only required type prop", () => {
    const { container } = render(<PaymentCard type="pending" />);
    expect(getCard(container)).toBeInTheDocument();
  });

  // ── RTL direction ─────────────────────────────────────────────────────────

  it("sets dir=rtl on the card when language=ar", () => {
    const { container } = render(<PaymentCard {...baseProps} language="ar" />);
    expect(getCard(container)).toHaveAttribute("dir", "rtl");
  });

  it("sets dir=ltr on the card when language=en", () => {
    const { container } = render(<PaymentCard {...baseProps} language="en" />);
    expect(getCard(container)).toHaveAttribute("dir", "ltr");
  });
});
