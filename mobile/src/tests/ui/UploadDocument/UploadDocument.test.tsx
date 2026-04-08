/**
 * Tests for the UploadDocument UI component.
 *
 * Exercises: default rendering, uploaded state, file picking success/cancel,
 * file type validation, file size validation, onFileChange callback,
 * onDownloadClick callback, and Arabic language.
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

// jest.mock is hoisted before variable declarations, so we cannot reference a
// const inside the factory. Instead we use a forwarder so getDocumentAsync
// always delegates to whatever jest.fn() we set on the module.
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({ canceled: true }),
}));

import { UploadDocument } from "@platform/UploadDocument/UploadDocument";

// Grab the mocked function AFTER the import (module has been set up by now)
const getDocumentAsync = () =>
  require("expo-document-picker").getDocumentAsync as jest.Mock;

describe("UploadDocument", () => {
  beforeEach(() => {
    getDocumentAsync().mockClear();
    getDocumentAsync().mockResolvedValue({ canceled: true });
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<UploadDocument />);
  });

  it("renders Add text and document name in default state", () => {
    render(<UploadDocument documentName="Passport" />);
    expect(screen.getByText("Add ")).toBeTruthy();
    expect(screen.getByText("Passport")).toBeTruthy();
  });

  it("renders the plus icon when not uploaded", () => {
    render(<UploadDocument />);
    expect(screen.getByTestId("plus")).toBeTruthy();
  });

  // ── Uploaded state ─────────────────────────────────────────────────────────

  it("shows Uploaded text when isUploaded=true", () => {
    render(<UploadDocument documentName="Passport" isUploaded />);
    expect(screen.getByText("Uploaded ")).toBeTruthy();
  });

  it("hides plus icon when isUploaded=true", () => {
    render(<UploadDocument isUploaded />);
    expect(screen.queryByTestId("plus")).toBeNull();
  });

  it("shows file-text icon when isUploaded=true", () => {
    render(<UploadDocument isUploaded />);
    expect(screen.getByTestId("file-text")).toBeTruthy();
  });

  it("updates hasFile when isUploaded prop changes", () => {
    const { rerender } = render(
      <UploadDocument documentName="Doc" isUploaded={false} />
    );
    expect(screen.getByText("Add ")).toBeTruthy();
    rerender(<UploadDocument documentName="Doc" isUploaded />);
    expect(screen.getByText("Uploaded ")).toBeTruthy();
  });

  // ── File picker — cancel ───────────────────────────────────────────────────

  it("does not change state when picker is canceled", async () => {
    getDocumentAsync().mockResolvedValueOnce({ canceled: true });
    const onFileChange = jest.fn();
    render(<UploadDocument onFileChange={onFileChange} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onFileChange).not.toHaveBeenCalled();
    expect(screen.queryByText("Uploaded ")).toBeNull();
  });

  // ── File picker — success ──────────────────────────────────────────────────

  it("calls onFileChange with file info on successful pick", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          name: "passport.pdf",
          uri: "file://passport.pdf",
          size: 1000,
          mimeType: "application/pdf",
        },
      ],
    });
    const onFileChange = jest.fn();
    render(<UploadDocument onFileChange={onFileChange} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onFileChange).toHaveBeenCalledWith({
      name: "passport.pdf",
      uri: "file://passport.pdf",
      size: 1000,
      mimeType: "application/pdf",
    });
  });

  it("shows Uploaded text after successful file pick", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          name: "doc.pdf",
          uri: "file://doc.pdf",
          size: 500,
          mimeType: "application/pdf",
        },
      ],
    });
    render(<UploadDocument />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(screen.getByText("Uploaded ")).toBeTruthy();
  });

  // ── File type validation ───────────────────────────────────────────────────

  it("shows file type error when file extension is not in allowedTypes", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          name: "image.jpg",
          uri: "file://image.jpg",
          size: 500,
          mimeType: "image/jpeg",
        },
      ],
    });
    render(
      <UploadDocument
        allowedTypes={["pdf"]}
        fileTypeErrorMessage="File not the correct format"
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(screen.getByText("File not the correct format")).toBeTruthy();
  });

  it("calls onFileChange with null when file type is invalid", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [{ name: "image.jpg", uri: "file://image.jpg", size: 100 }],
    });
    const onFileChange = jest.fn();
    render(<UploadDocument allowedTypes={["pdf"]} onFileChange={onFileChange} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  it("accepts file when extension matches allowedTypes", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [
        { name: "doc.pdf", uri: "file://doc.pdf", size: 100, mimeType: "application/pdf" },
      ],
    });
    const onFileChange = jest.fn();
    render(<UploadDocument allowedTypes={["pdf"]} onFileChange={onFileChange} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onFileChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "doc.pdf" })
    );
    expect(screen.queryByText("File not the correct format")).toBeNull();
  });

  // ── File size validation ───────────────────────────────────────────────────

  it("shows file size error when file exceeds fileSize limit", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [
        { name: "large.pdf", uri: "file://large.pdf", size: 5000000 },
      ],
    });
    render(
      <UploadDocument
        fileSize={1000}
        fileSizeErrorMessage="File too large"
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(screen.getByText("File too large")).toBeTruthy();
  });

  it("calls onFileChange with null when file is too large", async () => {
    getDocumentAsync().mockResolvedValueOnce({
      canceled: false,
      assets: [{ name: "big.pdf", uri: "file://big.pdf", size: 999999 }],
    });
    const onFileChange = jest.fn();
    render(<UploadDocument fileSize={100} onFileChange={onFileChange} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  // ── onDownloadClick ────────────────────────────────────────────────────────

  it("calls onDownloadClick when file-text icon is pressed", () => {
    const onDownloadClick = jest.fn();
    render(<UploadDocument isUploaded onDownloadClick={onDownloadClick} />);
    fireEvent.press(screen.getByTestId("file-text"));
    expect(onDownloadClick).toHaveBeenCalledTimes(1);
  });

  // ── Accepted formats display ───────────────────────────────────────────────

  it("shows accepted formats when allowedTypes provided and no error and not uploaded", () => {
    render(
      <UploadDocument allowedTypes={["pdf", "docx"]} isUploaded={false} />
    );
    expect(screen.getByText("Accepted formats: pdf, docx")).toBeTruthy();
  });

  it("hides accepted formats when file is uploaded", () => {
    render(<UploadDocument allowedTypes={["pdf"]} isUploaded />);
    expect(screen.queryByText("Accepted formats: pdf")).toBeNull();
  });

  // ── Arabic language ────────────────────────────────────────────────────────

  it("shows Arabic text for Add when language='ar'", () => {
    render(<UploadDocument language="ar" documentName="جواز سفر" />);
    expect(screen.getByText("إضافة ")).toBeTruthy();
  });

  it("shows Arabic Uploaded text when language='ar' and isUploaded", () => {
    render(
      <UploadDocument language="ar" documentName="وثيقة" isUploaded />
    );
    expect(screen.getByText("تم رفع ")).toBeTruthy();
  });

  // ── type prop ─────────────────────────────────────────────────────────────

  it("renders without crashing with type='document'", () => {
    expect(() =>
      render(<UploadDocument type="document" />)
    ).not.toThrow();
  });
});
