import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "UI/TextArea",
  component: TextArea,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    label: { control: "text" },
    label_ar: { control: "text" },
    placeholder: { control: "text" },
    placeholder_ar: { control: "text" },
    value: { control: "text" },
    onChange: {
      action: "changed",
      description: "Function called when textarea value changes",
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
      control: { type: "radio" },
      options: ["light", "dark"],
      defaultValue: "light",
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <div style={{ background: "#fff", padding: 24 }}>
          <TextArea
            {...args}
            value={value}
            onChange={setValue}
            theme="light"
          />
        </div>
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Label",
    label_ar: "التسمية",
    placeholder: "Enter your message here...",
    placeholder_ar: "أدخل رسالتك هنا...",
    required: true,
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    tooltipText: "Please enter detailed description.",
    tooltipText_ar: "يرجى إدخال وصف مفصل.",
    language: "en",
    showInfoIcon: true,
    disabled: false,
    hasError: false,
    errorMessage: "",
  },
};

export const Dark: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <div style={{ background: "#12121B", padding: 24 }}>
          <TextArea
            {...args}
            value={value}
            onChange={setValue}
            theme="dark"
          />
        </div>
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Description",
    label_ar: "الوصف",
    placeholder: "Enter description...",
    placeholder_ar: "أدخل الوصف...",
    hasError: true,
    errorMessage: "Description is required.",
    errorMessage_ar: "الوصف مطلوب.",
    captionLeft: "",
    captionRight: "",
    language: "en",
  },
};

export const Disabled: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("Disabled text");
      return (
        <TextArea
          {...args}
          value={value}
          onChange={setValue}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Notes",
    label_ar: "ملاحظات",
    placeholder: "Disabled textarea",
    placeholder_ar: "منطقة نص معطلة",
    disabled: true,
    language: "en",
  },
};

export const ArabicLanguage: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <TextArea
          {...args}
          value={value}
          onChange={setValue}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Label",
    label_ar: "التسمية",
    placeholder: "Enter your message here...",
    placeholder_ar: "أدخل رسالتك هنا...",
    required: true,
    captionLeft: "Caption Left",
    captionLeft_ar: "التسمية التوضيحية اليسرى",
    captionRight: "Caption Right",
    captionRight_ar: "التسمية التوضيحية اليمنى",
    tooltipText: "Please enter detailed description.",
    tooltipText_ar: "يرجى إدخال وصف مفصل.",
    language: "ar",
  },
};

export const ArabicWithError: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState("نص غير صالح");
      return (
        <TextArea
          {...args}
          value={value}
          onChange={setValue}
        />
      );
    };
    return <Wrapper />;
  },
  args: {
    label: "Description",
    label_ar: "الوصف",
    placeholder: "Enter description...",
    placeholder_ar: "أدخل الوصف...",
    hasError: true,
    errorMessage: "Description is required.",
    errorMessage_ar: "الوصف مطلوب.",
    captionLeft: "",
    captionRight: "",
    language: "ar",
  },
};
