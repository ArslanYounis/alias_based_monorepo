import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioField } from "./RadioField";

const meta: Meta<typeof RadioField> = {
  title: "UI/RadioField",
  component: RadioField,
  argTypes: {
    id: { control: "text", description: "Unique id for the radio field" },
    label: { control: "text" },
    checked: {
      control: "boolean",
      description: "Whether the radio is checked",
    },
    disabled: { control: "boolean" },
    hasError: { control: "boolean" },
    onChange: {
      action: "changed",
      description: "Function called when radio selection changes",
      table: {
        category: "Events",
      },
    },
  },
  args: {
    id: "radio1",
    label: "Label",
    checked: "",
    disabled: false,
    hasError: false,
  },
};

export default meta;

type Story = StoryObj<typeof RadioField>;

// Interactive Unchecked Component
const UncheckedComponent = (args: React.ComponentProps<typeof RadioField>) => {
  const [selectedId, setSelectedId] = useState("");
  return (
    <RadioField
      {...args}
      checked={selectedId}
      onChange={(id, checked) => {
        if (checked) setSelectedId(id);
        args.onChange?.(id, checked);
      }}
    />
  );
};

// Interactive Checked Component
const CheckedComponent = (args: React.ComponentProps<typeof RadioField>) => {
   const [selectedId, setSelectedId] = useState(args.id ?? "radio2");
  return (
    <RadioField
      {...args}
      checked={selectedId}
      onChange={(id, checked) => {
        if (checked) setSelectedId(id);
        args.onChange?.(id, checked);
      }}
    />
  );
};

// Interactive Error Component
const ErrorComponent = (args: React.ComponentProps<typeof RadioField>) => {
    const [selectedId, setSelectedId] = useState("");
  return (
    <RadioField
      {...args}
      checked={selectedId}
      hasError={selectedId !== args.id}
      onChange={(id, checked) => {
        if (checked) setSelectedId(id);
        args.onChange?.(id, checked);
      }}
    />
  );
};

export const Unchecked: Story = {
  render: UncheckedComponent,
  args: {
    id: "radio1",
    label: "Label",
    checked: "",
    disabled: false,
    hasError: false,
  },
};

export const Checked: Story = {
  render: CheckedComponent,
  args: {
    id: "radio2",
    label: "Label",
    checked: "radio2",
    disabled: false,
    hasError: false,
  },
};

export const Disabled: Story = {
  args: {
    id: "radio3",
    label: "Label",
    checked: "",
    disabled: true,
    hasError: false,
  },
};

export const Error: Story = {
  render: ErrorComponent,
  args: {
    id: "radio4",
    label: "Label",
    checked: "",
    disabled: false,
    hasError: true,
  },
};
