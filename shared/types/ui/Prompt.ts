export interface PromptProps {
  title: string;
  title_ar?: string;
  /** @deprecated typo - use subtitle when added */
  subtiltle: string;
  subtiltle_ar?: string;
  yesText?: string;
  yesText_ar?: string;
  noText?: string;
  noText_ar?: string;
  onYesClick?: () => void;
  onNoClick?: () => void;
  theme?: "light" | "dark";
  language?: "en" | "ar";
}
