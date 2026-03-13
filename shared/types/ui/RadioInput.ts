import type { SelectOption } from "./Select";

export interface RadioInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  value?: string;
  checked?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  options?: SelectOption[];
  language?: "en" | "ar";
  theme?: "light" | "dark";
}
