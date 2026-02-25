import type { Meta, StoryObj } from "@storybook/react";
import TitleBar from "./TitleBar";

const meta: Meta<typeof TitleBar> = {
  component: TitleBar,
  title: "Components/TitleBar",
  parameters: {
    docs: {
      description: {
        component:
          "TitleBar displays a heading with optional acronym initials and a configurable CTA button. Supports bilingual (EN/AR) and RTL.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TitleBar>;

export const Default: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Land Allocation",
    title_ar: "تخصيص الأراضي",
    showAcronym: true,
    acronym: "LA",
    showButton: true,
    buttonLabel: "New Application",
    buttonLabel_ar: "طلب جديد",
    buttonType: "primary",
    onClick: () => {},
  },
};

export const WithoutButton: Story = {
  args: {
    language: "en",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    showAcronym: true,
    acronym: "PT",
    showButton: false,
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
    buttonType: "primary",
  },
};

export const Arabic: Story = {
  args: {
    language: "ar",
    showTitle: true,
    title: "Page Title",
    title_ar: "عنوان الصفحة",
    showAcronym: true,
    acronym: "LA",
    showButton: true,
    buttonLabel: "Primary CTA",
    buttonLabel_ar: "الإجراء الأساسي",
    buttonType: "primary",
  },
};
