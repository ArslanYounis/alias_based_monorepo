import React from "react";
import { Text } from "@platform/Text";
import { Cards } from "@platform/Cards";
import { Container } from "@platform/Container";
import { ScrollContainer } from "@platform/ScrollContainer";
import { ApplicationCard } from "@platform/ApplicationCard";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface AdditionalColumn {
  action: string;
  action_ar?: string;
  stepName: string;
  stepName_ar?: string;
  userName?: string;
  userName_ar?: string;
  role?: string;
  role_ar?: string;
  type: string;
  version?: string;
  direction?: string;
  currentStep?: number;
  totalDots?: number;
  imageURL?: string;
  onCardClick?: () => void | null;
  totalSteps?: number;
  completedSteps?: number;
  currentStepStatus?:
    | "pending"
    | "failed"
    | "complete"
    | "inProgress"
    | "fixed";
}

export interface ApplicationData {
  applicationTitle: string;
  applicationTitle_ar: string;
  location: string;
  location_ar: string;
  timeDate: string;
  timeDate_ar?: string;
  daysRemaining: string;
  daysRemaining_ar?: string;
  id: string;
  currentStep: number;
  totalDots?: number;
  onCardClick?: () => void | null;
  additionalColumns: AdditionalColumn[];
}

export interface ColumnDefinition {
  header: string;
  header_ar?: string;
  type?: string;
  accessorKey: string;
}

export interface ApplicationTableProps {
  data?: ApplicationData[];
  columns: ColumnDefinition[];
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

export const Table: React.FC<ApplicationTableProps> = ({
  data,
  columns,
  language = "en",
  platform = "web",
}) => {
  const tableData = data ?? [];
  const tableColumns = columns;
  const columnCount = Math.min(Math.max(tableColumns?.length, 1), 6);

  return (
    <Container className="w-full">
      {/* Column headers — visible on web, hidden on mobile (cards scroll horizontally) */}
      {tableData?.length > 0 && (
        <Container
          className="hidden md:grid gap-m mb-m"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
        >
          {tableColumns?.map((col, index) => (
            <Text
              key={index}
              className={`text-s font-bold text-text-default ${
                index >= 3 ? "!hidden md:!block" : ""
              }`}
            >
              <SharedLanguageSwitchRenderer
                language={language}
                value={col.header}
                value_ar={col?.header_ar}
              />
            </Text>
          ))}
        </Container>
      )}

      {tableData?.map((row, rowIndex) => (
        <Container
          key={rowIndex}
          className={`mb-xl ${
            rowIndex + 1 < tableData?.length ? "border-b" : ""
          } border-form-border pb-l`}
        >
          {platform === "web" ? (
            <Container className="flex flex-row gap-xs w-full">
              <Container className="min-w-50 shrink-0 me-xs">
                <ApplicationCard
                  cardsData={{
                    title:
                      language === "ar"
                        ? row.applicationTitle_ar
                        : row.applicationTitle,
                    id: row.id,
                    location:
                      language === "ar" ? row.location_ar : row.location,
                    date: row.timeDate,
                    stage: {
                      complete: row?.currentStep ?? 0,
                      approval: 1,
                      inprogress: 0,
                    },
                    remaining:
                      language === "ar"
                        ? (row.daysRemaining_ar ?? "")
                        : row.daysRemaining,
                  }}
                  totalDots={row?.totalDots}
                  onClick={row.onCardClick ?? undefined}
                />
              </Container>
              {row.additionalColumns?.map((col, colIndex) => (
                <Container
                  key={colIndex}
                  className="min-w-50 shrink-0 flex-1 mr-xs"
                >
                  <Cards
                    type={col?.type}
                    version={col?.version}
                    direction={col?.direction}
                    currentStep={col?.currentStep}
                    action={col?.action}
                    action_ar={col?.action_ar}
                    stepName={col?.stepName}
                    stepName_ar={col?.stepName_ar}
                    userName={col?.userName}
                    userName_ar={col?.userName_ar}
                    role={col?.role}
                    role_ar={col?.role_ar}
                    language={language}
                    imageURL={col?.imageURL ?? ""}
                    onCardClick={col?.onCardClick ?? undefined}
                    totalSteps={col?.totalSteps}
                    completedSteps={col?.completedSteps}
                    currentStepStatus={col?.currentStepStatus}
                  />
                </Container>
              ))}
            </Container>
          ) : (
            <ScrollContainer horizontal className="flex flex-row gap-xs w-full">
              <Container className="min-w-50 shrink-0 me-xs">
                <ApplicationCard
                  cardsData={{
                    title:
                      language === "ar"
                        ? row.applicationTitle_ar
                        : row.applicationTitle,
                    id: row.id,
                    location:
                      language === "ar" ? row.location_ar : row.location,
                    date: row.timeDate,
                    stage: {
                      complete: row?.currentStep ?? 0,
                      approval: 1,
                      inprogress: 0,
                    },
                    remaining:
                      language === "ar"
                        ? (row.daysRemaining_ar ?? "")
                        : row.daysRemaining,
                  }}
                  totalDots={row?.totalDots}
                  onClick={row.onCardClick ?? undefined}
                />
              </Container>
              {row.additionalColumns?.map((col, colIndex) => (
                <Container
                  key={colIndex}
                  className="min-w-50 shrink-0 flex-1 mr-xs"
                >
                  <Cards
                    type={col?.type}
                    version={col?.version}
                    direction={col?.direction}
                    currentStep={col?.currentStep}
                    action={col?.action}
                    action_ar={col?.action_ar}
                    stepName={col?.stepName}
                    stepName_ar={col?.stepName_ar}
                    userName={col?.userName}
                    userName_ar={col?.userName_ar}
                    role={col?.role}
                    role_ar={col?.role_ar}
                    language={language}
                    imageURL={col?.imageURL ?? ""}
                    onCardClick={col?.onCardClick ?? undefined}
                    totalSteps={col?.totalSteps}
                    completedSteps={col?.completedSteps}
                    currentStepStatus={col?.currentStepStatus}
                  />
                </Container>
              ))}
            </ScrollContainer>
          )}
        </Container>
      ))}
    </Container>
  );
};

export default Table;
