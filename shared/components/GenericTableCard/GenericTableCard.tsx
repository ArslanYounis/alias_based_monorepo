import React, { useState, useEffect } from "react";
import { Buttons } from "@platform/Buttons";
import { Pagination } from "@platform/Pagination";
import CardRow, { type ICardRowProps } from "../CardRow";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import CardTitle, { type ButtonType, type ICardTitleProps } from "../CardTitle";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { ScrollContainer } from "@platform/ScrollContainer";

export interface ICardColProps {
  key?: string;
  label: string;
  label_ar?: string;
}

export interface IGenericTableCardProps extends ICardTitleProps {
  showTitleSection?: boolean;
  rowVariant?: "3colButton" | "4colButton" | "5colButton" | "6colButton";
  columnsData?: ICardColProps[];
  rowsData: ICardRowProps[];
  showRowButtons?: boolean;
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  defaultShowMore?: boolean;
  showFooterButtons?: boolean;
  footerButton?: ButtonType[];
  showPagination?: boolean;
  handlePaginationInternally?: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  platform?: "web" | "mobile";
}

const INTERNAL_PAGE_SIZE = 3;

const GenericTableCard: React.FC<IGenericTableCardProps> = ({
  showTitleSection = true,
  title,
  title_ar = "",
  description,
  description_ar,
  cardTitleLabel = "",
  cardTitleLabel_ar = "",
  cardTitleValue = "",
  cardTitleValue_ar = "",
  variant = "large",
  isExpandable = true,
  isExpanded = true,
  onToggleExpand = () => {},
  showButtons = false,
  buttons = [],
  language = "en",
  showRowButtons = true,
  rowsData,
  rowVariant = "3colButton",
  columnsData,
  defaultShowMore = false,
  showFooterButtons = false,
  footerButton = [],
  showPagination,
  handlePaginationInternally = true,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  platform = "web",
}) => {
  const [isMoreShown, setIsMoreShown] = useState(defaultShowMore);
  const [internalPage, setInternalPage] = useState(1);

  const internalTotalPages = Math.ceil(
    (rowsData?.length ?? 0) / INTERNAL_PAGE_SIZE
  );
  const rowsToShow =
    handlePaginationInternally && showPagination
      ? rowsData?.slice(
          (internalPage - 1) * INTERNAL_PAGE_SIZE,
          internalPage * INTERNAL_PAGE_SIZE
        ) ?? []
      : rowsData?.slice(0, isMoreShown ? rowsData.length : 3) ?? [];

  // Maps each variant to how many value columns exist (excluding label + optional button col)
  const buttonLayout: Partial<
    Record<
      NonNullable<IGenericTableCardProps["rowVariant"]>,
      { valueCount: number }
    >
  > = {
    "3colButton": { valueCount: 2 },
    "4colButton": { valueCount: 3 },
    "5colButton": { valueCount: 4 },
    "6colButton": { valueCount: 5 },
  };

  const currentButtonLayout =
    rowVariant && buttonLayout[rowVariant as keyof typeof buttonLayout];

  useEffect(() => {
    if (!isExpanded) setIsMoreShown(false);
    else setIsMoreShown(defaultShowMore);
  }, [isExpanded, defaultShowMore]);

  useEffect(() => {
    if (handlePaginationInternally && rowsData?.length) {
      setInternalPage((p) =>
        Math.min(p, Math.ceil(rowsData.length / INTERNAL_PAGE_SIZE) || 1)
      );
    }
  }, [handlePaginationInternally, rowsData?.length]);

  return (
    <Container className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      {showTitleSection && (
        <CardTitle
          title={title}
          title_ar={title_ar}
          description={description}
          description_ar={description_ar}
          variant={variant}
          isExpandable={isExpanded ? isExpandable : false}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          language={language}
          platform={platform}
        />
      )}
      {isExpanded ? (
        <Container
          className={`rounded-xs bg-cards-base-l1 text-text-default ${
            platform === "web" ? "px-l" : "px-s"
          } py-m border border-cards-stroke`}
        >
          <Container className="flex flex-row justify-between items-center mb-s">
            <Text className="text-bold-ml font-bold cursor-pointer wrap-break-word whitespace-normal min-w-0">
              <SharedLanguageSwitchRenderer
                language={language}
                value={cardTitleValue}
                value_ar={cardTitleValue_ar}
              />
            </Text>
            <Container className="flex flex-row flex-wrap gap-s">
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
          {platform === "web" ? (
            <>
              {currentButtonLayout && columnsData && columnsData.length > 0 && (
                <Container className="gap-xxs py-s flex flex-row items-center text-text-default border-b border-border-dimmed">
                  {columnsData
                    .slice(0, (currentButtonLayout?.valueCount ?? 0) + 1)
                    .map((column, idx) => (
                      <Container
                        key={column.key ?? idx}
                        className="flex-1 min-w-0 text-bold-m"
                      >
                        <Text>
                          <SharedLanguageSwitchRenderer
                            language={language}
                            value={column.label}
                            value_ar={column.label_ar}
                          />
                        </Text>
                      </Container>
                    ))}
                  {/* Placeholder to align with the button column in each row */}
                  {showRowButtons && <Container className="flex-1 min-w-0" />}
                </Container>
              )}
              {rowsToShow.map((row, idx) => {
                const button: ButtonType = {
                  title: row.button?.title ?? "View",
                  title_ar: row.button?.title_ar ?? row.label_ar,
                  type: row.button?.type ?? "secondary",
                  onClick: row.button?.onClick,
                };
                return (
                  <CardRow
                    key={idx}
                    {...row}
                    button={showRowButtons ? button : undefined}
                    language={language}
                    rowVariant={rowVariant}
                  />
                );
              })}
            </>
          ) : (
            <>
              {/* Column header row — flex replaces grid; each cell gets flex-1 to match equal columns */}
              {currentButtonLayout && columnsData && columnsData.length > 0 && (
                <ScrollContainer
                  horizontal
                  className="flex flex-row gap-xs w-full"
                >
                  <Container className="gap-s py-s flex flex-row items-center text-text-default border-b border-border-dimmed">
                    {columnsData
                      .slice(0, (currentButtonLayout?.valueCount ?? 0) + 1)
                      .map((column, idx) => (
                        <Container
                          key={column.key ?? idx}
                          className="flex-1 min-w-0 text-bold-m"
                        >
                          <Text>
                            <SharedLanguageSwitchRenderer
                              language={language}
                              value={column.label}
                              value_ar={column.label_ar}
                            />
                          </Text>
                        </Container>
                      ))}
                    {/* Placeholder to align with the button column in each row */}
                    {showRowButtons && <Container className="flex-1 min-w-0" />}
                  </Container>
                </ScrollContainer>
              )}

              {rowsToShow.map((row, idx) => {
                const button: ButtonType = {
                  title: row.button?.title ?? "View",
                  title_ar: row.button?.title_ar ?? row.label_ar,
                  type: row.button?.type ?? "secondary",
                  onClick: row.button?.onClick,
                };
                return (
                  <ScrollContainer
                    horizontal
                    className="flex flex-row gap-xs w-full"
                  >
                    <CardRow
                      key={idx}
                      {...row}
                      button={showRowButtons ? button : undefined}
                      language={language}
                      rowVariant={rowVariant}
                    />
                  </ScrollContainer>
                );
              })}
            </>
          )}

          {showPagination && (
            <Container className="flex flex-row justify-end py-s">
              <Pagination
                currentPage={
                  handlePaginationInternally ? internalPage : currentPage
                }
                totalPages={
                  handlePaginationInternally ? internalTotalPages : totalPages
                }
                pageSize={
                  handlePaginationInternally ? INTERNAL_PAGE_SIZE : pageSize
                }
                onPageChange={
                  handlePaginationInternally ? setInternalPage : onPageChange
                }
                showBottomText={false}
              />
            </Container>
          )}
        </Container>
      ) : (
        <Container
          className="rounded-xs bg-cards-base-l1 text-text-default border border-cards-stroke px-l py-m gap-l flex justify-between items-center cursor-pointer"
          onClick={onToggleExpand}
        >
          <Container className="text-bold-m">
            <SharedLanguageSwitchRenderer
              language={language}
              value={cardTitleLabel}
              value_ar={cardTitleLabel_ar}
            />
          </Container>
          <Container className="text-m">
            <SharedLanguageSwitchRenderer
              language={language}
              value={cardTitleValue}
              value_ar={cardTitleValue_ar}
            />
          </Container>
        </Container>
      )}
      <Container className="flex flex-row gap-s my-s">
        {showFooterButtons &&
          footerButton?.map((button) => (
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
  );
};

export default GenericTableCard;
