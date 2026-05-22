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

/** Controls what appears in the last column when `showRowButtons` is true. Row data should supply the matching prop (`button`, `radio`, `checkbox`, `selectSingle`, `selectMulti`, `textInput`, or `dateField`). */
export type GenericTableLastColItem =
  | "button"
  | "radio"
  | "checkbox"
  | "selectSingle"
  | "selectMulti"
  | "input"
  | "date";

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
  lastColItem?: GenericTableLastColItem;
}

const INTERNAL_PAGE_SIZE = 3;
const colClass = "flex-1 min-w-[120px]";

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
  lastColItem = "button",
}) => {
  const [isMoreShown, setIsMoreShown] = useState(defaultShowMore);
  const [internalPage, setInternalPage] = useState(1);

  const internalTotalPages = Math.ceil(
    (rowsData?.length ?? 0) / INTERNAL_PAGE_SIZE
  );
  const rowsToShow =
    handlePaginationInternally && showPagination
      ? (rowsData?.slice(
          (internalPage - 1) * INTERNAL_PAGE_SIZE,
          internalPage * INTERNAL_PAGE_SIZE,
        ) ?? [])
      : rowsData?.slice(0, isMoreShown ? rowsData.length : 10) ?? [];

  // Maps each variant to how many value columns exist (excluding label + optional button col)
  const buttonLayout: Partial<
    Record<
      NonNullable<IGenericTableCardProps["rowVariant"]>,
      {
        colsClass: string;
        noButtonColsClass: string;
        valueCount: number;
      }
    >
  > = {
    "3colButton": {
      colsClass: "grid-cols-4",
      noButtonColsClass: "grid-cols-3",
      valueCount: 2,
    },
    "4colButton": {
      colsClass: "grid-cols-5",
      noButtonColsClass: "grid-cols-4",
      valueCount: 3,
    },
    "5colButton": {
      colsClass: "grid-cols-6",
      noButtonColsClass: "grid-cols-5",
      valueCount: 4,
    },
    "6colButton": {
      colsClass: "grid-cols-7",
      noButtonColsClass: "grid-cols-6",
      valueCount: 5,
    },
  };

  const currentButtonLayout =
    rowVariant &&
    buttonLayout[
      rowVariant as NonNullable<IGenericTableCardProps["rowVariant"]>
    ];

  const headerColsClass = currentButtonLayout
    ? showRowButtons
      ? currentButtonLayout.colsClass
      : currentButtonLayout.noButtonColsClass
    : "";

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
                <Container
                  className={`gap-xxs py-s grid ${headerColsClass} items-center text-text-default border-b border-border-dimmed`}
                >
                  {columnsData
                    .slice(0, (currentButtonLayout?.valueCount ?? 0) + 1)
                    .map(
                      (
                        column: {
                          key?: string;
                          label: string;
                          label_ar?: string;
                        },
                        idx: number
                      ) => (
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
                      )
                    )}
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
                    button={
                      showRowButtons && lastColItem === "button"
                        ? button
                        : undefined
                    }
                    radio={
                      showRowButtons && lastColItem === "radio"
                        ? row.radio
                        : undefined
                    }
                    checkbox={
                      showRowButtons && lastColItem === "checkbox"
                        ? row.checkbox
                        : undefined
                    }
                    selectSingle={
                      showRowButtons && lastColItem === "selectSingle"
                        ? row.selectSingle
                        : undefined
                    }
                    selectMulti={
                      showRowButtons && lastColItem === "selectMulti"
                        ? row.selectMulti
                        : undefined
                    }
                    textInput={
                      showRowButtons && lastColItem === "input"
                        ? row.textInput
                        : undefined
                    }
                    dateField={
                      showRowButtons && lastColItem === "date"
                        ? row.dateField
                        : undefined
                    }
                    language={language}
                    rowVariant={rowVariant}
                  />
                );
              })}
            </>
          ) : (
            (() => {
              const COL_WIDTH = 120;
              const colCount = currentButtonLayout
                ? currentButtonLayout.valueCount + 1 + (showRowButtons ? 1 : 0)
                : 0;
              const tableWidth = colCount * COL_WIDTH;
              return (
                <ScrollContainer horizontal className="w-full">
                  <Container
                    className="flex flex-col"
                    style={tableWidth > 0 ? { width: tableWidth } : undefined}
                  >
                    {/* Column header row — lives in the same scroll container so headers and rows scroll together */}
                    {currentButtonLayout &&
                      columnsData &&
                      columnsData.length > 0 && (
                        <Container className="flex flex-row border-b border-border-dimmed">
                          {columnsData
                            .slice(0, (currentButtonLayout?.valueCount ?? 0) + 1)
                            .map(
                              (
                                column: {
                                  key?: string;
                                  label: string;
                                  label_ar?: string;
                                },
                                idx: number
                              ) => (
                                <Container
                                  key={column.key ?? idx}
                                  className="flex-1 px-xs py-s"
                                >
                                  <Text className="text-bold-m whitespace-normal wrap-break-word">
                                    <SharedLanguageSwitchRenderer
                                      language={language}
                                      value={column.label}
                                      value_ar={column.label_ar}
                                    />
                                  </Text>
                                </Container>
                              )
                            )}
                          {showRowButtons && (
                            <Container className="flex-1 px-xs py-s" />
                          )}
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
                          button={
                            showRowButtons && lastColItem === "button"
                              ? button
                              : undefined
                          }
                          radio={
                            showRowButtons && lastColItem === "radio"
                              ? row.radio
                              : undefined
                          }
                          checkbox={
                            showRowButtons && lastColItem === "checkbox"
                              ? row.checkbox
                              : undefined
                          }
                          selectSingle={
                            showRowButtons && lastColItem === "selectSingle"
                              ? row.selectSingle
                              : undefined
                          }
                          selectMulti={
                            showRowButtons && lastColItem === "selectMulti"
                              ? row.selectMulti
                              : undefined
                          }
                          textInput={
                            showRowButtons && lastColItem === "input"
                              ? row.textInput
                              : undefined
                          }
                          dateField={
                            showRowButtons && lastColItem === "date"
                              ? row.dateField
                              : undefined
                          }
                          language={language}
                          rowVariant={rowVariant}
                          platform={platform}
                        />
                      );
                    })}
                  </Container>
                </ScrollContainer>
              );
            })()
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
