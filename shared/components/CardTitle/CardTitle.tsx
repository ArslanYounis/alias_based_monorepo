import React, { type ReactElement } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { ChevronDownIcon, ChevronUpIcon } from "@platform/icons";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export type ButtonType = {
  title: string;
  title_ar?: string;
  size?: "s" | "m" | "l";
  type?: "primary" | "secondary" | "tertiary" | "delete";
  onClick?: () => void;
  disabled?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
};

export interface ICardTitleProps {
  title: string;
  title_ar: string;
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

const CardTitle: React.FC<ICardTitleProps> = ({
  title,
  title_ar,
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
  const variantStyles = {
    large: { title: "text-heading-h3", subText: "text-m" },
    medium: { title: "text-bold-l", subText: "text-m" },
    small: { title: "text-bold-ml", subText: "text-s" },
  }[variant];

  const shouldShowBorder =
    showBorder &&
    (!!subText || !!subText_ar || !!status || !!status_ar || (isExpandable && !isExpanded));

  return (
    <Container
      className={`flex flex-col flex-1 pb-s ${
        shouldShowBorder ? "border-b border-b-border-dimmed mb-m" : ""
      }`}
    >
      <Container
        className={`flex flex-1 ${
          description || description_ar ? "items-start" : "items-center"
        } justify-between`}
      >
        <Container
          className={`flex ${
            description || description_ar
              ? "flex-col items-start flex-1 min-w-0 gap-xs"
              : `flex-row items-center flex-1 min-w-0 ${
                  subText || subText_ar ? "justify-between" : ""
                }`
          }`}
        >
          <Text
            className={`${variantStyles.title} font-bold text-text-default wrap-break-word whitespace-normal min-w-0`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={title}
              value_ar={title_ar || title}
            />
          </Text>
          {!(description || description_ar) && (subText || subText_ar) && (
            <Text className={`${variantStyles.subText} text-text-default`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={subText || ""}
                value_ar={subText_ar || subText || ""}
              />
            </Text>
          )}
        </Container>
        <Container className="flex items-center gap-xs">
          {(status || status_ar) && (
            <Container className="w-[60px] h-[24px] flex items-center justify-center rounded-xxl bg-status-pending-fade text-status-pending-solid py-xxs px-xs gap-sm">
              <Text className="text-xs">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={status || ""}
                  value_ar={status_ar || status || ""}
                />
              </Text>
            </Container>
          )}
          {showButtons && buttons?.length > 0 && (
            <Container className="flex items-center justify-between gap-xs">
              {buttons?.map((btn: ButtonType, idx: number) => (
                <Buttons
                  // Buttons is platform-specific; we rely on it for clickability
                  key={idx}
                  size="s"
                  title={btn.title}
                  title_ar={btn.title_ar}
                  type={btn.type || "secondary"}
                  onClick={btn.onClick}
                  language={language}
                  leftIcon={btn.leftIcon}
                  rightIcon={btn.rightIcon}
                />
              ))}
            </Container>
          )}
          {isExpandable && (
            <Buttons
              size="s"
              type="tertiary"
              language={language}
              title=""
              onClick={onToggleExpand}
              leftIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            />
          )}
          {!isExpandable && showTitleButtons && titleButtons?.length > 0 && (
            <Container className="flex items-center justify-between gap-xs">
              {titleButtons?.map((btn: ButtonType, idx: number) => (
                <Buttons
                  key={idx}
                  size="s"
                  title={btn.title}
                  title_ar={btn.title_ar}
                  type={btn.type || "secondary"}
                  onClick={btn.onClick}
                  language={language}
                  leftIcon={btn.leftIcon}
                  rightIcon={btn.rightIcon}
                />
              ))}
            </Container>
          )}
        </Container>
      </Container>
      {(description || description_ar) && (
        <Container className="flex items-center justify-between w-full mt-xs">
          <Text className="text-text-default text-m">
            <SharedLanguageSwitchRenderer
              language={language}
              value={description}
              value_ar={description_ar || description}
            />
          </Text>
          {(subText || subText_ar) && (
            <Text className={`${variantStyles.subText} text-text-default`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={subText || ""}
                value_ar={subText_ar || subText || ""}
              />
            </Text>
          )}
        </Container>
      )}
    </Container>
  );
};

export default CardTitle;
