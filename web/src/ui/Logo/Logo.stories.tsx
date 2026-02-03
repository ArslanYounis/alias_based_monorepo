import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  component: Logo,
  title: "UI/Logo",
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const Full: Story = { args: { type: "full" } };
export const Icon: Story = { args: { type: "icon" } };
export const Hub: Story = { args: { type: "hub" } };
