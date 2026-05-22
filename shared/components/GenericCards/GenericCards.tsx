import React, { useState, useEffect } from "react";
import GenericCard, { type IGenericCardProps } from "../GenericCard";
import type { ICardRowProps } from "../CardRow";
import type { ButtonType } from "../CardTitle";
import { Container } from "@platform/Container";
import CardTitle from "../CardTitle";

export type GenericCardsButtonType = Omit<ButtonType, "onClick"> & {
  onClick?: (card: IGenericCardItem, index: number) => void;
};

export interface IGenericCardItem
  extends Partial<Omit<IGenericCardProps, "isExpanded" | "onToggleExpand">> {
  id?: string;
  rowsData: ICardRowProps[];
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
}

export interface IGenericCardsProps {
  cardsData: IGenericCardItem[];
  itemsPerRow?: "1" | "2" | "3";
  title?: string;
  title_ar?: string;
  language?: "en" | "ar";
  isExpandable?: boolean;
  defaultShowMore?: boolean;
  showBorder?: boolean;
  showButtons?: boolean;
  buttons?: GenericCardsButtonType[];
  variant?: IGenericCardProps["variant"];
  showTitleSection?: boolean;
  platform?: "web" | "mobile";
}

const GenericCards: React.FC<IGenericCardsProps> = ({
  cardsData,
  itemsPerRow = "1",
  title = "",
  title_ar = "",
  language = "en",
  isExpandable = true,
  defaultShowMore = false,
  showBorder = false,
  showButtons = false,
  buttons = [],
  variant = "small",
  showTitleSection = true,
  platform = "web",
}) => {
 const [expandedIndices, setExpandedIndices] = useState<number[]>(
   cardsData?.map((_, idx) => idx) ?? [],
 );

  useEffect(() => {
    if (cardsData?.length) {
      const indices = cardsData.map((_, idx) => idx);
      setExpandedIndices((prev) => {
        const newIndices = indices.filter((i) => !prev.includes(i));
        return newIndices.length ? [...prev, ...newIndices] : prev;
      });
    }
  }, [cardsData]);

  const allExpanded =
    !!cardsData?.length && expandedIndices.length === cardsData.length;

  const toggleMaster = () => {
    if (!cardsData?.length) return;
    if (allExpanded) {
      setExpandedIndices([]);
    } else {
      setExpandedIndices(cardsData.map((_, idx) => idx));
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      if (prev.length === 0) {
        return [index];
      }
      return prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
    });
  };

  const gridCols =
    itemsPerRow === "3"
      ? "grid-cols-3"
      : itemsPerRow === "2"
        ? "grid-cols-2"
        : "grid-cols-1";

  const isMobile = platform === "mobile";

  return (
    <Container
      className="w-full flex flex-col shrink-0"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Container
        className={
          isMobile ? "flex flex-col gap-xl" : `grid gap-xl ${gridCols}`
        }
        style={
          !isMobile && itemsPerRow !== "1"
            ? { gridAutoFlow: "dense" }
            : undefined
        }
      >
        {isExpandable && cardsData && cardsData.length > 0 ? (
          <Container
            className={
              isMobile
                ? "w-full min-w-0 mb-[-15px]"
                : itemsPerRow === "3"
                  ? "col-span-3 w-full min-w-0 mb-[-15px]"
                  : itemsPerRow === "2"
                    ? "col-span-2 w-full min-w-0 mb-[-15px]"
                    : "w-full min-w-0 mb-[-15px]"
            }
          >
            <CardTitle
              title={title}
              title_ar={title_ar}
              variant="small"
              isExpandable
              isExpanded={allExpanded}
              onToggleExpand={toggleMaster}
              language={language}
              showBorder={false}
            />
          </Container>
        ) : null}
        {cardsData?.map((card, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const buttonsForCard: IGenericCardProps["buttons"] = (
            buttons ?? []
          ).map((btn) => ({
            ...btn,
            onClick:
              btn.onClick != null ? () => btn.onClick!(card, idx) : undefined,
          }));
          const cardProps: IGenericCardProps = {
            title,
            title_ar,
            variant,
            language,
            isExpandable,
            showBorder,
            showButtons,
            buttons: buttonsForCard,
            defaultShowMore,
            showMoreButton: (card.rowsData?.length ?? 0) > 3,
            ...card,
            rowsData: card.rowsData,
            ...(isExpandable
              ? {
                  showTitleSection: false,
                  handleToggleInternally: false,
                  isExpanded,
                  onToggleExpand: () => toggleExpand(idx),
                }
              : {
                  showTitleSection,
                  isExpanded: true,
                  onToggleExpand: () => {},
                }),
            platform,
          };
          return <GenericCard key={card.id ?? idx} {...cardProps} />;
        })}
      </Container>
    </Container>
  );
};

export default GenericCards;
