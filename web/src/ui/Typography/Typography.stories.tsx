import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
  component: Typography,
  title: "UI/Typography",
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: { variant: "h1", text: "Heading 1", color: "default" },
};

export const Body: Story = {
  args: { variant: "text-md", text: "Body text", color: "default" },
};

export const WithArabic: Story = {
  args: {
    variant: "h2",
    text: "Title",
    text_ar: "عنوان",
    language: "ar",
  },
};
