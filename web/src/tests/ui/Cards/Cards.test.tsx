import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Cards } from "@platform/Cards";

// Mock heavy sub-components to keep unit scope narrow
vi.mock("@platform/PaymentCard", () => ({
  PaymentCard: (props: Record<string, unknown>) => (
    <div data-testid="payment-card" data-version={props.version as string} />
  ),
}));

vi.mock("@platform/ProfileIconStatus", () => ({
  ProfileIconStatus: ({ status }: { status: string }) => (
    <div data-testid="profile-icon-status" data-status={status} />
  ),
}));

vi.mock("@platform/Avatar", () => ({
  Avatar: ({ imageUrl }: { imageUrl: string }) => (
    <img data-testid="avatar" src={imageUrl} alt="avatar" />
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
    language: string;
  }) => <>{language === "en" ? value : value_ar || value}</>,
}));

describe("Cards", () => {
  // ── image-row version ─────────────────────────────────────────────────────

  it("renders image-row version with image and action text", () => {
    render(
      <Cards
        type="pending"
        version="image-row"
        action="Pending Action"
        imageURL="https://example.com/img.jpg"
      />
    );
    const img = screen.getByAltText("Location") as HTMLImageElement;
    expect(img.src).toContain("img.jpg");
    expect(screen.getByText("Pending Action")).toBeInTheDocument();
  });

  it("renders image-row with Arabic action when language is 'ar'", () => {
    render(
      <Cards
        type="pending"
        version="image-row"
        action="Action"
        action_ar="إجراء"
        language="ar"
        imageURL="https://example.com/img.jpg"
      />
    );
    expect(screen.getByText("إجراء")).toBeInTheDocument();
  });

  it("image-row: uses bg-status-pending-solid for pending type", () => {
    const { container } = render(
      <Cards type="pending" version="image-row" imageURL="x.jpg" />
    );
    expect(container.firstChild).toHaveClass("bg-status-pending-solid");
  });

  // ── hybrid / multi-row versions delegate to PaymentCard ──────────────────

  it("renders PaymentCard for version='hybrid'", () => {
    render(
      <Cards
        type="success"
        version="hybrid"
        action="Hybrid"
        imageURL=""
      />
    );
    expect(screen.getByTestId("payment-card")).toBeInTheDocument();
    expect(screen.getByTestId("payment-card")).toHaveAttribute(
      "data-version",
      "hybrid"
    );
  });

  it("renders PaymentCard for version='multi-row'", () => {
    render(<Cards type="failed" version="multi-row" action="Multi" />);
    expect(screen.getByTestId("payment-card")).toHaveAttribute(
      "data-version",
      "multi-row"
    );
  });

  // ── Default (no version / other) ──────────────────────────────────────────

  it("renders action text in default layout", () => {
    render(<Cards type="success" action="My Action" />);
    expect(screen.getByText("My Action")).toBeInTheDocument();
  });

  it("renders stepName text in default layout", () => {
    render(<Cards type="success" action="A" stepName="Step 1" />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("renders Avatar when imageURL is provided in default layout", () => {
    render(
      <Cards type="success" action="A" imageURL="https://example.com/photo.jpg" />
    );
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("renders ProfileIconStatus when imageURL is not provided in default layout", () => {
    render(<Cards type="success" action="A" />);
    expect(screen.getByTestId("profile-icon-status")).toBeInTheDocument();
  });

  // ── State styles ──────────────────────────────────────────────────────────

  it("applies bg-status-failed-light for 'failed' type in default layout", () => {
    const { container } = render(<Cards type="failed" action="A" />);
    expect(container.firstChild).toHaveClass("bg-status-failed-light");
  });

  it("applies bg-status-success-light for 'success' type in default layout", () => {
    const { container } = render(<Cards type="success" action="A" />);
    expect(container.firstChild).toHaveClass("bg-status-success-light");
  });

  it("applies bg-status-pending-solid for 'action' type in default layout", () => {
    const { container } = render(<Cards type="action" action="A" />);
    expect(container.firstChild).toHaveClass("bg-status-pending-solid");
  });

  it("applies bg-status-pending-light for 'action-other' type in default layout", () => {
    const { container } = render(<Cards type="action-other" action="A" />);
    expect(container.firstChild).toHaveClass("bg-status-pending-light");
  });

  it("applies default (pending) styles for unknown type in default layout", () => {
    const { container } = render(
      <Cards type={"unknown" as "pending"} action="A" />
    );
    expect(container.firstChild).toHaveClass("bg-status-pending-light");
  });

  // ── Direction ─────────────────────────────────────────────────────────────

  it("default layout: applies space-x for horizontal direction", () => {
    const { container } = render(
      <Cards type="success" action="A" direction="horizontal" />
    );
    expect(container.firstChild).toHaveClass("space-x-[10px]");
  });

  it("default layout: applies flex-col for vertical direction", () => {
    const { container } = render(
      <Cards type="success" action="A" direction="vertical" />
    );
    expect(container.firstChild).toHaveClass("flex-col");
  });

  // ── ProfileIconStatus status mapping ──────────────────────────────────────

  it("maps 'pending' type to pending status icon", () => {
    render(<Cards type="pending" action="A" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "pending"
    );
  });

  it("maps 'failed' type to failed status icon", () => {
    render(<Cards type="failed" action="A" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "failed"
    );
  });

  it("maps 'success' type to complete status icon", () => {
    render(<Cards type="success" action="A" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "complete"
    );
  });

  it("maps 'action' type to inProgress status icon", () => {
    render(<Cards type="action" action="A" />);
    expect(screen.getByTestId("profile-icon-status")).toHaveAttribute(
      "data-status",
      "inProgress"
    );
  });
});
