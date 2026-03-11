import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateSelect } from "./DateSelect";

const meta: Meta<typeof DateSelect> = {
  title: "UI/DateSelect",
  component: DateSelect,
  argTypes: {
    label: { control: "text" },
    label_ar: { control: "text" },
    placeholder: { control: "text" },
    placeholder_ar: { control: "text" },
    value: { control: "text" },
    onChange: {
      action: "changed",
      description: "Function called when date value changes",
      table: {
        category: "Events",
      },
    },
    hasError: { control: "boolean" },
    errorMessage: { control: "text" },
    errorMessage_ar: { control: "text" },
    required: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    tooltipText: { control: "text" },
    tooltipText_ar: { control: "text" },
    disabled: { control: "boolean" },
    captionLeft: { control: "text" },
    captionLeft_ar: { control: "text" },
    captionRight: { control: "text" },
    captionRight_ar: { control: "text" },
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls the language.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    theme: {
      options: ["light", "dark"],
      control: { type: "radio" },
      description: "Theme of the component",
    },
  },
};
export default meta;

type Story = StoryObj<typeof DateSelect>;

export const Default: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return <DateSelect {...args} value={value} onChange={setValue} />;
    };
    return <Wrapper />;
  },
  args: {
    label: "Select Date",
    label_ar: "اختر التاريخ",
    placeholder: "Select a date",
    placeholder_ar: "اختر تاريخاً",
    required: true,
    showInfoIcon: true,
    tooltipText: "Please select a date",
    tooltipText_ar: "يرجى اختيار تاريخ",
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    theme: "light",
    language: "en",
  },
};

export const Disabled: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("2024-07-07");
      return <DateSelect {...args} value={value} onChange={setValue} />;
    };
    return <Wrapper />;
  },
  args: {
    label: "Select Date",
    label_ar: "اختر التاريخ",
    placeholder: "Select a date",
    placeholder_ar: "اختر تاريخاً",
    required: true,
    showInfoIcon: true,
    disabled: true,
    captionLeft: "Date is fixed",
    captionLeft_ar: "التاريخ محدد",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    theme: "light",
    language: "en",
  },
};

export const WithError: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return <DateSelect {...args} value={value} onChange={setValue} />;
    };
    return <Wrapper />;
  },
  args: {
    label: "Select Date",
    label_ar: "اختر التاريخ",
    placeholder: "Select a date",
    placeholder_ar: "اختر تاريخاً",
    required: true,
    showInfoIcon: true,
    hasError: true,
    errorMessage: "Date is required",
    errorMessage_ar: "التاريخ مطلوب",
    theme: "light",
    language: "en",
  },
};

export const ArabicLanguage: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return <DateSelect {...args} value={value} onChange={setValue} />;
    };
    return <Wrapper />;
  },
  args: {
    label: "Select Date",
    label_ar: "اختر التاريخ",
    placeholder: "Select a date",
    placeholder_ar: "اختر تاريخاً",
    required: true,
    showInfoIcon: true,
    tooltipText: "Please select a date",
    tooltipText_ar: "يرجى اختيار تاريخ",
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    theme: "light",
    language: "ar",
  },
};

export const ArabicWithError: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return <DateSelect {...args} value={value} onChange={setValue} />;
    };
    return <Wrapper />;
  },
  args: {
    label: "Select Date",
    label_ar: "اختر التاريخ",
    placeholder: "Select a date",
    placeholder_ar: "اختر تاريخاً",
    required: true,
    showInfoIcon: true,
    hasError: true,
    errorMessage: "Date is required",
    errorMessage_ar: "التاريخ مطلوب",
    theme: "light",
    language: "ar",
  },
};

export const ArabicDisabled: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("2024-07-07");
      return <DateSelect {...args} value={value} onChange={setValue} />;
    };
    return <Wrapper />;
  },
  args: {
    label: "Select Date",
    label_ar: "اختر التاريخ",
    placeholder: "Select a date",
    placeholder_ar: "اختر تاريخاً",
    required: true,
    showInfoIcon: true,
    disabled: true,
    captionLeft: "Date is fixed",
    captionLeft_ar: "التاريخ محدد",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    theme: "light",
    language: "ar",
  },
};
