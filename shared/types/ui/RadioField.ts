export interface RadioFieldProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  value?: string;
  language?: "en" | "ar";
}
