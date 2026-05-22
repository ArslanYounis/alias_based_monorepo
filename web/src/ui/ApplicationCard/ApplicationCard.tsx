import React from "react";
import { StatusBalls } from "@platform/StatusBalls";
import type { ApplicationCardProps } from "@shared/types";
import { Card } from "@/components/ui/card";

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  cardsData,
  onClick,
  totalDots = 6,
}) => {
  const { complete = 0, approval = 0, inprogress = 0 } = cardsData.stage;

  const safeComplete = Math.max(0, Math.min(complete, totalDots));
  const remainingAfterComplete = totalDots - safeComplete;
  const safeApproval = Math.max(0, Math.min(approval, remainingAfterComplete));
  const remainingAfterApproval = remainingAfterComplete - safeApproval;
  const safeInprogress = Math.max(
    0,
    Math.min(inprogress, remainingAfterApproval),
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
    <Card
      onClick={onClick}
      className="bg-Base-White border border-border-light w-full h-[96px] rounded-xs shadow-md py-xs px-s flex flex-col justify-center gap-xs border-b-2 border-b-status-pending-solid cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-bold-xs text-Base-Black truncate max-w-[150px]">
          {cardsData.title}
        </h2>
        <span className="text-xs font-normal text-Base-Black">
          {cardsData.id}
        </span>
      </div>

      {/* Location + Date */}
      <div className="flex justify-between items-center">
        <h2 className="text-xs text-Base-Black truncate max-w-[150px]">
          {cardsData.location}
        </h2>
        <span className="text-xs text-Base-Black">{cardsData.date}</span>
      </div>

      {/* Stages + Remaining Time */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-xs">
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
        </div>
        <span className="text-xs text-Base-Black">{cardsData.remaining}</span>
      </div>
    </Card>
  );
};
