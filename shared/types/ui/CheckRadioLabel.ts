export interface CheckRadioLabelProps {
  label?: string;
  label_ar?: string;
  disabled?: boolean;
  language?: "en" | "ar";
  onClick?: () => void;
  htmlFor?: string;
}
