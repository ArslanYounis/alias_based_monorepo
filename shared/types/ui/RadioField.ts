export interface RadioFieldProps {
  id?: string;
  label?: string;
  label_ar?: string;
  required?: boolean;
  checked?: string;
  onChange?: (_id: string, checked: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
  language?: "en" | "ar";
  theme?: "light" | "dark";
}
