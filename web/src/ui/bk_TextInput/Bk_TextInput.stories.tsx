import type { Meta, StoryObj } from "@storybook/react";
import { Bk_TextInput } from "./Bk_TextInput";

const meta: Meta<typeof Bk_TextInput> = {
  component: Bk_TextInput,
  title: "UI/bk_TextInput",
};
export default meta;

type Story = StoryObj<typeof Bk_TextInput>;

export const Default: Story = {
  args: { label: "Label", placeholder: "Enter text" },
};

export const WithError: Story = {
  args: {
    label: "Field",
    value: "value",
    hasError: true,
    errorMessage: "Invalid input",
  },
};
