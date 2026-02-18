import type { Meta, StoryObj } from "@storybook/react";
import { CheckRadioLabel } from "./CheckRadioLabel";

const meta: Meta<typeof CheckRadioLabel> = {
  component: CheckRadioLabel,
  title: "UI/CheckRadioLabel",
};
export default meta;

type Story = StoryObj<typeof CheckRadioLabel>;

export const Default: Story = {
  args: { label: "Label text" },
};

export const Disabled: Story = {
  args: { label: "Disabled label", disabled: true },
};
