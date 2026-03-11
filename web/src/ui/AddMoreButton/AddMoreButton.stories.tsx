import type { Meta, StoryObj } from "@storybook/react";
import AddMoreButton from "./AddMoreButton";

const meta: Meta<typeof AddMoreButton> = {
  component: AddMoreButton,
  title: "UI/AddMoreButton",
  parameters: {
    docs: {
      description: {
        component: `
A button component used to add more items to a list or form.
Supports bilingual text (English/Arabic) and a customizable plus icon.
`,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Button text in English",
      defaultValue: "Add More Owner",
    },
    title_ar: {
      control: "text",
      description: "Button text in Arabic",
      defaultValue: "Add More Owner",
    },
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
    onClick: {
      action: "clicked",
      description: "Function called when the button is clicked",
      table: {
        category: "Events",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AddMoreButton>;

export const Default: Story = {
  args: {
    title: "Add More Owner",
    title_ar: "إضافة مالك آخر",
    language: "en",
  },
};

export const Arabic: Story = {
  args: {
    title: "Add More Owner",
    title_ar: "إضافة مالك آخر",
    language: "ar",
  },
};

export const AddMorePlot: Story = {
  args: {
    title: "Add More Plot",
    title_ar: "إضافة قطعة أخرى",
    language: "en",
  },
};

export const AddMorePlotArabic: Story = {
  args: {
    title: "Add More Plot",
    title_ar: "إضافة قطعة أخرى",
    language: "ar",
  },
};
