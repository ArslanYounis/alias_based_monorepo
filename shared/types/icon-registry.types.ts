import type { ComponentType } from "react";

/**
 * Shape of an icon registry item. Web and mobile each provide their own implementation
 * (e.g. web: lucide-react SVG components, mobile: lucide-react-native).
 */
export interface IconRegistryItem {
  iconColor: string;
  component: ComponentType<Record<string, unknown>>;
  types: string[];
}

export type IconRegistry = Record<string, IconRegistryItem>;
