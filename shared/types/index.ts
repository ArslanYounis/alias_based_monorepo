import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
  onClick?: () => void;
  dir?: "ltr" | "rtl";
}

export interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
  horizontal?: boolean;
}

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

export * from "./ui";
export * from "./components";

