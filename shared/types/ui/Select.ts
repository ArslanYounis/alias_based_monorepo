export interface SelectOption {
  label?: string;
  label_ar?: string;
  value: string;
  description?: string;
  description_ar?: string;
}

export interface SelectProps {
  label: string;
  label_ar?: string;
  required?: boolean;
  isPrint_Archive?: boolean;
  showInfoIcon?: boolean;
  options: SelectOption[];
  title?: string;
  title_ar?: string;
  checked?: string;
  onChange: (checked: string) => void;
  language?: "en" | "ar";
  placeholder?: string;
  placeholder_ar?: string;
  tooltipText?: string;
  tooltipText_ar?: string;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  disabled?: boolean;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  theme?: "dark" | "light";
}
