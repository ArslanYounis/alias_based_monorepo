import type { Meta, StoryObj } from "@storybook/react";
import ModalTitle from "./ModalTitle";

const meta: Meta<typeof ModalTitle> = {
  title: "Components/ModalTitle",
  component: ModalTitle,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The **ModalTitle** component renders a bold heading typically used as the title of a modal dialog.
It supports bilingual content (English/Arabic) with automatic language switching.

### Props:
\`\`\`
interface ModalTitleProps {
  label?: string;
  label_ar?: string;
  language?: "en" | "ar";
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "The title label text (English)",
      defaultValue: "New Application",
    },
    label_ar: {
      control: "text",
      description: "The title label text (Arabic)",
      defaultValue: "New Application",
    },
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ModalTitle>;

export const Default: Story = {
  args: {
    label: "New Application",
    label_ar: "\u0637\u0644\u0628 \u062c\u062f\u064a\u062f",
    language: "en",
  },
};

export const Arabic: Story = {
  args: {
    label: "New Application",
    label_ar: "\u0637\u0644\u0628 \u062c\u062f\u064a\u062f",
    language: "ar",
  },
};

export const LongTitle: Story = {
  args: {
    label: "Application for Plot Transfer and Ownership Change",
    label_ar: "\u0637\u0644\u0628 \u0646\u0642\u0644 \u0627\u0644\u0642\u0637\u0639\u0629 \u0648\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0645\u0644\u0643\u064a\u0629",
    language: "en",
  },
};
