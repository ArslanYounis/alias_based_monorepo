import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ApplicationSummaryProps } from "./ApplicationSummary.types";
import type { ComponentType } from "react";

const controls: ComponentConfig<ApplicationSummaryProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Application Summary",
    defaultValueAr: "ملخص الطلب",
    defaultCode: 'return "Application Summary"',
    defaultCodeAr: 'return "ملخص الطلب"',
  },
  data: {
    type: ["code"],
    label: "Data",
    defaultCode: `return [
  [
    {
      type: "agent",
      data: {
        agent: {
          name: "English Name",
          name_ar: "الاسم العربي",
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
        onPressView: () => console.log("View clicked"),
        onPressPlotChange: () => console.log("Plot change clicked"),
        onPressOwners: () => console.log("Owners clicked"),
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
        showViewButton: true,
        showPlotsButton: true,
        showEditButton: false,
        onPressAction: ({ action, owner }) => console.log(action, owner),
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
        ],
      },
    },
  ],
];`,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createApplicationSummaryConfig(
  Component: ComponentType<ApplicationSummaryProps>,
  icon: IconType
): ComponentConfig<ApplicationSummaryProps> {
  return {
    id: "applicationSummary",
    icon,
    name: "Application Summary",
    Component,
    controls,
  };
}
