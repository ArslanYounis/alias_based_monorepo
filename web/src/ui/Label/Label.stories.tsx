import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  component: Label,
  title: "UI/Label",
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { label: "Field label" },
};

export const Required: Story = {
  args: { label: "Required field", required: true },
};

export const WithInfo: Story = {
  args: {
    label: "With info",
    showInfoIcon: true,
    tooltipText: "Additional information",
  },
};
