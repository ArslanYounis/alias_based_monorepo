import type { SelectOption } from "./Select";

export interface RadioInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  options?: SelectOption[];
  language?: "en" | "ar";
}
