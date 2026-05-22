import type { ReactNode } from "react";

export interface RadioCardProps {
  icon?: ReactNode;
  label?: string;
  label_ar?: string;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  iconLocation?: "top" | "left" | "right" | "bottom";
  disabled?: boolean;
  clicked?: boolean;
  id?: string;
  onClick?: (id?: string) => void;
}
