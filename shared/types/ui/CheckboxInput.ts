export interface CheckboxInputOption {
  label?: string;
  label_ar?: string;
  value: string;
}

export interface CheckboxInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  options?: CheckboxInputOption[];
  language?: "en" | "ar";
}
