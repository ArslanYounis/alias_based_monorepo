import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationDetail from "./ApplicationDetail";
import type { ApplicationDetailProps } from "../../types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof ApplicationDetail> = {
  title: "CommonComponents/ApplicationDetail",
  component: ApplicationDetail,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The \`ApplicationDetail\` component displays comprehensive application information fetched via API, including:

- Application details (number, date, reference number — all read-only from API)
- Owner information with action buttons (View, Plots, Edit Contact)
- Plot information with View action
- Interaction history with progress tracking (ProcessStatusRows / completed badge)
- Documents section — uploaded docs, clickable to open via \`onDocumentOpen\`

Accepts platform-injected props:
- \`onDocumentOpen\`: replaces \`window.open\` — web passes \`(url) => window.open(url, '_blank')\`; mobile passes \`Linking.openURL\`

Icons (\`DocumentIcon\`, \`CheckIcon\`, \`SendIcon\`) are now imported internally from \`@platform/icons\`.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls the language / RTL direction.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    applicationTitle: {
      control: "text",
      description: "Page title (English).",
      table: { type: { summary: "string" } },
    },
    applicationTitle_ar: {
      control: "text",
      description: "Page title (Arabic).",
      table: { type: { summary: "string" } },
    },
    applicationId: {
      control: "text",
      description: "ID passed to useGetApplicationDetails hook.",
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Visual theme.",
      defaultValue: "dark",
    },
    onOwnerClick: {
      action: "ownerClicked",
      description: "Called with { ownerData, action } when an owner button is clicked.",
      table: { category: "Events" },
    },
    onPlotClick: {
      action: "plotClicked",
      description: "Called with { PlotData, action } when a plot button is clicked.",
      table: { category: "Events" },
    },
    onDocumentOpen: {
      action: "documentOpened",
      description: "Called with the download URL when a document row is clicked. Replaces window.open — inject platform-specific handler here.",
      table: { category: "Events" },
    },
  },
};

export default meta;

type Story = StoryObj<ApplicationDetailProps>;

const sharedArgs: Partial<ApplicationDetailProps> = {
  applicationId: "",
  applicationTitle: "Application Details",
  applicationTitle_ar: "تفاصيل الطلب",
  language: "en",
  theme: "dark",
  onDocumentOpen: (url) => window.open(url, "_blank"),
};

export const Dark: Story = {
  args: {
    ...sharedArgs,
    theme: "dark",
  },
  render: (args) => (
    <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
      <ApplicationDetail {...args} />
    </div>
  ),
};

export const Light: Story = {
  args: {
    ...sharedArgs,
    theme: "light",
  },
  render: (args) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <ApplicationDetail {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    ...sharedArgs,
    language: "ar",
    applicationTitle: "Application Details",
    applicationTitle_ar: "تفاصيل الطلب",
    theme: "dark",
  },
  render: (args) => (
    <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
      <ApplicationDetail {...args} />
    </div>
  ),
};
