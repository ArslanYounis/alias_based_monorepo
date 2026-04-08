/* istanbul ignore file */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ApplicationMessage from "./ApplicationMessage";

const meta: Meta<typeof ApplicationMessage> = {
  title: "ExtraComponents/ApplicationMessage",
  component: ApplicationMessage,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The ApplicationMessage component is used to display contextual system messages
such as success, error, informational, or action-required messages.

It supports:
- Multiple status variants (success, error, information, action)
- Optional interactive inputs (text, checkbox, radio, select, button)
- Bilingual support (English / Arabic)
- RTL layout handling for Arabic content

Status icons are imported internally from @platform/icons (no need to pass as props).

This component is commonly used to guide users during application workflows
and request additional input or actions when needed.
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: { type: "radio" },
      options: ["success", "error", "information", "action"],
      description: "Visual status of the application message",
      defaultValue: "success",
    },
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ApplicationMessage>;

/* ---------------------------------- Stories ---------------------------------- */

export const Default: Story = {
  render: (args) => (
    <ApplicationMessage
      {...args}
      title="Application Submitted Successfully"
      description="Your application has been submitted and is under review."
    />
  ),
};

export const ErrorMessage: Story = {
  render: () => (
    <ApplicationMessage
      status="error"
      title="Submission Failed"
      description="There was an error while submitting your application. Please try again."
    />
  ),
};

export const InformationWithTextInput: Story = {
  render: () => (
    <ApplicationMessage
      status="information"
      title="Additional Information Required"
      description="Please provide the missing details to continue."
      type="text"
      fieldType="text"
      label="Reference Number"
      label_ar="رقم المرجع"
      value=""
      onInputChange={(value) => console.log(value)}
    />
  ),
};

export const ActionWithCheckbox: Story = {
  render: () => (
    <ApplicationMessage
      status="action"
      title="Confirm Declaration"
      description="Please confirm the following before proceeding."
      type="checkbox"
      label="I agree to the terms"
      label_ar="أوافق على الشروط"
      value={[]}
      options={[
        {
          label: "Terms & Conditions",
          label_ar: "الشروط والأحكام",
          value: "terms",
        },
        {
          label: "Privacy Policy",
          label_ar: "سياسة الخصوصية",
          value: "privacy",
        },
      ]}
      onInputChange={(value) => console.log(value)}
    />
  ),
};

export const ActionWithRadio: Story = {
  render: () => (
    <ApplicationMessage
      status="action"
      title="Choose an Option"
      description="Please select one of the following options to proceed."
      type="radio"
      label="Decision"
      label_ar="القرار"
      value="approve"
      options={[
        { label: "Approve", label_ar: "موافقة", value: "approve" },
        { label: "Reject", label_ar: "رفض", value: "reject" },
      ]}
      onInputChange={(value) => console.log(value)}
    />
  ),
};

export const ActionWithButton: Story = {
  render: () => (
    <ApplicationMessage
      status="action"
      title="Next Step Required"
      description="Click the button below to continue to the next step."
      type="button"
      label="Continue"
      label_ar="متابعة"
      onClick={() => console.log("Button clicked")}
    />
  ),
};

export const ArabicRTL: Story = {
  render: () => (
    <ApplicationMessage
      language="ar"
      status="success"
      title="تم إرسال الطلب بنجاح"
      description="تم إرسال طلبك وهو الآن قيد المراجعة."
      type="button"
      label="حسناً"
    />
  ),
};
