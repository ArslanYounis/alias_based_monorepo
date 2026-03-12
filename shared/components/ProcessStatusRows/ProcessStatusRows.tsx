import React from "react";
import { Container } from "@platform/Container";
import { StatusBalls } from "@platform/StatusBalls";

export interface ProcessStatusRowsProps {
  totalSteps: number;
  completedSteps: number;
  currentStepStatus: "pending" | "inProgress" | "complete" | "fixed" | "failed";
  ballSize?: number | string;
  gap?: number | string;
}

const ProcessStatusRows: React.FC<ProcessStatusRowsProps> = ({
  totalSteps,
  completedSteps,
  currentStepStatus,
  ballSize = 16,
  gap = 4,
}) => {
  const balls = Array.from({ length: totalSteps }, (_, idx) => {
    if (idx < completedSteps)
      return (
        <StatusBalls
          key={idx}
          status="complete"
          width={ballSize}
          height={ballSize}
        />
      );
    if (idx === completedSteps)
      return (
        <StatusBalls
          key={idx}
          status={currentStepStatus}
          width={ballSize}
          height={ballSize}
        />
      );
    return (
      <StatusBalls
        key={idx}
        status="pending"
        width={ballSize}
        height={ballSize}
      />
    );
  });
  return (
    <Container style={{ display: "flex", flexDirection: "row", gap }}>
      {balls}
    </Container>
  );
};

export default ProcessStatusRows;
