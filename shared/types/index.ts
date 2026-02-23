import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
  /** Direction for RTL/LTR layout (e.g. language === "ar" ? "rtl" : "ltr") */
  dir?: "ltr" | "rtl";
  /** Click handler (e.g. for clickable collapsed card block). Web: onClick on div; mobile: onPress on View. */
  onClick?: () => void;
}

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

export * from "./ui";
export * from "./components";

