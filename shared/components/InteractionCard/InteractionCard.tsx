import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { CheckIcon, SendIcon } from "@platform/icons";
import CardTitle from "../CardTitle";
import ProcessStatusRows from "../ProcessStatusRows";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface WfiStep {
  isCompleted?: boolean;
  title?: string;
  title_ar?: string;
  stepConst?: string;
  stepStatusE?: string;
  stepStatusA?: string;
  comments?: string;
  isCurrent?: boolean;
  completedByCustomerNameE?: string;
  completedByCustomerNameA?: string;
  completeDate?: string;
}

export interface IInteractionCardProps {
  toggleType?: "Compact" | "Standard";
  language?: "en" | "ar";
  totalSteps?: number;
  totalCompletedSteps?: number;
  wfiStepList?: WfiStep[];
  platform?: "web" | "mobile";
}

const InteractionCard: React.FC<IInteractionCardProps> = ({
  toggleType,
  language = "en",
  totalSteps = 6,
  totalCompletedSteps = 0,
  wfiStepList = [],
  platform = "web",
}) => {
  const renderInteractionCard = (step: WfiStep, index: number) => {
    const isCompleted = step.isCompleted;
    const completedStep = totalCompletedSteps;

    return (
      <Container
        key={index}
        className={`w-full rounded-xs mb-m min-h-[72px] p-m gap-l border mt-s ${
          isCompleted
            ? "border-green-9 bg-[#2b8a3e10]"
            : "border-text-dimmed bg-base-white"
        }`}
      >
        <Container
          className={`flex flex-row ${
            isCompleted ? "items-start" : "items-center"
          } gap-m`}
        >
          <Container
            className={`flex flex-row items-center justify-center shrink-0 rounded-full bg-base-transparent w-[40px] h-[40px] border ${
              isCompleted ? "border-green-9" : "border-teal-9"
            }`}
          >
            <Text className="text-text-default">
              {isCompleted ? <CheckIcon /> : <SendIcon />}
            </Text>
          </Container>

          <Container className="flex-1 flex flex-col justify-between">
            <Container
              className={`flex ${
                platform === "mobile"
                  ? "flex-col items-start gap-xs"
                  : "flex-row justify-between items-start"
              }`}
            >
              <Text
                className={`text-bold-m text-text-default ${
                  platform === "web" ? "mb-xs" : ""
                }`}
              >
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={step?.title}
                  value_ar={step?.title_ar}
                />
              </Text>
              {isCompleted ? (
                <Container
                  className={`px-s py-xxs w-[70px] h-[24px] flex items-center justify-center rounded-xs text-xs bg-green-1 text-green-9`}
                >
                  <Text className="text-xs text-green-9">
                    {language === "en" ? "Completed" : "مكتمل"}
                  </Text>
                </Container>
              ) : (
                <ProcessStatusRows
                  totalSteps={totalSteps}
                  completedSteps={completedStep}
                  currentStepStatus="inProgress"
                  ballSize={platform === "mobile" ? 8 : 12}
                  gap={platform === "mobile" ? 3 : 4}
                />
              )}
            </Container>

            {toggleType === "Standard" && step?.completedByCustomerNameE && (
              <Container
                className={`flex flex-row ${
                  platform === "web" ? "w-[80%]" : "w-full"
                } py-xs border-b border-border-dimmed`}
              >
                <Container
                  className={`${platform === "web" ? "w-[40px]" : ""}`}
                >
                  <Text className={`text-bold-m text-text-default`}>
                    {language === "en" ? "By" : "بواسطة"}
                  </Text>
                </Container>

                <Container className={`flex-1 ms-xl`}>
                  <Text className={`text-m text-text-default`}>
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={step?.completedByCustomerNameE}
                      value_ar={step?.completedByCustomerNameA}
                    />
                  </Text>
                </Container>
              </Container>
            )}
            {toggleType === "Standard" && step?.completeDate && (
              <Container
                className={`flex flex-row ${
                  platform === "web" ? "w-[80%]" : "w-full"
                } py-xs ${
                  step?.comments ? "border-b border-border-dimmed" : ""
                }`}
              >
                <Container
                  className={`${platform === "web" ? "w-[40px]" : ""}`}
                >
                  <Text className={`text-bold-m text-text-default`}>
                    {language === "en" ? "Date" : "التاريخ"}
                  </Text>
                </Container>
                <Container className={`flex-1 ms-xl`}>
                  <Text className={`text-m text-text-default`}>
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={step?.completeDate}
                      value_ar={step?.completeDate}
                    />
                  </Text>
                </Container>
              </Container>
            )}
            {step?.comments && (
              <Container
                className={`flex flex-row ${
                  platform === "web" ? "w-[80%]" : "w-full"
                } py-xs`}
              >
                <Container
                  className={`${platform === "web" ? "w-[40px]" : ""}`}
                >
                  <Text className={`text-bold-m text-text-default`}>
                    {language === "en" ? "Remark" : "ملاحظة"}
                  </Text>
                </Container>
                <Container className={`flex-1 ms-xl`}>
                  <Text className={`text-m text-text-default line-clamp-1`}>
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={step?.comments}
                      value_ar={step?.comments}
                    />
                  </Text>
                </Container>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    );
  };

  return (
    <Container>
      <CardTitle
        title="Interaction History"
        title_ar="سجل التفاعلات"
        variant="small"
        language={language}
        platform={platform}
      />

      {wfiStepList?.length > 0 ? (
        wfiStepList?.map(renderInteractionCard)
      ) : (
        <Text className="text-text-dimmed text-m">
          <SharedLanguageSwitchRenderer
            language={language}
            value="No interaction history available."
            value_ar="لا يوجد سجل تفاعلات."
          />
        </Text>
      )}
    </Container>
  );
};

export default InteractionCard;
