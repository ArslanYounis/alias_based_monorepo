import type { ReactElement } from "react";

export type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text-link"
  | "delete";

export interface TitleBarProps {
  title?: string;
  title_ar?: string;
  showTitle?: boolean;
  acronym?: string;
  acronym_ar?: string;
  acronymBGColor?: string;
  showAcronym?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  buttonLabel_ar?: string;
  buttonType?: ButtonType;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  onClick?: () => void;
  theme?: "light" | "dark";
  language?: "en" | "ar";
}
