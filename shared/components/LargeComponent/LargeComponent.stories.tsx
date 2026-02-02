import type { Meta, StoryObj } from "@storybook/react";
import { LargeComponent } from "./LargeComponent";

const meta: Meta<typeof LargeComponent> = {
  component: LargeComponent,
  title: "Shared/LargeComponent",
};
export default meta;

type Story = StoryObj<typeof LargeComponent>;

export const Default: Story = {};
