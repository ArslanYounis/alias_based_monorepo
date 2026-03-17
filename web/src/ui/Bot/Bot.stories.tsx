import type { Meta, StoryObj } from "@storybook/react";
import { Bot } from "./Bot";

const meta: Meta<typeof Bot> = {
  title: "Components/Bot",
  component: Bot,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The \`Bot\` component simulates a chatbot message bubble in a conversation UI, typically used in live chat support or interactive assistant modules.

**Props:**

\`
interface BotProps {
  message: string;
  status?: 'open' | 'close';
  className?: string;
  onClick?: (newStatus: 'open' | 'close') => void;
}
\`

**Usage:**

\`
<Bot message="Hi. How can I help?" status="open" />
\`

**Behavior:**
- The bot avatar is always visible in the block where you use it.
- When \`status\` is \`open\`, a message bubble appears above the avatar
- If the \`status\` prop is changed to \`close\`, the message bubble disappears and only the avatar remains visible.
- The position can be customized by passing a \`className\` prop (e.g., to move the bot to a different position).
- Clicking the component toggles \`status\` between \`open\` and \`close\`.
`,
      },
    },
  },
  argTypes: {
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls the language.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    message_ar: {
      control: "text",
      description: "The text displayed on the button in Arabic.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Add Label" },
      },
    },
    message: {
      control: "text",
      description: "Text message to be displayed inside the bot bubble.",
    },
    status: {
      control: { type: "select" },
      options: ["open", "close"],
      description:
        "Status indicator for the bot message. When 'open', the message bubble is shown; when 'close', only the avatar is visible.",
    },
    className: {
      control: "text",
      description:
        "Additional CSS classes to override or extend the default position and styling.",
    },
    onClick: {
      action: "toggled",
      description:
        "Callback fired when the bot is clicked, returning the new status.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Bot>;

export const BotIconClosed: Story = {
  args: {
    message: "Hi. How can I help?",
    status: "close",
  },
};

export const BotIconOpen: Story = {
  args: {
    message: "Hi. How can I help?",
    status: "close",
  },
};

export const CustomPosition: Story = {
  args: {
    message: "I'm in the bottom right!",
    status: "open",
    className: "fixed bottom-5 right-5",
  },
};
