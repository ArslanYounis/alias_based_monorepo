import type { ComponentType, SVGProps } from "react";
import ArrowRight from "@/assets/svg/arrowRight";
import ArrowLeft from "@/assets/svg/arrowLeft";
import { Luggage } from "lucide-react";

export interface IconRegistryItem {
  iconColor: string;
  component: ComponentType<SVGProps<SVGSVGElement>>;
  types: string[]; // Component IDs that can use this icon (e.g., ["button", "breadcrumb"])
}

export const iconRegistry: Record<string, IconRegistryItem> = {
  ArrowRight: {
    iconColor: "#000000",
    component: ArrowRight,
    types: ["button", "input"],
  },
  ArrowLeft: {
    iconColor: "#000000",
    component: ArrowLeft,
    types: ["button", "input"],
  },
  Luggage: {
    iconColor: "#000000",
    component: Luggage,
    types: ["button", "input"],
  },
};
