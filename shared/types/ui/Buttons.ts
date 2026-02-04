import type { ReactElement } from "react";

export interface ButtonsProps {
  language?: "en" | "ar";
  size?: "s" | "m" | "l";
  fullWidth?: boolean;
  title?: string;
  title_ar?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  disabled?: boolean;
  type?: "primary" | "secondary" | "tertiary" | "text-link" | "delete";
  buttonType?: "button" | "submit" | "reset";
  onClick?: () => void;
  iconColor?: string;
  tooltip?: {
    text: string;
    text_ar?: string;
    language?: "en" | "ar";
    direction?:
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
      | "right-bottom"
      | "none";
  };
}
