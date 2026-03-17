import type { Meta, StoryObj } from "@storybook/react";
import { CheckRadioLabel } from "./CheckRadioLabel";

const meta: Meta<typeof CheckRadioLabel> = {
  title: "Components/InputAndFormElements/CheckRadioLabel",
  component: CheckRadioLabel,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CheckRadioLabel>;

export const Default: Story = {
  args: {
    label: "Add Label",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: "Add Label",
    disabled: true,
  },
};

export const ArabicLight: Story = {
  args: {
    label_ar: "تسمية",
    disabled: false,
    language: "ar",
  },
};

export const ArabicDark: Story = {
  args: {
    label_ar: "تسمية",
    disabled: false,
    language: "ar",
  },
};
