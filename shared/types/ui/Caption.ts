export interface CaptionProps {
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  hasError?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  theme?: "light" | "dark";
  language?: "en" | "ar";
}
