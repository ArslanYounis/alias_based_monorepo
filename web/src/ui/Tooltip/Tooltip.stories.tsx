import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "UI/Tooltip",
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { text: "Tooltip text" },
};

export const WithArabic: Story = {
  args: { text: "Tooltip", text_ar: "تلميح", language: "ar" },
};
