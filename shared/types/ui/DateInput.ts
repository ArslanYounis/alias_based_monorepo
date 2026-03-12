import type { ReactNode } from "react";

export interface DateInputProps {
  placeholder?: string;
  placeholder_ar?: string;
  hasError?: boolean;
  icon?: ReactNode;
  label?: string;
  label_ar?: string;
  disabled?: boolean;
  onDateChange?: (date: Date | undefined) => void;
  required?: boolean;
  infoText?: string;
  infoText_ar?: string;
  errMessage?: string;
  errMessage_ar?: string;
  errorMessage?: string;
  errorMessage_ar?: string;
  caption?: string;
  caption_ar?: string;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  captionPosition?: "left" | "right";
  language?: "en" | "ar";
  value?: string;
  testId?: string;
}
