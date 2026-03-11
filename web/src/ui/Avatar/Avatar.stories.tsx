import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Avatar** component supports:
- Image avatar via \`imageUrl\`
- Initials fallback via \`initials\`
- Status badge (inProgress, complete, failed, pending)
- Size control via \`avatarSize\` prop (default 32px)
- Badge size via \`badgeSize\` prop (default 18px)
- Initials font size via \`initialsFontSize\` prop (default 12px)
- Initials text color via \`initialsTextColor\` prop (default #12121B)
- Initials border color via \`initialsBorderColor\` prop (default #A0A0A4)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    avatarSize: { control: { type: "number" }, defaultValue: 64 },
    badgeSize: { control: { type: "number" }, defaultValue: 18 },
    initials: { control: { type: "text" } },
    initialsFontSize: {
      control: { type: "number" },
      defaultValue: 18,
      if: { arg: "initials", truthy: true },
    },
    initialsTextColor: {
      control: { type: "color" },
      defaultValue: "#12121B",
      if: { arg: "initials", truthy: true },
    },
    initialsBorderColor: {
      control: { type: "color" },
      defaultValue: "#A0A0A4",
      if: { arg: "initials", truthy: true },
    },
    status: {
      control: { type: "select" },
      options: ["inProgress", "complete", "failed", "pending"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const AvatarWithImage: Story = {
  args: {
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
  },
};

export const AvatarWithInitials: Story = {
  args: {
    initials: "AR",
  },
};

export const AvatarWithNoImageNoInitials: Story = {
  args: {},
};

export const AvatarWithInprogressBadge: Story = {
  args: {
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "inProgress",
  },
};

export const AvatarWithCompleteBadge: Story = {
  args: {
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "complete",
  },
};

export const AvatarWithFailedBadge: Story = {
  args: {
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "failed",
  },
};

export const AvatarWithPendingBadge: Story = {
  args: {
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "pending",
  },
};

export const InitialsWithInprogressBadge: Story = {
  args: {
    initials: "XX",
    status: "pending",
  },
};

export const InitialsWithCompleteBadge: Story = {
  args: {
    initials: "pp",
    status: "complete",
  },
};
