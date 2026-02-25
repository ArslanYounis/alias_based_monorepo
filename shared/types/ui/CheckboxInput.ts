export interface CheckboxInputOption {
  label?: string;
  label_ar?: string;
  value: string;
}

export interface CheckboxInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  options?: CheckboxInputOption[];
  language?: "en" | "ar";
  theme?: "light" | "dark";
}
