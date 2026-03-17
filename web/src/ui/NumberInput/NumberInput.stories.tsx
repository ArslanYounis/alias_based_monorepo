import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./NumberInput";

const meta: Meta<typeof NumberInput> = {
  title: "UI/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onChange: {
      action: "changed",
      description: "Function called when number value changes",
      table: {
        category: "Events",
      },
    },
    label: { control: "text" },
    label_ar: { control: "text" },
    placeholder: { control: "text" },
    placeholder_ar: { control: "text" },
    value: { control: "text" },
    hasError: { control: "boolean" },
    errorMessage: { control: "text" },
    errorMessage_ar: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    tooltipText: { control: "text" },
    tooltipText_ar: { control: "text" },
    captionLeft: { control: "text" },
    captionLeft_ar: { control: "text" },
    captionRight: { control: "text" },
    captionRight_ar: { control: "text" },
    showInfoIcon: { control: "boolean" },
    language: {
      control: { type: "select" },
      options: ["en", "ar"],
      description: "Language setting for the component",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the form element",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

const Template = (args: React.ComponentProps<typeof NumberInput>) => {
  const [value, setValue] = useState("");
  const theme = args.theme || "light";
  const background = theme === "dark" ? "#12121B" : "#fff";
  return (
    <div style={{ background, padding: 32, minHeight: 200 }}>
      <NumberInput
        {...args}
        value={value}
        onChange={setValue}
        theme={theme}
      />
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: "Number Field",
    placeholder: "Enter a number",
    required: true,
    showInfoIcon: true,
    tooltipText: "Please enter a valid number",
    captionLeft: "Caption Left",
    captionRight: "Caption Right",
    language: "en",
  },
};

export const Arabic: Story = {
  render: Template,
  args: {
    label: "Number Field",
    label_ar: "حقل الرقم",
    placeholder: "Enter a number",
    placeholder_ar: "أدخل رقماً",
    required: true,
    showInfoIcon: true,
    tooltipText: "Please enter a valid number",
    tooltipText_ar: "يرجى إدخال رقم صحيح",
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    language: "ar",
  },
};

export const WithError: Story = {
  render: Template,
  args: {
    label: "Number Field with Error",
    label_ar: "حقل الرقم مع خطأ",
    placeholder: "Enter a number",
    placeholder_ar: "أدخل رقماً",
    required: true,
    hasError: true,
    errorMessage: "This field is required",
    errorMessage_ar: "هذا الحقل مطلوب",
    showInfoIcon: true,
    tooltipText: "Please enter a valid number",
    tooltipText_ar: "يرجى إدخال رقم صحيح",
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    language: "en",
  },
};

export const ArabicWithError: Story = {
  render: Template,
  args: {
    label: "Number Field with Error",
    label_ar: "حقل الرقم مع خطأ",
    placeholder: "Enter a number",
    placeholder_ar: "أدخل رقماً",
    required: true,
    hasError: true,
    errorMessage: "This field is required",
    errorMessage_ar: "هذا الحقل مطلوب",
    showInfoIcon: true,
    tooltipText: "Please enter a valid number",
    tooltipText_ar: "يرجى إدخال رقم صحيح",
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    language: "ar",
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    label: "Disabled Number Field",
    label_ar: "حقل الرقم المعطل",
    placeholder: "Enter a number",
    placeholder_ar: "أدخل رقماً",
    disabled: true,
    showInfoIcon: true,
    tooltipText: "This field is disabled",
    tooltipText_ar: "هذا الحقل معطل",
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    language: "en",
    theme: "dark",
  },
};

export const Light: Story = {
  render: Template,
  args: {
    ...Default.args,
    theme: "light",
  },
};
