export type TooltipDirection =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";

export interface LabelProps {
  label: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  tooltipDirection?: TooltipDirection;
  disabled?: boolean;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  htmlFor?: string;
}
