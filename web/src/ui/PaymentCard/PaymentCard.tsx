import React from "react";
import { Avatar } from "../Avatar";
import { ProfileIconStatus } from "../ProfileIconStatus";
import ProcessStatusRows from "@shared/components/ProcessStatusRows";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

import type { PaymentCardType, PaymentCardProps } from "@shared/types";
export type { PaymentCardType, PaymentCardProps };

const getStateStyles = (state: PaymentCardProps["type"]) => {
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

  const { bgColor, borderColor, textColor, status } = getStateStyles(type);

  //  hybrid-only backgrounds
  const hybridLeftBg = type === "failed" ? "bg-status-failed-fade" : bgColor;
  const hybridRightBg =
    type === "failed"
      ? "bg-status-failed-light"
      : type === "success"
      ? "bg-status-success-light"
      : type === "action-other" || type === "action"
      ? "bg-status-pending-fade"
      : "";

  //  hybrid-only text color
  const hybridRightText =
    type === "action" ? "text-process-card-text-dark" : textColor;

  /** Pending */
  if (type === "pending" && version === "hybrid") {
    return (
      <div
        dir={language === "en" ? "ltr" : "rtl"}
        className={`${bgColor} flex cursor-pointer items-center w-full min-w-auto h-24 rounded-xs py-xs px-s overflow-hidden flex-col border-b-2 ${borderColor}`}
        onClick={onCardClick}
        style={{ boxShadow: "0px 2px 4px 0px #00000033" }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className={`text-bold-s mb-2 ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </div>

          <ProcessStatusRows
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            currentStepStatus={currentStepStatus}
          />
        </div>
      </div>
    );
  }
  /** Success - Hybrid */
  if (type === "success" && version === "hybrid") {
    return (
      <div
        dir={language === "en" ? "ltr" : "rtl"}
        className={`${bgColor} flex cursor-pointer items-center w-full min-w-auto h-24 rounded-xs py-xs px-s overflow-hidden flex-col border-b-2 ${borderColor}`}
        onClick={onCardClick}
        style={{ boxShadow: "0px 2px 4px 0px #00000033" }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className={`text-bold-s mb-2 ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </div>

          <ProcessStatusRows
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            currentStepStatus={currentStepStatus}
          />
        </div>
      </div>
    );
  }

  /** HYBRID VERSION */
  if (version === "hybrid") {
    return (
      <div
        dir={language === "en" ? "ltr" : "rtl"}
        onClick={onCardClick}
        className={`flex w-full min-w-auto h-24 rounded-xs overflow-hidden shadow-md cursor-pointer border-b-2 ${borderColor}`}
      >
        {/* Left */}
        <div className={`w-1/2 ${hybridLeftBg}`}>
          {/* Icon, Title & Text */}
          <div className="flex items-center gap-3 px-2 py-[6.25px]">
            <div className="w-8 h-8">
              <ProfileIconStatus status={status} width={32} height={32} />
            </div>
            <div className="flex flex-start flex-col items-start">
              <div className={`text-bold-xxs ${textColor} break-all`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={action}
                  value_ar={action_ar}
                />
              </div>
              <div className={`text-xxs font-normal ${textColor} line-clamp-1`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={stepName}
                  value_ar={stepName_ar}
                />
              </div>
            </div>
          </div>
          {/* Image */}
          <div className="flex  items-center gap-4 py-[6.25px] px-2">
            <Avatar imageUrl={imageURL} avatarSize={28} />
            <div className="flex flex-start flex-col items-start">
              <div
                className={`text-bold-s font-bold line-clamp-1 ${textColor}`}
              >
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={userName}
                  value_ar={userName_ar}
                />
              </div>
              <div className={`text-xs font-normal ${textColor} line-clamp-1`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={role}
                  value_ar={role_ar}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          className={`w-1/2 ${hybridRightBg} flex flex-col justify-center px-2 gap-2`}
        >
          <div className="flex flex-start flex-col items-center gap-2">
            <div className={`text-bold-xs ${hybridRightText} line-clamp-1`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={`Step ${currentStep} of ${totalSteps}`}
                value_ar={`الخطوة ${currentStep} من ${totalSteps}`}
              />
            </div>
            <div className={`text-xs font-normal ${hybridRightText}`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={stepName}
                value_ar={stepName_ar}
              />
            </div>
          </div>
          <div className="mx-auto">
            <ProcessStatusRows
              totalSteps={totalSteps}
              completedSteps={completedSteps}
              currentStepStatus={currentStepStatus}
            />
          </div>
        </div>
      </div>
    );
  }

  /**  MULTI-ROW VERSION (default) */
  return (
    <div
      dir={language === "en" ? "ltr" : "rtl"}
      onClick={onCardClick}
      className={`${bgColor} w-full min-w-auto h-24 rounded-xs shadow-md px-3 py-2 flex flex-col justify-center gap-2 cursor-pointer border-b-2 ${borderColor}`}
    >
      {/* Icon, Title & Text */}
      <div className="flex items-center gap-3 px-2 py-[6.25px]">
        <div className="w-8 h-8">
          <ProfileIconStatus status={status} width={32} height={32} />
        </div>
        <div className="flex flex-start flex-col items-start">
          <div className={`text-bold-xxs ${textColor} line-clamp-1`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={action}
              value_ar={action_ar}
            />
          </div>
          <div className={`text-xxs font-normal ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={stepName}
              value_ar={stepName_ar}
            />
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="flex  items-center gap-4 py-[6.25px] px-2 text-center">
        <Avatar imageUrl={imageURL} avatarSize={28} />
        <div className="flex flex-start flex-col items-start">
          <div className={`text-bold-s font-bold line-clamp-1 ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={userName}
              value_ar={userName_ar}
            />
          </div>
          <div className={`text-xs font-normal ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={role}
              value_ar={role_ar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
