import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { StatusBalls } from "@platform/StatusBalls";

export interface ApplicationCardProps {
  onClick?: () => void;
  totalDots?: number;
  cardsData: {
    id: string;
    title?: string;
    location?: string;
    date?: string;
    stage: { complete: number; approval: number; inprogress: number };
    remaining: string;
  };
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  cardsData,
  //   onClick,
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
    <Container className="bg-base-white border border-border-light w-full min-w-[173px] h-[90.53px] rounded-xs py-xs px-s flex flex-col flex-grow justify-center gap-xs border-b-2 border-b-status-pending-solid">
      <Text className="text-bold-xs text-base-black">{cardsData.id}</Text>
      <Text className="text-xs text-base-black">{cardsData.remaining}</Text>

      <Container className="flex flex-row gap-xxs">
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
            width={16}
            height={16}
          />
        ))}
      </Container>
    </Container>
  );
};
