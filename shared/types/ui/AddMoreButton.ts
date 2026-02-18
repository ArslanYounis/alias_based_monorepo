import type { ReactElement } from "react";

export interface AddMoreButtonProps {
  title?: string;
  title_ar?: string;
  language?: "en" | "ar";
  onClick?: () => void;
  plusIcon?: ReactElement;
}
