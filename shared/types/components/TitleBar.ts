export interface TitleBarProps {
  title?: string;
  title_ar?: string;
  showTitle?: boolean;
  acronym?: string;
  acronym_ar?: string;
  showAcronym?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  buttonLabel_ar?: string;
  buttonType?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
  theme?: "light" | "dark";
  language?: "en" | "ar";
}
