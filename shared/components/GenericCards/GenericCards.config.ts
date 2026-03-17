import { LayoutGridIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import GenericCards, { type IGenericCardsProps } from "./GenericCards";

const GenericCardsConfig: ComponentConfig<IGenericCardsProps> = {
  id: "genericCards",
  icon: LayoutGridIcon,
  name: "Generic Cards (Multiple)",
  Component: GenericCards,
  controls: {
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
  },
};

export default GenericCardsConfig;
