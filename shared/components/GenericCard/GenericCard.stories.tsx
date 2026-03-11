import type { Meta, StoryObj } from "@storybook/react";
import GenericCard from "./GenericCard";
import type { ICardRowProps } from "../CardRow";
import type { IDocument } from "./GenericCard";

const meta: Meta<typeof GenericCard> = {
  title: "Components/GenericCard",
  component: GenericCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **GenericCard** component is a flexible, reusable card component that can display expandable content with rows of data. It supports bilingual content (English/Arabic), multiple variants, and various action buttons.

### Features:
- **Bilingual Support**: All text elements support both English and Arabic
- **RTL Layout**: Automatic RTL layout when Arabic is selected
- **Expandable Cards**: Cards can be expanded/collapsed to show/hide details
- **Action Buttons**: Configurable buttons for various actions
- **Multiple Variants**: Large, medium, and small size variants
- **Show More Functionality**: Can show/hide additional rows with a "Show More" button
- **Status and Subtext**: Supports status indicators and subtext
- **Document Display**: Can show uploaded documents with download functionality
- **Dynamic Row Types**: Each row can have its own \`fieldType\` and \`rowVariant\`, allowing for mixed display types (default, text fields, select dropdowns, etc.) within the same card

### Props:
\`\`\`
interface IGenericCardProps extends ICardTitleProps {
  showTitleSection?: boolean;
  showMoreButton?: boolean;
  rowsData: ICardRowProps[];
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  defaultShowMore?: boolean;
  showDocuments?: boolean;
  documents?: IDocument[];
  documentTitle?: string;
  documentTitle_ar?: string;
  documentButtons?: Array<{ title: string; title_ar?: string; type?: string; onClick?: () => void }>;
}

// Each row in rowsData can have its own fieldType and rowVariant:
interface ICardRowProps {
  label?: string;
  label_ar?: string;
  value?: string;
  value_ar?: string;
  fieldType?: FieldType; // Overrides card-level fieldType for this row
  rowVariant?: RowVariant; // Overrides card-level rowVariant for this row
  inputProps?: {
    onChange?: (v: string) => void;
    options?: Array<{ label: string; value: string; label_ar?: string }>;
    disabled?: boolean;
    placeholder?: string;
    placeholder_ar?: string;
    value?: string;
  };
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
    showMoreButton: {
      control: "boolean",
      description:
        "Show/hide the 'Show More' button when there are more than 3 rows",
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
      description: "Show/hide action buttons",
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
      description:
        "Array of row data to display in the card. Each row can have its own fieldType and rowVariant to override the card-level defaults.",
      table: { category: "Data" },
    },
    buttons: {
      control: { type: "object" },
      description: "Array of button configurations",
      table: { category: "Buttons" },
    },
    titleButtons: {
      control: { type: "object" },
      description: "Array of title button configurations",
      table: { category: "Buttons" },
    },
    // Document props
    documents: {
      control: { type: "object" },
      description: "Array of uploaded documents to display",
      table: { category: "Documents" },
    },
    documentTitle: {
      control: "text",
      description: "Title for the documents section",
      table: { category: "Documents" },
    },
    documentTitle_ar: {
      control: "text",
      description: "Arabic title for the documents section",
      table: { category: "Documents" },
    },
    documentButtons: {
      control: { type: "object" },
      description:
        "Buttons for the document section header (e.g. Upload New Document)",
      table: { category: "Documents" },
    },
    showFooterButtons: {
      control: { type: "object" },
      description: "Array of title button configurations",
      table: { category: "Buttons" },
    },
    footerButton: {
      control: { type: "object" },
      description: "Array of footer button configurations",
      table: { category: "Buttons" },
    },
    onToggleExpand: {
      action: "toggle-expand",
      description: "Called when expand/collapse is toggled",
      table: { category: "Events" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GenericCard>;

const sampleRowsData: ICardRowProps[] = [
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
  {
    label: "Right Hold Type",
    label_ar: "نوع حق الحيازة",
    value: "Ownership Musataha",
    value_ar: "ملكية مستطاعة",
  },
];

// Mock documents data for stories
const mockDocuments: IDocument[] = [
  {
    id: "1",
    documentName: "Title Deed",
    documentName_ar: "سند الملكية",
    fileType: "PDF",
    size: "2.5 MB",
    isUploaded: true,
    onDownloadClick: () => console.log("Download Title Deed"),
  },
  {
    id: "2",
    documentName: "Property Tax Receipt",
    documentName_ar: "إيصال ضريبة العقار",
    fileType: "PDF",
    size: "1.8 MB",
    isUploaded: true,
    onDownloadClick: () => console.log("Download Tax Receipt"),
  },
  {
    id: "3",
    documentName: "Building Plan",
    documentName_ar: "مخطط البناء",
    fileType: "DWG",
    size: "4.2 MB",
    isUploaded: true,
    onDownloadClick: () => console.log("Download Building Plan"),
  },
];

export const Default: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const Collapsed: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: false,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithButtons: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: true,
    buttons: [
      {
        title: "View",
        title_ar: "عرض",
        type: "secondary",
        onClick: () => {},
      },
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => {},
      },
    ],
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithTitleButtons: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    variant: "small",
    showTitleSection: true,
    isExpandable: false,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showTitleButtons: true,
    titleButtons: [
      {
        title: "View",
        title_ar: "عرض",
        type: "secondary",
        onClick: () => {},
      },
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => {},
      },
    ],
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithStatus: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: true,
    showButtons: false,
    status: "Active",
    status_ar: "نشط",
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithSubText: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: true,
    showButtons: false,
    subText: "Last updated: 2024-01-15",
    subText_ar: "آخر تحديث: 2024-01-15",
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const LargeVariant: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "large",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const MediumVariant: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "medium",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    title: "تفاصيل المالك",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "طلال أحمد سالم",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "الاسم",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "ar",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithDefaultShowMore: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: true,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithoutTitleSection: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: false,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const NotExpandable: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: false,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithDeleteButton: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: true,
    buttons: [
      {
        title: "View",
        title_ar: "عرض",
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
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const FewRows: Story = {
  args: {
    title: "Owner Details",
    title_ar: "تفاصيل المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 2),
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

// ======================= NEW DOCUMENT STORIES =======================

export const WithSingleDocument: Story = {
  args: {
    title: "Property Documents",
    title_ar: "مستندات العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    documents: [mockDocuments[0]],
    documentTitle: "Documents",
    documentTitle_ar: "المستندات",
    documentButtons: [
      {
        title: "Upload New Document",
        title_ar: "رفع مستند جديد",
        type: "primary",
        onClick: () => alert("Upload New Document clicked"),
      },
    ],
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithMultipleDocuments: Story = {
  args: {
    title: "Property Documents",
    title_ar: "مستندات العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    documents: mockDocuments,
    documentTitle: "Uploaded Documents",
    documentTitle_ar: "المستندات المرفوعة",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const ArabicWithDocuments: Story = {
  args: {
    title: "مستندات العقار",
    title_ar: "مستندات العقار",
    cardTitleValue: "العقار #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "معرف العقار",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "ar",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    documents: mockDocuments,
    documentTitle: "المستندات",
    documentTitle_ar: "المستندات",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const DocumentsWithButtons: Story = {
  args: {
    title: "Property Documents",
    title_ar: "مستندات العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "en",
    showBorder: false,
    showButtons: true,
    buttons: [
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => {},
      },
      {
        title: "Upload",
        title_ar: "رفع",
        type: "primary",
        onClick: () => {},
      },
    ],
    defaultShowMore: false,
    documents: mockDocuments,
    documentTitle: "Property Documents",
    documentTitle_ar: "مستندات العقار",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const DocumentsWithCustomTitle: Story = {
  args: {
    title: "Property Details",
    title_ar: "تفاصيل العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    documents: mockDocuments,
    documentTitle: "Supporting Files",
    documentTitle_ar: "الملفات الداعمة",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const DocumentsInLargeVariant: Story = {
  args: {
    title: "Property Documents",
    title_ar: "مستندات العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "large",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData,
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    documents: mockDocuments,
    documentTitle: "Documents",
    documentTitle_ar: "المستندات",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const NoDocuments: Story = {
  args: {
    title: "Property Details",
    title_ar: "تفاصيل العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    documents: [],
    documentTitle: "Documents",
    documentTitle_ar: "المستندات",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const DocumentsWithStatus: Story = {
  args: {
    title: "Property Documents",
    title_ar: "مستندات العقار",
    cardTitleValue: "Property #12345",
    cardTitleValue_ar: "العقار #12345",
    cardTitleLabel: "Property ID",
    cardTitleLabel_ar: "معرف العقار",
    variant: "small",
    showTitleSection: true,
    isExpandable: true,
    isExpanded: true,
    showMoreButton: true,
    rowsData: sampleRowsData.slice(0, 3),
    language: "en",
    showBorder: true,
    showButtons: false,
    status: "Verified",
    status_ar: "تم التحقق",
    defaultShowMore: false,
    documents: mockDocuments,
    documentTitle: "Verified Documents",
    documentTitle_ar: "المستندات المؤكدة",
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};

export const WithDynamicRowTypes: Story = {
  args: {
    title: "Owner Information",
    title_ar: "معلومات المالك",
    cardTitleValue: "Talal Ahmed Salem",
    cardTitleValue_ar: "طلال أحمد سالم",
    cardTitleLabel: "Name",
    cardTitleLabel_ar: "الاسم",
    variant: "medium",
    showTitleSection: true,
    isExpandable: false,
    isExpanded: true,
    showMoreButton: true,
    showTitleButtons: true,
    titleButtons: [
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => console.log("Edit clicked"),
      },
      {
        title: "Delete",
        title_ar: "حذف",
        type: "secondary",
        onClick: () => console.log("Delete clicked"),
      },
    ],
    rowsData: [
      {
        label: "UAE National ID",
        label_ar: "الهوية الوطنية الإماراتية",
        value: "78273890399292",
        value_ar: "78273890399292",
        // First row: default display (no fieldType/rowVariant specified)
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "330928",
        value_ar: "330928",
        // Second row: text field
        fieldType: "text",
        rowVariant: "field",
        inputProps: {
          onChange: (v: string) => console.log("MOI Number changed:", v),
          placeholder: "Enter MOI Number",
          placeholder_ar: "أدخل رقم وزارة الداخلية",
        },
      },
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "United Arab Emirates",
        value_ar: "الإمارات العربية المتحدة",
        // Third row: select dropdown
        fieldType: "select",
        rowVariant: "field",
        inputProps: {
          onChange: (v: string) => console.log("Nationality changed:", v),
          options: [
            {
              label: "United Arab Emirates",
              value: "UAE",
              label_ar: "الإمارات العربية المتحدة",
            },
            {
              label: "Saudi Arabia",
              value: "SA",
              label_ar: "المملكة العربية السعودية",
            },
            {
              label: "Kuwait",
              value: "KW",
              label_ar: "الكويت",
            },
            {
              label: "Qatar",
              value: "QA",
              label_ar: "قطر",
            },
          ],
        },
      },
      {
        label: "Archive Number",
        label_ar: "رقم الأرشيف",
        value: "7921",
        value_ar: "7921",
        // Fourth row: default display
      },
      {
        label: "Special Nationality",
        label_ar: "الجنسية الخاصة",
        value: "No",
        value_ar: "لا",
        // Fifth row: default display
      },
      {
        label: "Share",
        label_ar: "الحصة",
        value: "100% Allotment 50% Share",
        value_ar: "100% تخصيص 50% حصة",
        // Sixth row: default display
      },
      {
        label: "Right Hold Type",
        label_ar: "نوع حق الحيازة",
        value: "Ownership Musataha",
        value_ar: "ملكية مستطاعة",
        // Seventh row: default display
      },
    ],
    language: "en",
    showBorder: false,
    showButtons: false,
    defaultShowMore: false,
    hasDocuments: true,
    documentTitle: "Documents",
    documentTitle_ar: "المستندات",
    document_type: "base",
    documentButtons: [
      {
        title: "Upload New Document",
        title_ar: "رفع مستند جديد",
        type: "secondary",
        onClick: () => console.log("Upload New Document clicked"),
      },
    ],
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <GenericCard {...args} />
    </div>
  ),
};
