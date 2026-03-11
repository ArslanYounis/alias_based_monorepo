import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Toast** component displays temporary status messages to inform users of application state changes.
Supports bilingual content (English/Arabic) with RTL layout support.

### Props:
- \`status\`: Defines the toast type — \`success\`, \`error\`, \`information\`, \`action\`, or \`pending\`.
- \`message\`: Message displayed below the title in the toast (English).
- \`language\`: Language setting ('en' or 'ar') for the component.
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["success", "error", "information", "pending", "action"],
      description: "Status of the toast message",
    },
    message: {
      control: "text",
      description: "Message to display below the title in the toast (English)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const ErrorToast: Story = {
  args: {
    status: "error",
    message: "Oh No! There is a problem",
  },
};

export const SuccessToast: Story = {
  args: {
    status: "success",
    message: "Well done! That was a complete success",
  },
};

export const InformationToast: Story = {
  args: {
    status: "information",
    message: "Ok! We need some more information",
  },
};

export const ActionToast: Story = {
  args: {
    status: "action",
    message: "Ok! We need some more action",
  },
};

export const ArabicError: Story = {
  args: {
    status: "error",
    message: "Oh No! There is a problem",
  },
};

export const ArabicSuccess: Story = {
  args: {
    status: "success",
    message: "Well done! That was a complete success",
  },
};

export const ArabicInformation: Story = {
  args: {
    status: "information",
    message: "Ok! We need some more information",
  },
};

export const ArabicAction: Story = {
  args: {
    status: "action",
    message: "Ok! We need some more action",
  },
};
