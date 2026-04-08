/* istanbul ignore file */
import type { Meta, StoryObj } from "@storybook/react";
import ModalSteps from "./ModalSteps";

const meta: Meta<typeof ModalSteps> = {
  title: "Components/ModalSteps",
  component: ModalSteps,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The **ModalSteps** component displays a step title and sub-text, typically used at the top of a multi-step modal dialog.
It supports bilingual content (English/Arabic) with automatic language switching.

### Props:
\`\`\`
interface ModalStepsProps {
  title?: string;
  title_ar?: string;
  subText?: string;
  subText_ar?: string;
  language?: "en" | "ar";
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "The step title text (English)",
      defaultValue: "Confirm and create",
    },
    title_ar: {
      control: "text",
      description: "The step title text (Arabic)",
      defaultValue: "Confirm and create",
    },
    subText: {
      control: "text",
      description: "The sub-text describing the current step (English)",
      defaultValue: "Step 3 of 3",
    },
    subText_ar: {
      control: "text",
      description: "The sub-text describing the current step (Arabic)",
      defaultValue: "Step 3 of 3",
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

type Story = StoryObj<typeof ModalSteps>;

export const Default: Story = {
  args: {
    title: "Confirm and create",
    title_ar: "\u062a\u0623\u0643\u064a\u062f \u0648\u0625\u0646\u0634\u0627\u0621",
    subText: "Step 3 of 3",
    subText_ar: "\u0627\u0644\u062e\u0637\u0648\u0629 3 \u0645\u0646 3",
    language: "en",
  },
};

export const Arabic: Story = {
  args: {
    title: "Confirm and create",
    title_ar: "\u062a\u0623\u0643\u064a\u062f \u0648\u0625\u0646\u0634\u0627\u0621",
    subText: "Step 3 of 3",
    subText_ar: "\u0627\u0644\u062e\u0637\u0648\u0629 3 \u0645\u0646 3",
    language: "ar",
  },
};

export const FirstStep: Story = {
  args: {
    title: "Owner Details",
    title_ar: "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0627\u0644\u0643",
    subText: "Step 1 of 3",
    subText_ar: "\u0627\u0644\u062e\u0637\u0648\u0629 1 \u0645\u0646 3",
    language: "en",
  },
};

export const SecondStep: Story = {
  args: {
    title: "Plot Information",
    title_ar: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0642\u0637\u0639\u0629",
    subText: "Step 2 of 3",
    subText_ar: "\u0627\u0644\u062e\u0637\u0648\u0629 2 \u0645\u0646 3",
    language: "en",
  },
};
