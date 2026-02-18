import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  title: "UI/Breadcrumb",
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", onClick: () => {} },
      { label: "Level 1", onClick: () => {} },
      { label: "Current", onClick: () => {} },
    ],
  },
};
