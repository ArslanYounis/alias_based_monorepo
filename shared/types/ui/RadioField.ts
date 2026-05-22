export interface RadioFieldProps {
  id?: string;
  label?: string;
  label_ar?: string;
  language?: "en" | "ar";
  checked?: string;
  disabled?: boolean;
  hasError?: boolean;
  onChange?: (id: string, checked: boolean) => void;
  theme?: "light" | "dark";
}
