import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Payment from "./Payment";
import { PaymentIcon, NoPaymentIcon } from "@platform/icons";

const meta: Meta<typeof Payment> = {
  title: "Components/Payment",
  component: Payment,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Payment component with bilingual support (English/Arabic). Supports language switching for all form labels, titles, and RTL layout.",
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
    applicationId: {
      control: "text",
      description: "Application identifier used for external APIs",
    },
    stepTitles: {
      control: "object",
      description: "Array of step titles in English",
    },
    stepTitles_ar: {
      control: "object",
      description: "Array of step titles in Arabic",
    },
    isStepInfoPending: {
      control: "boolean",
      description: "Simulate loading state for step info",
    },
    isPaymentSubmitting: {
      control: "boolean",
      description: "Simulate submitting state for payment",
    },
    paymentIcon: {
      control: false,
      description: "Icon for the payment option",
    },
    noPaymentIcon: {
      control: false,
      description: "Icon for the no payment option",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Payment>;

const defaultArgs = {
  applicationId: "APP-001",
  stepTitles: [
    "Select Payment Type",
    "Contract",
    "Measurement",
    "Insurance",
    "Rent",
  ],
  stepTitles_ar: ["اختر نوع الدفع", "العقد", "القياس", "التأمين", "الإيجار"],
  paymentIcon: <PaymentIcon />,
  noPaymentIcon: <NoPaymentIcon />,
  stepInfo: {
    result: {
      tenancyContract: {
        type: "New Tenancy",
        contractDate: "2024-01-01",
        contractNumber: "CONTRACT-123",
        ranchTenancyRegistrationFee: "500",
        ranchTenancyRegistrationFeeInWord: "Five Hundred",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        unitTypeValue: "M",
        requestLandClassificationId: 1,
        plotId: 1,
        tenancyContractId: 1,
        contractDuration: 12,
      },
      ranchInsuranceFee: "100",
      ranchInsuranceFeeInWord: "One Hundred",
    },
  },
  isStepInfoPending: false,
  isPaymentSubmitting: false,
  onSubmit: (data: unknown) => console.log("Storybook Payment onSubmit", data),
  onSaveDraft: () => console.log("Storybook Payment onSaveDraft"),
  onPaymentSubmit: (val: { payload: unknown; meta: unknown }) =>
    console.log("Storybook Payment onPaymentSubmit", val?.payload, val?.meta),
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    language: "en",
  },
  render: (args) => (
    <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
      <Payment {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    ...defaultArgs,
    language: "ar",
  },
  render: Default.render,
};

export const Light: Story = {
  args: {
    ...defaultArgs,
    language: "en",
  },
  render: (args) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <Payment {...args} />
    </div>
  ),
};

export const ArabicLight: Story = {
  args: {
    ...defaultArgs,
    language: "ar",
  },
  render: Light.render,
};
