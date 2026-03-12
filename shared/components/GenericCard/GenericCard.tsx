import React, { useState, useEffect } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import CardRow from "../CardRow";
// import { UploadDocument } from "@platform/UploadDocument";
import type { ICardRowProps } from "../CardRow";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import CardTitle, { type ButtonType, type ICardTitleProps } from "../CardTitle";

export interface IDocument {
  id: string;
  documentName: string;
  documentName_ar?: string;
  document_type?: "default" | "base";
  fileType?: string;
  uploadedDate?: string;
  uploadedDate_ar?: string;
  size?: string;
  isUploaded: boolean;
  downloadUrl?: string;
  onDownloadClick?: () => void;
}

export interface IGenericCardProps extends ICardTitleProps {
  showTitleSection?: boolean;
  showMoreButton?: boolean;
  rowsData: ICardRowProps[];
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  defaultShowMore?: boolean;
  handleToggleInternally?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  hasDocuments?: boolean;
  documents?: IDocument[];
  documentName?: string;
  documentName_ar?: string;
  documentTitle?: string;
  documentTitle_ar?: string;
  documentDescription?: string;
  documentDescription_ar?: string;
  document_type?: "default" | "base";
  isUploaded?: boolean;
  documentButtons?: ButtonType[];
  showFooterButtons?: boolean;
  footerButton?: ButtonType[];
  platform?: "web" | "mobile";
}

const GenericCard: React.FC<IGenericCardProps> = ({
  showTitleSection = true,
  title,
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
  subText,
  subText_ar,
  status,
  status_ar,
  showBorder = false,
  showButtons = false,
  showTitleButtons = false,
  buttons = [],
  titleButtons = [],
  language = "en",
  showMoreButton = false,
  rowsData,
  defaultShowMore = false,
  isExpanded = true,
  hasDocuments = false,
  documents = [],
  documentTitle = "Documents",
  documentTitle_ar = "المستندات",
  documentDescription = "Document Description",
  documentDescription_ar = "وصف الوثيقة",
  document_type = "default",
  isUploaded = true,
  documentButtons = [],
  showFooterButtons = false,
  footerButton = [],
  platform,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [isMoreShown, setIsMoreShown] = useState(defaultShowMore);
  const expanded = handleToggleInternally ? internalExpanded : isExpanded;
  const handleToggleExpand = handleToggleInternally
    ? () => setInternalExpanded((prev) => !prev)
    : onToggleExpand;

  useEffect(() => {
    if (!expanded) setIsMoreShown(false);
    else setIsMoreShown(defaultShowMore);
  }, [expanded, defaultShowMore]);

  return (
    <Container
      className="w-full flex flex-col shrink-0"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {showTitleSection && (
        <CardTitle
          title={expanded ? title : cardTitleLabel}
          title_ar={expanded ? title_ar : cardTitleLabel_ar}
          description={description}
          description_ar={description_ar}
          variant={variant}
          isExpandable={expanded ? isExpandable : false}
          isExpanded={expanded}
          onToggleExpand={
            handleToggleInternally ? handleToggleExpand : onToggleExpand
          }
          subText={subText}
          subText_ar={subText_ar}
          status={status}
          status_ar={status_ar}
          showBorder={showBorder}
          showButtons={expanded ? false : showButtons}
          buttons={expanded ? [] : buttons}
          language={language}
          showTitleButtons={showTitleButtons}
          titleButtons={titleButtons}
          platform={platform}
        />
      )}
      {expanded ? (
        <Container className="rounded-xs bg-cards-base-l1 text-text-default px-l py-m border border-cards-stroke">
          {(cardTitleLabel || cardTitleLabel_ar || showButtons) && (
            <Container className="flex flex-row justify-between items-center mb-3">
              <Text className="text-bold-ml font-bold cursor-pointer wrap-break-word whitespace-normal min-w-0">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={cardTitleLabel}
                  value_ar={cardTitleLabel_ar}
                />
              </Text>
              <Container className="flex flex-row gap-s flex-wrap">
                {showButtons &&
                  buttons?.map((button) => (
                    <Buttons
                      key={button.title}
                      size="s"
                      type={button.type || "secondary"}
                      {...button}
                      language={language}
                    />
                  ))}
              </Container>
            </Container>
          )}
          {rowsData
            ?.slice(0, isMoreShown ? rowsData.length : 3)
            .map((row, idx) => (
              <CardRow key={idx} {...row} language={language} />
            ))}
          {showMoreButton && (
            <CardRow
              rowVariant="moreLink"
              language={language}
              isMoreShown={isMoreShown}
              onToggleMore={() => setIsMoreShown(!isMoreShown)}
            />
          )}
          {hasDocuments && documents && documents.length > 0 && (
            <Container className="mt-m">
              <CardTitle
                variant="medium"
                title={documentTitle}
                title_ar={documentTitle_ar}
                description={documentDescription}
                description_ar={documentDescription_ar}
                showButtons={documentButtons.length > 0}
                buttons={documentButtons}
                language={language}
              />
              {documents.map((document) => (
                <Container key={document?.id} className="mb-m last:mb-0">
                  <Container className="flex items-center gap-2 py-2">
                    <Text className="text-m text-text-default">
                      <SharedLanguageSwitchRenderer
                        language={language}
                        value={document?.isUploaded ? "Uploaded " : "Add "}
                        value_ar={document?.isUploaded ? "تم رفع " : "إضافة "}
                      />
                      <SharedLanguageSwitchRenderer
                        language={language}
                        value={document?.documentName}
                        value_ar={
                          document?.documentName_ar ?? document?.documentName
                        }
                      />
                    </Text>
                    {document?.onDownloadClick && (
                      <Buttons
                        type="text-link"
                        size="s"
                        language={language}
                        title={language === "ar" ? "تحميل" : "Download"}
                        onClick={document.onDownloadClick}
                      />
                    )}
                  </Container>
                </Container>
              ))}
            </Container>
          )}
        </Container>
      ) : (
        <Container
          className="rounded-xs bg-cards-base-l1 text-text-default border border-cards-stroke px-l py-m gap-l flex flex-row justify-between items-center cursor-pointer"
          onClick={handleToggleExpand}
        >
          <Text className="text-bold-m">
            <SharedLanguageSwitchRenderer
              language={language}
              value={cardTitleLabel || title}
              value_ar={cardTitleLabel_ar || title_ar}
            />
          </Text>
          <Text className="text-m">
            <SharedLanguageSwitchRenderer
              language={language}
              value={cardTitleValue}
              value_ar={cardTitleValue_ar}
            />
          </Text>
        </Container>
      )}
      {showFooterButtons && (
        <Container className="flex flex-row gap-s my-s">
          {footerButton?.map((button) => (
            <Buttons
              key={button.title}
              size="s"
              type={button.type || "secondary"}
              {...button}
              language={language}
            />
          ))}
        </Container>
      )}
    </Container>
  );
};

export default GenericCard;
