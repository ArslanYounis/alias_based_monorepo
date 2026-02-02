import type { Meta, StoryObj } from "@storybook/react";
import { Fields } from "./Fields";

const meta: Meta<typeof Fields> = {
  component: Fields,
  title: "UI/Fields",
};
export default meta;

type Story = StoryObj<typeof Fields>;

export const Text: Story = {
  args: {
    type: "text",
    placeholder: "Enter text",
    value: "",
    onChange: () => {},
  },
};

export const Select: Story = {
  args: {
    type: "select",
    placeholder: "Select option",
    value: "",
    onChange: () => {},
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
  },
};
