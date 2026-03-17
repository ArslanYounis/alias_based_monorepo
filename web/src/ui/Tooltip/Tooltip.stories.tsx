import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Tooltip** component displays contextual information in a floating container.
Supports bilingual content (English/Arabic) with RTL layout support and various arrow positions.

### Props:
- \`text\` (string): Tooltip text in English.
- \`text_ar\` (string): Tooltip text in Arabic.
- \`language\` (string): Language setting ('en' or 'ar') for the component.
- \`direction\` (string): Arrow position and tooltip placement.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language setting for the tooltip text",
      defaultValue: "en",
    },
    text: {
      control: { type: "text" },
      description: "Tooltip text in English",
    },
    text_ar: {
      control: { type: "text" },
      description: "Tooltip text in Arabic",
    },
    direction: {
      control: { type: "select" },
      options: [
        "none",
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
        "left-top",
        "left-center",
        "left-bottom",
        "right-top",
        "right-center",
        "right-bottom",
      ],
      description: "Arrow position and tooltip placement",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const defaultText = "This is a long text for the tooltip on hover.";
const defaultTextAr = "\u0647\u0630\u0627 \u0646\u0635 \u0637\u0648\u064a\u0644 \u0644\u062a\u0644\u0645\u064a\u062d \u0627\u0644\u0623\u062f\u0627\u0629 \u0639\u0646\u062f \u0627\u0644\u062a\u0645\u0631\u064a\u0631.";

export const Default: Story = {
  args: {
    language: "en",
    direction: "none",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};
// ===== TOP STORIES =====
export const TopLeft: Story = {
  args: {
    language: "en",
    direction: "top-left",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const TopCenter: Story = {
  args: {
    language: "en",
    direction: "top-center",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const TopRight: Story = {
  args: {
    language: "en",
    direction: "top-right",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

// ===== BOTTOM STORIES =====
export const BottomLeft: Story = {
  args: {
    language: "en",
    direction: "bottom-left",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const BottomCenter: Story = {
  args: {
    language: "en",
    direction: "bottom-center",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const BottomRight: Story = {
  args: {
    language: "en",
    direction: "bottom-right",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

// ===== LEFT STORIES =====
export const LeftTop: Story = {
  args: {
    language: "en",
    direction: "left-top",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const LeftCenter: Story = {
  args: {
    language: "en",
    direction: "left-center",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const LeftBottom: Story = {
  args: {
    language: "en",
    direction: "left-bottom",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

// ===== RIGHT STORIES =====
export const RightTop: Story = {
  args: {
    language: "en",
    direction: "right-top",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const RightCenter: Story = {
  args: {
    language: "en",
    direction: "right-center",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const RightBottom: Story = {
  args: {
    language: "en",
    direction: "right-bottom",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};

export const Arabic: Story = {
  args: {
    language: "ar",
    direction: "top-center",
    text: defaultText,
    text_ar: defaultTextAr,
  },
};
