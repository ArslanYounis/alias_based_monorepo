/* istanbul ignore file */
import type { Meta, StoryObj } from "@storybook/react";
import GenericTableCard from "./GenericTableCard";
import type { ICardRowProps } from "../CardRow";
import type { ICardColProps } from "./GenericTableCard";

const meta: Meta<typeof GenericTableCard> = {
  title: "Components/GenericTableCard",
  component: GenericTableCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **GenericTableCard** component is a flexible, reusable card for displaying tabular row data with an action button column. It supports bilingual content (English/Arabic), multiple column-count variants, and pagination.

### Features:
- **Bilingual Support**: All text elements support both English and Arabic
- **RTL Layout**: Automatic RTL layout when Arabic is selected
- **Expandable Cards**: Cards can be expanded/collapsed to show/hide details
- **Dynamic Columns**: Header columns are driven by \`columnsData\`
- **Row Actions**: Each row can render an action button, configurable via props
- **Pagination**: Built-in pagination controls in the footer

### Props:
\`\`\`
interface IGenericTableCardProps extends ICardTitleProps {
  showTitleSection?: boolean;
  showMoreButton?: boolean;
  rowVariant?: "3colButton" | "4colButton" | "5colButton" | "6colButton";
  columnsData?: ICardColProps[];
  rowsData: ICardRowProps[];
  onRowButtonClick?: (row: ICardRowProps, index: number) => void;
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  defaultShowMore?: boolean;
  showFooterButtons?: boolean;
  footerButton?: ButtonType[];
  showPagination?: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language setting that affects layout direction (LTR/RTL)",
      table: { category: "Language" },
    },
    title: {
      control: "text",
      description: "Main title displayed when card is expanded",
      table: { category: "Content" },
    },
    title_ar: {
      control: "text",
      description: "Arabic version of the main title",
      table: { category: "Content" },
    },
    cardTitleValue: {
      control: "text",
      description:
        "Value displayed in the card title (when collapsed) or as subtitle (when expanded)",
      table: { category: "Content" },
    },
    cardTitleValue_ar: {
      control: "text",
      description: "Arabic version of the card title value",
      table: { category: "Content" },
    },
    cardTitleLabel: {
      control: "text",
      description: "Label displayed when card is collapsed",
      table: { category: "Content" },
    },
    cardTitleLabel_ar: {
      control: "text",
      description: "Arabic version of the card title label",
      table: { category: "Content" },
    },
    variant: {
      control: { type: "select" },
      options: ["large", "medium", "small"],
      description: "Size variant of the card",
      table: { category: "Appearance" },
    },
    showTitleSection: {
      control: "boolean",
      description: "Show/hide the title section",
      table: { category: "Layout" },
    },
    isExpandable: {
      control: "boolean",
      description: "Whether the card can be expanded/collapsed",
      table: { category: "Behavior" },
    },
    isExpanded: {
      control: "boolean",
      description: "Initial expanded state of the card",
      table: { category: "Behavior" },
    },

    defaultShowMore: {
      control: "boolean",
      description: "Default state for showing more rows",
      table: { category: "Behavior" },
    },
    showBorder: {
      control: "boolean",
      description: "Show/hide border in the title section",
      table: { category: "Appearance" },
    },
    showButtons: {
      control: "boolean",
      description: "Show/hide header action buttons",
      table: { category: "Buttons" },
    },
    showTitleButtons: {
      control: "boolean",
      description: "Show/hide title buttons",
      table: { category: "Buttons" },
    },
    subText: {
      control: "text",
      description: "Subtext displayed in the title section",
      table: { category: "Content" },
    },
    subText_ar: {
      control: "text",
      description: "Arabic version of the subtext",
      table: { category: "Content" },
    },
    status: {
      control: "text",
      description: "Status text displayed in the title section",
      table: { category: "Content" },
    },
    status_ar: {
      control: "text",
      description: "Arabic version of the status",
      table: { category: "Content" },
    },
    rowsData: {
      control: { type: "object" },
      description: "Array of row data to display in the table",
      table: { category: "Data" },
    },
    columnsData: {
      control: { type: "object" },
      description: "Array of column definitions for the header row",
      table: { category: "Data" },
    },
    rowVariant: {
      control: { type: "select" },
      options: ["3colButton", "4colButton", "5colButton", "6colButton"],
      description: "Grid configuration for value columns + button column",
      table: { category: "Layout" },
    },
    buttons: {
      control: { type: "object" },
      description: "Array of header button configurations",
      table: { category: "Buttons" },
    },
    titleButtons: {
      control: { type: "object" },
      description: "Array of title button configurations",
      table: { category: "Buttons" },
    },
    showFooterButtons: {
      control: { type: "object" },
      description: "Array of footer button configurations",
      table: { category: "Buttons" },
    },
    footerButton: {
      control: { type: "object" },
      description: "Array of footer button configurations",
      table: { category: "Buttons" },
    },
    showPagination: {
      control: "boolean",
      description: "Show/hide the pagination component in the footer",
      table: { category: "Pagination" },
    },
    currentPage: {
      control: "number",
      description: "Current page index for pagination",
      table: { category: "Pagination" },
    },
    totalPages: {
      control: "number",
      description: "Total number of pages",
      table: { category: "Pagination" },
    },
    pageSize: {
      control: "number",
      description: "Number of items per page",
      table: { category: "Pagination" },
    },
    onToggleExpand: {
      action: "toggle-expand",
      description: "Called when expand/collapse is toggled",
      table: { category: "Events" },
    },
    onPageChange: {
      action: "page-change",
      description: "Called when the pagination page changes",
      table: { category: "Events" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GenericTableCard>;

const sampleColumnsData: ICardColProps[] = [
  {
    key: "field",
    label: "Field",
    label_ar: "الحقل",
  },
  {
    key: "col1",
    label: "Value 1",
    label_ar: "القيمة 1",
  },
  {
    key: "col2",
    label: "Value 2",
    label_ar: "القيمة 2",
  },
  {
    key: "col3",
    label: "Value 3",
    label_ar: "القيمة 3",
  },
];

const sampleRowsData: ICardRowProps[] = [
  {
    label: "Identity Details",
    label_ar: "تفاصيل الهوية",
    extraItems: [
      {
        label: "UAE National ID",
        label_ar: "الهوية الوطنية الإماراتية",
        value: "78273890399292",
        value_ar: "78273890399292",
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "330928",
        value_ar: "330928",
      },
      {
        label: "Archive Number",
        label_ar: "رقم الأرشيف",
        value: "7921",
        value_ar: "7921",
      },
    ],
  },
  {
    label: "Nationality Details",
    label_ar: "تفاصيل الجنسية",
    extraItems: [
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "United Arab Emirates",
        value_ar: "الإمارات العربية المتحدة",
      },
      {
        label: "Special Nationality",
        label_ar: "الجنسية الخاصة",
        value: "No",
        value_ar: "لا",
      },
      {
        label: "Share",
        label_ar: "الحصة",
        value: "100% Allotment 50% Share",
        value_ar: "100% تخصيص 50% حصة",
      },
    ],
  },
  {
    label: "Right Hold Type",
    label_ar: "نوع حق الحيازة",
    extraItems: [
      {
        value: "Ownership Musataha",
        value_ar: "ملكية مستطاعة",
      },
      {
        value: "Leasehold",
        value_ar: "حق الإيجار",
      },
      {
        value: "Freehold",
        value_ar: "ملكية مطلقة",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    title: "Owner Information",
    title_ar: "معلومات المالك",
    description: "Description",
    description_ar: "معلومات المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "medium",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    rowsData: sampleRowsData,
    rowVariant: "4colButton",
    columnsData: sampleColumnsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    showPagination: true,
    currentPage: 1,
    totalPages: 5,
    pageSize: 5,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericTableCard {...args} />
    </div>
  ),
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    isExpanded: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericTableCard {...args} />
    </div>
  ),
};

export const WithHeaderButtons: Story = {
  args: {
    ...Default.args,
    showButtons: true,
    buttons: [
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => {},
      },
      {
        title: "Delete",
        title_ar: "حذف",
        type: "delete",
        onClick: () => {},
      },
    ],
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericTableCard {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    ...Default.args,
    language: "ar",
    title: "معلومات المالك",
    title_ar: "معلومات المالك",
    cardTitleValue: "طلال أحمد سالم",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "الاسم",
    cardTitleLabel_ar: "الاسم",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericTableCard {...args} />
    </div>
  ),
};

export const WithFooterButtons: Story = {
  args: {
    ...Default.args,
    showFooterButtons: true,
    footerButton: [
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
      },
      {
        title: "Delete",
        title_ar: "حذف",
        type: "delete",
      },
    ],
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericTableCard {...args} />
    </div>
  ),
};

export const WithoutPagination: Story = {
  args: {
    ...Default.args,
    showPagination: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericTableCard {...args} />
    </div>
  ),
};
