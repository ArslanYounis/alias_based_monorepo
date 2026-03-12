import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { StatusBalls } from "@platform/StatusBalls";

export interface ApplicationCardProps {
  onClick?: () => void;
  totalDots?: number;
  cardsData: {
    title: string;
    id: string;
    location: string;
    date: string;
    stage: { complete: number; approval: number; inprogress: number };
    remaining: string;
  };
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  cardsData,
  // onClick,
  totalDots = 6,
}) => {
  const { complete = 0, approval = 0, inprogress = 0 } = cardsData.stage;
  const safeComplete = Math.max(0, Math.min(complete, totalDots));
  const remainingAfterComplete = totalDots - safeComplete;
  const safeApproval = Math.max(0, Math.min(approval, remainingAfterComplete));
  const remainingAfterApproval = remainingAfterComplete - safeApproval;
  const safeInprogress = Math.max(
    0,
    Math.min(inprogress, remainingAfterApproval)
  );

  const statusBalls = [
    ...Array(safeComplete).fill("complete"),
    ...Array(safeApproval).fill("inProgress"),
    ...Array(safeInprogress).fill("failed"),
  ];
  const remainingDotsCount = Math.max(0, totalDots - statusBalls.length);
  const allStatusBalls = [
    ...statusBalls,
    ...Array(remainingDotsCount).fill("pending"),
  ];

  return (
    <Container className="bg-Base-White border border-border-light w-full h-[96px] rounded-xs shadow-md py-xs px-s flex flex-col justify-center gap-xs border-b-2 border-b-status-pending-solid">
      <Container className="flex justify-between items-center">
        <Text className="text-bold-xs text-Base-Black truncate max-w-[150px]">
          {cardsData.title}
        </Text>
        <Text className="text-xs font-normal text-Base-Black">
          {cardsData.id}
        </Text>
      </Container>
      <Container className="flex justify-between items-center">
        <Text className="text-xs text-Base-Black truncate max-w-[150px]">
          {cardsData.location}
        </Text>
        <Text className="text-xs text-Base-Black">{cardsData.date}</Text>
      </Container>
      <Container className="flex justify-between items-center">
        <Container className="flex space-x-xs">
          {allStatusBalls.map((status, index) => (
            <StatusBalls
              key={index}
              status={
                status as
                  | "pending"
                  | "inProgress"
                  | "complete"
                  | "fixed"
                  | "failed"
              }
              width={12}
              height={12}
            />
          ))}
        </Container>
        <Text className="text-xs text-Base-Black">{cardsData.remaining}</Text>
      </Container>
    </Container>
  );
};
