export interface PromptProps {
  title: string;
  title_ar?: string;
  subtitle: string;
  subtitle_ar?: string;
  yesText?: string;
  yesText_ar?: string;
  noText?: string;
  noText_ar?: string;
  onYesClick?: () => void;
  onNoClick?: () => void;
  language?: "en" | "ar";
}
