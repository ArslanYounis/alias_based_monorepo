import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
    checkinButtonText: {
      control: "text",
      description: "Check-in button text in English",
    },
    checkinButtonText_ar: {
      control: "text",
      description: "Check-in button text in Arabic",
    },
    // notificationsAriaLabel: {
    //   control: "text",
    //   description: "Notifications aria label in English",
    // },
    // notificationsAriaLabel_ar: {
    //   control: "text",
    //   description: "Notifications aria label in Arabic",
    // },
    // notificationCount: {
    //   control: "number",
    //   description: "Number of notifications",
    // },
    userName: {
      control: "text",
      description: "User name in English",
    },
    userName_ar: {
      control: "text",
      description: "User name in Arabic",
    },
    avatarUrl: {
      control: "text",
      description: "Avatar image URL",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Header component with bilingual support (English/Arabic). Supports language switching for all user-facing text including home text, check-in button, notifications, and user name.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    language: "en",
    checkinButtonText: "Checkin",
    checkinButtonText_ar: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062d\u0636\u0648\u0631",
    // notificationsAriaLabel: "Notifications",
    // notificationsAriaLabel_ar: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a",
    // notificationCount: 3,
    userName: "Farzana",
    userName_ar: "\u0641\u0631\u0632\u0627\u0646\u0627",
    avatarUrl:
      "https://storage.googleapis.com/a1aa/image/6d2c85a3-1e14-413b-9a59-1133f2f5af8b.jpg",
  },
};

export const English: Story = {
  args: {
    ...Default.args,
    language: "en",
  },
};

export const Arabic: Story = {
  args: {
    ...Default.args,
    language: "ar",
    userName_ar: "\u0641\u0631\u0632\u0627\u0646\u0627",
  },
  parameters: {
    docs: {
      description: {
        story: "Header component displayed in Arabic with RTL layout.",
      },
    },
  },
};

export const WithoutNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 0,
  },
};

export const ArabicWithoutNotifications: Story = {
  args: {
    ...Arabic.args,
    notificationCount: 0,
  },
};
