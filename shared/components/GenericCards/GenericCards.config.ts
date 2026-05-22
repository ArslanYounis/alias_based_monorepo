/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { IGenericCardsProps } from "./GenericCards";
import type { ComponentType } from "react";

const controls: ComponentConfig<IGenericCardsProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Items",
    defaultCode: 'return "Items"',
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
    defaultValue: [
      {
        title: "View",
        title_ar: "عرض",
        type: "secondary",
        onClick: () => console.log("View clicked"),
      },
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => console.log("Edit clicked"),
      },
    ],
    defaultCode: `
return [
  {
    title: "View",
    title_ar: "عرض",
    type: "secondary",
    onClick: (card, index) => console.log("View clicked", card, index)
  },
  {
    title: "Edit",
    title_ar: "تعديل",
    type: "secondary",
    onClick: (card, index) => console.log("Edit clicked", card, index)
  }
];
      `,
  },
  cardsData: {
    type: ["code"],
    label: "Cards Data",
    defaultValue: [
      {
        id: "card-1",
        cardTitleValue: "Item One",
        cardTitleValue_ar: "العنصر الأول",
        cardTitleLabel: "Name",
        cardTitleLabel_ar: "الاسم",
        rowsData: [
          {
            label: "Field A",
            label_ar: "الحقل أ",
            value: "Value A",
            value_ar: "القيمة أ",
          },
          {
            label: "Field B",
            label_ar: "الحقل ب",
            value: "Value B",
            value_ar: "القيمة ب",
          },
        ],
      },
      {
        id: "card-2",
        cardTitleValue: "Item Two",
        cardTitleValue_ar: "العنصر الثاني",
        cardTitleLabel: "Name",
        cardTitleLabel_ar: "الاسم",
        rowsData: [
          {
            label: "Field A",
            label_ar: "الحقل أ",
            value: "Value A2",
            value_ar: "القيمة أ٢",
          },
          {
            label: "Field B",
            label_ar: "الحقل ب",
            value: "Value B2",
            value_ar: "القيمة ب٢",
          },
        ],
      },
    ],
    defaultCode: `return [
  {
    id: "card-1",
    cardTitleValue: "Item One",
    cardTitleValue_ar: "العنصر الأول",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    rowsData: [
      { label: "Field A", label_ar: "الحقل أ", value: "Value A", value_ar: "القيمة أ" },
      { label: "Field B", label_ar: "الحقل ب", value: "Value B", value_ar: "القيمة ب" }
    ]
  },
  {
    id: "card-2",
    cardTitleValue: "Item Two",
    cardTitleValue_ar: "العنصر الثاني",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    rowsData: [
      { label: "Field A", label_ar: "الحقل أ", value: "Value A2", value_ar: "القيمة أ٢" },
      { label: "Field B", label_ar: "الحقل ب", value: "Value B2", value_ar: "القيمة ب٢" }
    ]
  }
];`,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createGenericCardsConfig(
  Component: ComponentType<IGenericCardsProps>,
  icon: IconType
): ComponentConfig<IGenericCardsProps> {
  return {
    id: "genericCards",
    icon,
    name: "Generic Cards (Multiple)",
    Component,
    controls,
  };
}
