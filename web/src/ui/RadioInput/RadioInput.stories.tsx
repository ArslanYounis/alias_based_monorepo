import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioInput, type RadioInputProps } from "./RadioInput";

const meta: Meta<typeof RadioInput> = {
  title: "UI/RadioInput",
  component: RadioInput,
  argTypes: {
    onChange: {
      action: "changed",
      description: "Function called when radio selection changes",
      table: {
        category: "Events",
      },
    },
    label: { control: "text" },
    required: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    tooltipText: { control: "text" },
    disabled: { control: "boolean" },
    captionLeft: { control: "text" },
    captionRight: { control: "text" },
    hasError: { control: "boolean" },
    errorMessage: { control: "text" },
    value: { control: "text" },
    options: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof RadioInput>;

const Template = (args: RadioInputProps) => {
  const [selected, setSelected] = useState(args.value || "");

  return (
    <RadioInput
      {...args}
      value={selected}
      onChange={(id) => setSelected(id)}
    />
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: "Select your option",
    required: true,
    showInfoIcon: true,
    tooltipText: "This is additional info about the options",
    disabled: false,
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
    ],
    value: "1",
    captionLeft: "Left caption text",
    captionRight: "Right caption text",
    hasError: false,
    errorMessage: "",
  },
};
