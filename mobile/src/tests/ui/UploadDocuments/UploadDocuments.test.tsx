/**
 * Tests for the UploadDocuments UI component.
 *
 * Exercises: rendering multiple documents, download callback, onFileChange
 * callback routing, isUploaded guard, and Arabic language support.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

jest.mock("@shared/components/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  const makeIcon = (name: string) => (p: any) =>
    React.createElement(View, { testID: name });
  return {
    ListFilter: makeIcon("list-filter"),
    Search: makeIcon("search"),
    ChevronDown: makeIcon("chevron-down"),
    Plus: makeIcon("plus"),
    FileText: makeIcon("file-text"),
    Filter: makeIcon("filter"),
    ChevronRight: makeIcon("chevron-right"),
    ChevronLeft: makeIcon("chevron-left"),
  };
});

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({ canceled: true }),
}));

const mockDownload = jest.fn();
// UploadDocuments imports from "../sharedHooks/useDownload" which resolves to
// mobile/src/ui/sharedHooks/useDownload — matched by the @platform alias below.
jest.mock("@platform/sharedHooks/useDownload", () => ({
  useDownload: () => ({ download: mockDownload }),
}));

import { UploadDocuments } from "@platform/UploadDocuments/UploadDocuments";

const makeDoc = (overrides: Record<string, any> = {}) => ({
  documentName: "Passport",
  documentName_ar: "جواز سفر",
  allowedTypes: ["pdf"],
  fileTypeErrorMessage: "Wrong format",
  fileTypeErrorMessage_ar: "تنسيق خاطئ",
  fileSize: 5000000,
  fileSizeErrorMessage: "Too large",
  fileSizeErrorMessage_ar: "كبير جداً",
  isUploaded: false,
  downloadUrl: "https://example.com/passport.pdf",
  uploadUrl: "https://upload.example.com",
  ...overrides,
});

describe("UploadDocuments", () => {
  beforeEach(() => {
    mockDownload.mockClear();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing with no documents", () => {
    render(<UploadDocuments documents={[]} />);
  });

  it("renders without crashing with undefined documents", () => {
    render(<UploadDocuments documents={undefined as any} />);
  });

  it("renders a single document", () => {
    render(<UploadDocuments documents={[makeDoc()]} />);
    expect(screen.getByText("Passport")).toBeTruthy();
  });

  it("renders multiple documents", () => {
    render(
      <UploadDocuments
        documents={[
          makeDoc({ documentName: "Passport" }),
          makeDoc({ documentName: "ID Card" }),
        ]}
      />
    );
    expect(screen.getByText("Passport")).toBeTruthy();
    expect(screen.getByText("ID Card")).toBeTruthy();
  });

  // ── Uploaded state ─────────────────────────────────────────────────────────

  it("shows Uploaded for documents with isUploaded=true", () => {
    render(
      <UploadDocuments documents={[makeDoc({ isUploaded: true })]} />
    );
    expect(screen.getByText("Uploaded ")).toBeTruthy();
  });

  it("shows Add for documents with isUploaded=false", () => {
    render(
      <UploadDocuments documents={[makeDoc({ isUploaded: false })]} />
    );
    expect(screen.getByText("Add ")).toBeTruthy();
  });

  // ── Download callback ──────────────────────────────────────────────────────

  it("calls download with url and filename when download icon is pressed", () => {
    render(
      <UploadDocuments
        documents={[
          makeDoc({ isUploaded: true, downloadUrl: "https://example.com/doc.pdf", documentName: "Passport" }),
        ]}
      />
    );
    fireEvent.press(screen.getByTestId("file-text"));
    expect(mockDownload).toHaveBeenCalledWith(
      "https://example.com/doc.pdf",
      "Passport"
    );
  });

  it("does not call download when downloadUrl is undefined", () => {
    render(
      <UploadDocuments
        documents={[makeDoc({ isUploaded: true, downloadUrl: undefined })]}
      />
    );
    fireEvent.press(screen.getByTestId("file-text"));
    expect(mockDownload).not.toHaveBeenCalled();
  });

  it("uses filename from url when documentName is not provided", () => {
    render(
      <UploadDocuments
        documents={[
          makeDoc({
            isUploaded: true,
            downloadUrl: "https://example.com/report.pdf",
            documentName: undefined,
          }),
        ]}
      />
    );
    fireEvent.press(screen.getByTestId("file-text"));
    expect(mockDownload).toHaveBeenCalledWith(
      "https://example.com/report.pdf",
      "report.pdf"
    );
  });

  // ── onFileChange routing ───────────────────────────────────────────────────

  it("does not call parent onFileChange when doc is already uploaded", async () => {
    const { getDocumentAsync } = require("expo-document-picker");
    getDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          name: "new.pdf",
          uri: "file://new.pdf",
          size: 100,
          mimeType: "application/pdf",
        },
      ],
    });
    const onFileChange = jest.fn();
    render(
      <UploadDocuments
        documents={[makeDoc({ isUploaded: true, allowedTypes: undefined })]}
        onFileChange={onFileChange}
      />
    );
    // With isUploaded=true, the plus icon should not be rendered
    expect(screen.queryByTestId("plus")).toBeNull();
  });

  it("calls onFileChange when file is successfully picked for non-uploaded doc", async () => {
    const { getDocumentAsync } = require("expo-document-picker");
    getDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          name: "passport.pdf",
          uri: "file://passport.pdf",
          size: 100,
          mimeType: "application/pdf",
        },
      ],
    });
    const onFileChange = jest.fn();
    render(
      <UploadDocuments
        documents={[makeDoc({ isUploaded: false, allowedTypes: undefined, uploadUrl: "https://upload.example.com" })]}
        onFileChange={onFileChange}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onFileChange).toHaveBeenCalledWith(
      expect.objectContaining({
        uploadUrl: "https://upload.example.com",
      })
    );
  });

  // ── Language ───────────────────────────────────────────────────────────────

  it("renders Arabic document names when language='ar'", () => {
    render(
      <UploadDocuments
        documents={[makeDoc({ isUploaded: false })]}
        language="ar"
      />
    );
    expect(screen.getByText("جواز سفر")).toBeTruthy();
  });

  // ── type / theme props ─────────────────────────────────────────────────────

  it("renders without crashing with type='document' and theme='dark'", () => {
    expect(() =>
      render(
        <UploadDocuments
          documents={[makeDoc()]}
          type="document"
          theme="dark"
        />
      )
    ).not.toThrow();
  });
});
