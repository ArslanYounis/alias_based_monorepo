import type { ReactNode } from "react";

export interface PhoneInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  placeholder?: string;
  placeholder_ar?: string;
  value?: string;
  onChange?: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  icon?: ReactNode;
  disabled?: boolean;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  phoneCode?: string;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  fieldType?:
    | "text"
    | "date"
    | "select"
    | "textarea"
    | "uaeid"
    | "currency"
    | "phone"
    | "number";
  options?: { label?: string; label_ar?: string; value: string }[];
  selectType?: "single" | "multi";
}
