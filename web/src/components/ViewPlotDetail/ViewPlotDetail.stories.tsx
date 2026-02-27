import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ViewPlotDetail } from "@shared/components/ViewPlotDetail";
import type { ViewPlotDetailProps } from "@shared/components/ViewPlotDetail";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof ViewPlotDetail> = {
  title: "Components/ViewPlotDetail",
  component: ViewPlotDetail,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Displays plot and owner details along with document upload inputs. Supports bilingual (English/Arabic) interface with RTL layout.",
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language for the component interface",
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "Theme variant",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ViewPlotDetail>;

const sampleProps: ViewPlotDetailProps = {
  plotIds: ["12345"],
  plotCode: "0-222-000-RCH9999",
  plotCode_ar: "0-222-000-RCH9999",
  plotTitle: "Plot",
  plotTitle_ar: "القطعة",
  plotLeftDetails: [
    {
      label: "Plot Address",
      label_ar: "عنوان القطعة",
      value: "0-222-000-RCH9999",
    },
    { label: "Zone/District", label_ar: "المنطقة/الحي", value: "Al Layyan" },
    { label: "Sector", label_ar: "القطاع", value: "Seih Al Sedeirah 64" },
  ],
  plotBottomDetails: [
    { label: "Plot Number", label_ar: "رقم القطعة", value: "C1" },
    { label: "Municipality", label_ar: "البلدية", value: "Abu Dhabi City" },
    { label: "Allocation Type", label_ar: "نوع التخصيص", value: "Commercial" },
    { label: "Land Use", label_ar: "استخدام الأرض", value: "Multi-usage" },
    {
      label: "Investment Area Name",
      label_ar: "اسم المنطقة الاستثمارية",
      value: "-",
    },
    {
      label: "Expat Ownership Percentage",
      label_ar: "نسبة ملكية الوافدين",
      value: "No",
    },
    { label: "Plot File Number", label_ar: "رقم ملف القطعة", value: "-" },
    {
      label: "Area",
      label_ar: "المساحة",
      value: "314.939.11 Square Meter 3,389,962.71 Square Feet",
    },
    {
      label: "Construction Status",
      label_ar: "حالة البناء",
      value: "Not Constructed",
    },
  ],
  owner: {
    name: "Talal Ahmed Salem",
    details: [
      {
        label: "UAE National ID",
        label_ar: "الهوية الوطنية الإماراتية",
        value: "78273890399292",
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "330928",
      },
      { label: "Archive Number", label_ar: "رقم الأرشيف", value: "7921" },
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "United Arab Emirates",
      },
      { label: "Special Nationality", label_ar: "الجنسية الخاصة", value: "No" },
      { label: "Share", label_ar: "الحصة", value: "100% Allotment 50% Share" },
      {
        label: "Right Hold Type",
        label_ar: "نوع حق الحيازة",
        value: "Ownership Musataha",
      },
    ],
  },
  viewButtonText: "View",
  viewButtonText_ar: "عرض",
  ownerText: "Owner",
  ownerText_ar: "المالك",
  documentsText: "Documents",
  documentsText_ar: "المستندات",
  uaeIdText: "UAE National Identity",
  uaeIdText_ar: "الهوية الوطنية الإماراتية",
  passportText: "Passport",
  passportText_ar: "جواز السفر",
};

export const Default: Story = {
  args: {
    ...sampleProps,
    theme: "dark",
    language: "en",
  },
  render: (args) => (
    <div style={{ background: "#2A2A32", minHeight: "100vh", padding: 32 }}>
      <ViewPlotDetail {...args} />
    </div>
  ),
};

export const Light: Story = {
  args: {
    ...sampleProps,
    theme: "light",
    language: "en",
  },
  render: (args) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <ViewPlotDetail {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    ...sampleProps,
    theme: "dark",
    language: "ar",
  },
  render: (args) => (
    <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
      <ViewPlotDetail {...args} />
    </div>
  ),
};

export const ArabicLight: Story = {
  args: {
    ...sampleProps,
    theme: "light",
    language: "ar",
  },
  render: (args) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <ViewPlotDetail {...args} />
    </div>
  ),
};

export const NoOwner: Story = {
  args: {
    ...sampleProps,
    theme: "dark",
    language: "en",
    showOwnerDetails: false,
  },
  render: (args) => (
    <div style={{ background: "#2A2A32", minHeight: "100vh", padding: 32 }}>
      <ViewPlotDetail {...args} />
    </div>
  ),
};
