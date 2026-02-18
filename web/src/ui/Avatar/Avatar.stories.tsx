import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "UI/Avatar",
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    imageUrl: "https://adrec-images.mastermind-mindset.com/user.png",
    status: "complete",
  },
};

export const WithInitials: Story = {
  args: { initials: "JD", status: "inProgress" },
};

export const Placeholder: Story = {
  args: {},
};
