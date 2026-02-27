import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import Cards from "../Cards";
import ApplicationCard from "../ApplicationCard";
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
  imageURL?: string;
  onCardClick?: () => void | null;
  totalSteps?: number;
  completedSteps?: number;
  currentStepStatus?: "pending" | "failed" | "complete" | "inProgress" | "fixed";
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
}

export const Table: React.FC<ApplicationTableProps> = ({
  data,
  columns,
  language = "en",
}) => {
  const tableData = data ?? [];
  const tableColumns = columns;
  const columnCount = Math.min(Math.max(tableColumns.length, 1), 6);

  return (
    <Container className="w-full">
      {tableData.length > 0 && (
        <Container
          className="grid gap-4 mb-4"
          style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
        >
          {tableColumns?.map((col, index) => (
            <Text
              key={index}
              className={`text-sm font-bold text-[#000000] ${
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

      {tableData?.map((row, rowIndex) => {
        const rowColumnCount = Math.min(
          Math.max(row.additionalColumns?.length + 1 || 1, 1),
          6
        );
        return (
          <Container
            key={rowIndex}
            className={`mb-8 ${
              rowIndex + 1 < tableData.length ? "border-b" : ""
            } border-Form-Border pb-6`}
          >
            <Container
              className="grid gap-xs w-full"
              style={{
                gridTemplateColumns: `repeat(${rowColumnCount}, minmax(0, 1fr))`,
              }}
            >
              <Container className="min-w-0">
                <ApplicationCard
                  cardsData={{
                    title:
                      language === "ar" ? row.applicationTitle_ar : row.applicationTitle,
                    id: row.id,
                    location: language === "ar" ? row.location_ar : row.location,
                    date: row.timeDate,
                    stage: {
                      complete: row?.currentStep ?? 0,
                      approval: 1,
                      inprogress: 0,
                    },
                    remaining:
                      language === "ar" ? row.daysRemaining_ar ?? "" : row.daysRemaining,
                  }}
                  onClick={row.onCardClick ?? undefined}
                />
              </Container>
              {row.additionalColumns
                ?.slice(0, 5)
                .map((col, colIndex) => (
                  <Container
                    key={colIndex}
                    className={`min-w-0 ${colIndex > 1 ? "!hidden md:!block" : ""}`}
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
          </Container>
        );
      })}
    </Container>
  );
};

export default Table;
