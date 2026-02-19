import React, { useState } from "react";
import { Container } from "@platform/Container";
import { CardTitle } from "@shared/components/CardTitle";
import { Typography } from "@platform/Typography";
import { Buttons } from "@platform/Buttons";
import type { CardTitleProps, ButtonType } from "@shared/components/CardTitle";

export interface RowDataItem {
  label?: string;
  label_ar?: string;
  value?: string;
  value_ar?: string;
}

export interface GenericCardProps extends CardTitleProps {
  showTitleSection?: boolean;
  showMoreButton?: boolean;
  rowsData?: RowDataItem[];
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  defaultShowMore?: boolean;
  handleToggleInternally?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  buttons?: ButtonType[];
  titleButtons?: ButtonType[];
  hasDocuments?: boolean;
  documents?: unknown[];
  documentTitle?: string;
  documentTitle_ar?: string;
  documentDescription?: string;
  documentDescription_ar?: string;
  document_type?: string;
  isUploaded?: boolean;
  documentButtons?: ButtonType[];
  showFooterButtons?: boolean;
  footerButton?: ButtonType[];
}

export const GenericCard: React.FC<GenericCardProps> = ({
  showTitleSection = true,
  title = "",
  title_ar = "",
  cardTitleValue = "",
  cardTitleValue_ar = "",
  cardTitleLabel = "",
  cardTitleLabel_ar = "",
  variant = "large",
  isExpandable = true,
  handleToggleInternally = true,
  onToggleExpand = () => {},
  language = "en",
  showButtons = false,
  showTitleButtons = false,
  buttons = [],
  titleButtons = [],
  showMoreButton = false,
  rowsData = [],
  defaultShowMore = false,
  isExpanded = true,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const expanded = handleToggleInternally ? internalExpanded : isExpanded;
  const handleToggle = handleToggleInternally
    ? () => setInternalExpanded((p) => !p)
    : onToggleExpand;

  return (
    <Container>
      {showTitleSection && (
        <CardTitle
          title={expanded ? (title ?? "") : (cardTitleLabel ?? "")}
          title_ar={expanded ? (title_ar ?? title ?? "") : (cardTitleLabel_ar || cardTitleLabel ?? "")}
          variant={variant}
          isExpandable={isExpandable}
          isExpanded={expanded}
          onToggleExpand={handleToggle}
          showButtons={showButtons}
          buttons={buttons}
          showTitleButtons={showTitleButtons}
          titleButtons={titleButtons}
          language={language}
        />
      )}
      {expanded && rowsData.length > 0 && (
        <Container>
          {rowsData.map((row, idx) => (
            <Container key={idx}>
              <Typography
                variant="text-bold-md"
                text={row.label}
                text_ar={row.label_ar || row.label}
                language={language}
              />
              <Typography
                variant="text-md"
                text={row.value}
                text_ar={row.value_ar || row.value}
                language={language}
              />
            </Container>
          ))}
        </Container>
      )}
      {showMoreButton && (
        <Buttons
          title="Show more"
          title_ar="عرض المزيد"
          type="secondary"
          language={language}
        />
      )}
    </Container>
  );
};

export default GenericCard;
