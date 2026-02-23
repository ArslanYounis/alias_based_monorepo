import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";
import { Buttons } from "@platform/Buttons";

export type CardRowVariant = "default" | "moreLink";

export interface CardRowProps {
  label?: string;
  label_ar?: string;
  value?: string;
  value_ar?: string;
  language?: "en" | "ar";
  /** When "moreLink", renders a Show more / Show less control. */
  rowVariant?: CardRowVariant;
  isMoreShown?: boolean;
  onToggleMore?: () => void;
}

export const CardRow: React.FC<CardRowProps> = ({
  label,
  label_ar,
  value,
  value_ar,
  language = "en",
  rowVariant = "default",
  isMoreShown = false,
  onToggleMore = () => {},
}) => {
  if (rowVariant === "moreLink") {
    const showMoreLabel = language === "ar" ? "أكثر" : "More";
    const showLessLabel = language === "ar" ? "أقل" : "Less";
    return (
      <Container className="py-2">
        <Buttons
          type="tertiary"
          size="s"
          title={isMoreShown ? showLessLabel : showMoreLabel}
          title_ar={isMoreShown ? showLessLabel : showMoreLabel}
          onClick={onToggleMore}
          language={language}
        />
      </Container>
    );
  }

  return (
    <Container className="border-b border-border-dimmed py-2">
      <Typography variant="text-bold-md" text={label} text_ar={label_ar ?? label} language={language} />
      <Typography variant="text-md" text={value} text_ar={value_ar ?? value} language={language} />
    </Container>
  );
};
