import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";
import { Buttons } from "@platform/Buttons";

export interface ButtonType {
  title: string;
  title_ar?: string;
  size?: "s" | "m" | "l";
  type?: "primary" | "secondary" | "tertiary" | "delete";
  onClick?: () => void;
  disabled?: boolean;
}

export interface CardTitleProps {
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  language?: "en" | "ar";
  variant?: "large" | "medium" | "small";
  isExpandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  subText?: string;
  subText_ar?: string;
  status?: string;
  status_ar?: string;
  showButtons?: boolean;
  buttons?: ButtonType[];
  showTitleButtons?: boolean;
  titleButtons?: ButtonType[];
  showBorder?: boolean;
}

const variantMap: Record<"large" | "medium" | "small", "h3" | "text-bold-lg" | "text-bold-md"> = {
  large: "h3",
  medium: "text-bold-lg",
  small: "text-bold-md",
};

export const CardTitle: React.FC<CardTitleProps> = ({
  title = "",
  title_ar = "",
  description,
  description_ar,
  language = "en",
  variant = "medium",
  isExpandable = false,
  isExpanded = false,
  onToggleExpand = () => {},
  subText,
  subText_ar,
  status,
  status_ar,
  showButtons = false,
  showTitleButtons = false,
  buttons = [],
  titleButtons = [],
  showBorder = true,
}) => {
  const typoVariant = variantMap[variant];
  const shouldShowBorder =
    showBorder &&
    Boolean(
      subText ||
        subText_ar ||
        status ||
        status_ar ||
        (isExpandable && !isExpanded)
    );

  return (
    <Container>
      <Container>
        <Typography
          variant={typoVariant}
          text={title}
          text_ar={title_ar || title}
          language={language}
        />
        {!(description || description_ar) && (subText || subText_ar) && (
          <Typography
            variant="text-md"
            text={subText || ""}
            text_ar={subText_ar || subText || ""}
            language={language}
          />
        )}
      </Container>
      <Container>
        {(status || status_ar) && (
          <Typography
            variant="text-xs"
            text={status || ""}
            text_ar={status_ar || status || ""}
            language={language}
          />
        )}
        {showButtons && buttons?.length > 0 &&
          buttons.map((btn, idx) => (
            <Buttons
              key={idx}
              size="s"
              title={btn.title}
              title_ar={btn.title_ar}
              type={btn.type || "secondary"}
              onClick={btn.onClick}
              language={language}
            />
          ))}
        {isExpandable && (
          <Buttons
            size="s"
            type="tertiary"
            title={isExpanded ? "Collapse" : "Expand"}
            onClick={onToggleExpand}
            language={language}
          />
        )}
        {!isExpandable && showTitleButtons && titleButtons?.length > 0 &&
          titleButtons.map((btn, idx) => (
            <Buttons
              key={idx}
              size="s"
              title={btn.title}
              title_ar={btn.title_ar}
              type={btn.type || "secondary"}
              onClick={btn.onClick}
              language={language}
            />
          ))}
      </Container>
          {(description || description_ar) && (
        <Container>
          <Typography
            variant="text-md"
            text={description ?? ""}
            text_ar={description_ar || description ?? ""}
            language={language}
          />
          {(subText || subText_ar) && (
            <Typography
              variant="text-sm"
              text={subText || ""}
              text_ar={subText_ar || subText || ""}
              language={language}
            />
          )}
        </Container>
      )}
    </Container>
  );
};

export default CardTitle;
