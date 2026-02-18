import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: "UI/Checkbox",
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { id: "cb1" },
};

export const Checked: Story = {
  args: { id: "cb2", checked: true },
};

export const Disabled: Story = {
  args: { id: "cb3", disabled: true },
};
