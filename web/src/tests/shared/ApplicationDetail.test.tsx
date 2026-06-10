import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ApplicationDetail from "@shared/components/ApplicationDetail/ApplicationDetail";

// NOTE: The previous version of this test targeted an older, hook-driven
// ApplicationDetail (owners / plots / documents / interaction history fetched
// via useGetApplicationDetails). That component was replaced. The current
// ApplicationDetail is a presentational, props-driven card showing application
// number / date / reference number plus a single action button. The
// (now obsolete) ApplicationSummaryDetail component was folded into this one,
// so its old test file has been removed and its coverage merged here.

describe("ApplicationDetail (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<ApplicationDetail />);
  });

  it("renders the default title 'Application Detail' in English", () => {
    render(<ApplicationDetail language="en" />);
    expect(screen.getByText("Application Detail")).toBeInTheDocument();
  });

  it("renders custom title in English", () => {
    render(
      <ApplicationDetail title="App Info" title_ar="معلومات الطلب" language="en" />
    );
    expect(screen.getByText("App Info")).toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(
      <ApplicationDetail title="App Info" title_ar="معلومات الطلب" language="ar" />
    );
    expect(screen.getByText("معلومات الطلب")).toBeInTheDocument();
  });

  it("renders Application Number label and value in English", () => {
    render(<ApplicationDetail applicationNumber="APP-001" language="en" />);
    expect(screen.getByText("Application Number")).toBeInTheDocument();
    expect(screen.getByText("APP-001")).toBeInTheDocument();
  });

  it("renders Arabic Application Number label when language is 'ar'", () => {
    render(
      <ApplicationDetail
        applicationNumber="APP-001"
        applicationNumber_ar="طلب-001"
        language="ar"
      />
    );
    expect(screen.getByText("رقم الطلب")).toBeInTheDocument();
    expect(screen.getByText("طلب-001")).toBeInTheDocument();
  });

  it("renders Application Date row when date is provided", () => {
    render(<ApplicationDetail applicationDate="2024-01-15" language="en" />);
    expect(screen.getByText("Application Date")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("renders Arabic Application Date label when language is 'ar'", () => {
    render(
      <ApplicationDetail
        applicationDate="2024-01-15"
        applicationDate_ar="٢٠٢٤-٠١-١٥"
        language="ar"
      />
    );
    expect(screen.getByText("تاريخ الطلب")).toBeInTheDocument();
  });

  it("does not render Application Date row when date is empty", () => {
    render(<ApplicationDetail language="en" />);
    expect(screen.queryByText("Application Date")).not.toBeInTheDocument();
  });

  it("renders Reference Number row when reference is provided", () => {
    render(<ApplicationDetail referenceNumber="REF-2024-001" language="en" />);
    expect(screen.getByText("Reference Number")).toBeInTheDocument();
    expect(screen.getByText("REF-2024-001")).toBeInTheDocument();
  });

  it("does not render Reference Number row when reference is empty", () => {
    render(<ApplicationDetail language="en" />);
    expect(screen.queryByText("Reference Number")).not.toBeInTheDocument();
  });

  it("renders View button by default", () => {
    render(<ApplicationDetail language="en" />);
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("does not render button when showButton is false", () => {
    render(<ApplicationDetail showButton={false} language="en" />);
    expect(screen.queryByText("View")).not.toBeInTheDocument();
  });

  it("renders custom button title", () => {
    render(
      <ApplicationDetail buttonTitle="Open" buttonTitle_ar="فتح" language="en" />
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders Arabic button title when language is 'ar'", () => {
    render(
      <ApplicationDetail buttonTitle="Open" buttonTitle_ar="فتح" language="ar" />
    );
    expect(screen.getByText("فتح")).toBeInTheDocument();
  });

  it("calls onButtonClick when button is clicked", () => {
    const onButtonClick = vi.fn();
    render(<ApplicationDetail onButtonClick={onButtonClick} language="en" />);
    fireEvent.click(screen.getByText("View"));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(<ApplicationDetail language="ar" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<ApplicationDetail language="en" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "ltr");
  });
});
