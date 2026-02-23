import React, { type ReactNode } from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";
import { Buttons } from "@platform/Buttons";
import { TextInput } from "@platform/TextInput";
import { CheckboxInput } from "@platform/CheckboxInput";
import { RadioInput } from "@platform/RadioInput";
import { Select } from "@platform/Select";
import { MultiSelect } from "@platform/MultiSelect";

export type ApplicationMessageStatus = "success" | "error" | "information" | "action";
export type ApplicationMessageInputType = "text" | "checkbox" | "radio" | "button";
export type ApplicationMessageFieldType =
  | "text"
  | "date"
  | "select"
  | "textarea"
  | "uaeid"
  | "currency"
  | "phone"
  | "number";

export interface ApplicationMessageInputOption {
  label: string;
  label_ar?: string;
  value: string;
}

export interface ApplicationMessageProps {
  /** Required in source; optional here for backward compat with defaults. */
  title?: string;
  title_ar?: string;
  /** Required in source; optional here for backward compat with defaults. */
  description?: string;
  description_ar?: string;
  status?: ApplicationMessageStatus;
  /** Optional custom icon (overrides status icon when provided). */
  icon?: ReactNode;
  /** When set, shows a primary button with this label. */
  buttonTitle?: string;
  buttonTitle_ar?: string;
  onClick?: () => void;
  onInputChange?: (value: string | string[]) => void;
  language?: "en" | "ar";
  className?: string;
  /** Embedded input type: text, checkbox, radio, button. */
  type?: ApplicationMessageInputType;
  fieldType?: ApplicationMessageFieldType;
  selectType?: "single" | "multi";
  label?: string;
  label_ar?: string;
  value?: string | string[];
  options?: ApplicationMessageInputOption[];
  required?: boolean;
  disabled?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
}

const DEFAULT_TITLE = "Application Submitted Successfully";
const DEFAULT_TITLE_AR = "تم تقديم الطلب بنجاح";
const DEFAULT_DESCRIPTION =
  "Your application has been submitted and is currently under review.";
const DEFAULT_DESCRIPTION_AR = "تم تقديم طلبك وهو قيد المراجعة حالياً.";

/** Status indicator when no custom icon is provided. */
function StatusIndicator({ status }: { status: ApplicationMessageStatus }) {
  const char =
    status === "success" ? "✓" : status === "error" ? "✕" : "ℹ";
  return (
    <Typography variant="text-bold-lg" text={char} language="en" />
  );
}

export const ApplicationMessage: React.FC<ApplicationMessageProps> = ({
  title = DEFAULT_TITLE,
  title_ar = DEFAULT_TITLE_AR,
  description = DEFAULT_DESCRIPTION,
  description_ar = DEFAULT_DESCRIPTION_AR,
  status = "success",
  icon,
  buttonTitle,
  buttonTitle_ar,
  onClick,
  onInputChange,
  language = "en",
  className,
  type,
  fieldType,
  selectType,
  label,
  label_ar,
  value,
  options,
  required,
  disabled,
  showInfoIcon,
  tooltipText,
  tooltipText_ar,
  hasError,
  errorMessage,
  errorMessage_ar,
}) => {
  const titleDisplay =
    language === "ar" ? (title_ar ?? title) : title;
  const descriptionDisplay =
    language === "ar" ? (description_ar ?? description) : description;
  const buttonLabel =
    language === "ar"
      ? (buttonTitle_ar ?? buttonTitle ?? "OK")
      : (buttonTitle ?? "OK");

  const statusClasses: Record<ApplicationMessageStatus, { bg: string; border: string }> = {
    success: {
      bg: "bg-status-success-light",
      border: "border border-solid border-status-success-solid",
    },
    error: {
      bg: "bg-status-failed-light",
      border: "border border-solid border-status-failed-solid",
    },
    information: {
      bg: "bg-status-pending-light",
      border: "border border-solid border-status-pending-solid",
    },
    action: {
      bg: "bg-status-action-light",
      border: "border border-solid border-status-action-solid",
    },
  };
  const { bg, border } =
    statusClasses[status] ??
    ({ border: "border border-solid border-gray-900", bg: "bg-gray-100" });
  const rootClassName = [className, "application-message", `application-message--${status}`, border, bg]
    .filter(Boolean)
    .join(" ");

  const renderInput = () => {
    if (!type && fieldType !== "select") return null;

    if (fieldType === "select") {
      const stringValue =
        typeof value === "string"
          ? value
          : Array.isArray(value)
            ? value.join(",")
            : "";
      if (selectType === "multi") {
        return (
          <MultiSelect
            label={label}
            label_ar={label_ar}
            required={required}
            value={Array.isArray(value) ? value : value ? [value] : []}
            options={options ?? []}
            disabled={disabled}
            language={language}
            placeholder={label}
            placeholder_ar={label_ar}
            onChange={(val) => onInputChange?.(Array.isArray(val) ? val : [val])}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
          />
        );
      }
      return (
        <Select
          label={label}
          label_ar={label_ar}
          required={required}
          value={stringValue}
          options={options ?? []}
          disabled={disabled}
          language={language}
          placeholder={label}
          placeholder_ar={label_ar}
          onChange={(val) => onInputChange?.(val)}
          hasError={hasError}
          errorMessage={errorMessage}
          errorMessage_ar={errorMessage_ar}
        />
      );
    }

    switch (type) {
      case "text":
        return (
          <TextInput
            value={(value as string) ?? ""}
            label={label}
            label_ar={label_ar}
            required={required}
            fieldType={fieldType}
            disabled={disabled}
            language={language}
            showInfoIcon={showInfoIcon}
            tooltipText={tooltipText}
            tooltipText_ar={tooltipText_ar}
            onChange={(val) => onInputChange?.(val)}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
          />
        );
      case "checkbox":
        return options ? (
          <CheckboxInput
            label={label ?? ""}
            label_ar={label_ar}
            required={required}
            options={options.map((opt) => ({
              label: opt.label,
              label_ar: opt.label_ar,
              value: opt.value,
            }))}
            value={Array.isArray(value) ? value : []}
            disabled={disabled}
            language={language}
            onChange={(selected) => onInputChange?.([...selected])}
          />
        ) : null;
      case "radio":
        return options ? (
          <RadioInput
            label={label}
            label_ar={label_ar}
            required={required}
            options={options.map((opt) => ({
              label: opt.label,
              label_ar: opt.label_ar,
              value: opt.value,
            }))}
            value={(value as string) ?? ""}
            disabled={disabled}
            language={language}
            onChange={(val) => onInputChange?.(val)}
          />
        ) : null;
      case "button":
        return (
          <Buttons
            title={label ?? ""}
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
      className={rootClassName}
      style={language === "ar" ? { direction: "rtl" } : { direction: "ltr" }}
    >
      <Container>
        {icon != null ? icon : <StatusIndicator status={status} />}
        <Container>
          <Typography
            variant="text-bold-lg"
            text={titleDisplay}
            text_ar={title_ar ?? title}
            language={language}
          />
          <Typography
            variant="text-s"
            text={descriptionDisplay}
            text_ar={description_ar ?? description}
            language={language}
          />
          {onClick != null && (
            <Buttons
              title={buttonLabel}
              title_ar={buttonTitle_ar ?? buttonTitle ?? "OK"}
              type="primary"
              size="m"
              onClick={onClick}
              language={language}
            />
          )}
          <Container>{renderInput()}</Container>
        </Container>
      </Container>
    </Container>
  );
};

export default ApplicationMessage;
