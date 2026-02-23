import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";
import { GenericCard } from "@shared/components/GenericCard";
import type { GenericCardProps } from "@shared/components/GenericCard";
import type { ButtonType } from "@shared/components/CardTitle";

export interface CardDataItem {
  id?: string;
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  rowsData?: { label?: string; label_ar?: string; value?: string; value_ar?: string }[];
}

/** Button type for GenericCards: onClick receives the card data and index for that card. */
export type GenericCardsButtonType = Omit<ButtonType, "onClick"> & {
  onClick?: (card: CardDataItem, index: number) => void;
};

export interface GenericCardsProps {
  title?: string;
  title_ar?: string;
  /** Number of cards per row: "1", "2", or "3". */
  itemsPerRow?: "1" | "2" | "3";
  isExpandable?: boolean;
  showBorder?: boolean;
  showButtons?: boolean;
  defaultShowMore?: boolean;
  variant?: GenericCardProps["variant"];
  showTitleSection?: boolean;
  /** Shared buttons for each card. onClick(card, index) receives that card's data and index. */
  buttons?: GenericCardsButtonType[];
  cardsData?: CardDataItem[];
  language?: "en" | "ar";
}

export const GenericCards: React.FC<GenericCardsProps> = ({
  title = "Items",
  title_ar = "العناصر",
  cardsData = [],
  itemsPerRow = "1",
  variant = "small",
  showTitleSection = true,
  isExpandable = true,
  showBorder = false,
  showButtons = false,
  buttons = [],
  defaultShowMore = false,
  language = "en",
}) => {
  const [expandedIndices, setExpandedIndices] = React.useState<number[]>(
    cardsData?.map((_, idx) => idx) ?? []
  );

  React.useEffect(() => {
    if (cardsData?.length) {
      const indices = cardsData.map((_, idx) => idx);
      setExpandedIndices((prev) => {
        const newIndices = indices.filter((i) => !prev.includes(i));
        return newIndices.length ? [...prev, ...newIndices] : prev;
      });
    }
  }, [cardsData]);

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const gridCols =
    itemsPerRow === "3" ? "grid-cols-3" : itemsPerRow === "2" ? "grid-cols-2" : "grid-cols-1";

  return (
    <Container className="w-full flex flex-col shrink-0">
      {showTitleSection && (title || title_ar) && (
        <Typography
          variant="h3"
          text={title}
          text_ar={title_ar || title}
          language={language}
        />
      )}
      <Container
        className={`grid gap-8 ${gridCols}`}
        style={itemsPerRow !== "1" ? { gridAutoFlow: "dense" } : undefined}
      >
        {cardsData.map((card, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const buttonsForCard: GenericCardProps["buttons"] = (buttons ?? []).map((btn) => ({
            ...btn,
            onClick:
              btn.onClick != null ? () => btn.onClick!(card, idx) : undefined,
          }));
          return (
            <GenericCard
              key={card.id ?? idx}
              title={card.cardTitleLabel ?? card.cardTitleValue}
              title_ar={card.cardTitleLabel_ar ?? card.cardTitleValue_ar ?? card.cardTitleLabel ?? card.cardTitleValue}
              cardTitleLabel={card.cardTitleLabel}
              cardTitleLabel_ar={card.cardTitleLabel_ar ?? card.cardTitleLabel}
              cardTitleValue={card.cardTitleValue}
              cardTitleValue_ar={card.cardTitleValue_ar ?? card.cardTitleValue}
              rowsData={card.rowsData ?? []}
              variant={variant}
              isExpandable={isExpandable}
              handleToggleInternally={false}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(idx)}
              showBorder={showBorder}
              showButtons={showButtons}
              buttons={buttonsForCard}
              defaultShowMore={defaultShowMore}
              showMoreButton={(card.rowsData?.length ?? 0) > 3}
              language={language}
            />
          );
        })}
      </Container>
    </Container>
  );
};

export default GenericCards;
