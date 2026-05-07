import React from "react";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { RadioInput } from "@platform/RadioInput";
import { CheckboxInput } from "@platform/CheckboxInput";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import {
  AppMessageSuccessIcon,
  AppMessageErrorIcon,
  AppMessageInformationIcon,
  AppMessageActionIcon,
} from "@platform/icons";

type ApplicationStatus = "success" | "error" | "information" | "action";
type InputType = "text" | "checkbox" | "radio" | "button";
type FieldType =
  | "text"
  | "date"
  | "select"
  | "textarea"
  | "uaeid"
  | "currency"
  | "phone"
  | "number";

// Option type for checkbox/radio
interface InputOption {
  label: string;
  label_ar?: string;
  value: string;
}

export interface ApplicationMessageProps {
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status?: ApplicationStatus;
  language?: "en" | "ar";
  /*  Flattened input props */
  type?: InputType;
  fieldType?: FieldType;
  selectType?: "single" | "multi";
  label?: string;
  label_ar?: string;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  value?: string | string[];
  options?: InputOption[];

  onClick?: () => void;
  onInputChange?: (value: string | string[]) => void;
  platform?: "web" | "mobile";
}

const ApplicationMessage: React.FC<ApplicationMessageProps> = ({
  title,
  title_ar,
  description,
  description_ar,
  language = "en",
  status = "success",
  type,
  fieldType,
  selectType,
  label,
  label_ar,
  showInfoIcon,
  tooltipText,
  tooltipText_ar,
  disabled,
  required,
  value,
  options,
  hasError,
  errorMessage,
  errorMessage_ar,
  onClick,
  onInputChange,
  platform = "web",
}) => {
  const getStyles = () => {
    switch (status) {
      case "success":
        return {
          bg: "bg-status-success-light",
          border: "border border-solid border-status-success-solid",
          icon: <AppMessageSuccessIcon />,
        };
      case "error":
        return {
          bg: "bg-status-failed-light",
          border: "border border-solid border-status-failed-solid",
          icon: <AppMessageErrorIcon />,
        };
      case "information":
        return {
          bg: "bg-status-pending-light",
          border: "border border-solid border-status-pending-solid",
          icon: <AppMessageInformationIcon />,
        };
      case "action":
        return {
          bg: "bg-status-action-light",
          border: "border border-solid border-status-action-solid",
          icon: <AppMessageActionIcon />,
        };
      default:
        return {
          border: "border border-solid border-gray-900",
          bg: "bg-gray-100",
          icon: null,
        };
    }
  };

  const { border, bg, icon } = getStyles();

  // Render input based on type
  const renderInput = () => {
    if (!type && fieldType !== "select") return null;

    /* Select / Multi-select */
    if (fieldType === "select") {
      return (
        <Container className="w-full">
          <TextInput
            fieldType="select"
            label={label}
            label_ar={label_ar}
            required={required}
            value={
              typeof value === "string"
                ? value
                : Array.isArray(value)
                ? value.join(",")
                : ""
            }
            options={options || []}
            selectType={selectType === "multi" ? "multi" : "single"}
            disabled={disabled}
            language={language}
            placeholder={label}
            placeholder_ar={label_ar}
            onChange={(val: string) => {
              if (selectType === "multi") {
                onInputChange?.(val.split(",").map((v) => v.trim()));
              } else {
                onInputChange?.(val);
              }
            }}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
          />
        </Container>
      );
    }

    switch (type) {
      case "text":
        return (
          <TextInput
            value={value as string}
            label={label}
            label_ar={label_ar}
            required={required}
            fieldType={fieldType}
            disabled={disabled}
            language={language}
            showInfoIcon={showInfoIcon}
            tooltipText={tooltipText}
            tooltipText_ar={tooltipText_ar}
            onChange={(val: string) => onInputChange?.(val)}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
          />
        );

      case "checkbox":
        return options ? (
          <CheckboxInput
            label={label || ""}
            label_ar={label_ar}
            required={required}
            options={options.map((opt) => ({
              label: language === "en" ? opt.label : opt.label_ar ?? opt.label,
              value: opt.value,
            }))}
            value={Array.isArray(value) ? value : []}
            disabled={disabled}
            language={language}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
            showInfoIcon={showInfoIcon}
            tooltipText={tooltipText}
            tooltipText_ar={tooltipText_ar}
            onChange={(selected: string[]) => {
              onInputChange?.([...selected]);
            }}
          />
        ) : null;

      case "radio":
        return options ? (
          <RadioInput
            label={label}
            label_ar={label_ar}
            required={required}
            options={options.map((opt) => ({
              label: language === "en" ? opt.label : opt.label_ar ?? opt.label,
              value: opt.value,
            }))}
            checked={value as string}
            disabled={disabled}
            language={language}
            showInfoIcon={showInfoIcon}
            tooltipText={tooltipText}
            tooltipText_ar={tooltipText_ar}
            onChange={(val: string) => onInputChange?.(val)}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
          />
        ) : null;

      case "button":
        return (
          <Buttons
            title={label}
            title_ar={label_ar}
            disabled={disabled}
            language={language}
            onClick={onClick}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container
      dir={language === "en" ? "ltr" : "rtl"}
      className={`h-auto w-full px-m py-s gap-m rounded-s ${border} ${bg} flex justify-start items-start`}
    >
      <Container className="flex flex-row items-start gap-l">
        {icon}
        <Container className="space-y-2 flex-1">
          <Text className="text-bold-l text-structure-menu-select-text pb-0.5">
            <SharedLanguageSwitchRenderer
              language={language}
              value={title}
              value_ar={title_ar}
            />
          </Text>
          <Text className="text-s text-structure-menu-select-text w-full">
            <SharedLanguageSwitchRenderer
              language={language}
              value={description}
              value_ar={description_ar}
            />
          </Text>

          <Container className="flex items-center gap-m mt-s flex-wrap">
            {renderInput()}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default ApplicationMessage;
