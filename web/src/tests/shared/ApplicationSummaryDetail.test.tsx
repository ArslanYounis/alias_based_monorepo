import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ApplicationSummaryDetail from "@shared/components/ApplicationSummary/ApplicationSummaryDetail";

describe("ApplicationSummaryDetail (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<ApplicationSummaryDetail />);
  });

  it("renders the default title 'Application Detail' in English", () => {
    render(<ApplicationSummaryDetail language="en" />);
    expect(screen.getByText("Application Detail")).toBeInTheDocument();
  });

  it("renders custom title in English", () => {
    render(
      <ApplicationSummaryDetail
        title="App Info"
        title_ar="معلومات الطلب"
        language="en"
      />
    );
    expect(screen.getByText("App Info")).toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(
      <ApplicationSummaryDetail
        title="App Info"
        title_ar="معلومات الطلب"
        language="ar"
      />
    );
    expect(screen.getByText("معلومات الطلب")).toBeInTheDocument();
  });

  it("renders Application Number label in English", () => {
    render(
      <ApplicationSummaryDetail
        applicationNumber="APP-001"
        language="en"
      />
    );
    expect(screen.getByText("Application Number")).toBeInTheDocument();
    expect(screen.getByText("APP-001")).toBeInTheDocument();
  });

  it("renders Arabic Application Number label when language is 'ar'", () => {
    render(
      <ApplicationSummaryDetail
        applicationNumber="APP-001"
        applicationNumber_ar="طلب-001"
        language="ar"
      />
    );
    expect(screen.getByText("رقم الطلب")).toBeInTheDocument();
    expect(screen.getByText("طلب-001")).toBeInTheDocument();
  });

  it("renders Application Date row when date is provided", () => {
    render(
      <ApplicationSummaryDetail
        applicationDate="2024-01-15"
        language="en"
      />
    );
    expect(screen.getByText("Application Date")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("does not render Application Date row when date is empty", () => {
    render(
      <ApplicationSummaryDetail language="en" />
    );
    expect(screen.queryByText("Application Date")).not.toBeInTheDocument();
  });

  it("renders Reference Number row when reference is provided", () => {
    render(
      <ApplicationSummaryDetail
        referenceNumber="REF-2024-001"
        language="en"
      />
    );
    expect(screen.getByText("Reference Number")).toBeInTheDocument();
    expect(screen.getByText("REF-2024-001")).toBeInTheDocument();
  });

  it("does not render Reference Number row when reference is empty", () => {
    render(<ApplicationSummaryDetail language="en" />);
    expect(screen.queryByText("Reference Number")).not.toBeInTheDocument();
  });

  it("renders View button by default", () => {
    render(<ApplicationSummaryDetail language="en" />);
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("does not render button when showButton is false", () => {
    render(<ApplicationSummaryDetail showButton={false} language="en" />);
    expect(screen.queryByText("View")).not.toBeInTheDocument();
  });

  it("renders custom button title", () => {
    render(
      <ApplicationSummaryDetail
        buttonTitle="Open"
        buttonTitle_ar="فتح"
        language="en"
      />
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders Arabic button title when language is 'ar'", () => {
    render(
      <ApplicationSummaryDetail
        buttonTitle="Open"
        buttonTitle_ar="فتح"
        language="ar"
      />
    );
    expect(screen.getByText("فتح")).toBeInTheDocument();
  });

  it("calls onButtonClick when button is clicked", () => {
    const onButtonClick = vi.fn();
    render(
      <ApplicationSummaryDetail
        onButtonClick={onButtonClick}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("View"));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});
