import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prompt } from "@platform/Prompt";

vi.mock("@platform/Buttons", () => ({
  Buttons: ({
    title,
    title_ar,
    language,
    onClick,
    type,
  }: {
    title?: string;
    title_ar?: string;
    language?: string;
    onClick?: () => void;
    type?: string;
    size?: string;
  }) => (
    <button
      data-testid={`btn-${type}`}
      onClick={onClick}
    >
      {language === "ar" ? title_ar ?? title : title}
    </button>
  ),
}));

vi.mock("@/components/shared/SharedLanguageSwitchRenderer", () => ({
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

describe("Prompt (web)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    title: "Are you sure?",
    title_ar: "هل أنت متأكد؟",
    // Note: PromptProps uses the (misspelled) `subtiltle` / `subtiltle_ar` keys.
    subtiltle: "This action cannot be undone.",
    subtiltle_ar: "لا يمكن التراجع عن هذا الإجراء.",
    onYesClick: vi.fn(),
    onNoClick: vi.fn(),
  };

  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders the title in English by default", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders the title in Arabic when language=ar", () => {
    render(<Prompt {...defaultProps} language="ar" />);
    expect(screen.getByText("هل أنت متأكد؟")).toBeInTheDocument();
  });

  it("renders the subtitle in English by default", () => {
    render(<Prompt {...defaultProps} />);
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
  });

  it("renders the subtitle in Arabic when language=ar", () => {
    render(<Prompt {...defaultProps} language="ar" />);
    expect(
      screen.getByText("لا يمكن التراجع عن هذا الإجراء.")
    ).toBeInTheDocument();
  });

  // ── Buttons ───────────────────────────────────────────────────────────────

  it("renders the No (delete) button", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByTestId("btn-delete")).toBeInTheDocument();
  });

  it("renders the Yes (secondary) button", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByTestId("btn-secondary")).toBeInTheDocument();
  });

  it("renders default 'No' text on the delete button in English", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByTestId("btn-delete")).toHaveTextContent("No");
  });

  it("renders default 'Yes' text on the secondary button in English", () => {
    render(<Prompt {...defaultProps} />);
    expect(screen.getByTestId("btn-secondary")).toHaveTextContent("Yes");
  });

  it("renders custom noText when provided", () => {
    render(<Prompt {...defaultProps} noText="Cancel" />);
    expect(screen.getByTestId("btn-delete")).toHaveTextContent("Cancel");
  });

  it("renders custom yesText when provided", () => {
    render(<Prompt {...defaultProps} yesText="Confirm" />);
    expect(screen.getByTestId("btn-secondary")).toHaveTextContent("Confirm");
  });

  it("renders Arabic no text when language=ar", () => {
    render(<Prompt {...defaultProps} language="ar" noText_ar="لا" />);
    expect(screen.getByTestId("btn-delete")).toHaveTextContent("لا");
  });

  it("renders Arabic yes text when language=ar", () => {
    render(<Prompt {...defaultProps} language="ar" yesText_ar="نعم" />);
    expect(screen.getByTestId("btn-secondary")).toHaveTextContent("نعم");
  });

  // ── Interactions ──────────────────────────────────────────────────────────

  it("calls onYesClick when Yes button is clicked", () => {
    const onYesClick = vi.fn();
    render(<Prompt {...defaultProps} onYesClick={onYesClick} />);
    fireEvent.click(screen.getByTestId("btn-secondary"));
    expect(onYesClick).toHaveBeenCalledTimes(1);
  });

  it("calls onNoClick when No button is clicked", () => {
    const onNoClick = vi.fn();
    render(<Prompt {...defaultProps} onNoClick={onNoClick} />);
    fireEvent.click(screen.getByTestId("btn-delete"));
    expect(onNoClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onYesClick is not provided and Yes is clicked", () => {
    render(
      <Prompt
        {...defaultProps}
        onYesClick={undefined}
      />
    );
    expect(() =>
      fireEvent.click(screen.getByTestId("btn-secondary"))
    ).not.toThrow();
  });

  it("does not throw when onNoClick is not provided and No is clicked", () => {
    render(
      <Prompt
        {...defaultProps}
        onNoClick={undefined}
      />
    );
    expect(() =>
      fireEvent.click(screen.getByTestId("btn-delete"))
    ).not.toThrow();
  });

  // ── RTL layout ────────────────────────────────────────────────────────────

  it("sets dir=ltr on root div when language=en", () => {
    const { container } = render(<Prompt {...defaultProps} language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("sets dir=rtl on root div when language=ar", () => {
    const { container } = render(<Prompt {...defaultProps} language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies flex-row-reverse on button container when language=ar", () => {
    render(<Prompt {...defaultProps} language="ar" />);
    const btnContainer = screen
      .getByTestId("btn-delete")
      .closest("div[class*='flex']");
    expect(btnContainer).toHaveClass("flex-row-reverse");
  });

  it("does not apply flex-row-reverse when language=en", () => {
    render(<Prompt {...defaultProps} language="en" />);
    const btnContainer = screen
      .getByTestId("btn-delete")
      .closest("div[class*='flex']");
    expect(btnContainer).not.toHaveClass("flex-row-reverse");
  });

  // ── Minimal props ─────────────────────────────────────────────────────────

  it("renders with no title or subtitle without crashing", () => {
    render(<Prompt onYesClick={vi.fn()} onNoClick={vi.fn()} />);
    expect(screen.getByTestId("btn-secondary")).toBeInTheDocument();
  });
});
