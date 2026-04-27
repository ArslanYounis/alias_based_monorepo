import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { Fields } from "@platform/Fields";
import { RadioField } from "@platform/RadioField";
import { CheckboxField } from "@platform/CheckboxField";
import { Select } from "@platform/Select";
import { MultiSelect } from "@platform/MultiSelect";
import { TextInput } from "@platform/TextInput";
import { DateSelect } from "@platform/DateSelect";
import { ChevronDownIcon, ChevronUpIcon } from "@platform/icons";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import type { ButtonType } from "../CardTitle";
import type { RadioFieldProps } from "@shared/types";
import type { CheckboxFieldProps } from "@shared/types";
import type { SelectProps } from "@shared/types";
import type { MultiSelectProps } from "@shared/types";
import type { TextInputProps } from "@shared/types";
import type { DateSelectProps } from "@shared/types";

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
  radio?: RadioFieldProps;
  checkbox?: CheckboxFieldProps;
  selectSingle?: SelectProps;
  selectMulti?: MultiSelectProps;
  textInput?: TextInputProps;
  dateField?: DateSelectProps;
}

const Label = ({
  l,
  l_ar,
  language = "en",
}: {
  l?: string;
  l_ar?: string;
  language?: Language;
}) => (
  <Text className="text-bold-m">
    <SharedLanguageSwitchRenderer
      language={language}
      value={l}
      value_ar={l_ar ?? l}
    />
  </Text>
);

const Value = ({
  v,
  v_ar,
  language = "en",
}: {
  v?: string;
  v_ar?: string;
  language?: Language;
}) => (
  <Text className="text-m wrap-break-word min-w-0">
    <SharedLanguageSwitchRenderer
      language={language}
      value={v ?? ""}
      value_ar={v_ar ?? v ?? ""}
    />
  </Text>
);

