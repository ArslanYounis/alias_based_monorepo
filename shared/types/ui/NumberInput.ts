import type { ReactNode } from "react";

export interface NumberInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  placeholder?: string;
  placeholder_ar?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  disabled?: boolean;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  language?: "en" | "ar";
  icon?: ReactNode;
}
