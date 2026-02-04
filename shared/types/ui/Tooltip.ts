export type TooltipDirectionType =
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

export interface TooltipProps {
  text: string;
  text_ar?: string;
  language?: "en" | "ar";
  direction?: TooltipDirectionType;
}
