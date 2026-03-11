import type { Meta, StoryFn } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/InputAndFormElements/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    required: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    tooltipText: { control: "text" },
    tooltipDirection: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
        "left-top",
        "left-center",
        "left-bottom",
        "right-top",
        "right-center",
        "right-bottom",
      ],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;

const Template: StoryFn<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  required: true,
  showInfoIcon: true,
  tooltipText: "tooltip",
  tooltipDirection: "left-center",
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Label",
  required: true,
  showInfoIcon: true,
  tooltipText: "tooltip",
  tooltipDirection: "left-center",
  disabled: true,
};

export const ArabicLight: StoryFn<typeof Label> = (args) => (
    <Label
      {...args}
      label="الاسم الكامل"
      label_ar="الاسم الكامل"
      required={true}
      showInfoIcon={true}
      tooltipText="معلومات إضافية"
      tooltipText_ar="معلومات إضافية"
      tooltipDirection="right-center"
      theme="light"
      language="ar"
    />
);

export const ArabicDark: StoryFn<typeof Label> = (args) => (
    <Label
      {...args}
      label="الاسم الكامل"
      label_ar="الاسم الكامل"
      required={true}
      showInfoIcon={true}
      tooltipText="معلومات إضافية"
      tooltipText_ar="معلومات إضافية"
      tooltipDirection="right-center"
      theme="dark"
      language="ar"
    />
);
