import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: "UI/IconButton",
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: { icon: <span>⚙</span> },
};
