import type { Meta, StoryObj } from "@storybook/react";
import Typography from "./Typography";

const meta: Meta<typeof Typography> = {
  title: "UI/Typography",
  component: Typography,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "h1-shouting",
        "h1-hero",
        "h1",
        "h2",
        "h3",
        "h4",
        "text-lg",
        "text-md",
        "text-sm",
        "text-xs",
        "text-bold-lg",
        "text-bold-md",
        "text-bold-sm",
        "text-bold-xs",
        "text-bold-xxs",
      ],
      defaultValue: "text-md",
    },
    language: {
      control: { type: "select" },
      options: ["en", "ar"],
      defaultValue: "en",
    },
    text: { control: "text" },
    text_ar: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    variant: "text-md",
    text: "This is a sample paragraph using text-md.",
    text_ar: "هذا نص تجريبي يستخدم text-md.",
    language: "en",
  },
};

export const EnglishHeading: Story = {
  args: {
    variant: "h2",
    text: "English H2 Heading",
    text_ar: "عنوان H2 باللغة العربية",
    language: "en",
  },
};

export const ArabicHeading: Story = {
  args: {
    variant: "h2",
    text: "English fallback heading",
    text_ar: "عنوان H2 باللغة العربية",
    language: "ar",
  },
};

export const HeadingsShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography
        variant="h1-shouting"
        text="H1 Shouting (EN)"
        text_ar="H1 صاخب (AR)"
        language="en"
      />
      <Typography
        variant="h1-hero"
        text="H1 Hero (EN)"
        text_ar="H1 بطل (AR)"
        language="en"
      />
      <Typography variant="h1" text="H1 (EN)" text_ar="H1 (AR)" language="en" />
      <Typography variant="h2" text="H2 (EN)" text_ar="H2 (AR)" language="en" />
      <Typography variant="h3" text="H3 (EN)" text_ar="H3 (AR)" language="en" />
      <Typography variant="h4" text="H4 (EN)" text_ar="H4 (AR)" language="en" />
    </div>
  ),
};

export const TextSizesShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography
        variant="text-lg"
        text="Large text (EN)"
        text_ar="نص كبير (AR)"
        language="en"
      />
      <Typography
        variant="text-md"
        text="Medium text (EN)"
        text_ar="نص متوسط (AR)"
        language="en"
      />
      <Typography
        variant="text-sm"
        text="Small text (EN)"
        text_ar="نص صغير (AR)"
        language="en"
      />
      <Typography
        variant="text-xs"
        text="Extra small text (EN)"
        text_ar="نص صغير جدا (AR)"
        language="en"
      />
    </div>
  ),
};

export const BoldTextShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography
        variant="text-bold-lg"
        text="Bold large (EN)"
        text_ar="عريض كبير (AR)"
        language="en"
      />
      <Typography
        variant="text-bold-md"
        text="Bold medium (EN)"
        text_ar="عريض متوسط (AR)"
        language="en"
      />
      <Typography
        variant="text-bold-sm"
        text="Bold small (EN)"
        text_ar="عريض صغير (AR)"
        language="en"
      />
      <Typography
        variant="text-bold-xs"
        text="Bold xsmall (EN)"
        text_ar="عريض صغير جدا (AR)"
        language="en"
      />
      <Typography
        variant="text-bold-xxs"
        text="Bold tiny (EN)"
        text_ar="عريض ضئيل (AR)"
        language="en"
      />
    </div>
  ),
};
