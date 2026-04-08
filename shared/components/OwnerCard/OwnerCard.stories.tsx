/* istanbul ignore file */
import type { Meta, StoryObj } from "@storybook/react";
import OwnerCard from "./OwnerCard";
import type { Owner } from "./OwnerCard";

const meta: Meta<typeof OwnerCard> = {
  title: "Components/OwnerCard",
  component: OwnerCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **OwnerCard** component displays a list of owner cards with expandable details. Each card shows owner information with fields, supports bilingual content (English/Arabic), and includes action buttons for viewing, editing, viewing plots, or deleting owners.

### Features:
- **Bilingual Support**: All text elements support both English and Arabic
- **RTL Layout**: Automatic RTL layout when Arabic is selected
- **Expandable Cards**: Each owner card can be expanded/collapsed to show/hide details
- **Action Buttons**: Configurable View, Plot, Edit, and Delete buttons
- **Multiple Owners**: Supports displaying multiple owner cards in a list
- **Grid Layout**: Supports single or two-column layout (itemsPerRow)

### Props:
\`\`\`
interface ApprovalModalProps {
  owners: Owner[];
  title: string;
  title_ar?: string;
  showViewButton?: boolean;
  showPlotsButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onPressAction?: ({ action, owner }: { action: "view" | "plot" | "edit" | "delete"; owner: Owner }) => void;
  language?: "en" | "ar";
  itemsPerRow?: "1" | "2";
  defaultShowMore?: boolean;
  isExpandable?: boolean;
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
      description: "Main title for the owner cards section",
      table: { category: "Content" },
    },
    title_ar: {
      control: "text",
      description: "Arabic version of the main title",
      table: { category: "Content" },
    },
    showViewButton: {
      control: "boolean",
      description: "Show/hide the View button on each owner card",
      table: { category: "Buttons" },
    },
    showPlotsButton: {
      control: "boolean",
      description: "Show/hide the Plot button on each owner card",
      table: { category: "Buttons" },
    },
    showEditButton: {
      control: "boolean",
      description: "Show/hide the Edit button on each owner card",
      table: { category: "Buttons" },
    },
    showDeleteButton: {
      control: "boolean",
      description: "Show/hide the Delete button on each owner card",
      table: { category: "Buttons" },
    },
    itemsPerRow: {
      control: { type: "radio" },
      options: ["1", "2"],
      description: "Number of cards per row (1 or 2)",
      table: { category: "Layout" },
    },
    isExpandable: {
      control: "boolean",
      description: "Whether cards can be expanded/collapsed",
      table: { category: "Behavior" },
    },
    defaultShowMore: {
      control: "boolean",
      description: "Default state for showing more fields in each card",
      table: { category: "Behavior" },
    },
    owners: {
      control: { type: "object" },
      description: "Array of owner objects to display",
      table: { category: "Data" },
    },
    onPressAction: {
      action: "action-pressed",
      description: "Called when any action button is clicked",
      table: { category: "Events" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof OwnerCard>;

const sampleOwners: Owner[] = [
  {
    ownerId: "owner-1",
    ownerArgs: "args-1",
    name: "Talal Ahmed Salem",
    name_ar: "\u0637\u0644\u0627\u0644 \u0623\u062d\u0645\u062f \u0633\u0627\u0644\u0645",
    fields: [
      {
        label: "UAE National ID",
        label_ar: "\u0627\u0644\u0647\u0648\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a\u064a\u0629",
        value: "78273890399292",
        value_ar: "78273890399292",
      },
      {
        label: "MOI Unified Number",
        label_ar: "\u0631\u0642\u0645 \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629 \u0627\u0644\u0645\u0648\u062d\u062f",
        value: "330928",
        value_ar: "330928",
      },
      {
        label: "Archive Number",
        label_ar: "\u0631\u0642\u0645 \u0627\u0644\u0623\u0631\u0634\u064a\u0641",
        value: "7921",
        value_ar: "7921",
      },
      {
        label: "Nationality",
        label_ar: "\u0627\u0644\u062c\u0646\u0633\u064a\u0629",
        value: "United Arab Emirates",
        value_ar: "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0645\u062a\u062d\u062f\u0629",
      },
      {
        label: "Special Nationality",
        label_ar: "\u0627\u0644\u062c\u0646\u0633\u064a\u0629 \u0627\u0644\u062e\u0627\u0635\u0629",
        value: "No",
        value_ar: "\u0644\u0627",
      },
      {
        label: "Share",
        label_ar: "\u0627\u0644\u062d\u0635\u0629",
        value: "100% Allotment 50% Share",
        value_ar: "100% \u062a\u062e\u0635\u064a\u0635 50% \u062d\u0635\u0629",
      },
      {
        label: "Right Hold Type",
        label_ar: "\u0646\u0648\u0639 \u062d\u0642 \u0627\u0644\u062d\u064a\u0627\u0632\u0629",
        value: "Ownership Musataha",
        value_ar: "\u0645\u0644\u0643\u064a\u0629 \u0645\u0633\u062a\u0637\u0627\u0639\u0629",
      },
    ],
  },
  {
    ownerId: "owner-2",
    ownerArgs: "args-2",
    name: "Ahmed Abdulla Ahmed Mohamed",
    name_ar: "\u0623\u062d\u0645\u062f \u0639\u0628\u062f \u0627\u0644\u0644\u0647 \u0623\u062d\u0645\u062f \u0645\u062d\u0645\u062f",
    fields: [
      {
        label: "UAE National ID",
        label_ar: "\u0627\u0644\u0647\u0648\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a\u064a\u0629",
        value: "78451234567890",
        value_ar: "78451234567890",
      },
      {
        label: "MOI Unified Number",
        label_ar: "\u0631\u0642\u0645 \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629 \u0627\u0644\u0645\u0648\u062d\u062f",
        value: "445566",
        value_ar: "445566",
      },
      {
        label: "Archive Number",
        label_ar: "\u0631\u0642\u0645 \u0627\u0644\u0623\u0631\u0634\u064a\u0641",
        value: "8932",
        value_ar: "8932",
      },
      {
        label: "Nationality",
        label_ar: "\u0627\u0644\u062c\u0646\u0633\u064a\u0629",
        value: "United Arab Emirates",
        value_ar: "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0645\u062a\u062d\u062f\u0629",
      },
      {
        label: "Share",
        label_ar: "\u0627\u0644\u062d\u0635\u0629",
        value: "75% Allotment 75% Share",
        value_ar: "75% \u062a\u062e\u0635\u064a\u0635 75% \u062d\u0635\u0629",
      },
    ],
  },
  {
    ownerId: "owner-3",
    ownerArgs: "args-3",
    name: "Fatima Ali Hassan",
    name_ar: "\u0641\u0627\u0637\u0645\u0629 \u0639\u0644\u064a \u062d\u0633\u0646",
    fields: [
      {
        label: "UAE National ID",
        label_ar: "\u0627\u0644\u0647\u0648\u064a\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a\u064a\u0629",
        value: "78901234567890",
        value_ar: "78901234567890",
      },
      {
        label: "MOI Unified Number",
        label_ar: "\u0631\u0642\u0645 \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629 \u0627\u0644\u0645\u0648\u062d\u062f",
        value: "556677",
        value_ar: "556677",
      },
      {
        label: "Nationality",
        label_ar: "\u0627\u0644\u062c\u0646\u0633\u064a\u0629",
        value: "United Arab Emirates",
        value_ar: "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0645\u062a\u062d\u062f\u0629",
      },
      {
        label: "Share",
        label_ar: "\u0627\u0644\u062d\u0635\u0629",
        value: "50% Allotment 50% Share",
        value_ar: "50% \u062a\u062e\u0635\u064a\u0635 50% \u062d\u0635\u0629",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "en",
    itemsPerRow: "1",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const WithDeleteButton: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: true,
    language: "en",
    itemsPerRow: "1",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const TwoColumns: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "en",
    itemsPerRow: "2",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "ar",
    itemsPerRow: "1",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const ArabicTwoColumns: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "ar",
    itemsPerRow: "2",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const SingleOwner: Story = {
  args: {
    owners: [sampleOwners[0]],
    title: "Owner Details",
    title_ar: "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0627\u0644\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "en",
    itemsPerRow: "1",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const WithDefaultShowMore: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "en",
    itemsPerRow: "1",
    isExpandable: true,
    defaultShowMore: true,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const NotExpandable: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: true,
    showEditButton: true,
    showDeleteButton: false,
    language: "en",
    itemsPerRow: "1",
    isExpandable: false,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};

export const MinimalButtons: Story = {
  args: {
    owners: sampleOwners,
    title: "Owners",
    title_ar: "\u0627\u0644\u0645\u0644\u0627\u0643",
    showViewButton: true,
    showPlotsButton: false,
    showEditButton: false,
    showDeleteButton: false,
    language: "en",
    itemsPerRow: "1",
    isExpandable: true,
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <OwnerCard {...args} />
    </div>
  ),
};
