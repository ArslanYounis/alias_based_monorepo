import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";

const meta: Meta<typeof Container> = {
  component: Container,
  title: "UI/Container",
};
export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: { children: "Container content" },
};

export const WithClassName: Story = {
  args: { children: "Padded container", className: "p-4 bg-gray-100" },
};
