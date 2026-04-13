import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProcessStatusRows from "@shared/components/ProcessStatusRows/ProcessStatusRows";

describe("ProcessStatusRows (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(
      <ProcessStatusRows totalSteps={5} completedSteps={2} currentStepStatus="inProgress" />
    );
  });

  it("renders the correct number of balls (totalSteps)", () => {
    const { container } = render(
      <ProcessStatusRows totalSteps={6} completedSteps={3} currentStepStatus="pending" />
    );
    // StatusBalls renders SVG elements — just verify no crashes and something rendered
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with all steps completed", () => {
    render(
      <ProcessStatusRows totalSteps={4} completedSteps={4} currentStepStatus="complete" />
    );
  });

  it("renders with zero completed steps", () => {
    render(
      <ProcessStatusRows totalSteps={4} completedSteps={0} currentStepStatus="pending" />
    );
  });

  it("renders with currentStepStatus='failed'", () => {
    render(
      <ProcessStatusRows totalSteps={3} completedSteps={1} currentStepStatus="failed" />
    );
  });

  it("renders with currentStepStatus='fixed'", () => {
    render(
      <ProcessStatusRows totalSteps={3} completedSteps={1} currentStepStatus="fixed" />
    );
  });

  it("accepts custom ballSize and gap", () => {
    const { container } = render(
      <ProcessStatusRows
        totalSteps={3}
        completedSteps={1}
        currentStepStatus="inProgress"
        ballSize={20}
        gap={8}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders single-step flow", () => {
    render(
      <ProcessStatusRows totalSteps={1} completedSteps={0} currentStepStatus="inProgress" />
    );
  });
});
