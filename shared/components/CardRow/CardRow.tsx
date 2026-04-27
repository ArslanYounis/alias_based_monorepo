import React from "react";
import { Text } from "@platform/Text";
import { Fields } from "@platform/Fields";
import { Container } from "@platform/Container";
import { ChevronDownIcon, ChevronUpIcon } from "@platform/icons";

import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

import type { ButtonType } from "../CardTitle";
import { RadioFieldProps } from "@shared/types";

import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { TextInput } from "@platform/TextInput";
import { RadioField } from "@platform/RadioField";
import { DateSelect } from "@platform/DateSelect";
import { MultiSelect } from "@platform/MultiSelect";
import { CheckboxField } from "@platform/CheckboxField";

import type {
  TextInputProps,
  DateSelectProps,
  CheckboxFieldProps,
  MultiSelectProps,
  SelectProps,
} from "@shared/types";

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
  /** Last-column checkbox (DLS CheckboxField) */
  checkbox?: CheckboxFieldProps;
  /** Last-column single select (DLS SingleSelectDropdown) */
  selectSingle?: SelectProps;
  /** Last-column multi select (DLS MultiSelectDropdown) */
  selectMulti?: MultiSelectProps;
  /** Last-column text / number / phone / currency / UAE ID / textarea / select via TextInput */
  textInput?: TextInputProps;
  /** Last-column date (DLS DateField) */
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
  // Maps each button-column variant to how many value columns it has (excluding label + optional button)
  const buttonLayout: Partial<
    Record<
      Extract<
        RowVariant,
        "3colButton" | "4colButton" | "5colButton" | "6colButton"
      >,
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

          {/* Optional button — takes 1 equal share only when present */}
          {button && (
            <Container className="flex-1 min-w-0">
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
          {!button && radio && (
            <Container className="min-w-0">
              <RadioField
                id={radio.id}
                checked={radio.checked}
                label={radio.label}
                label_ar={radio.label_ar}
                disabled={radio.disabled}
                language={language}
                onChange={
                  radio.onChange
                    ? (id, checked) => radio.onChange?.(id, checked)
                    : () => {}
                }
              />
            </Container>
          )}
          {!button && !radio && checkbox && (
            <Container className="min-w-0">
              <CheckboxField
                {...checkbox}
                language={checkbox.language ?? language}
              />
            </Container>
          )}
          {!button && !radio && !checkbox && selectSingle && (
            <Container className="min-w-0 w-full max-w-full">
              <Select
                {...selectSingle}
                isPrint_Archive={true}
                language={selectSingle.language ?? language}
              />
            </Container>
          )}
          {!button && !radio && !checkbox && !selectSingle && selectMulti && (
            <Container className="min-w-0 w-full max-w-full">
              <MultiSelect
                {...selectMulti}
                isPrint_Archive={true}
                language={selectMulti.language ?? language}
              />
            </Container>
          )}
          {!button &&
            !radio &&
            !checkbox &&
            !selectSingle &&
            !selectMulti &&
            textInput && (
              <Container className="min-w-0 w-full max-w-full">
                <TextInput
                  {...textInput}
                  isPrint_Archive={true}
                  language={textInput.language ?? language}
                />
              </Container>
            )}
          {!button &&
            !radio &&
            !checkbox &&
            !selectSingle &&
            !selectMulti &&
            !textInput &&
            dateField && (
              <Container className="min-w-0 w-full max-w-full">
                <DateSelect
                  {...dateField}
                  isPrint_Archive={true}
                  language={dateField.language ?? language}
                />
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
