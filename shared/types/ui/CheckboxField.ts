export interface CheckboxFieldProps {
  id?: string;
  label?: string;
  label_ar?: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
  language?: "en" | "ar";
  theme?: "light" | "dark";
}
