import type { Meta, StoryObj } from "@storybook/react";
import { Bot } from "./Bot";

const meta: Meta<typeof Bot> = {
  component: Bot,
  title: "UI/Bot",
};
export default meta;

type Story = StoryObj<typeof Bot>;

export const Closed: Story = {
  args: { status: "close" },
};

export const Open: Story = {
  args: { status: "open", message: "How can I help?" },
};
