import type { Meta, StoryObj } from "@storybook/react";
import { MenuColumn } from "./MenuColumn";

const meta: Meta<typeof MenuColumn> = {
  title: "Components/Navigation/MenuColumn",
  component: MenuColumn,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Sidebar** component provides a responsive navigation panel for both desktop and mobile views.
Use \`currentPath\` to simulate an active route in Storybook.

### Features:
- **Responsive Design**: Adapts to desktop and mobile layouts
- **Theme Support**: Light and dark theme variants
- **Bilingual Support**: English and Arabic with RTL layout
- **Collapsible**: Desktop sidebar can be collapsed/expanded
- **Active State**: Highlights current active route
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language setting for RTL layout and text display",
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Theme variant for styling",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MenuColumn>;

export const Default: Story = {
  args: {
    language: "en",
    theme: "light",
  },
};

export const Dark: Story = {
  args: {
    language: "en",
    theme: "dark",
  },
  render: (args) => {
    return (
      <div style={{ background: '#2A2A32', minHeight: '100vh', padding: 32 }}>
        <MenuColumn {...args} />
      </div>
    );
  },
};

export const ArabicRTL: Story = {
  args: {
    language: "ar",
    theme: "light",
  },
  render: (args) => {
    return (
    <div style={{ direction: 'rtl' }}>
        <MenuColumn
          {...args}
        />
    </div>
    );
  },
};

export const ArabicDark: Story = {
  args: {
    language: "ar",
    theme: "dark",
  },
  render: (args) => {
    return (
      <div style={{ background: '#2A2A32', minHeight: '100vh', padding: 32, direction: 'rtl' }}>
        <MenuColumn {...args} />
      </div>
    );
  },
};
