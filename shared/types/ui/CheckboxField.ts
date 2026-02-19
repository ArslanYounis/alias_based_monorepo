export interface CheckboxFieldProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  language?: "en" | "ar";
}
