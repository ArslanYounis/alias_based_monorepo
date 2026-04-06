import type { ReactElement } from "react";

export interface IconProp {
  iconName: string;
  iconColor: string;
  iconType?: "remote" | "lucide";
  iconWidth?: number;
  iconHeight?: number;
}

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
  theme?: "light" | "dark";
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
  showIconOnMobile?: boolean;
  mobileIcon?: IconProp | null;
}
