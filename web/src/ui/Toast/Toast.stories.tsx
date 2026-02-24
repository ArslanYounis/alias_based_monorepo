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
The **Toast** component displays temporary status messages. Auto-hides after 5 seconds; user can dismiss via close icon.

### Props:
- \`status\`: \`success\`, \`error\`, \`information\`, \`action\`
- \`message\`: Message text
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["success", "error", "information", "action"],
    },
    message: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const SuccessToast: Story = {
  args: {
    status: "success",
    message: "Well done! That was a complete success",
  },
};

export const ErrorToast: Story = {
  args: {
    status: "error",
    message: "Oh No! There is a problem",
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
