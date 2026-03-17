import type { IconRegistry } from "@shared/types/icon-registry.types";
import { ArrowRight, ArrowLeft, Luggage } from "lucide-react-native";

/**
 * Mobile icon registry. Uses lucide-react-native icons.
 * Web keeps its own implementation; both export the same shape.
 */
export const iconRegistry: IconRegistry = {
  ArrowRight: {
    iconColor: "#000000",
    component: ArrowRight,
    types: ["button", "input", "form"],
  },
  ArrowLeft: {
    iconColor: "#000000",
    component: ArrowLeft,
    types: ["button", "input", "form"],
  },
  Luggage: {
    iconColor: "#000000",
    component: Luggage,
    types: ["button", "input", "form"],
  },
};
