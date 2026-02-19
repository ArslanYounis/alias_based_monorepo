import type { Meta, StoryObj } from "@storybook/react";
import { Bk_DateInput } from "./Bk_DateInput";

const meta: Meta<typeof Bk_DateInput> = {
  component: Bk_DateInput,
  title: "UI/bk_DateInput",
};
export default meta;

type Story = StoryObj<typeof Bk_DateInput>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: { label: "Select date", required: true },
};
