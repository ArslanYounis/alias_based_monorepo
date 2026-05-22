export interface CheckRadioLabelProps {
  label?: string;
  label_ar?: string;
  disabled?: boolean;
  language?: "en" | "ar";
  theme?: "light" | "dark";
  onClick?: () => void;
  htmlFor?: string;
}
