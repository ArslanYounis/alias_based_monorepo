import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import CardTitle from "./CardTitle";

/**
 * Component props type.
 */
type CardTitleProps = React.ComponentProps<typeof CardTitle>;

const meta: Meta<typeof CardTitle> = {
  title: "Components/CardTitle",
  component: CardTitle,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
CardTitle displays a title with optional right-side content:
- subText
- status
- buttons
- expandable functionality (chevron)

The component is now fully generic with all props being optional except title and title_ar.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: "radio",
      options: ["en", "ar"] as const,
    },
    variant: {
      control: "radio",
      options: ["large", "medium", "small"] as const,
    },
    title: { control: "text" },
    title_ar: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof CardTitle>;

const base = {
  title: "Card title",
  title_ar: "عنوان البطاقة",
} as const;

/* Variants preview (non-args render) */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 600 }}>
      <CardTitle title="Small variant" title_ar="صغير" variant="small" />
      <CardTitle title="Medium variant" title_ar="متوسط" variant="medium" />
      <CardTitle title="Large variant" title_ar="كبير" variant="large" />
    </div>
  ),
};

/* Basic title story */
export const Title: Story = {
  args: {
    ...base,
    variant: "large",
  },
  render: (args: CardTitleProps) => (
    <div style={{ width: 600 }}>
      <CardTitle {...args} />
    </div>
  ),
};

/* SubText story */
export const WithSubText: Story = {
  args: {
    ...base,
    variant: "medium",
    subText: "This is subtext",
    subText_ar: "هذا نص فرعي",
  },
  render: (args: CardTitleProps) => (
    <div style={{ width: 600 }}>
      <CardTitle {...args} />
    </div>
  ),
};

/* Status story */
export const WithStatus: Story = {
  args: {
    ...base,
    variant: "small",
    status: "Pending",
    status_ar: "قيد الانتظار",
  },
  render: (args: CardTitleProps) => (
    <div style={{ width: 600 }}>
      <CardTitle {...args} />
    </div>
  ),
};

/* Buttons story */
export const WithButtons: Story = {
  args: {
    ...base,
    variant: "large",
    showButtons: true,
    buttons: [
      {
        title: "Add",
        title_ar: "إضافة",
        type: "secondary",
        onClick: () => {
          console.log("Add clicked");
        },
      },
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => {
          console.log("Edit clicked");
        },
      },
      {
        title: "Delete",
        title_ar: "حذف",
        type: "secondary",
        onClick: () => {
          console.log("Delete clicked");
        },
      },
    ],
  },
  render: (args: CardTitleProps) => (
    <div style={{ width: 800 }}>
      <CardTitle {...args} />
    </div>
  ),
};

/* Expandable story */
export const Expandable: Story = {
  args: {
    ...base,
    variant: "medium",
    isExpandable: true,
    isExpanded: false,
    onToggleExpand: () => {
      console.log("Toggle expand");
    },
  },
  render: (args: CardTitleProps) => (
    <div style={{ width: 600 }}>
      <CardTitle {...args} />
    </div>
  ),
};

/* Combined features story */
export const Combined: Story = {
  args: {
    ...base,
    variant: "large",
    subText: "Additional information",
    subText_ar: "معلومات إضافية",
    isExpandable: true,
    isExpanded: true,
    onToggleExpand: () => {
      console.log("Toggle expand");
    },
    showButtons: true,
    buttons: [
      {
        title: "Action",
        title_ar: "إجراء",
        type: "primary",
        onClick: () => {
          console.log("Action clicked");
        },
      },
    ],
    showBorder: true,
  },
  render: (args: CardTitleProps) => (
    <div style={{ width: 800 }}>
      <CardTitle {...args} />
    </div>
  ),
};
