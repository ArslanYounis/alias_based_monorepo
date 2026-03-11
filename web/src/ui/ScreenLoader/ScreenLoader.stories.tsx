import type { Meta, StoryObj } from "@storybook/react";
import ScreenLoader from "./ScreenLoader";

const meta: Meta<typeof ScreenLoader> = {
  component: ScreenLoader,
  title: "UI/ScreenLoader",
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof ScreenLoader>;

export const Default: Story = {
  args: {
    isLoading: true,
    gifSrc: "https://adrec-images.mastermind-mindset.com/TrailLoading.gif",
    alt: "Loading...",
  },
  render: (args) => (
    <div style={{ height: "100vh", position: "relative" }}>
      <ScreenLoader {...args} />
      <div style={{ textAlign: "center", marginTop: "50vh" }}>
        <h1>Content behind loader</h1>
      </div>
    </div>
  ),
};
