import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";
import { action } from "storybook/actions";

const meta: Meta<typeof Radio> = {
  title: "Components/InputAndFormElements/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    hasError: { control: "boolean" },
    theme: { control: { type: "select" }, options: ["light", "dark"], defaultValue: "light" },
    onChange: {
      action: "changed",
      description: "Function called when radio selection changes",
      table: {
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Checked: Story = {
  name: "Checked",
  args: {
    id: "radio-checked",
    checked: true,
    hasError: false,
    theme: "light",
    onChange: action("onChange"),
  },
};

export const Unchecked: Story = {
  name: "Unchecked",
  args: {
    id: "radio-unchecked",
    checked: false,
    hasError: false,
    theme: "light",
    onChange: action("onChange"),
  },
};

export const Error: Story = {
  name: "Error",
  args: {
    id: "radio-error",
    checked: false,
    hasError: true,
    theme: "light",
    onChange: action("onChange"),
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    id: "radio-disabled",
    checked: false,
    disabled: true,
    hasError: false,
    theme: "light",
    onChange: action("onChange"),
  },
};
