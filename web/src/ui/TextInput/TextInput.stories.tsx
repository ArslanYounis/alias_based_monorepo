import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextInput } from "./TextInput";

type TextInputProps = Parameters<typeof TextInput>[0];

type Story = StoryObj<typeof TextInput>;

const meta: Meta<typeof TextInput> = {
  title: "UI/TextInput",
  component: TextInput,
  argTypes: {
    label: { control: "text" },
    label_ar: { control: "text" },
    required: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    tooltipText: { control: "text" },
    tooltipText_ar: { control: "text" },
    placeholder: { control: "text" },
    placeholder_ar: { control: "text" },
    value: { control: "text" },
    hasError: { control: "boolean" },
    errorMessage: { control: "text" },
    errorMessage_ar: { control: "text" },
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
    icon: {
      control: false,
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Theme for the field",
      defaultValue: "light",
    },
    onChange: {
      action: "changed",
      description: "Function called when input value changes",
      table: {
        category: "Events",
      },
    },
  },
};

export default meta;

const DefaultWrapper = (args: TextInputProps) => {
  const [value, setValue] = useState("");
  return (
    <TextInput
      {...args}
      value={value}
      onChange={(newValue: string) => {
        setValue(newValue);
        console.log("Changed:", newValue);
      }}
      theme={args.theme}
    />
  );
};

export const Default: Story = {
  args: {
    label: "Label",
    label_ar: "التسمية",
    required: true,
    showInfoIcon: true,
    tooltipText: "Enter placeholder",
    tooltipText_ar: "أدخل النص",
    placeholder: "Placeholder",
    placeholder_ar: "نص العرض",
    hasError: false,
    errorMessage: "This field is required",
    errorMessage_ar: "هذا الحقل مطلوب",
    disabled: false,
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    icon: null,
    theme: "light",
    language: "en",
  },
  render: DefaultWrapper,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: "Disabled text",
    captionLeft: "Caption Left",
    captionRight: "Caption Right",
    theme: "light",
    language: "en",
  },
  render: (args) => <TextInput {...args} />,
};

export const WithError: Story = {
  args: {
    ...Default.args,
    hasError: true,
    errorMessage: "Error message here",
    errorMessage_ar: "رسالة خطأ هنا",
    captionLeft: "",
    captionRight: "",
    theme: "light",
    language: "en",
  },
  render: (args) => <TextInput {...args} />,
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    theme: "light",
    language: "en",
  },
  render: (args) => <TextInput {...args} />,
};

export const ArabicLanguage: Story = {
  args: {
    ...Default.args,
    language: "ar",
  },
  render: DefaultWrapper,
};

export const ArabicWithError: Story = {
  args: {
    ...Default.args,
    hasError: true,
    errorMessage: "Error message here",
    errorMessage_ar: "رسالة خطأ هنا",
    captionLeft: "",
    captionRight: "",
    language: "ar",
  },
  render: (args) => <TextInput {...args} />,
};

export const ArabicDisabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: "نص معطل",
    language: "ar",
  },
  render: (args) => <TextInput {...args} />,
};
