import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";
import { GenericCard } from "@shared/components/GenericCard";
import type { GenericCardProps } from "@shared/components/GenericCard";

export interface CardDataItem {
  id?: string;
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  rowsData?: { label?: string; label_ar?: string; value?: string; value_ar?: string }[];
}

export interface GenericCardsProps {
  title?: string;
  title_ar?: string;
  itemsPerRow?: string;
  isExpandable?: boolean;
  showBorder?: boolean;
  showButtons?: boolean;
  defaultShowMore?: boolean;
  variant?: string;
  showTitleSection?: boolean;
  buttons?: unknown[];
  cardsData?: CardDataItem[];
  language?: "en" | "ar";
}

export const GenericCards: React.FC<GenericCardsProps> = ({
  title = "Items",
  title_ar = "العناصر",
  cardsData = [],
  variant = "small",
  showTitleSection = true,
  language = "en",
}) => {
  return (
    <Container>
      {showTitleSection && (title || title_ar) && (
        <Typography
          variant="h3"
          text={title}
          text_ar={title_ar || title}
          language={language}
        />
      )}
      {cardsData.map((card, idx) => (
        <GenericCard
          key={card.id ?? idx}
          title={card.cardTitleValue}
          title_ar={card.cardTitleValue_ar || card.cardTitleValue}
          cardTitleLabel={card.cardTitleLabel}
          cardTitleLabel_ar={card.cardTitleLabel_ar || card.cardTitleLabel}
          rowsData={card.rowsData ?? []}
          variant={variant as "large" | "medium" | "small"}
          language={language}
        />
      ))}
    </Container>
  );
};

export default GenericCards;
