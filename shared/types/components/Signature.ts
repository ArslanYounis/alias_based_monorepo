export interface SignatureProps {
  title?: string;
  title_ar?: string;
  theme?: "light" | "dark";
  onSubmit?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
