import type { Meta, StoryObj } from "@storybook/react";
import { Caption } from "./Caption";

const meta: Meta<typeof Caption> = {
  component: Caption,
  title: "UI/Caption",
};
export default meta;

type Story = StoryObj<typeof Caption>;

export const Default: Story = {
  args: { captionLeft: "Left", captionRight: "Right" },
};

export const WithError: Story = {
  args: {
    captionLeft: "Left",
    captionRight: "Right",
    hasError: true,
    errorMessage: "Error message",
  },
};
