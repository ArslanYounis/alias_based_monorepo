import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
}

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

export * from "./ui";
export * from "./components";

