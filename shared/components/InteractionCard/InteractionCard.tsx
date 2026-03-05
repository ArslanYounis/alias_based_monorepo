import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { CheckIcon, SendIcon } from "@platform/icons";
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
}

const InteractionCard: React.FC<IInteractionCardProps> = ({
  toggleType,
  language = "en",
  totalSteps = 6,
  totalCompletedSteps = 0,
  wfiStepList = [],
}) => {
  const renderInteractionCard = (step: WfiStep, index: number) => {
    const isCompleted = step.isCompleted;
    const completedStep = totalCompletedSteps;

    return (
      <Container
        key={index}
        className={`w-full rounded-xs mb-4 min-h-[72px] max-h-[160px] p-m gap-l border ${
          isCompleted
            ? "border-Green-9 bg-[#2b8a3e10]"
            : "border-text-dimmed bg-Base-White"
        }`}
      >
        <Container
          className={`flex ${
            isCompleted ? "items-start" : "items-center"
          } gap-4 h-full`}
        >
          <Container
            className={`flex items-center justify-center shrink-0 rounded-full bg-Base-Transparent w-[40px] h-[40px] border ${
              isCompleted ? "border-Green-9" : "border-Teal-9"
            }`}
          >
            <Text className="text-text-default">
              {isCompleted ? <CheckIcon /> : <SendIcon />}
            </Text>
          </Container>

          <Container className="flex-1 flex flex-col justify-between h-full">
            <Container className="flex justify-between items-start">
              <Text className={`text-bold-m text-text-default pb-xs`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={step?.title}
                  value_ar={step?.title_ar}
                />
              </Text>
              {isCompleted ? (
                <Container
                  className={`px-3 py-1 w-[70px] h-[24px] flex items-center justify-center rounded-xs text-xs bg-Green-1 text-Green-9`}
                >
                  <Text className="text-xs text-Green-9">
                    {language === "en" ? "Completed" : "مكتمل"}
                  </Text>
                </Container>
              ) : (
                <ProcessStatusRows
                  totalSteps={totalSteps}
                  completedSteps={completedStep}
                  currentStepStatus="inProgress"
                  ballSize={12}
                  gap={4}
                />
              )}
            </Container>

            {toggleType === "Standard" && step?.completedByCustomerNameE && (
              <Container className="flex w-[80%] py-xs border-b border-Dark-7">
                <Container className="w-[40px]">
                  <Text className={`text-bold-m text-text-default`}>
                    {language === "en" ? "By" : "بواسطة"}
                  </Text>
                </Container>

                <Container
                  className={`flex-1 ${language === "en" ? "ml-xl" : "mr-xl"}`}
                >
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
                className={`flex w-[80%] py-xs ${
                  step?.comments ? "border-b border-Dark-7" : ""
                }`}
              >
                <Container className="w-[40px]">
                  <Text className={`text-bold-m text-text-default`}>
                    {language === "en" ? "Date" : "التاريخ"}
                  </Text>
                </Container>
                <Container
                  className={`flex-1 ${language === "en" ? "ml-xl" : "mr-xl"}`}
                >
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
              <Container className="flex w-[80%] py-xs">
                <Container className="w-[40px]">
                  <Text className={`text-bold-m text-text-default`}>
                    {language === "en" ? "Remark" : "ملاحظة"}
                  </Text>
                </Container>
                <Container
                  className={`flex-1 ${language === "en" ? "ml-xl" : "mr-xl"}`}
                >
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
      <Text className={`text-bold-ml text-text-default pb-s`}>
        <SharedLanguageSwitchRenderer
          language={language}
          value="Interaction History"
          value_ar="سجل التفاعلات"
        />
      </Text>

      {wfiStepList.length > 0 ? (
        wfiStepList.map(renderInteractionCard)
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
