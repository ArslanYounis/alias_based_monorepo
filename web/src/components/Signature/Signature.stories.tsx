import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Signature from "./Signature";

const meta: Meta<typeof Signature> = {
  title: "Components/Signature",
  component: Signature,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Signature** component is made for capturing a digital signature and optional remarks, typically used for approvals or confirmations.

**Props:**

\`\`\`
interface SignatureModelProps {
  title?: string; // Title at the top of the modal
  theme?: "light" | "dark"; // Theme for the modal (default: 'dark')
}
\`\`\`

**Usage:**

\`\`\`
<SignatureModel
  title="Sign to Approve"

/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Language setting that affects layout direction (LTR/RTL)",
    },
    title: {
      description: "Title displayed at the top of the signature modal.",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Sign to Approve" },
      },
    },
    title_ar: {
      description: "Arabic translation of the title.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    buttonText: {
      description: "Text for the approve button.",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Approve" },
      },
    },
    buttonText_ar: {
      description: "Arabic translation of button text.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    theme: {
      control: "radio",
      options: ["light", "dark"],
      description: "Theme variant for the signature component",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Signature>;

type SignatureArgs = {
  language?: "en" | "ar";
  title: string;
  title_ar?: string;
  buttonText?: string;
  buttonText_ar?: string;
  theme: "dark" | "light";
};

export const Default: Story = {
  args: {
    language: "en",
    title: "Sign to Approve",
    title_ar: "وقع للموافقة",
    buttonText: "Approve",
    buttonText_ar: "موافق",
    theme: "dark",
  },
  render: (args: SignatureArgs) => (
    <div style={{ background: "#2A2A32", minHeight: "100vh", padding: 32 }}>
      <Signature {...args} />
    </div>
  ),
};

export const Light: Story = {
  args: {
    language: "en",
    title: "Sign to Approve",
    title_ar: "وقع للموافقة",
    buttonText: "Approve",
    buttonText_ar: "موافق",
    theme: "light",
  },
  render: (args: SignatureArgs) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <Signature {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    language: "ar",
    title: "Sign to Approve",
    title_ar: "وقع للموافقة",
    buttonText: "Approve",
    buttonText_ar: "موافق",
    theme: "dark",
  },
  render: (args: SignatureArgs) => (
    <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
      <Signature {...args} />
    </div>
  ),
};
