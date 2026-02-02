import type { Meta, StoryObj } from "@storybook/react";
import { ProfileIconStatus } from "./ProfileIconStatus";

const meta: Meta<typeof ProfileIconStatus> = {
  component: ProfileIconStatus,
  title: "UI/ProfileIconStatus",
};
export default meta;

type Story = StoryObj<typeof ProfileIconStatus>;

export const Pending: Story = { args: { status: "pending" } };
export const InProgress: Story = { args: { status: "inProgress" } };
export const Complete: Story = { args: { status: "complete" } };
export const Failed: Story = { args: { status: "failed" } };
