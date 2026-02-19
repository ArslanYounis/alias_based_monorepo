import type { SelectOption } from "./Select";

export interface MultiSelectProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  placeholder?: string;
  placeholder_ar?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  disabled?: boolean;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  language?: "en" | "ar";
  options?: SelectOption[];
  maxSelection?: number;
  showAddButton?: boolean;
}
