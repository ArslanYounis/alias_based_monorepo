import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Avatar } from "@platform/Avatar";
import { ProfileIconStatus } from "@platform/ProfileIconStatus";
import { PaymentCard } from "@platform/PaymentCard";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export type StatusCardProps = {
  type?: "pending" | "action" | "action-other" | "failed" | "success" | string;
  direction?: "horizontal" | "vertical" | string;
  version?: "hybrid" | "multi-row" | "single-row" | "image-row" | string;
  action: string;
  action_ar?: string;
  stepName?: string;
  stepName_ar?: string;
  userName?: string;
  userName_ar?: string;
  language?: "en" | "ar";
  role?: string;
  role_ar?: string;
  imageURL?: string;
  currentStep?: number;
  onCardClick?: () => void;
  totalSteps?: number;
  completedSteps?: number;
  currentStepStatus?:
    | "pending"
    | "failed"
    | "complete"
    | "inProgress"
    | "fixed";
};

const getStateStyles = (state: StatusCardProps["type"]) => {
  switch (state) {
    case "pending":
      return {
        bgColor: "bg-button-primary-disabled",
        borderColor: "border-text-dimmed",
        textColor: "text-text-dimmed",
        status: "pending" as const,
      };
    case "failed":
      return {
        bgColor: "bg-status-failed-light",
        borderColor: "border-status-failed-solid",
        textColor: "text-process-card-text-dark",
        status: "failed" as const,
      };
    case "success":
      return {
        bgColor: "bg-status-success-light",
        borderColor: "border-status-success-solid",
        textColor: "text-process-card-text-dark",
        status: "complete" as const,
      };
    case "action":
      return {
        bgColor: "bg-status-pending-solid",
        borderColor: "border-status-pending-solid",
        textColor: "text-process-card-text-light",
        status: "inProgress" as const,
      };
    case "action-other":
      return {
        bgColor: "bg-status-pending-light",
        borderColor: "border-status-pending-solid",
        textColor: "text-process-card-text-dark",
        status: "pending" as const,
      };
    default:
      return {
        bgColor: "bg-status-pending-light",
        borderColor: "border-status-pending-solid",
        textColor: "text-process-card-text-dark",
        status: "pending" as const,
      };
  }
};

const Cards: React.FC<StatusCardProps> = ({
  type,
  version,
  direction = "horizontal",
  action,
  action_ar,
  stepName,
  stepName_ar,
  userName,
  userName_ar,
  language = "en",
  role,
  role_ar,
  imageURL,
  onCardClick,
  currentStep = 0,
  totalSteps = 0,
  completedSteps = 0,
  currentStepStatus = "pending",
}) => {
  const { bgColor, borderColor, textColor, status } = getStateStyles(type);

  if (version === "image-row") {
    return (
      <Container
        className={`w-full min-w-auto h-[96px] ${
          type === "pending" ? "bg-status-pending-solid" : bgColor
        } shadow-md rounded-xs flex border-b-2 ${borderColor} overflow-hidden`}
      >
        <Container className="w-1/2 h-[96px]">
          {/* <img
            src={imageURL}
            alt="Location"
            className="w-full h-full object-cover rounded-l-xs"
          /> */}
        </Container>
        <Container
          className={`w-1/2 flex flex-col justify-center px-2 ${bgColor}`}
        >
          <Text className={`text-sm font-bold ${textColor} line-clamp-2`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </Text>
          <Text className={`text-xs font-normal ${textColor} line-clamp-1`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={stepName}
              value_ar={stepName_ar}
            />
          </Text>
        </Container>
      </Container>
    );
  }

  if (version === "hybrid" || version === "multi-row") {
    return (
      <PaymentCard
        type={type}
        version={version}
        action={action}
        action_ar={action_ar}
        stepName={stepName}
        stepName_ar={stepName_ar}
        userName={userName}
        userName_ar={userName_ar}
        role={role}
        role_ar={role_ar}
        language={language}
        imageURL={imageURL}
        onCardClick={onCardClick}
        totalSteps={totalSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        currentStepStatus={currentStepStatus}
      />
    );
  }

  return (
    <Container
      className={`${bgColor} flex items-center w-full min-w-auto h-[96px] rounded-xs py-xs px-s overflow-hidden ${
        direction === "vertical" ? "" : "space-x-[10px]"
      } ${
        direction === "vertical" ? "flex-col py-[8px]" : "flex py-7"
      } border-b-2 ${borderColor}`}
      style={{ boxShadow: "0px 2px 4px 0px #00000033" }}
    >
      {imageURL ? (
        <Avatar imageUrl={imageURL} avatarSize={32} />
      ) : (
        <ProfileIconStatus status={status} width={32} height={32} />
      )}
      <Container
        className={
          direction === "horizontal"
            ? "text-start"
            : "text-center mt-2 flex flex-col"
        }
      >
        <Text className={`text-sm font-bold ${textColor}`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={action}
            value_ar={action_ar}
          />
        </Text>
        <Text className={`text-xs font-normal ${textColor}`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={stepName}
            value_ar={stepName_ar}
          />
        </Text>
      </Container>
    </Container>
  );
};

export default Cards;
