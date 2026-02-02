import type { Meta, StoryObj } from "@storybook/react";
import { AddButton } from "./AddButton";

const meta: Meta<typeof AddButton> = {
  component: AddButton,
  title: "UI/AddButton",
};
export default meta;

type Story = StoryObj<typeof AddButton>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithClick: Story = {
  args: {
    onClick: () => alert("Clicked"),
  },
};
