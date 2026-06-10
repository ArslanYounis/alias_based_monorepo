import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentCard } from "@platform/PaymentCard";

// Mock all platform sub-components used inside PaymentCard
vi.mock("@platform/Text", () => ({
  Text: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
}));

vi.mock("@platform/Avatar", () => ({
  Avatar: ({
    imageUrl,
    avatarSize,
  }: {
    imageUrl?: string;
    avatarSize?: number;
  }) => <img data-testid="avatar" src={imageUrl} alt="avatar" />,
}));

vi.mock("@platform/Container", () => ({
  Container: ({
    children,
    className,
    dir,
    onClick,
    style,
  }: {
    children?: React.ReactNode;
    className?: string;
    dir?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
  }) => (
    <div
      data-testid="container"
      className={className}
      dir={dir}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
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

vi.mock("@shared/components/SharedLanguageSwitchRenderer", () => ({
  default: ({
    value,
    value_ar,
    language,
  }: {
    value?: string;
    value_ar?: string;
    language?: string;
  }) => <span>{language === "ar" ? value_ar ?? value : value}</span>,
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

  // ── Default multi-row version ─────────────────────────────────────────────

  it("renders without crashing for type=pending multi-row", () => {
    render(<PaymentCard {...baseProps} />);
    expect(screen.getAllByTestId("container").length).toBeGreaterThan(0);
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
    render(<PaymentCard {...baseProps} onCardClick={onCardClick} />);
    // Click the outermost container
    const containers = screen.getAllByTestId("container");
    fireEvent.click(containers[0]);
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });

  // ── State-based styles ────────────────────────────────────────────────────

  it("applies pending background class for type=pending", () => {
    render(<PaymentCard {...baseProps} type="pending" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveClass("bg-button-primary-disabled");
  });

  it("applies failed background class for type=failed", () => {
    render(<PaymentCard {...baseProps} type="failed" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveClass("bg-status-failed-light");
  });

  it("applies success background class for type=success", () => {
    render(<PaymentCard {...baseProps} type="success" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveClass("bg-status-success-light");
  });

  it("applies action background class for type=action", () => {
    render(<PaymentCard {...baseProps} type="action" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveClass("bg-status-pending-solid");
  });

  it("applies action-other background class for type=action-other", () => {
    render(<PaymentCard {...baseProps} type="action-other" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveClass("bg-status-pending-light");
  });

  it("defaults to pending styles when type is undefined", () => {
    render(<PaymentCard {...baseProps} type={undefined} />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveClass("bg-button-primary-disabled");
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
    // Should show step info
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
    render(<PaymentCard type="pending" />);
    expect(screen.getAllByTestId("container").length).toBeGreaterThan(0);
  });

  // ── RTL direction ─────────────────────────────────────────────────────────

  it("sets dir=rtl on the outermost container when language=ar", () => {
    render(<PaymentCard {...baseProps} language="ar" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveAttribute("dir", "rtl");
  });

  it("sets dir=ltr on the outermost container when language=en", () => {
    render(<PaymentCard {...baseProps} language="en" />);
    const outerContainer = screen.getAllByTestId("container")[0];
    expect(outerContainer).toHaveAttribute("dir", "ltr");
  });
});
