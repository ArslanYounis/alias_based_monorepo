import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CheckboxInput, type CheckboxInputProps } from "./CheckboxInput";

const meta: Meta<typeof CheckboxInput> = {
  title: "UI/CheckboxInput",
  component: CheckboxInput,
  argTypes: {
    onChange: {
      action: "changed",
      description: "Function called when checkbox selection changes",
      table: {
        category: "Events",
      },
    },
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language for the component",
      defaultValue: "en",
    },
    value: {
      control: false,
      description: "Array of selected values (controlled)",
    },
    options: {
      control: false,
      description: "Array of checkbox options [{label, value}]",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxInput>;

const Template = (args: CheckboxInputProps) => {
  const [selected, setSelected] = useState<string[]>(args.value ?? []);

  const handleChange = (selectedValues: string[]) => {
    setSelected(selectedValues);
    if (args.onChange) args.onChange(selectedValues);
  };

  return (
    <CheckboxInput
      {...args}
      value={selected}
      onChange={handleChange}
    />
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: "Choose Options",
    label_ar: "",
    required: true,
    showInfoIcon: true,
    tooltipText: "Select one or more",
    tooltipText_ar: "",
    captionLeft: "Caption Left",
    captionLeft_ar: "",
    captionRight: "Caption Right",
    captionRight_ar: "",
    hasError: false,
    errorMessage: "Please select at least one.",
    errorMessage_ar: "",
    language: "en",
    options: [
      { label: "Option 1", label_ar: "الخيار 1", value: "option1" },
      { label: "Option 2", label_ar: "الخيار 2", value: "option2" },
      { label: "Option 3", label_ar: "الخيار 3", value: "option3" },
    ],
    value: ["option1"],
  },
};

export const Arabic: Story = {
  render: Template,
  args: {
    ...Default.args,
    language: "ar",
  },
};
