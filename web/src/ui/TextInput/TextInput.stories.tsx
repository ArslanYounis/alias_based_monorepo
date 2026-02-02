import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: "UI/TextInput",
};
export default meta;

type Story = StoryObj<typeof TextInput>;

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
