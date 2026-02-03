import type { Meta, StoryObj } from "@storybook/react";
import { DateInput } from "./DateInput";

const meta: Meta<typeof DateInput> = {
  component: DateInput,
  title: "UI/DateInput",
};
export default meta;

type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: { label: "Select date", required: true },
};
