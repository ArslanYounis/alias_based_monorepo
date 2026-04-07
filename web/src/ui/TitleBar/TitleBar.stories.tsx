import type { Meta, StoryObj } from "@storybook/react";
import TitleBar from "./TitleBar";
import PlusIcon from "@/assets/svg/PlusIcon";

// NOTE: SectionTitle is a separate component and is not part of TitleBar stories.

const meta: Meta<typeof TitleBar> = {
  component: TitleBar,
  title: "Components/TitleBar",
  parameters: {
    docs: {
      description: {
        component: `
The **TitleBar** component displays a heading with acronym initials and a configurable call-to-action optional button.
Supports bilingual content (English/Arabic) with RTL layout support.

### Props:
- \`title\` (string): Main heading text in English.
- \`title_ar\` (string): Main heading text in Arabic.
- \`language\` (string): Language setting ('en' or 'ar') for the component.
- \`showTitle\` (boolean): Controls visibility of the title and related props. Defaults to true.
- \`acronym\` (string): Up to 3 characters, shown as initials. Defaults to first 3 chars of title, always uppercase.
- \`acronymBGColor\` (string): Background color for the acronym initials. Defaults to #7D99A6.
- \`showButton\` (boolean): Controls visibility of the CTA button and button props.
- \`buttonLabel\`, \`buttonLabel_ar\`, \`buttonType\`: Customize the button's appearance and text.
        `,
      },
    },
    actions: { argTypesRegex: "^on.*" },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language setting for the component text",
      table: { type: { summary: '"en" | "ar"' }, defaultValue: { summary: "en" } },
    },
    showTitle: {
      control: "boolean",
      description: "Controls visibility of the title prop.",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
    },
    title: {
      control: "text",
      description: "Main heading text in English.",
      table: { type: { summary: "string" }, defaultValue: { summary: "" } },
      if: { arg: "showTitle", truthy: true },
    },
    title_ar: {
      control: "text",
      description: "Main heading text in Arabic.",
      table: { type: { summary: "string" }, defaultValue: { summary: "" } },
      if: { arg: "showTitle", truthy: true },
    },
    acronym: {
      control: "text",
      description: "Up to 3 characters, shown as initials. Defaults to first 3 chars of title, always uppercase.",
      table: { type: { summary: "string" }, defaultValue: { summary: "" } },
    },
    acronymBGColor: {
      control: "color",
      description: "Background color for the acronym initials. Defaults to #7D99A6.",
      table: { type: { summary: "string" }, defaultValue: { summary: "#7D99A6" } },
    },
    showButton: {
      control: "boolean",
      description: "Controls visibility of the CTA button.",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    buttonLabel: {
      control: "text",
      description: "Text for the CTA button in English.",
      table: { type: { summary: "string" }, defaultValue: { summary: "Primary CTA" } },
      if: { arg: "showButton", truthy: true },
    },
    buttonLabel_ar: {
      control: "text",
      description: "Text for the CTA button in Arabic.",
      table: { type: { summary: "string" }, defaultValue: { summary: "" } },
      if: { arg: "showButton", truthy: true },
    },
    buttonType: {
      control: { type: "radio" },
      options: ["primary", "secondary", "tertiary", "text-link", "delete"],
      description: "Type of the CTA button.",
      table: { type: { summary: '"primary" | "secondary" | "tertiary" | "text-link" | "delete"' }, defaultValue: { summary: "primary" } },
      if: { arg: "showButton", truthy: true },
    },
    leftIcon: {
      control: false,
      description: "Icon to display on the left side of the button.",
      table: { type: { summary: "ReactElement" }, defaultValue: { summary: "undefined" } },
      if: { arg: "showButton", truthy: true },
    },
    rightIcon: {
      control: false,
      description: "Icon to display on the right side of the button.",
      table: { type: { summary: "ReactElement" }, defaultValue: { summary: "undefined" } },
      if: { arg: "showButton", truthy: true },
    },
    onClick: {
      action: "changed",
      table: { category: "Events" },
      if: { arg: "showButton", truthy: true },
    },
    showAcronym: {
      control: "boolean",
      description: "Controls visibility of the acronym initials.",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
    },
    theme: {
      control: "radio",
      options: ["light", "dark"],
      description: "Sets the theme of the button (light or dark).",
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: "light" },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TitleBar>;

export const Desktop: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    acronym: "xxx",
    showButton: true,
    buttonLabel: "Primary CTA",
    buttonLabel_ar: "الإجراء الأساسي",
    buttonType: "primary",
  },
};

export const WebMobileResponsive: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    acronym: "XXX",
    showButton: true,
    buttonLabel: "Primary CTA",
    buttonLabel_ar: "الإجراء الأساسي",
    buttonType: "primary",
    leftIcon: <PlusIcon color="#000000" />,
  },
};

export const WithoutButton: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    acronym: "XXX",
    acronymBGColor: undefined,
    buttonLabel: "New CTA",
    buttonLabel_ar: "إجراء جديد",
    buttonType: "primary",
  },
};

export const NoAcronym: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    showAcronym: false,
    showButton: true,
    buttonLabel: "Primary CTA",
    buttonLabel_ar: "الإجراء الأساسي",
    buttonType: "primary",
  },
};

export const DarkMode: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    showAcronym: true,
    theme: "dark",
    showButton: true,
    buttonLabel: "Primary CTA",
    buttonLabel_ar: "الإجراء الأساسي",
    buttonType: "primary",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Arabic: Story = {
  args: {
    language: "ar",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    showAcronym: true,
    showButton: true,
    buttonLabel: "Primary CTA",
    buttonLabel_ar: "الإجراء الأساسي",
    buttonType: "primary",
  },
};
