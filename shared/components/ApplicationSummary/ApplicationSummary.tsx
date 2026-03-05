import React, { useMemo, useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { ChevronDownIcon, ChevronUpIcon } from "@platform/icons";
import CardTitle from "../CardTitle";
import Agent from "../Agent";
import PlotCard from "../PlotCard";
import OwnerCard from "../OwnerCard";
import GenericCard from "../GenericCard";
import GenericCards from "../GenericCards";
import GenericTableCard from "../GenericTableCard";
import InteractionCard from "../InteractionCard";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import ApplicationSummaryDetail from "./ApplicationSummaryDetail";

import type { AgentProps } from "../Agent";
import type { IPlotCardProps } from "../PlotCard";
import type { IOwnerCardProps } from "../OwnerCard";
import type { IGenericCardProps } from "../GenericCard";
import type { IGenericCardsProps } from "../GenericCards";
import type { IGenericTableCardProps } from "../GenericTableCard";
import type { IInteractionCardProps } from "../InteractionCard";
import type { ApplicationSummaryDetailProps } from "./ApplicationSummaryDetail";
import type {
  UiBlock,
  ApplicationType,
  ApplicationSummaryProps,
  UploadDocumentsProps,
} from "./ApplicationSummary.types";

/* Component */
const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  title = "Application Summary",
  title_ar = "ملخص الطلب",
  language = "en",
  data = [],
  DocumentsComponent,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [type, setType] = useState<ApplicationType>("Compact");

  const handleToggle = () => {
    setType((prev) => (prev === "Compact" ? "Standard" : "Compact"));
  };

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const sectionsArray = useMemo(() => {
    return data;
  }, [data]);

  const gridCols = data?.length;

  /* Renderer */
  const renderSection = (block: UiBlock, index: number) => {
    switch (block.type) {
      case "agent": {
        const props = block.data as AgentProps;
        return (
          <Agent
            key={index}
            {...props}
            language={language}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      case "applicationDetails": {
        const props = block.data as ApplicationSummaryDetailProps;
        return (
          <ApplicationSummaryDetail
            key={index}
            {...props}
            language={language}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      case "plot": {
        const props = block.data as IPlotCardProps;
        return (
          <PlotCard
            key={index}
            {...props}
            language={language}
            defaultShowMore={type === "Standard"}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      case "owners": {
        const props = block.data as IOwnerCardProps;
        return (
          <OwnerCard
            key={index}
            {...props}
            language={language}
            defaultShowMore={type === "Standard"}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      case "interactionHistory": {
        const props = block.data as IInteractionCardProps;
        return (
          <InteractionCard
            key={index}
            {...props}
            language={language}
            toggleType={type}
          />
        );
      }

      case "documents": {
        const props = block.data as UploadDocumentsProps;
        return (
          <Container key={index} className="gap-m">
            {block.title && (
              <CardTitle
                title={block.title}
                title_ar={block.title_ar ?? ""}
                variant="small"
                language={language}
              />
            )}
            {DocumentsComponent && (
              <DocumentsComponent {...props} language={language} />
            )}
          </Container>
        );
      }

      case "genericCard": {
        const props = block.data as IGenericCardProps;
        return (
          <GenericCard
            key={index}
            {...props}
            language={language}
            defaultShowMore={type === "Standard"}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      case "genericCards": {
        const props = block.data as IGenericCardsProps;
        return (
          <GenericCards
            key={index}
            {...props}
            language={language}
            defaultShowMore={type === "Standard"}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      case "genericTableCard": {
        const props = block.data as IGenericTableCardProps;
        return (
          <GenericTableCard
            key={index}
            {...props}
            language={language}
            title={block.title ?? props.title}
            title_ar={block.title_ar ?? props.title_ar}
          />
        );
      }

      default:
        return null;
    }
  };

  /* Render */
  return (
    <Container
      className="bg-grey-form-back border border-grey-form-border py-m px-l w-full"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <Container className="flex items-center justify-between gap-m">
        <Text className="text-bold-l text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar}
          />
        </Text>

        {/* Compact & Standard Toggle + Expand button */}
        <Container className="flex items-center gap-xs">
          {isExpanded && (
            <>
              {/* Toggle track — click handled by wrapping Container following existing project pattern */}
              <Container
                className="relative inline-flex items-center cursor-pointer"
                onClick={handleToggle}
              >
                <Container className="w-[48px] h-[24px] border border-text-dimmed bg-Base-White rounded-full transition-colors duration-300" />
                <Container
                  className={`absolute left-0.5 top-0.5 ${
                    type === "Standard" ? "bg-text-link" : "bg-text-dimmed"
                  } w-5 h-5 rounded-full transition-transform duration-300`}
                  style={{
                    transform: type === "Standard" ? "translateX(24px)" : "translateX(0)",
                  }}
                />
              </Container>
              <Text className="text-bold-xs text-text-default">
                {type === "Compact" ? (
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Compact"
                    value_ar="مضغوط"
                  />
                ) : (
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Standard"
                    value_ar="قياسي"
                  />
                )}
              </Text>
            </>
          )}

          {/* Expand/Collapse button */}
          <Buttons
            type="tertiary"
            size="s"
            title=""
            language={language}
            onClick={handleExpandToggle}
            leftIcon={
              isExpanded ? (
                <Text className="text-text-default">
                  <ChevronUpIcon size={20} />
                </Text>
              ) : (
                <Text className="text-text-default">
                  <ChevronDownIcon size={20} />
                </Text>
              )
            }
          />
        </Container>
      </Container>

      {/* Body */}
      {isExpanded && (
        <Container className={`grid grid-cols-${gridCols} gap-l mt-l`}>
          {sectionsArray?.map((blocks, columnIndex) => (
            <Container key={columnIndex} className="flex flex-col gap-xl">
              {blocks?.map((block, blockIndex) =>
                renderSection(block, blockIndex)
              )}
            </Container>
          ))}
        </Container>
      )}
    </Container>
  );
};

export default ApplicationSummary;
