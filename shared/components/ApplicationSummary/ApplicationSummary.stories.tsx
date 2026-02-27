import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import type { UiBlock } from "./ApplicationSummary.types";
import ApplicationSummary from "./ApplicationSummary";

const meta: Meta<typeof ApplicationSummary> = {
  title: "CommonComponents/ApplicationSummary",
  component: ApplicationSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Displays a flexible summary component that can render multiple sections including:

- Agent (customer representative)
- Application details
- Plot cards
- Owner cards
- Generic card
- Generic cards
- Generic table card
- Interaction history
- Documents

The component supports dynamic grid columns based on the number of data arrays provided.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: "radio",
      options: ["en", "ar"] as const,
      description: "Controls UI language and direction (LTR / RTL).",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    title: {
      control: "text",
      description: "Title shown in the header (English).",
    },
    title_ar: {
      control: "text",
      description: "Title shown in the header (Arabic).",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ApplicationSummary>;

const defaultData: UiBlock[][] = [
  [
    {
      type: "agent",
      data: {
        agent: {
          name: "English Name",
          name_ar: "Arabic Name",
          email: "email@test.com",
          phone: "0500000000",
        },
      },
    },
    {
      type: "applicationDetails",
      data: {
        applicationNumber: "APP-123",
        applicationNumber_ar: "١٢٣-APP",
      },
    },
    {
      type: "plot",
      data: {
        title: "Plot",
        plots: [
          {
            plotId: "1",
            plotArgs: "1",
            plotNumber: "Plot-01",
            fields: [
              { label: "Zone", value: "Zone A" },
              { label: "District", value: "District 1" },
              { label: "Community", value: "Community X" },
            ],
          },
        ],
        showChangePlotButton: true,
        showViewButton: true,
        showOwnersButton: true,
      },
    },
    {
      type: "owners",
      data: {
        title: "Owners",
        owners: [
          {
            ownerId: "1",
            ownerArgs: "1",
            name: "Owner Name",
            fields: [
              { label: "Share", value: "50%" },
              { label: "Hold Type", value: "Ownership" },
            ],
          },
          {
            ownerId: "2",
            ownerArgs: "2",
            name: "Owner Name 2",
            fields: [
              { label: "Share", value: "50%" },
              { label: "Hold Type", value: "Ownership" },
            ],
          },
        ],
      },
    },
    {
      type: "genericCards",
      data: {
        title: "Late Payment Details",
        title_ar: "تفاصيل التأخير في الدفع",
        cardsData: [
          {
            rowsData: [
              { label: "Tenancy Contract Type", value: "Standing" },
              { label: "Start Date", value: "29/6/2025" },
              { label: "Rent Amount", value: "912" },
            ],
            showTitleButtons: true,
            titleButtons: [
              {
                title: "Edit",
                title_ar: "تعديل",
                onClick: () => console.log("Edit clicked"),
              },
              {
                title: "View",
                title_ar: "عرض",
                onClick: () => console.log("View clicked"),
              },
            ],
          },
        ],
        isExpandable: false,
        showButtons: false,
      },
    },
    {
      type: "genericTableCard",
      data: {
        title: "Owner Information",
        title_ar: "معلومات المالك",
        description: "Description",
        description_ar: "Arabic Description",
        cardTitleLabel: "Card Title Label",
        cardTitleValue: "Card Title Value",
        variant: "small",
        columnsData: [
          { key: "field", label: "Field", label_ar: "الحقل" },
          { key: "col1", label: "Value 1", label_ar: "القيمة 1" },
          { key: "col2", label: "Value 2", label_ar: "القيمة 2" },
          { key: "col3", label: "Value 3", label_ar: "القيمة 3" },
          { key: "col4", label: "Value 4", label_ar: "القيمة 4" },
          { key: "col5", label: "Value 5", label_ar: "القيمة 5" },
        ],
        rowsData: [
          {
            label: "Identity Details",
            label_ar: "تفاصيل الهوية",
            button: { title: "Hello", onClick: () => alert("hello") },
            extraItems: [
              { label: "UAE National ID", label_ar: "الهوية الوطنية الإماراتية", value: "78273890399292", value_ar: "78273890399292" },
              { label: "MOI Unified Number", label_ar: "رقم وزارة الداخلية الموحد", value: "330928", value_ar: "330928" },
              { label: "Archive Number", label_ar: "رقم الأرشيف", value: "7921", value_ar: "7921" },
            ],
          },
          {
            label: "Nationality Details",
            label_ar: "تفاصيل الجنسية",
            extraItems: [
              { label: "Nationality", label_ar: "الجنسية", value: "United Arab Emirates", value_ar: "الإمارات العربية المتحدة" },
              { label: "Share", label_ar: "الحصة", value: "100% Allotment 50% Share", value_ar: "100% تخصيص 50% حصة" },
            ],
          },
          {
            label: "Right Hold Type",
            label_ar: "نوع حق الحيازة",
            extraItems: [
              { value: "Ownership Musataha", value_ar: "ملكية مستطاعة" },
              { value: "Ownership Musataha", value_ar: "ملكية مستطاعة" },
            ],
          },
        ],
        showFooterButtons: true,
        footerButton: [
          { title: "Edit", title_ar: "تعديل", onClick: () => console.log("Edit clicked") },
          { title: "View", title_ar: "عرض", onClick: () => console.log("View clicked") },
        ],
        handlePaginationInternally: false,
        showPagination: true,
        currentPage: 1,
        totalPages: 10,
        pageSize: 5,
        onPageChange: (page: number) => console.log(page),
      },
    },
  ],
  [
    {
      type: "genericCards",
      data: {
        title: "Tenant Info",
        title_ar: "معلومات المستأجر",
        cardsData: [
          {
            rowsData: [
              { label: "Name", value: "John Doe" },
              { label: "Status", value: "Active" },
              { label: "Contract", value: "Annual" },
              { label: "Unit", value: "A-101" },
            ],
            showMoreButton: true,
            defaultShowMore: false,
            buttons: [
              {
                title: "Edit",
                title_ar: "تعديل",
                onClick: () => console.log("Edit clicked"),
              },
              {
                title: "View",
                title_ar: "عرض",
                onClick: () => console.log("View clicked"),
              },
            ],
            showFooterButtons: true,
            footerButton: [
              {
                title: "Edit",
                title_ar: "تعديل",
                type: "primary",
                onClick: () => console.log("Edit clicked"),
              },
              {
                title: "View",
                title_ar: "عرض",
                type: "secondary",
                onClick: () => console.log("View clicked"),
              },
            ],
          },
        ],
      },
    },
    {
      type: "genericCard",
      data: {
        title: "Tenant Info with Generic Card",
        title_ar: "معلومات المستأجر",
        cardTitleLabel: "Tenant Info with Generic Card",
        cardTitleLabel_ar: "معلومات المستأجر",
        variant: "small",
        rowsData: [
          { label: "Name", value: "John Doe" },
          { label: "Status", value: "Active" },
          { label: "Contract", value: "Annual" },
          { label: "Unit", value: "A-101" },
        ],
        showMoreButton: true,
        defaultShowMore: false,
        showButtons: true,
        buttons: [
          {
            title: "Edit",
            title_ar: "تعديل",
            onClick: () => console.log("Edit clicked"),
          },
          {
            title: "View",
            title_ar: "عرض",
            onClick: () => console.log("View clicked"),
          },
        ],
      },
    },
    {
      type: "interactionHistory",
      data: {
        totalCompletedSteps: 0,
        totalSteps: 6,
        wfiStepList: [
          {
            title: "Registration",
            title_ar: "التسجيل",
            stepConst: "ElmsAllotmentOfRanchPlots.Registration",
            stepStatusE: "Completed",
            stepStatusA: "مكتمل",
            comments: "Application submitted successfully",
            isCurrent: false,
            completedByCustomerNameE: "John Doe",
            completedByCustomerNameA: "جون دو",
            completeDate: "2025-01-15",
          },
          {
            title: "Assignment",
            title_ar: "التخصيص",
            stepConst: "ElmsAllotmentOfRanchPlots.Assignment",
            stepStatusE: "In Progress",
            stepStatusA: "قيد التنفيذ",
            comments: "Under review by the registration team",
            isCurrent: true,
            completedByCustomerNameE: "Jane Smith",
            completedByCustomerNameA: "جين سميث",
            completeDate: "2025-01-18",
          },
          {
            title: "Approval",
            title_ar: "الموافقة",
            stepConst: "ElmsAllotmentOfRanchPlots.Approval",
            stepStatusE: "Pending",
            stepStatusA: "قيد الانتظار",
            isCurrent: false,
          },
        ],
      },
    },
    {
      type: "documents",
      title: "Documents",
      title_ar: "وثائق",
      data: {
        documents: [
          {
            documentName: "Identity Document",
            documentName_ar: "وثيقة الهوية",
            isUploaded: true,
            downloadUrl: "https://example.com/document1.pdf",
          },
          {
            documentName: "Property Deed",
            documentName_ar: "سند الملكية",
            isUploaded: true,
            downloadUrl: "https://example.com/document2.pdf",
          },
        ],
        type: "base",
      },
    },
  ],
];

export const Default: Story = {
  args: {
    title: "Application Summary",
    title_ar: "ملخص الطلب",
    language: "en",
    data: defaultData,
  },
};

export const Arabic: Story = {
  args: {
    title: "Application Summary",
    title_ar: "ملخص الطلب",
    language: "ar",
    data: defaultData,
  },
  render: (args) => (
    <div dir="rtl">
      <ApplicationSummary {...args} />
    </div>
  ),
};

export const SingleColumn: Story = {
  args: {
    title: "Application Summary",
    title_ar: "ملخص الطلب",
    language: "en",
    data: [defaultData[0]],
  },
};
