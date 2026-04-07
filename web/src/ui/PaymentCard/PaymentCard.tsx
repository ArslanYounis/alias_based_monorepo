import React from "react";
import { Text } from "@platform/Text";
import { Avatar } from "@platform/Avatar";
import { Container } from "@platform/Container";
import { ProfileIconStatus } from "@platform/ProfileIconStatus";
import ProcessStatusRows from "@shared/components/ProcessStatusRows";
import SharedLanguageSwitchRenderer from "@shared/components/SharedLanguageSwitchRenderer";

import type { PaymentCardType, PaymentCardProps } from "@shared/types";
export type { PaymentCardType, PaymentCardProps };

const getStateStyles = (state: PaymentCardType) => {
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

export const PaymentCard: React.FC<PaymentCardProps> = (props) => {
  const {
    type,
    version = "multi-row",
    action,
    action_ar,
    stepName,
    stepName_ar,
    userName,
    userName_ar,
    role,
    role_ar,
    language = "en",
    imageURL,
    onCardClick,
    currentStep = 0,
    totalSteps = 0,
    completedSteps = 0,
    currentStepStatus = "pending",
  } = props;

  const { bgColor, borderColor, textColor, status } = getStateStyles(
    type ?? "pending"
  );
  const dir = language === "en" ? "ltr" : "rtl";
  const hybridLeftBg = type === "failed" ? "bg-status-failed-fade" : bgColor;
  const hybridRightBg =
    type === "failed"
      ? "bg-status-failed-light"
      : type === "success"
      ? "bg-status-success-light"
      : type === "action-other" || type === "action"
      ? "bg-status-pending-fade"
      : "";
  const hybridRightText =
    type === "action" ? "text-process-card-text-dark" : textColor;

  if (type === "pending" && version === "hybrid") {
    return (
      <Container
        dir={dir}
        className={`${bgColor} flex cursor-pointer items-center w-full min-w-auto h-24 rounded-xs py-xs px-s overflow-hidden flex-col border-b-2 ${borderColor}`}
        onClick={onCardClick}
        style={{ boxShadow: "0px 2px 4px 0px #00000033" }}
      >
        <Container className="flex flex-col items-center justify-center h-full">
          <Text className={`text-bold-s mb-2 ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </Text>
          <ProcessStatusRows
            totalSteps={totalSteps ?? 0}
            completedSteps={completedSteps}
            currentStepStatus={currentStepStatus}
          />
        </Container>
      </Container>
    );
  }

  if (type === "success" && version === "hybrid") {
    return (
      <Container
        dir={dir}
        className={`${bgColor} flex cursor-pointer items-center w-full min-w-auto h-24 rounded-xs py-xs px-s overflow-hidden flex-col border-b-2 ${borderColor}`}
        onClick={onCardClick}
        style={{ boxShadow: "0px 2px 4px 0px #00000033" }}
      >
        <Container className="flex flex-col items-center justify-center h-full">
          <Text className={`text-bold-s mb-2 ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </Text>
          <ProcessStatusRows
            totalSteps={totalSteps ?? 0}
            completedSteps={completedSteps}
            currentStepStatus={currentStepStatus}
          />
        </Container>
      </Container>
    );
  }

  if (version === "hybrid") {
    return (
      <Container
        dir={dir}
        onClick={onCardClick}
        className={`flex w-full min-w-auto h-24 rounded-xs overflow-hidden shadow-md cursor-pointer border-b-2 ${borderColor}`}
      >
        <Container className={`w-1/2 ${hybridLeftBg}`}>
          <Container className="flex items-center gap-3 px-2 py-[6.25px]">
            <Container className="w-8 h-8">
              <ProfileIconStatus status={status} width={32} height={32} />
            </Container>
            <Container className="flex flex-start flex-col items-start">
              <Text className={`text-bold-xxs ${textColor} break-all`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={action}
                  value_ar={action_ar}
                />
              </Text>
              <Text
                className={`text-xxs font-normal ${textColor} line-clamp-1`}
              >
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={stepName}
                  value_ar={stepName_ar}
                />
              </Text>
            </Container>
          </Container>
          <Container className="flex items-center gap-4 py-[6.25px] px-2">
            <Avatar imageUrl={imageURL} avatarSize={28} />
            <Container className="flex flex-start flex-col items-start">
              <Text
                className={`text-bold-s font-bold line-clamp-1 ${textColor}`}
              >
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={userName}
                  value_ar={userName_ar}
                />
              </Text>
              <Text className={`text-xs font-normal ${textColor} line-clamp-1`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={role}
                  value_ar={role_ar}
                />
              </Text>
            </Container>
          </Container>
        </Container>
        <Container
          className={`w-1/2 ${hybridRightBg} flex flex-col justify-center px-2 gap-2`}
        >
          <Container className="flex flex-start flex-col items-center gap-2">
            <Text className={`text-bold-xs ${hybridRightText} line-clamp-1`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={`Step ${currentStep} of ${totalSteps}`}
                value_ar={`الخطوة ${currentStep} من ${totalSteps}`}
              />
            </Text>
            <Text className={`text-xs font-normal ${hybridRightText}`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={stepName}
                value_ar={stepName_ar}
              />
            </Text>
          </Container>
          <Container className="mx-auto">
            <ProcessStatusRows
              totalSteps={totalSteps ?? 0}
              completedSteps={completedSteps}
              currentStepStatus={currentStepStatus}
            />
          </Container>
        </Container>
      </Container>
    );
  }

  return (
    <Container
      dir={dir}
      onClick={onCardClick}
      className={`${bgColor} w-full min-w-auto h-24 rounded-xs shadow-md px-3 py-2 flex flex-col justify-center gap-2 cursor-pointer border-b-2 ${borderColor}`}
    >
      <Container className="flex items-center gap-3 px-2 py-[6.25px]">
        <Container className="w-8 h-8">
          <ProfileIconStatus status={status} width={32} height={32} />
        </Container>
        <Container className="flex flex-start flex-col items-start">
          <Text className={`text-bold-xxs ${textColor} line-clamp-1`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </Text>
          <Text className={`text-xxs font-normal ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={stepName}
              value_ar={stepName_ar}
            />
          </Text>
        </Container>
      </Container>
      <Container className="flex items-center gap-4 py-[6.25px] px-2 text-center">
        <Avatar imageUrl={imageURL} avatarSize={28} />
        <Container className="flex flex-start flex-col items-start">
          <Text className={`text-bold-s font-bold line-clamp-1 ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={userName}
              value_ar={userName_ar}
            />
          </Text>
          <Text className={`text-xs font-normal ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={role}
              value_ar={role_ar}
            />
          </Text>
        </Container>
      </Container>
    </Container>
  );
};
