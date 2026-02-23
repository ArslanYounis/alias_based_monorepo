import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface GenericCardsProps {
  title?: string;
  title_ar?: string;
  itemsPerRow?: "1" | "2" | "3";
  isExpandable?: boolean;
  showBorder?: boolean;
  showButtons?: boolean;
  defaultShowMore?: boolean;
  variant?: string;
  showTitleSection?: boolean;
  buttons?: unknown[];
  cardsData?: unknown[];
}

const controls: ControlsConfig<GenericCardsProps> = {
  title: {
    type: ["text", "code"],
    label: "Title",
    defaultValue: "Items",
    defaultCode: 'return "Items"',
  },
  title_ar: {
    type: ["text", "code"],
    label: "Title (AR)",
    defaultValue: "العناصر",
    defaultCode: 'return "العناصر"',
  },
  itemsPerRow: {
    type: ["select"],
    label: "Items Per Row",
    options: ["1", "2", "3"],
    defaultValue: "1",
  },
  isExpandable: {
    type: ["boolean", "code"],
    label: "Expandable",
    defaultValue: true,
    defaultCode: "return true",
  },
  showBorder: {
    type: ["boolean", "code"],
    label: "Show Border",
    defaultValue: false,
    defaultCode: "return false",
  },
  showButtons: {
    type: ["boolean", "code"],
    label: "Show Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  defaultShowMore: {
    type: ["boolean", "code"],
    label: "Default Show More",
    defaultValue: false,
    defaultCode: "return false",
  },
  variant: {
    type: ["select", "code"],
    label: "Title Variant",
    options: ["large", "medium", "small"],
    defaultValue: "small",
    defaultCode: "return 'small'",
  },
  showTitleSection: {
    type: ["boolean", "code"],
    label: "Show Title Section",
    defaultValue: true,
    defaultCode: "return true",
  },
  buttons: {
    type: ["code"],
    label: "Buttons",
    defaultCode: "return []",
  },
  cardsData: {
    type: ["code"],
    label: "Cards Data",
    defaultCode: "return []",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createGenericCardsConfig(
  Component: ComponentType<GenericCardsProps>,
  icon: IconType
): ComponentConfig<GenericCardsProps> {
  return {
    id: "genericCards",
    icon,
    name: "Generic Cards (Multiple)",
    Component,
    controls,
  };
}
