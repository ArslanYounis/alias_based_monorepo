import React, { useState, useEffect } from "react";
import { Container } from "@platform/Container";
import { CardTitle } from "@shared/components/CardTitle";
import { Typography } from "@platform/Typography";
import { Buttons } from "@platform/Buttons";
import { CardRow } from "@shared/components/CardRow";
import type { CardTitleProps, ButtonType } from "@shared/components/CardTitle";

export interface RowDataItem {
  label?: string;
  label_ar?: string;
  value?: string;
  value_ar?: string;
}

export interface GenericCardDocument {
  id: string;
  documentName: string;
  documentName_ar?: string;
  isUploaded?: boolean;
  onDownloadClick?: () => void;
  /** Optional metadata for display (ADREC parity) */
  fileType?: string;
  uploadedDate?: string;
  uploadedDate_ar?: string;
  size?: string;
  downloadUrl?: string;
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
  documents?: GenericCardDocument[];
  documentTitle?: string;
  documentTitle_ar?: string;
  documentDescription?: string;
  documentDescription_ar?: string;
  document_type?: "default" | "base";
  isUploaded?: boolean;
  documentButtons?: ButtonType[];
  showFooterButtons?: boolean;
  footerButton?: ButtonType[];
}

const ROWS_VISIBLE_WHEN_COLLAPSED = 3;

export const GenericCard: React.FC<GenericCardProps> = ({
  showTitleSection = true,
  title = "",
  title_ar = "",
  description,
  description_ar,
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
  hasDocuments = false,
  documents = [],
  documentTitle = "Documents",
  documentTitle_ar = "المستندات",
  documentDescription,
  documentDescription_ar,
  documentButtons = [],
  showFooterButtons = false,
  footerButton = [],
  showBorder = false,
  subText,
  subText_ar,
  status,
  status_ar,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [isMoreShown, setIsMoreShown] = useState(defaultShowMore);

  const expanded = handleToggleInternally ? internalExpanded : isExpanded;
  const handleToggle = handleToggleInternally
    ? () => setInternalExpanded((p) => !p)
    : onToggleExpand;

  useEffect(() => {
    if (!expanded) {
      setIsMoreShown(false);
    } else {
      setIsMoreShown(defaultShowMore);
    }
  }, [expanded, defaultShowMore]);

  const visibleRows = showMoreButton && !isMoreShown
    ? rowsData.slice(0, ROWS_VISIBLE_WHEN_COLLAPSED)
    : rowsData;
  const hasMoreRows = showMoreButton && rowsData.length > ROWS_VISIBLE_WHEN_COLLAPSED;
  const showMoreLabel = language === "ar" ? "عرض المزيد" : "Show more";
  const showLessLabel = language === "ar" ? "عرض أقل" : "Show less";

  return (
    <Container dir={language === "ar" ? "rtl" : "ltr"} className="w-full flex flex-col shrink-0">
      {showTitleSection && (
        <CardTitle
          title={expanded ? title : (cardTitleLabel || title)}
          title_ar={expanded ? (title_ar ?? title) : (cardTitleLabel_ar ?? cardTitleLabel ?? title_ar ?? title)}
          description={expanded ? description : undefined}
          description_ar={expanded ? description_ar : undefined}
          variant={variant}
          isExpandable={isExpandable}
          isExpanded={expanded}
          onToggleExpand={handleToggle}
          showButtons={!expanded ? showButtons : false}
          buttons={!expanded ? buttons : []}
          showTitleButtons={showTitleButtons}
          titleButtons={titleButtons}
          language={language}
          showBorder={showBorder}
          subText={subText}
          subText_ar={subText_ar}
          status={status}
          status_ar={status_ar}
        />
      )}

      {expanded ? (
        <Container>
          {(cardTitleLabel || cardTitleLabel_ar || (showButtons && buttons?.length > 0)) && (
            <Container>
              <Typography variant="text-bold-md" text={cardTitleLabel} text_ar={cardTitleLabel_ar ?? cardTitleLabel} language={language} />
              {showButtons && buttons?.map((btn, idx) => (
                <Buttons key={idx} size="s" title={btn.title} title_ar={btn.title_ar} type={btn.type ?? "secondary"} onClick={btn.onClick} language={language} />
              ))}
            </Container>
          )}
          {visibleRows.map((row, idx) => (
            <CardRow
              key={idx}
              label={row.label}
              label_ar={row.label_ar}
              value={row.value}
              value_ar={row.value_ar}
              language={language}
            />
          ))}
          {showMoreButton && hasMoreRows && (
            <CardRow
              rowVariant="moreLink"
              language={language}
              isMoreShown={isMoreShown}
              onToggleMore={() => setIsMoreShown((p) => !p)}
            />
          )}
          {hasDocuments && documents.length > 0 && (
            <Container>
              <CardTitle variant="medium" title={documentTitle} title_ar={documentTitle_ar} description={documentDescription} description_ar={documentDescription_ar} showButtons={documentButtons.length > 0} buttons={documentButtons} language={language} showBorder={false} />
              {documents.map((doc) => (
                <Container key={doc.id} className="mb-4 last:mb-0">
                  <Typography variant="text-md" text={doc.documentName} text_ar={doc.documentName_ar ?? doc.documentName} language={language} />
                  {(doc.size ?? doc.uploadedDate) && (
                    <Typography variant="text-sm" text={[doc.size, doc.uploadedDate].filter(Boolean).join(" · ")} text_ar={[doc.size, doc.uploadedDate_ar ?? doc.uploadedDate].filter(Boolean).join(" · ")} language={language} />
                  )}
                  {doc.onDownloadClick && (
                    <Buttons title={language === "ar" ? "تحميل" : "Download"} type="secondary" size="s" onClick={doc.onDownloadClick} language={language} />
                  )}
                </Container>
              ))}
            </Container>
          )}
        </Container>
      ) : (
        <Container
          className="rounded-xs bg-cards-base-l1 text-text-default border border-cards-stroke px-4 py-4 gap-4 flex justify-between items-center cursor-pointer"
          onClick={handleToggle}
        >
          <Typography variant="text-bold-md" text={cardTitleLabel || title} text_ar={cardTitleLabel_ar ?? cardTitleLabel ?? title_ar ?? title} language={language} />
          <Typography variant="text-md" text={cardTitleValue} text_ar={cardTitleValue_ar ?? cardTitleValue} language={language} />
        </Container>
      )}

      {showFooterButtons && footerButton && footerButton.length > 0 && (
        <Container>
          {footerButton.map((btn, idx) => (
            <Buttons key={idx} size="s" title={btn.title} title_ar={btn.title_ar} type={btn.type ?? "secondary"} onClick={btn.onClick} language={language} />
          ))}
        </Container>
      )}
    </Container>
  );
};

export default GenericCard;
