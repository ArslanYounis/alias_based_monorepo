/* istanbul ignore file */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import GenericCards from "./GenericCards";
import type { IGenericCardItem } from "./GenericCards";
import type { ICardRowProps } from "../CardRow";

const meta: Meta<typeof GenericCards> = {
  title: "Components/GenericCards",
  component: GenericCards,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **GenericCards** component renders multiple **GenericCard** components in a responsive grid. It accepts an array of card data (similar to owner data), shared props (title, variant, language), and controls how many cards appear per row.

### Features:
- **Multiple cards**: Pass \`cardsData\` array; each item is rendered as one GenericCard.
- **Grid layout**: \`itemsPerRow\` controls columns ("1", "2", or "3").
- **Shared props**: Title, variant, language, showBorder, buttons, etc. apply to all cards.
- **Per-card data**: Each item defines \`rowsData\`, \`cardTitleValue\`, \`cardTitleLabel\`, and optional overrides.
- **Expandable**: Each card can be expanded/collapsed; state is managed internally.
- **Bilingual**: Supports English and Arabic with RTL.

### Props:
\`\`\`
interface IGenericCardsProps {
  cardsData: IGenericCardItem[];
  itemsPerRow?: "1" | "2" | "3";
  title?: string;
  title_ar?: string;
  language?: "en" | "ar";
  isExpandable?: boolean;
  defaultShowMore?: boolean;
  showBorder?: boolean;
  showButtons?: boolean;
  buttons?: GenericCardsButtonType[];  // onClick(card, index) receives that card's data
  variant?: "large" | "medium" | "small";
  showTitleSection?: boolean;
}

interface IGenericCardItem {
  id?: string;
  rowsData: ICardRowProps[];
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  // ... optional overrides for any GenericCard props
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language (LTR/RTL)",
      table: { category: "Language" },
    },
    title: {
      control: "text",
      description: "Shared title for all cards",
      table: { category: "Content" },
    },
    title_ar: {
      control: "text",
      description: "Arabic title",
      table: { category: "Content" },
    },
    itemsPerRow: {
      control: { type: "radio" },
      options: ["1", "2", "3"],
      description: "Number of cards per row",
      table: { category: "Layout" },
    },
    isExpandable: {
      control: "boolean",
      description: "Whether cards can expand/collapse",
      table: { category: "Behavior" },
    },
    defaultShowMore: {
      control: "boolean",
      description: "Default show more rows inside each card",
      table: { category: "Behavior" },
    },
    showBorder: {
      control: "boolean",
      description: "Show border on card title section",
      table: { category: "Appearance" },
    },
    showButtons: {
      control: "boolean",
      description: "Show action buttons on each card",
      table: { category: "Buttons" },
    },
    variant: {
      control: { type: "select" },
      options: ["large", "medium", "small"],
      description: "Title variant for all cards",
      table: { category: "Appearance" },
    },
    cardsData: {
      control: { type: "object" },
      description: "Array of card data; each item becomes one GenericCard",
      table: { category: "Data" },
    },
    buttons: {
      control: { type: "object" },
      description:
        "Buttons for each card. onClick(card, index) is called with that card's data and index.",
      table: { category: "Buttons" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GenericCards>;

const sampleRows: ICardRowProps[] = [
  {
    label: "UAE National ID",
    label_ar: "الهوية الوطنية الإماراتية",
    value: "78273890399292",
    value_ar: "78273890399292",
  },
  {
    label: "MOI Unified Number",
    label_ar: "رقم وزارة الداخلية الموحد",
    value: "330928",
    value_ar: "330928",
  },
  {
    label: "Archive Number",
    label_ar: "رقم الأرشيف",
    value: "7921",
    value_ar: "7921",
  },
  {
    label: "Nationality",
    label_ar: "الجنسية",
    value: "United Arab Emirates",
    value_ar: "الإمارات العربية المتحدة",
  },
  {
    label: "Share",
    label_ar: "الحصة",
    value: "100% Allotment 50% Share",
    value_ar: "100% تخصيص 50% حصة",
  },
];

const sampleCardsData: IGenericCardItem[] = [
  {
    id: "card-1",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    rowsData: sampleRows,
  },
  {
    id: "card-2",
    cardTitleValue: "Ahmed Abdulla Ahmed Mohamed",
    cardTitleValue_ar: "أحمد عبد الله أحمد محمد",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    rowsData: [
      ...sampleRows.slice(0, 3),
      {
        label: "Share",
        label_ar: "الحصة",
        value: "75% Allotment 75% Share",
        value_ar: "75% تخصيص 75% حصة",
      },
    ],
  },
  {
    id: "card-3",
    cardTitleValue: "Fatima Ali Hassan",
    cardTitleValue_ar: "فاطمة علي حسن",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    rowsData: sampleRows.slice(0, 4),
  },
];

const wrapper = (args: React.ComponentProps<typeof GenericCards>) => (
  <div style={{ minHeight: "100vh", padding: 32 }}>
    <GenericCards {...args} />
  </div>
);

export const Default: Story = {
  args: {
    cardsData: sampleCardsData,
    title: "Owners",
    title_ar: "الملاك",
    itemsPerRow: "1",
    language: "en",
    isExpandable: true,
    defaultShowMore: false,
    showBorder: false,
    showButtons: false,
    variant: "small",
    showTitleSection: true,
  },
  render: (args) => wrapper(args),
};

export const TwoPerRow: Story = {
  args: {
    ...Default.args,
    itemsPerRow: "2",
  },
  render: (args) => wrapper(args),
};

export const ThreePerRow: Story = {
  args: {
    ...Default.args,
    itemsPerRow: "3",
  },
  render: (args) => wrapper(args),
};

export const WithButtons: Story = {
  args: {
    ...Default.args,
    showButtons: true,
    buttons: [
      {
        title: "View",
        title_ar: "عرض",
        type: "secondary",
        onClick: (card: IGenericCardItem, index: number) => console.log("View", card.cardTitleValue, index),
      },
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: (card: IGenericCardItem, index: number) => console.log("Edit", card.cardTitleValue, index),
      },
    ],
  },
  render: (args) => wrapper(args),
};

export const WithBorder: Story = {
  args: {
    ...Default.args,
    showBorder: true,
  },
  render: (args) => wrapper(args),
};

export const Arabic: Story = {
  args: {
    ...Default.args,
    language: "ar",
  },
  render: (args) => wrapper(args),
};

export const ArabicTwoPerRow: Story = {
  args: {
    ...Default.args,
    language: "ar",
    itemsPerRow: "2",
  },
  render: (args) => wrapper(args),
};

export const SingleCard: Story = {
  args: {
    ...Default.args,
    cardsData: [sampleCardsData[0]],
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
  },
  render: (args) => wrapper(args),
};

export const NotExpandable: Story = {
  args: {
    ...Default.args,
    isExpandable: false,
  },
  render: (args) => wrapper(args),
};

export const WithDefaultShowMore: Story = {
  args: {
    ...Default.args,
    defaultShowMore: true,
  },
  render: (args) => wrapper(args),
};
