import type { Meta, StoryObj } from "@storybook/react";
import { SearchPlot } from "@shared/components/SearchPlot";

const meta: Meta<typeof SearchPlot> = {
  title: "Components/SearchPlot",
  component: SearchPlot,
  tags: ["autodocs"],
  parameters: {
    layout: "",
    docs: {
      description: {
        component: `
The **SearchPlot** component allows users to search for available plots by plot number, company owner, or individual owner.

### Props:

- \`title\` / \`title_ar\` (string): Main heading displayed in English or Arabic.
- \`subtitle\` / \`subtitle_ar\` (string): Optional subtitle for additional instructions.
- \`ownerTypeOptions\` (object): Labels for the plot type radio cards.
- \`initialOwnerType\` ("plot" | "company" | "owner"): Default selected tab.
- \`enabledTabs\` (object): Controls which tabs are visible. Plot is always enabled.
- \`selected\` (SearchResult[]): Pre-selected search results.
- \`onSubmit\` (function): Callback when search results are submitted.
- \`language\` ("en" | "ar"): Controls language and RTL layout.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls language and RTL layout.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    title: { control: "text", description: "English title" },
    title_ar: { control: "text", description: "Arabic title" },
    subtitle: { control: "text", description: "English subtitle" },
    subtitle_ar: { control: "text", description: "Arabic subtitle" },
    initialOwnerType: {
      control: "radio",
      options: ["plot", "company", "owner"],
      description: "Initial selected owner type",
    },
    ownerTypeOptions: {
      control: "object",
      description: "Labels for plot type options",
    },
    enabledTabs: {
      control: "object",
      description: "Controls which tabs are visible (plot | company | owner)",
      table: {
        type: {
          summary: "{ plot?: boolean; company?: boolean; owner?: boolean }",
        },
        defaultValue: {
          summary: "{ plot: true, company: true, owner: true }",
        },
      },
    },
    selected: { control: "object", description: "Pre-selected search results" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchPlot>;

export const English: Story = {
  args: {
    language: "en",
    title: "Search Plot",
    subtitle: "",
    initialOwnerType: "plot",
    enabledTabs: {
      plot: true,
      company: true,
      owner: true,
    },
    ownerTypeOptions: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    selected: [],
  },
};

export const Arabic: Story = {
  args: {
    language: "ar",
    title: "Search Plot",
    title_ar: "العثور على قطعة أرض",
    subtitle: "",
    subtitle_ar: "اختر قطعة أرض حسب النوع",
    initialOwnerType: "plot",
    enabledTabs: {
      plot: true,
      company: true,
      owner: true,
    },
    ownerTypeOptions: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    selected: [],
  },
};

export const PlotAndCompanyOnly: Story = {
  args: {
    language: "en",
    title: "Search Plot",
    initialOwnerType: "company",
    enabledTabs: {
      plot: true,
      company: true,
      owner: false,
    },
    ownerTypeOptions: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    selected: [],
  },
};

export const PlotAndOwnerOnly: Story = {
  args: {
    language: "en",
    title: "Search Plot",
    initialOwnerType: "owner",
    enabledTabs: {
      plot: true,
      company: false,
      owner: true,
    },
    ownerTypeOptions: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    selected: [],
  },
};

export const InitialCompanySelected: Story = {
  args: {
    language: "en",
    title: "Search Plot",
    subtitle: "",
    initialOwnerType: "company",
    ownerTypeOptions: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    selected: [],
  },
};

export const PreSelectedResults: Story = {
  args: {
    language: "en",
    title: "Search Plot",
    initialOwnerType: "owner",
    enabledTabs: {
      plot: true,
      owner: true,
      company: false,
    },
    ownerTypeOptions: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    selected: [
      {
        plotNumber: "101",
        ownerId: "O-001",
        plotId: "123",
        landUseName: "Land Use",
        code: "S45",
      },
      {
        plotNumber: "102",
        ownerId: "O-002",
        plotId: "122",
        landUseName: "Land Use",
        code: "S45",
      },
    ],
  },
};
