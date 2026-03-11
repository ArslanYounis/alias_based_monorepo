import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Footer** component provides a responsive footer bar for your application, supporting both desktop and mobile layouts with bilingual (English/Arabic) support. It can display a logo and a chatbot (Bot) component, with adaptive behavior for different screen sizes.

### Props:
- **language**: Language for the component ("en" or "ar").
- **showLogo**: Whether to display the Logo component.
- **logoType**: The type of logo to display ("full", "icon", or "hub").
- **logoClassName**: Additional CSS classes for the Logo component.
- **logoWidth**: Width for the Logo (overridden to 60px on mobile when type is "icon").
- **logoHeight**: Height for the Logo (overridden to 60px on mobile when type is "icon").
- **showBot**: Whether to display the Bot component.
- **botMessage**: Message to display in the Bot component (English).
- **botMessage_ar**: Message to display in the Bot component (Arabic).
- **botStatus**: Status for the Bot ("open" or "close").
- **botClassName**: Additional CSS classes for the Bot component.

**Behavior:**
- On desktop (screen width >= 640px), the logo and bot are displayed side by side.
- On mobile (screen width < 640px), the footer collapses to a pully. When expanded, the logo (as an icon, 60x60px) and bot are shown.
- The logo's width and height are set to 60px on mobile, regardless of the passed props.
- The Bot component is always visible if enabled, with its own open/close state controlled by props.
- Language switching affects the bot message display using SharedLanguageSwitchRenderer.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "en" },
      },
    },
    showLogo: {
      control: "boolean",
      description: "Show the Logo component",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    logoType: {
      control: { type: "radio" },
      options: ["full", "icon", "hub"],
      description: "Type of logo to display",
      if: { arg: "showLogo", truthy: true },
    },
    logoClassName: {
      control: "text",
      description: "Class name for Logo",
      if: { arg: "showLogo", truthy: true },
    },
    logoWidth: {
      control: "text",
      description: "Width for Logo",
      if: { arg: "showLogo", truthy: true },
    },
    logoHeight: {
      control: "text",
      description: "Height for Logo",
      if: { arg: "showLogo", truthy: true },
    },
    showBot: {
      control: "boolean",
      description: "Show the Bot component",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    botMessage: {
      control: "text",
      description: "Message for Bot (English)",
      if: { arg: "showBot", truthy: true },
    },
    botMessage_ar: {
      control: "text",
      description: "Message for Bot (Arabic)",
      if: { arg: "showBot", truthy: true },
    },
    botStatus: {
      control: { type: "radio" },
      options: ["open", "close"],
      description: "Status for Bot",
      if: { arg: "showBot", truthy: true },
    },
    botClassName: {
      control: "text",
      description: "Class name for Bot",
      if: { arg: "showBot", truthy: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    language: "en",
    showLogo: true,
    logoType: "full",
    showBot: true,
    botMessage: "Hello! How can I help you today?",
    botStatus: "close",
  },
};

export const LogoOnly: Story = {
  args: {
    language: "en",
    showLogo: true,
    logoType: "full",
    showBot: false,
  },
};

export const BotOnly: Story = {
  args: {
    language: "en",
    showLogo: false,
    showBot: true,
    botMessage: "Hello! How can I help you today?",
    botStatus: "close",
  },
};

export const Arabic: Story = {
  args: {
    language: "ar",
    showLogo: true,
    logoType: "full",
    showBot: true,
    botMessage: "Hello! How can I help you today?",
    botMessage_ar: "\u0645\u0631\u062d\u0628\u0627\u064b! \u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u064a \u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0627\u0644\u064a\u0648\u0645\u061f",
    botStatus: "open",
  },
  render: (args) => (
    <div style={{ direction: "rtl" }}>
      <Footer {...args} />
    </div>
  ),
};

export const ArabicBotOnly: Story = {
  args: {
    language: "ar",
    showLogo: false,
    showBot: true,
    botMessage: "Hello! How can I help you today?",
    botMessage_ar: "\u0645\u0631\u062d\u0628\u0627\u064b! \u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u064a \u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0627\u0644\u064a\u0648\u0645\u061f",
    botStatus: "open",
  },
  render: (args) => (
    <div style={{ direction: "rtl" }}>
      <Footer {...args} />
    </div>
  ),
};
