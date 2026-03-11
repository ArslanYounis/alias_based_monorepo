import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PaymentDetails from "./PaymentDetails";
import type { ApplicationPayment } from "./PaymentDetails";

const meta: Meta<typeof PaymentDetails> = {
  title: "Components/PaymentDetails",
  component: PaymentDetails,
  parameters: {
    docs: {
      description: {
        component:
          "PaymentDetails component with bilingual support (English/Arabic). Supports language switching for all labels, titles, and RTL layout.",
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
    variant: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
      description: "Size variant for the component",
    },
    applicationId: {
      control: "text",
      description: "Application identifier",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaymentDetails>;

const defaultPayments: ApplicationPayment[] = [
  {
    applicationPaymentId: 1,
    paymentDescriptionE: "Initial Payment",
    paymentDescriptionA: "الدفعة الأولى",
    status: "success",
    amountDue: "150.00 AED",
    amountInWords: "One Hundred and Fifty",
    vatAmount: "0.00",
    receiptNumber: "REC-001",
    receiptDate: "2024-01-15",
  },
  {
    applicationPaymentId: 2,
    paymentDescriptionE: "Second Payment",
    paymentDescriptionA: "الدفعة الثانية",
    status: "pending",
    amountDue: "2,000.00 AED",
    amountInWords: "Two Thousand",
    vatAmount: "100.00 AED",
    receiptNumber: "REC-002",
    receiptDate: "2024-02-01",
  },
  {
    applicationPaymentId: 3,
    paymentDescriptionE: "Final Payment",
    paymentDescriptionA: "الدفعة النهائية",
    status: "success",
    amountDue: "2,500.00 AED",
    amountInWords: "Two Thousand Five Hundred",
    vatAmount: "125.00 AED",
    receiptNumber: "REC-003",
    receiptDate: "2024-03-01",
  },
];

export const Default: Story = {
  args: {
    language: "en",
    applicationId: "APP-001",
    variant: "medium",
    payments: defaultPayments,
    isLoading: false,
    showButtons: true,
    paymentOverrideTitle: "Payment Override",
    paymentOverrideTitle_ar: "تجاوز الدفع",
    paymentOverrideDescription:
      "Search for the customer who wants to have the ranch land allocated to them.",
    paymentOverrideDescription_ar:
      "ابحث عن العميل الذي يرغب في تخصيص أرض المزرعة له.",
  },
  render: (args) => (
    <div
      style={{
        background: "#12121B",
        minHeight: "100vh",
        padding: 32,
      }}
    >
      <PaymentDetails {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    ...Default.args,
    language: "ar",
  },
  render: Default.render,
};

export const Light: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <div
      style={{
        background: "white",
        minHeight: "100vh",
        padding: 32,
      }}
    >
      <PaymentDetails {...args} />
    </div>
  ),
};

export const ArabicLight: Story = {
  args: {
    ...Default.args,
    language: "ar",
  },
  render: Light.render,
};
