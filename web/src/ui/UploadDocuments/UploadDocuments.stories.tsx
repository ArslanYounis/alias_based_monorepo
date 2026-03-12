import { Meta, StoryObj } from "@storybook/react";
import { UploadDocuments } from "./UploadDocuments";

const meta: Meta<typeof UploadDocuments> = {
  title: "Components/Upload/Documents",
  component: UploadDocuments,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **UploadDocuments** component renders multiple UploadDocument fields, each with its own configuration.

### documents (array of config objects):
- 	**documentName**: The name of the document to upload (displayed in the field).
- 	**documentName_ar**: The Arabic name of the document to upload.
- 	**allowedTypes**: Array of allowed file extensions (e.g., ["pdf", "png"]).
- 	**fileTypeErrorMessage**: Custom error message for file type validation.
- 	**fileTypeErrorMessage_ar**: Custom error message for file type validation in Arabic.
- 	**fileSize**: Maximum allowed file size in bytes.
- 	**fileSizeErrorMessage**: Custom error message for file size validation.
- 	**fileSizeErrorMessage_ar**: Custom error message for file size validation in Arabic.
- 	**isDark**: Boolean to enable dark mode styling for the accepted formats message and input.
- 	**language**: Language setting for the component text ("en" | "ar").

**Behavior:**
- Each document field manages its own upload, validation, and error state.
- Shows accepted formats and error messages as in UploadDocument.
- Supports both light and dark mode for each document field.
- Supports bilingual content with RTL layout for Arabic.
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language setting for all document fields",
      table: { category: "Language" },
    },
    documents: {
      control: { type: "object" },
      description: "Array of document configurations",
      table: { type: { summary: "DocumentConfig[]" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UploadDocuments>;

export const MultipleDocuments: Story = {
  args: {
    language: "en",
    documents: [
      {
        documentName: "Document 1",
        documentName_ar: "وثيقة 1",
        isDark: true,
      },
      {
        documentName: "Document 2",
        documentName_ar: "وثيقة 2",
        fileSize: 20000, // 20 KB
        fileSizeErrorMessage: "Document 2 must be less than 20 KB.",
        fileSizeErrorMessage_ar: "يجب أن تكون وثيقة 2 أقل من 20 كيلوبايت.",
      },
      {
        documentName: "Document 3",
        documentName_ar: "وثيقة 3",
        allowedTypes: ["docx", "txt"],
        fileTypeErrorMessage: "Document 3 must be a DOCX or TXT file.",
        fileTypeErrorMessage_ar: "يجب أن تكون وثيقة 3 من نوع DOCX أو TXT.",
        isDark: true,
      },
      {
        documentName: "Document 4",
        documentName_ar: "وثيقة 4",
        allowedTypes: ["PDF"],
        fileTypeErrorMessage: "Document 4 must be a PDF file.",
        fileTypeErrorMessage_ar: "يجب أن تكون وثيقة 4 من نوع PDF.",
      },
      {
        documentName: "Document 5",
        documentName_ar: "وثيقة 5",
        allowedTypes: ["PDF", "PNG"],
        fileTypeErrorMessage: "Document 5 must be a PDF or PNG file.",
        fileTypeErrorMessage_ar: "يجب أن تكون وثيقة 5 من نوع PDF أو PNG.",
        isDark: true,
      },
      {
        documentName: "Document 6",
        documentName_ar: "وثيقة 6",
        allowedTypes: ["PDF", "JPG", "PNG"],
        fileSize: 10000, // 10 KB
        fileTypeErrorMessage: "Document 6 must be a PDF, JPG, or PNG file.",
        fileTypeErrorMessage_ar:
          "يجب أن تكون وثيقة 6 من نوع PDF أو JPG أو PNG.",
        fileSizeErrorMessage: "Document 6 must be less than 10 KB.",
        fileSizeErrorMessage_ar: "يجب أن تكون وثيقة 6 أقل من 10 كيلوبايت.",
      },
      {
        documentName: "Document 7",
        documentName_ar: "وثيقة 7",
        fileSize: 5000, // 5 KB
        fileSizeErrorMessage: "Document 7 must be less than 5 KB.",
        fileSizeErrorMessage_ar: "يجب أن تكون وثيقة 7 أقل من 5 كيلوبايت.",
        isDark: true,
      },
    ],
  },
};
