import type { Meta, StoryObj } from "@storybook/react";
import { DummyComponent } from "./DummyComponent";

const meta: Meta<typeof DummyComponent> = {
  component: DummyComponent,
  title: "Shared/DummyComponent",
};
export default meta;

type Story = StoryObj<typeof DummyComponent>;

export const Default: Story = {
  args: { title: "Dummy Component" },
};

export const CustomTitle: Story = {
  args: { title: "Custom title" },
};
