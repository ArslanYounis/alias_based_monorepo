import { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./index";
import { useState } from "react";
import type { ComponentProps } from "react";

type FilterBarProps = ComponentProps<typeof FilterBar>;

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **FilterBar** component provides a flexible and interactive UI for filtering and searching content with bilingual (English/Arabic) support.
        `,
      },
    },
  },
  argTypes: {
    language: { control: "radio", options: ["en", "ar"] },
    theme: { control: "radio", options: ["light", "dark"] },
    filterOptions: { control: "object" },
    sortOptions: { control: "object" },
    applicationOptions: { control: "object" },
    searchColumns: { control: "object" },
    selectedSearchColumns: { control: "object" },
    onSearchColumnsChange: { action: "search columns changed" },
    searchPlaceholder: { control: "text" },
    searchPlaceholder_ar: { control: "text" },
    filterButtonLabel: { control: "text" },
    filterButtonLabel_ar: { control: "text" },
    resetButtonLabel: { control: "text" },
    resetButtonLabel_ar: { control: "text" },
    filterButtonCount: { control: "number" },
    filterButtonClassName: { control: "text" },
    mobileColumnTitle: { control: "text" },
    mobileColumnTitle_ar: { control: "text" },
    onSearchChange: { action: "search changed" },
    onReset: { action: "reset clicked" },
    showResetButton: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

const Template = (args: FilterBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>(
    []
  );

  return (
    <div
      className={
        args.theme === "dark"
          ? "bg-[#1a1a1a] p-4 min-h-screen"
          : "bg-white p-4 min-h-screen"
      }
    >
      <FilterBar
        {...args}
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        selectedSearchColumns={selectedSearchColumns}
        onSearchColumnsChange={setSelectedSearchColumns}
      />
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    language: "en",
    theme: "light",
    filterOptions: ["Actions", "Critical"],
    sortOptions: ["Newest First", "Oldest First"],
    applicationOptions: ["My Applications", "All Applications"],
    searchColumns: ["Column 1", "Column 2", "Column 3"],
    filterButtonLabel: "All Filters",
    resetButtonLabel: "Default Filter",
    mobileColumnTitle: "View Column",
    showResetButton: true,
  },
};

export const Arabic: Story = {
  render: (args) => (
    <div dir="rtl" className="bg-white p-4 min-h-screen">
      <FilterBar {...args} />
    </div>
  ),
  args: {
    language: "ar",
    theme: "light",
    searchColumns: ["العمود 1", "العمود 2", "العمود 3"],
    filterOptions: ["الإجراءات", "حرج"],
    sortOptions: ["الأحدث أولاً", "الأقدم أولاً"],
    applicationOptions: ["طلباتي", "جميع الطلبات"],
    filterButtonLabel_ar: "جميع المرشحات",
    resetButtonLabel_ar: "المرشح الافتراضي",
    searchPlaceholder_ar: "بحث",
    mobileColumnTitle_ar: "عرض العمود",
    showResetButton: true,
  },
};

export const Dark: Story = {
  render: (args) => (
    <div className="bg-[#12121B] p-4 min-h-screen">
      <FilterBar {...args} />
    </div>
  ),
  args: {
    language: "en",
    theme: "dark",
    filterOptions: ["Actions", "Critical"],
    sortOptions: ["Newest First", "Oldest First"],
    applicationOptions: ["My Applications", "All Applications"],
    searchColumns: ["Column 1", "Column 2", "Column 3"],
    filterButtonLabel: "All Filters",
    resetButtonLabel: "Default Filter",
    mobileColumnTitle: "View Column",
    showResetButton: true,
  },
};

export const DarkArabic: Story = {
  render: (args) => (
    <div dir="rtl" className="bg-[#12121B] p-4 min-h-screen">
      <FilterBar {...args} />
    </div>
  ),
  args: {
    language: "ar",
    theme: "dark",
    searchColumns: ["العمود 1", "العمود 2", "العمود 3"],
    filterOptions: ["الإجراءات", "حرج"],
    sortOptions: ["الأحدث أولاً", "الأقدم أولاً"],
    applicationOptions: ["طلباتي", "جميع الطلبات"],
    filterButtonLabel_ar: "جميع المرشحات",
    resetButtonLabel_ar: "المرشح الافتراضي",
    searchPlaceholder_ar: "بحث",
    mobileColumnTitle_ar: "عرض العمود",
    showResetButton: true,
  },
};
