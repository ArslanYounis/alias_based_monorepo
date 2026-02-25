import type { Meta, StoryObj } from "@storybook/react";
import { Layout } from "./Layout";

const meta: Meta<typeof Layout> = {
  component: Layout,
  title: "UI/Layout",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Layout uses shared Layout with Group 0 (ADREC): Container, Header, MenuColumn, Footer, Toast. Header and Footer match ADREC stories/header and stories/footer; MenuColumn is stub until full migration from ADREC Navigation/menuColumn.",
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Theme of the layout",
    },
    isEditing: {
      control: "boolean",
      description: "Whether the layout is in editing mode",
    },
    showHeader: { control: "boolean" },
    showSidebar: { control: "boolean" },
    showFooter: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Layout>;

const defaultMenuItems = [
  { label: "Profile", label_ar: "الملف الشخصي", onClick: () => {} },
  { label: "Logout", label_ar: "تسجيل الخروج", onClick: () => {} },
];
const defaultBreadcrumbItems = [
  { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
  { label: "Level 1", label_ar: "المستوى 1", onClick: () => {} },
];

const baseArgs = {
  language: "en" as const,
  theme: "light" as const,
  isEditing: false,
  showHeader: true,
  showSidebar: true,
  showFooter: true,
  menuItems: defaultMenuItems,
  breadcrumbItems: defaultBreadcrumbItems,
  toast: { message: "", status: "success" as const },
};

export const Default: Story = {
  args: baseArgs,
  render: (args) => (
    <Layout {...args}>
      <div className="p-4">Main content goes here.</div>
    </Layout>
  ),
};

export const Arabic: Story = {
  args: { ...baseArgs, language: "ar" },
  render: (args) => (
    <Layout {...args}>
      <div className="p-4">المحتوى الرئيسي هنا.</div>
    </Layout>
  ),
};

export const WithEditing: Story = {
  args: { ...baseArgs, theme: "dark", isEditing: true },
  render: (args) => (
    <Layout {...args}>
      <div className="p-4">
        Edit Mode Content - Layout elements are blurred/disabled.
      </div>
    </Layout>
  ),
};

export const WithToast: Story = {
  args: {
    ...baseArgs,
    toast: { message: "Operation completed successfully.", status: "success" as const },
  },
  render: (args) => (
    <Layout {...args}>
      <div className="p-4">Content with toast visible.</div>
    </Layout>
  ),
};
