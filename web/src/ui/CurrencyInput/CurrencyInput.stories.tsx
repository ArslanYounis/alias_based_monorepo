import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput } from "./CurrencyInput";

const meta: Meta<typeof CurrencyInput> = {
  title: "UI/CurrencyInput",
  component: CurrencyInput,
  argTypes: {
    label: { control: "text" },
    label_ar: { control: "text" },
    placeholder: { control: "text" },
    placeholder_ar: { control: "text" },
    checked: { control: "text" },
    onChange: {
      action: "changed",
      description: "Function called when currency value changes",
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
    currencySymbol: { control: "text" },
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

type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("");
      return (
        <CurrencyInput
          {...args}
          checked={checked}
          onChange={setChecked}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Amount",
    label_ar: "المبلغ",
    placeholder: "Enter amount",
    placeholder_ar: "أدخل المبلغ",
    required: true,
    captionLeft: "Minimum 10 AED",
    captionLeft_ar: "الحد الأدنى 10 درهم",
    captionRight: "Maximum 5000 AED",
    captionRight_ar: "الحد الأقصى 5000 درهم",
    tooltipText: "Enter currency amount in AED.",
    tooltipText_ar: "أدخل مبلغ العملة بالدرهم الإماراتي.",
    currencySymbol: "AED",
    theme: "light",
    language: "en",
  },
};

export const Disabled: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("500");
      return (
        <CurrencyInput
          {...args}
          checked={checked}
          onChange={setChecked}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Amount",
    label_ar: "المبلغ",
    placeholder: "Enter amount",
    placeholder_ar: "أدخل المبلغ",
    disabled: true,
    captionLeft: "Amount is fixed",
    captionLeft_ar: "المبلغ محدد",
    theme: "light",
    language: "en",
  },
};

export const WithError: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("Invalid");
      return (
        <CurrencyInput
          {...args}
          checked={checked}
          onChange={setChecked}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Amount",
    label_ar: "المبلغ",
    placeholder: "Enter amount",
    placeholder_ar: "أدخل المبلغ",
    hasError: true,
    errorMessage: "Amount must be a number.",
    errorMessage_ar: "يجب أن يكون المبلغ رقماً.",
    theme: "light",
    language: "en",
  },
};

export const ArabicLanguage: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("");
      return (
        <CurrencyInput
          {...args}
          checked={checked}
          onChange={setChecked}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Amount",
    label_ar: "المبلغ",
    placeholder: "Enter amount",
    placeholder_ar: "أدخل المبلغ",
    required: true,
    captionLeft: "Minimum 10 AED",
    captionLeft_ar: "الحد الأدنى 10 درهم",
    captionRight: "Maximum 5000 AED",
    captionRight_ar: "الحد الأقصى 5000 درهم",
    tooltipText: "Enter currency amount in AED.",
    tooltipText_ar: "أدخل مبلغ العملة بالدرهم الإماراتي.",
    currencySymbol: "AED",
    theme: "light",
    language: "ar",
  },
};

export const ArabicWithError: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("نص غير صالح");
      return (
        <CurrencyInput
          {...args}
          checked={checked}
          onChange={setChecked}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Amount",
    label_ar: "المبلغ",
    placeholder: "Enter amount",
    placeholder_ar: "أدخل المبلغ",
    hasError: true,
    errorMessage: "Amount must be a number.",
    errorMessage_ar: "يجب أن يكون المبلغ رقماً.",
    theme: "light",
    language: "ar",
  },
};

export const ArabicDisabled: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("500");
      return (
        <CurrencyInput
          {...args}
          checked={checked}
          onChange={setChecked}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Amount",
    label_ar: "المبلغ",
    placeholder: "Enter amount",
    placeholder_ar: "أدخل المبلغ",
    disabled: true,
    captionLeft: "Amount is fixed",
    captionLeft_ar: "المبلغ محدد",
    theme: "light",
    language: "ar",
  },
};
