import type { Meta, StoryObj } from "@storybook/react";
import { Buttons } from "./Buttons";

const meta: Meta<typeof Buttons> = {
  component: Buttons,
  title: "UI/Buttons",
};
export default meta;

type Story = StoryObj<typeof Buttons>;

export const Primary: Story = {
  args: { title: "Primary Button", type: "primary" },
};

export const Secondary: Story = {
  args: { title: "Secondary", type: "secondary" },
};

export const Tertiary: Story = {
  args: { title: "Tertiary", type: "tertiary" },
};

export const Disabled: Story = {
  args: { title: "Disabled", type: "primary", disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Buttons title="Small" size="s" type="primary" />
      <Buttons title="Medium" size="m" type="primary" />
      <Buttons title="Large" size="l" type="primary" />
    </div>
  ),
};
