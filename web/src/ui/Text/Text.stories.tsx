import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  component: Text,
  title: "UI/Text",
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: { children: "Sample text" },
};

export const WithClassName: Story = {
  args: { children: "Styled text", className: "text-lg font-bold" },
};
