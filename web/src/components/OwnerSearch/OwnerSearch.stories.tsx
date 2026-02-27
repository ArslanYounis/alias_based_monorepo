import type { Meta, StoryObj } from "@storybook/react";
import { OwnerSearch } from "@shared/components/OwnerSearch";

const meta: Meta<typeof OwnerSearch> = {
  component: OwnerSearch,
  title: "Components/OwnerSearch",
  parameters: {
    docs: {
      description: {
        component:
          "OwnerSearch allows users to search for owners by individual owner details or by company. Supports bilingual (EN/AR) and RTL.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof OwnerSearch>;

export const Default: Story = {
  args: {
    language: "en",
    title: "Search Owner",
    title_ar: "البحث عن مالك",
    initialOwnerType: "company",
    ownerTypeOptions: {
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
    },
    selected: [],
    onSubmit: (val) => console.log("OwnerSearch onSubmit", val),
  },
};

export const Arabic: Story = {
  args: {
    language: "ar",
    title: "Search Owner",
    title_ar: "البحث عن مالك",
    initialOwnerType: "owner",
    ownerTypeOptions: {
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
    },
    selected: [],
    onSubmit: (val) => console.log("OwnerSearch onSubmit", val),
  },
};

export const InitialOwner: Story = {
  args: {
    language: "en",
    title: "Search Owner",
    initialOwnerType: "owner",
    ownerTypeOptions: {
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
    },
    selected: [],
  },
};

export const WithSubtitle: Story = {
  args: {
    language: "en",
    title: "Find Owner",
    title_ar: "العثور على مالك",
    subtitle: "Search by owner name, national number, or company",
    subtitle_ar: "ابحث باسم المالك أو الرقم الوطني أو الشركة",
    initialOwnerType: "company",
    ownerTypeOptions: {
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
    },
    selected: [],
  },
};
