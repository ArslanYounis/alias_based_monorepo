import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { action } from "storybook/actions";

const meta: Meta<typeof Checkbox> = {
  title: "Components/InputAndFormElements/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text" },
    checked: { control: "boolean" },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    hasError: {
      control: "boolean",
      description: "Show error state",
    },
    onChange: {
      action: "changed",
      description: "Callback when checkbox state changes",
      table: {
        category: "Events",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Checked: Story = {
  name: "Checked",
  args: {
    id: "checkbox-checked",
    checked: true,
    hasError: false,
    onChange: action("onChange"),
  },
};

export const Unchecked: Story = {
  name: "Unchecked",
  args: {
    id: "checkbox-unchecked",
    hasError: false,
    onChange: action("onChange"),
  },
};

export const Error: Story = {
  name: "Error",
  args: {
    id: "checkbox-error",
    checked: false,
    hasError: true,
    onChange: action("onChange"),
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    id: "checkbox-disabled",
    checked: false,
    disabled: true,
    hasError: false,
    onChange: action("onChange"),
  },
};
