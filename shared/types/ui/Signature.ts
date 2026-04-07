export interface SignatureProps {
  language?: "en" | "ar";
  theme?: "light" | "dark";
  title?: string;
  title_ar?: string;
  buttonText?: string;
  buttonText_ar?: string;
  onSubmit?: (val: { signature: string }) => void;
}
