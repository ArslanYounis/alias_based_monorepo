import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The \`Breadcrumb\` component provides a hierarchical navigation trail.

**Props:**

\`
interface BreadcrumbItem {
  label: string;
  label_ar?: string;
  onClick?: () => void;
}
\`

\`
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  selectedItemIndex?: number; // defaults to last item
  isSelectedHover?: boolean;  // enable hover styling for the selected item
  language?: 'en' | 'ar';
}
\`

**Usage:**

\`
<Breadcrumb
  items={[
    { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
    { label: "Section", label_ar: "القسم", onClick: () => {} },
    { label: "Current Page", label_ar: "الصفحة الحالية" }
  ]}
  selectedItemIndex={2}
  isSelectedHover={true}
  language="en"
/>
\`
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description:
        "An array of breadcrumb items, each with a `label` and optional `href`.",
    },
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls the language.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    selectedItemIndex: {
      control: "number",
      description: "The index of the selected item.",
    },
    isSelectedHover: {
      control: "boolean",
      description: "Enable hover effect on the selected item.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Level1: Story = {
  args: {
    items: [{ label: "Home", label_ar: "الرئيسية", onClick: () => null }],
  },
};

export const Level2: Story = {
  args: {
    items: [
      { label: "Home", label_ar: "الرئيسية", onClick: () => null },
      {
        label: "Level 1",
        label_ar: "المستوى 1",
        onClick: () => null,
      },
    ],
  },
};

export const Level3: Story = {
  args: {
    items: [
      { label: "Home", label_ar: "الرئيسية", onClick: () => null },
      {
        label: "Level 1",
        label_ar: "المستوى 1",
        onClick: () => null,
      },
      { label: "Level 2", label_ar: "المستوى 2" },
    ],
  },
};

export const Level4: Story = {
  args: {
    items: [
      { label: "Home", label_ar: "الرئيسية", onClick: () => null },
      {
        label: "Level 1",
        label_ar: "المستوى 1",
        onClick: () => null,
      },
      {
        label: "Level 2",
        label_ar: "المستوى 2",
        onClick: () => null,
      },
      { label: "Level 3", label_ar: "المستوى 3" },
    ],
  },
};

export const SelectedHover: Story = {
  args: {
    items: [
      { label: "Home", label_ar: "الرئيسية", onClick: () => null },
      {
        label: "Level 1",
        label_ar: "المستوى 1",
        onClick: () => null,
      },
      {
        label: "Level 2",
        label_ar: "المستوى 2",
        onClick: () => null,
      },
      { label: "Level 3", label_ar: "المستوى 3" },
    ],
    isSelectedHover: true,
  },
};

export const UnSelectedHover: Story = {
  args: {
    items: [
      { label: "Home", label_ar: "الرئيسية", onClick: () => null },
      {
        label: "Level 1",
        label_ar: "المستوى 1",
        onClick: () => null,
      },
      { label: "Level 2", label_ar: "المستوى 2" },
      { label: "Level 3", label_ar: "المستوى 3" },
    ],
  },
};

export const DifferentSelected: Story = {
  args: {
    items: [
      { label: "Home", onClick: () => null },
      { label: "Level 1", onClick: () => null },
      { label: "Level 2", onClick: () => null },
      { label: "Level 3", onClick: () => null },
    ],
    selectedItemIndex: 1, // Select the second item
  },
};

export const ArabicLanguage: Story = {
  args: {
    language: "ar",
    items: [
      { label: "Home", label_ar: "الرئيسية", onClick: () => null },
      { label: "Settings", label_ar: "الإعدادات", onClick: () => null },
      { label: "Profile", label_ar: "الملف الشخصي" },
    ],
  },
};
