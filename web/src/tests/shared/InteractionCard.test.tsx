import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InteractionCard from "@shared/components/InteractionCard/InteractionCard";
import type { WfiStep } from "@shared/components/InteractionCard/InteractionCard";

const completedStep: WfiStep = {
  isCompleted: true,
  title: "Submit Application",
  title_ar: "تقديم الطلب",
  completedByCustomerNameE: "John Smith",
  completedByCustomerNameA: "جون سميث",
  completeDate: "2024-01-15",
  comments: "Approved",
};

const inProgressStep: WfiStep = {
  isCompleted: false,
  title: "Review Documents",
  title_ar: "مراجعة المستندات",
};

describe("InteractionCard (shared component – web platform)", () => {
  it("renders without crashing with empty wfiStepList", () => {
    render(<InteractionCard wfiStepList={[]} />);
  });

  it("renders empty state message in English", () => {
    render(<InteractionCard wfiStepList={[]} language="en" />);
    expect(screen.getByText("No interaction history available.")).toBeInTheDocument();
  });

  it("renders empty state message in Arabic", () => {
    render(<InteractionCard wfiStepList={[]} language="ar" />);
    expect(screen.getByText("لا يوجد سجل تفاعلات.")).toBeInTheDocument();
  });

  it("renders completed step title in English", () => {
    render(
      <InteractionCard wfiStepList={[completedStep]} language="en" />
    );
    expect(screen.getByText("Submit Application")).toBeInTheDocument();
  });

  it("renders step title in Arabic when language is 'ar'", () => {
    render(
      <InteractionCard wfiStepList={[completedStep]} language="ar" />
    );
    expect(screen.getByText("تقديم الطلب")).toBeInTheDocument();
  });

  it("shows 'Completed' badge for completed steps in English", () => {
    render(
      <InteractionCard wfiStepList={[completedStep]} language="en" />
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows 'مكتمل' badge for completed steps in Arabic", () => {
    render(
      <InteractionCard wfiStepList={[completedStep]} language="ar" />
    );
    expect(screen.getByText("مكتمل")).toBeInTheDocument();
  });

  it("shows completedByCustomerNameE in Standard toggleType", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="en"
      />
    );
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("shows Arabic author name in Standard mode with 'ar' language", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="ar"
      />
    );
    expect(screen.getByText("جون سميث")).toBeInTheDocument();
  });

  it("shows completeDate in Standard toggleType", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="en"
      />
    );
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("shows comments when present", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        toggleType="Standard"
        language="en"
      />
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("renders in-progress step without completed badge", () => {
    render(
      <InteractionCard wfiStepList={[inProgressStep]} language="en" />
    );
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });

  it("renders multiple steps", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep, inProgressStep]}
        language="en"
      />
    );
    expect(screen.getByText("Submit Application")).toBeInTheDocument();
    expect(screen.getByText("Review Documents")).toBeInTheDocument();
  });

  it("renders the Interaction History section title in English", () => {
    render(<InteractionCard wfiStepList={[]} language="en" />);
    expect(screen.getByText("Interaction History")).toBeInTheDocument();
  });

  it("renders the Interaction History section title in Arabic", () => {
    render(<InteractionCard wfiStepList={[]} language="ar" />);
    expect(screen.getByText("سجل التفاعلات")).toBeInTheDocument();
  });

  it("renders on mobile platform without crashing", () => {
    render(
      <InteractionCard
        wfiStepList={[completedStep]}
        language="en"
        platform="mobile"
      />
    );
  });
});
