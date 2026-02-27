import type { Meta, StoryObj } from "@storybook/react";
import ViewOwnerDetail from "./ViewOwnerDetail";
import type { ViewOwnerDetailProps } from "./ViewOwnerDetail";

const meta: Meta<typeof ViewOwnerDetail> = {
  title: "CommonComponents/ViewOwnerDetail",
  component: ViewOwnerDetail,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Displays owner details and document upload inputs for the given plot code. Supports bilingual (English/Arabic) interface with RTL layout.",
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

type Story = StoryObj<typeof ViewOwnerDetail>;

const sampleProps: ViewOwnerDetailProps = {
  plotCode: "0-222-000-RCH9999",
  plotCode_ar: "0-222-000-RCH9999",
  owner: {
    name: "Talal Ahmed Salem",
    details: [
      { label: "UAE National ID", label_ar: "الهوية الوطنية الإماراتية", value: "78273890399292" },
      { label: "MOI Unified Number", label_ar: "رقم وزارة الداخلية الموحد", value: "330928" },
      { label: "Archive Number", label_ar: "رقم الأرشيف", value: "7921" },
      { label: "Nationality", label_ar: "الجنسية", value: "United Arab Emirates" },
      { label: "Special Nationality", label_ar: "الجنسية الخاصة", value: "No" },
      { label: "Share", label_ar: "الحصة", value: "100% Allotment 50% Share" },
      { label: "Right Hold Type", label_ar: "نوع حق الحيازة", value: "Ownership Musataha" },
    ],
  },
  // Button labels
  viewButtonText: "View",
  viewButtonText_ar: "عرض",
  // Section labels
  ownerText: "Owner",
  ownerText_ar: "المالك",
  documentsText: "Documents",
  documentsText_ar: "المستندات",
  // Document names
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
      <ViewOwnerDetail {...args} />
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
      <ViewOwnerDetail {...args} />
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
      <ViewOwnerDetail {...args} />
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
      <ViewOwnerDetail {...args} />
    </div>
  ),
};

export const WithMainTitle: Story = {
  args: {
    ...sampleProps,
    mainTitle: "Owner Detail",
    mainTitle_ar: "تفاصيل المالك",
    plotCode: "",
    plotCode_ar: "",
    theme: "dark",
    language: "en",
  },
  render: (args) => (
    <div style={{ background: "#2A2A32", minHeight: "100vh", padding: 32 }}>
      <ViewOwnerDetail {...args} />
    </div>
  ),
};
