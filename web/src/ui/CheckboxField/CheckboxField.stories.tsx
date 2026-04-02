import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CheckboxField } from "./CheckboxField";

const meta: Meta<typeof CheckboxField> = {
  title: "UI/CheckboxField",
  component: CheckboxField,
  argTypes: {
    onChange: {
      action: "changed",
      description: "Function called when checkbox selection changes",
      table: {
        category: "Events",
      },
    },
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls the language.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    label_ar: {
      control: "text",
      description: "The text displayed on the button in Arabic.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Add Label" },
      },
    },
    id: { control: "text", description: "Unique id for the checkbox field" },
    label: { control: "text" },
    disabled: { control: "boolean" },
    hasError: { control: "boolean", description: "Show error state" },
  },
  args: {
    id: "checkbox-field",
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxField>;

// Interactive Unchecked Component
const UncheckedComponent = (args: React.ComponentProps<typeof CheckboxField>) =>
{
  const [isChecked, setIsChecked] = useState(false);

  return (
    <CheckboxField
      {...args}
      checked={isChecked}
      onChange={(_id, checked) => {
        setIsChecked(checked);
        args.onChange?.(_id, checked);
      }}
    />
  );
};

// Interactive Checked Component
const CheckedComponent = (args: React.ComponentProps<typeof CheckboxField>) =>
{
  const [isChecked, setIsChecked] = useState(true);

  return (
    <CheckboxField
      {...args}
      checked={isChecked}
      onChange={(_id, checked) => {
        setIsChecked(checked);
        args.onChange?.(_id, checked);
      }}
    />
  );
};

export const Unchecked: Story = {
  render: UncheckedComponent,
  args: {
    id: "checkbox-field-unchecked",
    label: "Label",
    disabled: false,
    hasError: false,
  },
};

export const Checked: Story = {
  render: CheckedComponent,
  args: {
    id: "checkbox-field-checked",
    label: "Label",
    disabled: false,
    hasError: false,
  },
};

export const Disabled: Story = {
  args: {
    id: "checkbox-field-disabled",
    label: "Label",
    disabled: true,
    hasError: false,
  },
};

export const Error: Story = {
  args: {
    id: "checkbox-field-error",
    label: "Label",
    disabled: false,
    hasError: true,
  },
};