const FieldRenderer = ({
  item,
  language = "en",
}: {
  item: FieldItem;
  language?: Language;
}) => {
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
  radio,
  checkbox,
  selectSingle,
  selectMulti,
  textInput,
  dateField,
}) => {
  const hasLastColumnControl = !!(button || radio || checkbox || selectSingle || selectMulti || textInput || dateField);
  // Maps each button-column variant to how many value columns it has (excluding label + optional button)
  const buttonLayout: Partial<
    Record<
      Extract<
        RowVariant,
        "3colButton" | "4colButton" | "5colButton" | "6colButton"
      >,
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

  const mainItem: FieldItem = {
    label,
    label_ar,
    value,
    value_ar,
    fieldType,
    imageSrc,
    inputProps,
  };
  const allItems = [mainItem, ...extraItems];

  return (
    <Container className="gap-xl">
      {/* default / defaultNoBorder — two equal columns side by side */}
      {(rowVariant === "default" || rowVariant === "defaultNoBorder") && (
        <Container
          className={`gap-xxs flex flex-row items-center text-text-default py-s ${
            rowVariant === "default" ? "border-b border-border-dimmed" : ""
          }`}
        >
          {/* Each child takes exactly half the width, mirroring grid-cols-2 */}
          <Container className="flex-1 min-w-0">
            <Label l={label ?? ""} l_ar={label_ar} language={language} />
          </Container>
          <Container className="flex-1 min-w-0">
            <Value v={value} v_ar={value_ar} language={language} />
          </Container>
        </Container>
      )}

      {/* bottom — stacks vertically on mobile, two columns on md+ */}
      {rowVariant === "bottom" && (
        <Container className="gap-xxs pb-s flex flex-col md:flex-row flex-wrap items-center text-text-default border-b border-border-dimmed py-s">
          {allItems.map((item, idx) => (
            // Each item takes half the row on md screens (mirrors grid-cols-2)
            <Container key={idx} className="w-full md:w-1/2">
              <Label l={item.label} l_ar={item.label_ar} language={language} />
              <Value v={item.value} v_ar={item.value_ar} language={language} />
            </Container>
          ))}
        </Container>
      )}

      {/* field — label on left, field input on right */}
      {rowVariant === "field" && (
        <Container className="gap-xxs pb-s mt-s text-text-default border-b border-border-dimmed">
          {allItems.map((item, idx) => (
            <Container key={idx} className="flex flex-row items-center gap-xxs">
              {/* Left half — label */}
              <Container className="flex-1 min-w-0">
                <Label
                  l={item.label ?? ""}
                  l_ar={item.label_ar}
                  language={language}
                />
              </Container>
              {/* Right half — field input */}
              <Container className="flex-1 min-w-0">
                <FieldRenderer item={item} language={language} />
              </Container>
            </Container>
          ))}
        </Container>
      )}

      {/* rowImage — left column with up to 3 label/value pairs, right column with image placeholder */}
      {rowVariant === "rowImage" && (
        <Container className="flex flex-row text-text-default">
          {/* Left half */}
          <Container className="flex-1 min-w-0 gap-xxs">
            {allItems.slice(0, 3).map((item, idx) => (
              <Container
                key={idx}
                className={`py-s gap-xxs ${
                  idx < 3 ? "border-b border-border-dimmed" : ""
                }`}
              >
                <Label
                  l={item.label}
                  l_ar={item.label_ar}
                  language={language}
                />
                <Value
                  v={item.value}
                  v_ar={item.value_ar}
                  language={language}
                />
              </Container>
            ))}
          </Container>
          {/* Right half — image placeholder */}
          <Container className="flex-1 min-w-0 flex items-start justify-start">
            <Container className="h-[204px] w-[508px] max-w-full bg-neutral-200" />
          </Container>
        </Container>
      )}

      {/* 3colButton / 4colButton / 5colButton / 6colButton */}
      {currentButtonLayout && (
        <Container className="gap-xxs py-s flex flex-row items-center text-text-default border-b border-border-dimmed">
          {/* Label — takes 1 equal share */}
          <Container className="flex-1 min-w-0 text-bold-m">
            <Label l={label ?? ""} l_ar={label_ar} language={language} />
          </Container>

          {/* Value columns — each takes 1 equal share */}
          {Array.from({ length: currentButtonLayout.valueCount }).map(
            (_, i) => (
              <Container key={i} className="flex-1 min-w-0 text-m">
                <Value
                  v={allItems[i + 1]?.value}
                  v_ar={allItems[i + 1]?.value_ar}
                  language={language}
                />
              </Container>
            )
          )}

          {/* Last column: one of button, radio, checkbox, select, multiselect, textInput, dateField */}
          {hasLastColumnControl && (
            <Container className="flex-1 min-w-0">
              {button && (
                <Buttons
                  title={button.title}
                  title_ar={button.title_ar}
                  type={button.type || "secondary"}
                  size="s"
                  language={language}
                  onClick={button.onClick}
                />
              )}
              {!button && radio && (
                <RadioField {...radio} language={radio.language ?? language} />
              )}
              {!button && !radio && checkbox && (
                <CheckboxField {...checkbox} language={checkbox.language ?? language} />
              )}
              {!button && !radio && !checkbox && selectSingle && (
                <Select {...selectSingle} language={selectSingle.language ?? language} />
              )}
              {!button && !radio && !checkbox && !selectSingle && selectMulti && (
                <MultiSelect {...selectMulti} language={selectMulti.language ?? language} />
              )}
              {!button && !radio && !checkbox && !selectSingle && !selectMulti && textInput && (
                <TextInput {...textInput} language={textInput.language ?? language} />
              )}
              {!button && !radio && !checkbox && !selectSingle && !selectMulti && !textInput && dateField && (
                <DateSelect {...dateField} language={dateField.language ?? language} />
              )}
            </Container>
          )}
        </Container>
      )}

      {/* moreLink — unchanged, already uses Buttons with no layout concern */}
      {rowVariant === "moreLink" && (
        <Container className="flex items-start py-s justify-start">
          <Buttons
            type="text-link"
            size="s"
            language={language}
            title={isMoreShown ? "Less" : "More"}
            title_ar={isMoreShown ? "أقل" : "أكثر"}
            rightIcon={
              isMoreShown ? (
                <ChevronUpIcon size={16} />
              ) : (
                <ChevronDownIcon size={16} />
              )
            }
            onClick={onToggleMore}
          />
        </Container>
      )}
    </Container>
  );
};

export default CardRow;
