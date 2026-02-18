export type TypographyVariant =
  | "h1"
  | "h1-hero"
  | "h1-shouting"
  | "h2"
  | "h3"
  | "h4"
  | "text-xs"
  | "text-sm"
  | "text-md"
  | "text-lg"
  | "text-bold-xxs"
  | "text-bold-xs"
  | "text-bold-sm"
  | "text-bold-md"
  | "text-bold-lg";

export interface TypographyProps {
  variant: TypographyVariant;
  color?: "default" | "dimmed" | "primary" | "link" | "link-hover";
  text: string;
  text_ar?: string;
  language?: "en" | "ar";
}
