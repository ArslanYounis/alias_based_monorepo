export interface RadioFieldProps {
  id?: string;
  label?: string;
  label_ar?: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  value?: string;
  language?: "en" | "ar";
  theme?: "light" | "dark";
}
