/**
 * Tests for the UploadDocuments UI component.
 *
 * Exercises: rendering multiple documents, download callback, onFileChange
 * callback routing, isUploaded guard, and Arabic language support.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

// expo-file-system is imported at module top of UploadDocuments (used only inside
// the internal upload handler) — stub it so the import resolves under jest.
// File.bytes() returns a small buffer so the internal base64 encoder runs.
const mockBytes = jest.fn();
jest.mock("expo-file-system", () => ({
  File: class {
    bytes() {
      return mockBytes();
    }
  },
  Directory: class {},
  Paths: { cache: "" },
}));

// axios is used by the internal "dari" upload path.
const mockAxiosPost = jest.fn();
jest.mock("axios", () => ({
  __esModule: true,
  default: { post: (...args: any[]) => mockAxiosPost(...args) },
}));

// useUploadFile mutateAsync used by the internal "default" upload path.
const mockUploadFile = jest.fn().mockResolvedValue({ ok: true });

const mockDownload = jest.fn();
const mockDownloadDari = jest.fn();
// UploadDocuments imports from "../sharedHooks/useDownload" which resolves to
// mobile/src/ui/sharedHooks/useDownload — matched by the @platform alias below.
jest.mock("@platform/sharedHooks/useDownload", () => ({
  useDownload: () => ({ download: mockDownload, downloadDari: mockDownloadDari }),
}));

// UploadDocuments calls useUploadFile() (react-query useMutation). Mock it so we
// don't depend on the network; renders are still wrapped in QueryClientProvider.
jest.mock("@shared/hooks/useUploadFile", () => ({
  useUploadFile: () => ({ mutateAsync: (...args: any[]) => mockUploadFile(...args) }),
}));

import { UploadDocuments } from "@platform/UploadDocuments/UploadDocuments";

// All renders go through a QueryClientProvider wrapper.
const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

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
    mockDownloadDari.mockClear();
    mockBytes.mockReset();
    mockAxiosPost.mockReset();
    mockUploadFile.mockClear();
    mockUploadFile.mockResolvedValue({ ok: true });
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders without crashing with no documents", () => {
    renderWithClient(<UploadDocuments documents={[]} />);
  });

  it("renders without crashing with undefined documents", () => {
    renderWithClient(<UploadDocuments documents={undefined as any} />);
  });

  // NOTE: child UploadDocument renders prefix + documentName in a single Text node.
  it("renders a single document", () => {
    renderWithClient(<UploadDocuments documents={[makeDoc()]} />);
    expect(screen.getByText("Add Passport")).toBeTruthy();
  });

  it("renders multiple documents", () => {
    renderWithClient(
      <UploadDocuments
        documents={[
          makeDoc({ documentName: "Passport" }),
          makeDoc({ documentName: "ID Card" }),
        ]}
      />
    );
    expect(screen.getByText("Add Passport")).toBeTruthy();
    expect(screen.getByText("Add ID Card")).toBeTruthy();
  });

  // ── Uploaded state ─────────────────────────────────────────────────────────

  it("shows Uploaded for documents with isUploaded=true", () => {
    renderWithClient(
      <UploadDocuments documents={[makeDoc({ isUploaded: true })]} />
    );
    expect(screen.getByText("Uploaded Passport")).toBeTruthy();
  });

  it("shows Add for documents with isUploaded=false", () => {
    renderWithClient(
      <UploadDocuments documents={[makeDoc({ isUploaded: false })]} />
    );
    expect(screen.getByText("Add Passport")).toBeTruthy();
  });

  // ── Download callback ──────────────────────────────────────────────────────

  it("calls download with url and filename when download icon is pressed", () => {
    renderWithClient(
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
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({ isUploaded: true, downloadUrl: undefined })]}
      />
    );
    fireEvent.press(screen.getByTestId("file-text"));
    expect(mockDownload).not.toHaveBeenCalled();
  });

  it("uses filename from url when documentName is not provided", () => {
    renderWithClient(
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
    renderWithClient(
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
    renderWithClient(
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
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({ isUploaded: false })]}
        language="ar"
      />
    );
    expect(screen.getByText("إضافة جواز سفر")).toBeTruthy();
  });

  // ── type / theme props ─────────────────────────────────────────────────────

  it("renders without crashing with type='document' and theme='dark'", () => {
    expect(() =>
      renderWithClient(
        <UploadDocuments
          documents={[makeDoc()]}
          type="document"
          theme="dark"
        />
      )
    ).not.toThrow();
  });

  // ── Internal upload (handleUploadInternally) ─────────────────────────────────

  const pickFile = (overrides: Record<string, any> = {}) => {
    const { getDocumentAsync } = require("expo-document-picker");
    getDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          name: "passport.pdf",
          uri: "file://passport.pdf",
          size: 100,
          mimeType: "application/pdf",
          ...overrides,
        },
      ],
    });
  };

  it("uploads via useUploadFile for apiType='default' when handleUploadInternally", async () => {
    mockBytes.mockResolvedValueOnce(new Uint8Array([1, 2, 3, 4]));
    pickFile();
    const onUploadSuccess = jest.fn();
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({ allowedTypes: undefined, uploadUrl: "https://upload.example.com", wfiDocumentId: "W1" })]}
        handleUploadInternally
        apiType="default"
        onUploadSuccess={onUploadSuccess}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(mockUploadFile).toHaveBeenCalledWith(
      expect.objectContaining({ uploadUrl: "https://upload.example.com" })
    );
    expect(onUploadSuccess).toHaveBeenCalledWith({ ok: true });
  });

  it("uploads via axios for apiType='dari' when handleUploadInternally", async () => {
    mockBytes.mockResolvedValueOnce(new Uint8Array([10, 20]));
    mockAxiosPost.mockResolvedValueOnce({ data: "dari-ok" });
    pickFile({ name: "doc.png", mimeType: "image/png" });
    const onUploadSuccess = jest.fn();
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({
          allowedTypes: undefined,
          applicationType: "AT",
          applicationID: "APP1",
          documentType: "DT",
        })]}
        handleUploadInternally
        apiType="dari"
        onUploadSuccess={onUploadSuccess}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(mockAxiosPost).toHaveBeenCalledWith(
      "/dari/file/upload",
      expect.objectContaining({
        applicationType: "AT",
        applicationId: "APP1",
        documentType: "DT",
      })
    );
    expect(onUploadSuccess).toHaveBeenCalledWith({ data: "dari-ok" });
  });

  it("calls onUploadFail when internal upload throws", async () => {
    mockBytes.mockRejectedValueOnce(new Error("read fail"));
    pickFile();
    const onUploadFail = jest.fn();
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({ allowedTypes: undefined })]}
        handleUploadInternally
        apiType="default"
        onUploadFail={onUploadFail}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(onUploadFail).toHaveBeenCalledWith(expect.any(Error));
  });

  // ── downloadDari path ────────────────────────────────────────────────────────

  it("internal upload returns early when picked file is null (disallowed type)", async () => {
    // allowedTypes mismatch causes UploadDocument to emit onFileChange(null),
    // which routes to handleUpload(null, doc) — the early `if (!file) return`.
    pickFile({ name: "bad.txt" });
    const onUploadSuccess = jest.fn();
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({ allowedTypes: ["pdf"] })]}
        handleUploadInternally
        apiType="default"
        onUploadSuccess={onUploadSuccess}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(mockUploadFile).not.toHaveBeenCalled();
    expect(onUploadSuccess).not.toHaveBeenCalled();
  });

  it("internal upload handles file with no extension, no mimeType, and dari fallbacks", async () => {
    mockBytes.mockResolvedValueOnce(new Uint8Array([7]));
    mockAxiosPost.mockResolvedValueOnce({ data: "ok" });
    // name without a dot -> split fallback; mimeType undefined; applicationID
    // undefined -> String("") ; documentType falsy -> uploadUrl fallback.
    pickFile({ name: "noext", mimeType: undefined });
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({
          allowedTypes: undefined,
          applicationID: undefined,
          documentType: undefined,
          uploadUrl: "https://fallback.upload",
        })]}
        handleUploadInternally
        apiType="dari"
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(mockAxiosPost).toHaveBeenCalledWith(
      "/dari/file/upload",
      expect.objectContaining({
        applicationId: "",
        documentType: "https://fallback.upload",
      })
    );
  });

  it("default internal upload uses empty doc_name when wfiDocumentId missing", async () => {
    mockBytes.mockResolvedValueOnce(new Uint8Array([1]));
    pickFile();
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({ allowedTypes: undefined, wfiDocumentId: undefined })]}
        handleUploadInternally
        apiType="default"
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("plus"));
    });
    expect(mockUploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ name: "doc_name_" }),
      })
    );
  });

  it("calls downloadDari with empty-string fallbacks when fields missing", () => {
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({
          isUploaded: true,
          applicationID: "APP0",
          applicationType: undefined,
          documentType: undefined,
          subType: undefined,
        })]}
        apiType="dari"
      />
    );
    fireEvent.press(screen.getByTestId("file-text"));
    expect(mockDownloadDari).toHaveBeenCalledWith(
      {
        applicationID: "APP0",
        applicationType: "",
        documentType: "",
        subType: "",
      },
      "Passport"
    );
  });

  it("calls downloadDari for apiType='dari' with applicationID", () => {
    renderWithClient(
      <UploadDocuments
        documents={[makeDoc({
          isUploaded: true,
          apiType: "dari",
          applicationID: "APP9",
          applicationType: "AT",
          documentType: "DT",
          subType: "ST",
        })]}
        apiType="dari"
      />
    );
    fireEvent.press(screen.getByTestId("file-text"));
    expect(mockDownloadDari).toHaveBeenCalledWith(
      {
        applicationID: "APP9",
        applicationType: "AT",
        documentType: "DT",
        subType: "ST",
      },
      "Passport"
    );
  });
});
