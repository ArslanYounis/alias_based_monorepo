/* istanbul ignore file */
import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The Table component displays tabular data in a customizable format.
It supports dynamic columns and flexible cell content like cards, images, and states.
Supports bilingual content (English/Arabic) with RTL layout support.

Each row accepts additional information through the \`additionalColumns\` property,
allowing for a rich, card-like presentation inside the table.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const tableHeader = [
  { header: "Details", accessorKey: "details" },
  { header: "Owner", accessorKey: "owner" },
  { header: "Plot", accessorKey: "plot" },
  { header: "Approval", accessorKey: "approval" },
  { header: "Payment", accessorKey: "payment" },
  { header: "Print", accessorKey: "print" },
];

const data = [
  {
    applicationTitle: "New / Racing",
    applicationTitle_ar: "\u062c\u062f\u064a\u062f / \u0633\u0628\u0627\u0642",
    location: "Abu Dhabi City",
    location_ar: "\u0645\u062f\u064a\u0646\u0629 \u0623\u0628\u0648\u0638\u0628\u064a",
    timeDate: "13:51 - 21/06/2025",
    daysRemaining: "X Days Remaining",
    id: "202500268615",
    currentStep: 3,
    additionalColumns: [
      {
        stepKey: "registration 1",
        action: "Ahmed Mohammed 111",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        type: "success",
        version: "single-row",
      },
      {
        stepKey: "assignment",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        imageURL:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSsMJwWbiNM-sWtPsfvq1mdV0rxJ-t7t-JQ&s",
        currentStep: 4,
        type: "action",
        version: "image-row",
      },
      {
        stepKey: "approval",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "action-other",
        version: "multi-row",
      },
      {
        stepKey: "confirmcollectingpayments",
        action: "Pending",
        stepName: "Payment Pending",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "failed",
        version: "hybrid",
        totalSteps: 6,
        // currentStepStatus: "failed",
      },
      {
        stepKey: "print",
        action: "Pending",
        stepName: "Print Pending",
        currentStep: 4,
        type: "pending",
        version: "single-row",
        direction: "vertical",
      },
    ],
  },
  {
    applicationTitle: "Plot Transfer",
    applicationTitle_ar: "\u0646\u0642\u0644 \u0642\u0637\u0639\u0629 \u0627\u0644\u0623\u0631\u0636",
    location: "Dubai",
    location_ar: "\u062f\u0628\u064a",
    timeDate: "10:15 - 15/07/2025",
    daysRemaining: "5 Days Remaining",
    id: "202500268999",
    currentStep: 2,
    additionalColumns: [
      {
        stepKey: "registration 1",
        action: "Ahmed Mohammed 111",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        type: "success",
        version: "single-row",
      },
      {
        stepKey: "assignment",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        imageURL:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSsMJwWbiNM-sWtPsfvq1mdV0rxJ-t7t-JQ&s",
        currentStep: 4,
        type: "action",
        version: "image-row",
      },
      {
        stepKey: "approval",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "action-other",
        version: "multi-row",
      },
      {
        stepKey: "confirmcollectingpayments",
        action: "Pending",
        stepName: "Payment Pending",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "failed",
        version: "hybrid",
        totalSteps: 6,
        // currentStepStatus: "failed",
      },
      {
        stepKey: "print",
        action: "Pending",
        stepName: "Print Pending",
        currentStep: 4,
        type: "pending",
        version: "single-row",
        direction: "vertical",
      },
    ],
  },
  {
    applicationTitle: "Owner Change",
    applicationTitle_ar: "\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0645\u0627\u0644\u0643",
    location: "Sharjah",
    location_ar: "\u0627\u0644\u0634\u0627\u0631\u0642\u0629",
    timeDate: "09:00 - 01/08/2025",
    daysRemaining: "12 Days Remaining",
    id: "202500269111",
    currentStep: 1,
    additionalColumns: [
      {
        stepKey: "registration 1",
        action: "Ahmed Mohammed 111",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        type: "success",
        version: "single-row",
      },
      {
        stepKey: "assignment",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        imageURL:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSsMJwWbiNM-sWtPsfvq1mdV0rxJ-t7t-JQ&s",
        currentStep: 4,
        type: "action",
        version: "image-row",
      },
      {
        stepKey: "approval",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "action-other",
        version: "multi-row",
      },
      {
        stepKey: "confirmcollectingpayments",
        action: "Pending",
        stepName: "Payment Pending",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "failed",
        version: "hybrid",
        totalSteps: 6,
        // currentStepStatus: "failed",
      },
      {
        stepKey: "print",
        action: "Pending",
        stepName: "Print Pending",
        currentStep: 4,
        type: "pending",
        version: "single-row",
        direction: "vertical",
      },
    ],
  },
  {
    applicationTitle: "Payment Review",
    applicationTitle_ar: "\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u062f\u0641\u0639",
    location: "Al Ain",
    location_ar: "\u0627\u0644\u0639\u064a\u0646",
    timeDate: "17:30 - 20/09/2025",
    daysRemaining: "2 Days Remaining",
    id: "202500269222",
    currentStep: 4,
    additionalColumns: [
      {
        stepKey: "registration 1",
        action: "Ahmed Mohammed 111",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        type: "success",
        version: "single-row",
      },
      {
        stepKey: "assignment",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        imageURL:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSsMJwWbiNM-sWtPsfvq1mdV0rxJ-t7t-JQ&s",
        currentStep: 4,
        type: "action",
        version: "image-row",
      },
      {
        stepKey: "approval",
        action: "Ahmed Mohammed",
        stepName: "Al Ketbi",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "action-other",
        version: "multi-row",
      },
      {
        stepKey: "confirmcollectingpayments",
        action: "Pending",
        stepName: "Payment Pending",
        userName: "Username",
        role: "Role",
        currentStep: 4,
        type: "failed",
        version: "hybrid",
        totalSteps: 6,
        // currentStepStatus: "failed",
      },
      {
        stepKey: "print",
        action: "Pending",
        stepName: "Print Pending",
        currentStep: 4,
        type: "pending",
        version: "single-row",
        direction: "vertical",
      },
    ],
  },
];

export const Default: Story = {
  render: () => <Table columns={tableHeader} data={data} />,
};
