import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { Fields } from "@platform/Fields";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import type { ButtonType } from "../CardTitle";

export type Language = "en" | "ar";

export type RowVariant =
  | "default"
  | "defaultNoBorder"
  | "bottom"
  | "field"
  | "rowImage"
  | "3colButton"
  | "4colButton"
  | "5colButton"
  | "6colButton"
  | "moreLink";

export type FieldType =
  | "text"
  | "date"
  | "select"
  | "textarea"
  | "uaeid"
  | "currency"
  | "phone"
  | "number";

export interface FieldItem {
  label?: string;
  label_ar?: string;
  value?: string;
  value_ar?: string;
  fieldType?: FieldType;
  imageSrc?: string;
  inputProps?: {
    onChange?: (v: string) => void;
    options?: Array<{ label: string; value: string; label_ar?: string }>;
    disabled?: boolean;
    placeholder?: string;
    placeholder_ar?: string;
    value?: string;
  };
}

export interface ICardRowProps {
  label?: string;
  label_ar?: string;
  value?: string;
  value_ar?: string;
  fieldType?: FieldType;
  extraItems?: FieldItem[];
  language?: Language;
  rowVariant?: RowVariant;
  imageSrc?: string;
  inputProps?: FieldItem["inputProps"];
  onToggleMore?: () => void;
  isMoreShown?: boolean;
  button?: ButtonType;
}

const ChevronDownIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ChevronUpIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const Label = ({
  l,
  l_ar,
  language = "en",
}: { l?: string; l_ar?: string; language?: Language }) => (
  <Text className="text-bold-m">
    <SharedLanguageSwitchRenderer language={language} value={l} value_ar={l_ar ?? l} />
  </Text>
);

const Value = ({
  v,
  v_ar,
  language = "en",
}: { v?: string; v_ar?: string; language?: Language }) => (
  <Text className="text-m wrap-break-word min-w-0">
    <SharedLanguageSwitchRenderer language={language} value={v ?? ""} value_ar={v_ar ?? v ?? ""} />
  </Text>
);

const FieldRenderer = ({
  item,
  language = "en",
}: { item: FieldItem; language?: Language }) => {
  const { fieldType = "text", inputProps = {} } = item;
  const commonProps = {
    type: fieldType,
    language,
    value: inputProps.value || item.value || "",
    disabled: inputProps.disabled || false,
    onChange: inputProps.onChange || (() => {}),
    placeholder: inputProps.placeholder,
    placeholder_ar: inputProps.placeholder_ar,
    isPrint_Archive: true,
    options: inputProps.options || [],
  };
  return <Fields {...commonProps} />;
};

const CardRow: React.FC<ICardRowProps> = ({
  label,
  label_ar,
  value,
  value_ar,
  fieldType,
  extraItems = [],
  language = "en",
  rowVariant = "default",
  imageSrc,
  inputProps = {},
  onToggleMore = () => {},
  isMoreShown = true,
  button,
}) => {
  const buttonLayout: Partial<
    Record<Extract<RowVariant, "3colButton" | "4colButton" | "5colButton" | "6colButton">, {
      colsClass: string;
      noButtonColsClass: string;
      valueCount: number;
    }>
  > = {
    "3colButton": { colsClass: "grid-cols-4", noButtonColsClass: "grid-cols-3", valueCount: 2 },
    "4colButton": { colsClass: "grid-cols-5", noButtonColsClass: "grid-cols-4", valueCount: 3 },
    "5colButton": { colsClass: "grid-cols-6", noButtonColsClass: "grid-cols-5", valueCount: 4 },
    "6colButton": { colsClass: "grid-cols-7", noButtonColsClass: "grid-cols-6", valueCount: 5 },
  };

  const currentButtonLayout = rowVariant && buttonLayout[rowVariant as keyof typeof buttonLayout];
  const rowColsClass = currentButtonLayout
    ? button
      ? currentButtonLayout.colsClass
      : currentButtonLayout.noButtonColsClass
    : "";

  const mainItem: FieldItem = { label, label_ar, value, value_ar, fieldType, imageSrc, inputProps };
  const allItems = [mainItem, ...extraItems];

  return (
    <Container className="gap-xl">
      {(rowVariant === "default" || rowVariant === "defaultNoBorder") && (
        <Container
          className={`gap-xxs grid grid-cols-2 items-center text-text-default py-s ${
            rowVariant === "default" ? "border-b border-border-dimmed" : ""
          }`}
        >
          <Label l={label ?? ""} l_ar={label_ar} language={language} />
          <Value v={value} v_ar={value_ar} language={language} />
        </Container>
      )}

      {rowVariant === "bottom" && (
        <Container className="gap-xxs pb-s grid grid-cols-1 md:grid-cols-2 items-center text-text-default border-b border-border-dimmed py-3">
          {allItems.map((item, idx) => (
            <Container key={idx}>
              <Label l={item.label} l_ar={item.label_ar} language={language} />
              <Value v={item.value} v_ar={item.value_ar} language={language} />
            </Container>
          ))}
        </Container>
      )}

      {rowVariant === "field" && (
        <Container className="gap-xxs pb-s mt-s text-text-default border-b border-border-dimmed">
          {allItems.map((item, idx) => (
            <Container key={idx} className="grid grid-cols-2 items-center gap-xxs">
              <Label l={item.label ?? ""} l_ar={item.label_ar} language={language} />
              <Container>
                <FieldRenderer item={item} language={language} />
              </Container>
            </Container>
          ))}
        </Container>
      )}

      {rowVariant === "rowImage" && (
        <Container className="grid grid-cols-2 text-text-default">
          <Container className="gap-xxs">
            {allItems.slice(0, 3).map((item, idx) => (
              <Container
                key={idx}
                className={`py-s gap-xxs ${idx < 3 ? "border-b border-border-dimmed" : ""}`}
              >
                <Label l={item.label} l_ar={item.label_ar} language={language} />
                <Value v={item.value} v_ar={item.value_ar} language={language} />
              </Container>
            ))}
          </Container>
          <Container className="h-[204px] w-[508px] max-w-full bg-neutral-200" />
        </Container>
      )}

      {currentButtonLayout && (
        <Container
          className={`gap-xxs py-s grid ${rowColsClass} items-center text-text-default border-b border-border-dimmed`}
        >
          <Container className="text-bold-m">
            <Label l={label ?? ""} l_ar={label_ar} language={language} />
          </Container>
          {Array.from({ length: currentButtonLayout.valueCount }).map((_, i) => (
            <Container key={i} className="text-m">
              <Value
                v={allItems[i + 1]?.value}
                v_ar={allItems[i + 1]?.value_ar}
                language={language}
              />
            </Container>
          ))}
          {button && (
            <Container>
              <Buttons
                title={button.title}
                title_ar={button.title_ar}
                type={button.type || "secondary"}
                size="s"
                language={language}
                onClick={button.onClick}
              />
            </Container>
          )}
        </Container>
      )}

      {rowVariant === "moreLink" && (
        <Container className="py-s">
          <Buttons
            type="text-link"
            size="s"
            language={language}
            title={isMoreShown ? "Less" : "More"}
            title_ar={isMoreShown ? "أقل" : "أكثر"}
            rightIcon={isMoreShown ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={onToggleMore}
          />
        </Container>
      )}
    </Container>
  );
};

export default CardRow;
