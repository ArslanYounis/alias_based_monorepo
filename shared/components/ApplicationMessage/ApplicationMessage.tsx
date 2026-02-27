import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { TextInput } from "@platform/TextInput";
import { CheckboxInput } from "@platform/CheckboxInput";
import { RadioInput } from "@platform/RadioInput";

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
  description: string;
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

  /* Platform-injected status icons (optional; pass the icon node for current platform) */
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  informationIcon?: React.ReactNode;
  actionIcon?: React.ReactNode;
}

const ApplicationMessage: React.FC<ApplicationMessageProps> = ({
  title,
  description,
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
  successIcon,
  errorIcon,
  informationIcon,
  actionIcon,
}) => {
  const getStyles = () => {
    switch (status) {
      case "success":
        return {
          bg: "bg-status-success-light",
          border: "border border-solid border-status-success-solid",
          icon: successIcon ?? null,
        };
      case "error":
        return {
          bg: "bg-status-failed-light",
          border: "border border-solid border-status-failed-solid",
          icon: errorIcon ?? null,
        };
      case "information":
        return {
          bg: "bg-status-pending-light",
          border: "border border-solid border-status-pending-solid",
          icon: informationIcon ?? null,
        };
      case "action":
        return {
          bg: "bg-status-action-light",
          border: "border border-solid border-status-action-solid",
          icon: actionIcon ?? null,
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
      <Container className="flex items-start gap-l">
        {icon}
        <Container className="space-y-2">
          <Text className="text-bold-l text-structure-menu-select-text pb-0.5">
            {title}
          </Text>
          <Text className="text-s text-structure-menu-select-text w-full">
            {description}
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
