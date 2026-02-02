import type { Meta, StoryObj } from "@storybook/react";
import { RadioCard } from "./RadioCard";

const meta: Meta<typeof RadioCard> = {
  component: RadioCard,
  title: "UI/RadioCard",
};
export default meta;

type Story = StoryObj<typeof RadioCard>;

export const Default: Story = {
  args: { label: "Option", icon: <span>📄</span> },
};

export const Clicked: Story = {
  args: { label: "Selected", icon: <span>📄</span>, clicked: true },
};
