import type { Meta, StoryObj } from "@storybook/react";
import { Caption } from "./Caption";

const meta: Meta<typeof Caption> = {
  component: Caption,
  title: "UI/Caption",
  tags: ["autodocs"],
  argTypes: {
    captionLeft: { control: "text" },
    captionRight: { control: "text" },
    hasError: { control: "boolean" },
    disabled: { control: "boolean" },
    errorMessage: { control: "text" },
    theme: { control: { type: "select" }, options: ["light", "dark"] },
    language: { control: { type: "select" }, options: ["en", "ar"] },
  },
};
export default meta;

type Story = StoryObj<typeof Caption>;

export const Default: Story = {
  args: {
    captionLeft: "Left caption",
    captionRight: "Right caption",
    hasError: false,
    disabled: false,
    theme: "light",
    language: "en",
  },
};

export const EnglishCaptions: Story = {
  args: {
    captionLeft: "Left caption",
    captionRight: "Right caption",
    hasError: false,
    disabled: false,
    theme: "light",
    language: "en",
  },
};

export const ArabicCaptions: Story = {
  args: {
    captionLeft_ar: "التسمية على اليسار",
    captionRight_ar: "التسمية على اليمين",
    hasError: false,
    disabled: false,
    theme: "light",
    language: "ar",
  },
};

export const WithError: Story = {
  args: {
    captionLeft: "Left caption",
    captionRight: "Right caption",
    hasError: true,
    errorMessage: "This is an error message.",
    disabled: false,
    theme: "light",
    language: "en",
  },
};

export const WithErrorArabic: Story = {
  args: {
    captionLeft: "Left",
    captionRight: "Right",
    hasError: true,
    errorMessage: "هذه رسالة خطأ.",
    errorMessage_ar: "هذه رسالة خطأ.",
    disabled: false,
    theme: "light",
    language: "ar",
  },
};

export const Disabled: Story = {
  args: {
    captionLeft: "Left caption (disabled)",
    captionRight: "Right caption (disabled)",
    hasError: false,
    disabled: true,
    theme: "light",
    language: "en",
  },
};
