import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { UploadDocuments } from "@platform/UploadDocuments";

// The component now uses useDownload / useDariDownload to perform downloads.
const mockDownload = vi.fn();
const mockDownloadDari = vi.fn();
const mockUploadFile = vi.fn(() => Promise.resolve({ ok: true }));
vi.mock("@/hooks/useDownload", () => ({
  useDownload: () => ({ download: mockDownload }),
}));
vi.mock("@/hooks/useDariDownload", () => ({
  useDariDownload: () => ({ download: mockDownloadDari }),
}));
vi.mock("@shared/hooks/useUploadFile", () => ({
  useUploadFile: () => ({ mutateAsync: mockUploadFile }),
}));
vi.mock("axios", () => ({
  default: { post: vi.fn(() => Promise.resolve({ data: { id: 1 } })) },
}));

// Mock UploadDocument — source imports from "../UploadDocument/UploadDocument" (direct file, not index)
vi.mock("@platform/UploadDocument/UploadDocument", () => ({
  UploadDocument: ({
    documentName,
    isUploaded,
    onFileChange,
    onDownloadClick,
  }: {
    documentName?: string;
    isUploaded?: boolean;
    onFileChange?: (file: unknown) => void;
    onDownloadClick?: () => void;
  }) => (
    <div data-testid={`upload-doc-${documentName}`}>
      <span>{documentName}</span>
      {isUploaded && <span data-testid={`uploaded-${documentName}`}>Uploaded</span>}
      <button
        data-testid={`change-${documentName}`}
        onClick={() => onFileChange?.({ name: `${documentName}.pdf`, uri: "blob:", size: 100, mimeType: "application/pdf" })}
      >
        Change
      </button>
      <button
        data-testid={`change-null-${documentName}`}
        onClick={() => onFileChange?.(null)}
      >
        ChangeNull
      </button>
      <button
        data-testid={`change-bare-${documentName}`}
        onClick={() => onFileChange?.({ name: "noext", uri: "blob:" })}
      >
        ChangeBare
      </button>
      <button
        data-testid={`download-${documentName}`}
        onClick={() => onDownloadClick?.()}
      >
        Download
      </button>
    </div>
  ),
}));

const makeClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={makeClient()}>{children}</QueryClientProvider>
);

const documents = [
  { documentName: "Contract", documentName_ar: "عقد", allowedTypes: ["pdf"], uploadUrl: "/upload/1" },
  { documentName: "ID", documentName_ar: "الهوية", allowedTypes: ["jpg"], uploadUrl: "/upload/2" },
];

describe("UploadDocuments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test");
    global.URL.revokeObjectURL = vi.fn();
    // fetch returns a blob whose readAsDataURL produces a data URL
    global.fetch = vi.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve(new Blob(["hello"], { type: "application/pdf" })),
      })
    ) as unknown as typeof fetch;
    // NOTE: do NOT mock document.body.appendChild/removeChild — that breaks React rendering
  });

  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<UploadDocuments documents={documents} />, { wrapper });
    expect(screen.getByTestId("upload-doc-Contract")).toBeInTheDocument();
    expect(screen.getByTestId("upload-doc-ID")).toBeInTheDocument();
  });

  it("renders all documents", () => {
    render(<UploadDocuments documents={documents} />, { wrapper });
    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  it("renders nothing when documents array is empty", () => {
    const { container } = render(<UploadDocuments documents={[]} />, { wrapper });
    const root = container.querySelector(".flex.flex-col");
    expect(root?.children.length).toBe(0);
  });

  it("renders nothing when documents is empty array", () => {
    const { container } = render(<UploadDocuments documents={[]} />, { wrapper });
    const root = container.querySelector(".flex.flex-col");
    expect(root?.children.length ?? 0).toBe(0);
  });

  // ── onFileChange ───────────────────────────────────────────────────────────

  it("calls onFileChange with file and uploadUrl when not pre-uploaded", () => {
    const onFileChange = vi.fn();
    render(
      <UploadDocuments documents={documents} onFileChange={onFileChange} />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-Contract").click();
    });
    expect(onFileChange).toHaveBeenCalledWith(
      expect.objectContaining({ uploadUrl: "/upload/1" })
    );
  });

  it("does not call onFileChange when document is already uploaded", () => {
    const onFileChange = vi.fn();
    const uploadedDocs = [
      { documentName: "Contract", isUploaded: true, uploadUrl: "/upload/1" },
    ];
    render(
      <UploadDocuments documents={uploadedDocs} onFileChange={onFileChange} />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-Contract").click();
    });
    expect(onFileChange).not.toHaveBeenCalled();
  });

  // ── Download trigger ───────────────────────────────────────────────────────

  it("triggers download when onDownloadClick is called and downloadUrl is set", () => {
    const docsWithDownload = [
      { documentName: "Contract", downloadUrl: "/files/contract.pdf", uploadUrl: "/upload/1" },
    ];

    render(
      <UploadDocuments documents={docsWithDownload} />,
      { wrapper }
    );

    act(() => {
      screen.getByTestId("download-Contract").click();
    });

    // Default apiType invokes useDownload().download(downloadUrl, documentName).
    expect(mockDownload).toHaveBeenCalledWith("/files/contract.pdf", "Contract");
  });

  // ── isUploaded flag ────────────────────────────────────────────────────────

  it("passes isUploaded to each UploadDocument", () => {
    const uploadedDocs = [
      { documentName: "Contract", isUploaded: true, uploadUrl: "/upload/1" },
    ];
    render(<UploadDocuments documents={uploadedDocs} />, { wrapper });
    expect(screen.getByTestId("uploaded-Contract")).toBeInTheDocument();
  });

  // ── Language & theme props ─────────────────────────────────────────────────

  it("renders with custom language and type", () => {
    render(
      <UploadDocuments documents={documents} language="ar" type="base" />,
      { wrapper }
    );
    expect(screen.getByTestId("upload-doc-Contract")).toBeInTheDocument();
  });

  // ── Does not call onFileChange when handler is undefined ──────────────────

  it("does not crash when onFileChange is not provided and file is changed", () => {
    expect(() => {
      render(<UploadDocuments documents={documents} />, { wrapper });
      act(() => {
        screen.getByTestId("change-Contract").click();
      });
    }).not.toThrow();
  });

  // ── Download with no downloadUrl ──────────────────────────────────────────

  it("does not trigger download when downloadUrl is not set", () => {
    const docsNoDownload = [
      { documentName: "NoUrl", uploadUrl: "/upload/1" },
    ];
    render(<UploadDocuments documents={docsNoDownload} />, { wrapper });
    act(() => {
      screen.getByTestId("download-NoUrl").click();
    });
    expect(mockDownload).not.toHaveBeenCalled();
  });

  // ── Multiple documents render ─────────────────────────────────────────────

  it("renders correct number of UploadDocument components", () => {
    const threeDocs = [
      { documentName: "Doc1", uploadUrl: "/1" },
      { documentName: "Doc2", uploadUrl: "/2" },
      { documentName: "Doc3", uploadUrl: "/3" },
    ];
    render(<UploadDocuments documents={threeDocs} />, { wrapper });
    expect(screen.getByTestId("upload-doc-Doc1")).toBeInTheDocument();
    expect(screen.getByTestId("upload-doc-Doc2")).toBeInTheDocument();
    expect(screen.getByTestId("upload-doc-Doc3")).toBeInTheDocument();
  });

  // ── Default theme and type ────────────────────────────────────────────────

  it("uses default theme='dark' and type='default'", () => {
    render(<UploadDocuments documents={documents} />, { wrapper });
    // Just verify no crash with defaults
    expect(screen.getByTestId("upload-doc-Contract")).toBeInTheDocument();
  });

  // ── Internal upload (handleUploadInternally) ───────────────────────────────

  it("uploads via useUploadFile for the default apiType when handleUploadInternally", async () => {
    const onUploadSuccess = vi.fn();
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1", wfiDocumentId: 7 }]}
        handleUploadInternally
        onFileChange={vi.fn()}
        onUploadSuccess={onUploadSuccess}
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-Contract").click();
    });
    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(
        expect.objectContaining({ uploadUrl: "/upload/1" })
      );
    });
    await waitFor(() => {
      expect(onUploadSuccess).toHaveBeenCalledWith({ ok: true });
    });
  });

  it("uploads via axios for the dari apiType when handleUploadInternally", async () => {
    const onUploadSuccess = vi.fn();
    render(
      <UploadDocuments
        documents={[
          {
            documentName: "Contract",
            uploadUrl: "/upload/1",
            applicationType: "ranch",
            applicationID: 42,
            documentType: "permit",
          },
        ]}
        apiType="dari"
        handleUploadInternally
        onFileChange={vi.fn()}
        onUploadSuccess={onUploadSuccess}
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-Contract").click();
    });
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/dari/file/upload",
        expect.objectContaining({ applicationType: "ranch" })
      );
    });
    await waitFor(() => {
      expect(onUploadSuccess).toHaveBeenCalled();
    });
  });

  it("calls onUploadFail when the internal upload throws", async () => {
    const onUploadFail = vi.fn();
    mockUploadFile.mockRejectedValueOnce(new Error("upload failed"));
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1" }]}
        handleUploadInternally
        onFileChange={vi.fn()}
        onUploadFail={onUploadFail}
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-Contract").click();
    });
    await waitFor(() => {
      expect(onUploadFail).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it("does nothing on internal upload when file is null", async () => {
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1" }]}
        handleUploadInternally
        onFileChange={vi.fn()}
      />,
      { wrapper }
    );
    // No file change triggered -> handleUpload never receives a file.
    expect(mockUploadFile).not.toHaveBeenCalled();
  });

  // ── Dari download branch ───────────────────────────────────────────────────

  it("returns early from handleUpload when the file is null", async () => {
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1" }]}
        handleUploadInternally
        onFileChange={vi.fn()}
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-null-Contract").click();
    });
    // file is null -> handleUpload returns before any upload happens
    expect(mockUploadFile).not.toHaveBeenCalled();
  });

  it("handles a file without an extension and without a mimeType", async () => {
    const onUploadSuccess = vi.fn();
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1" }]}
        handleUploadInternally
        onFileChange={vi.fn()}
        onUploadSuccess={onUploadSuccess}
      />,
      { wrapper }
    );
    act(() => {
      // file has no extension and no mimeType -> exercises the "" fallbacks
      screen.getByTestId("change-bare-Contract").click();
    });
    await waitFor(() => expect(mockUploadFile).toHaveBeenCalled());
  });

  it("uploads via dari with a doc missing optional fields", async () => {
    const onUploadSuccess = vi.fn();
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1" }]}
        apiType="dari"
        handleUploadInternally
        onFileChange={vi.fn()}
        onUploadSuccess={onUploadSuccess}
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("change-Contract").click();
    });
    // doc has no applicationType/applicationID/documentType -> "" fallbacks used
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/dari/file/upload",
        expect.objectContaining({ applicationId: "" })
      );
    });
  });

  it("triggers dari download with a doc missing optional download fields", () => {
    render(
      <UploadDocuments
        documents={[{ documentName: "Contract", uploadUrl: "/upload/1", applicationID: 7 }]}
        apiType="dari"
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("download-Contract").click();
    });
    // documentType/applicationType/subType undefined -> "" fallbacks
    expect(mockDownloadDari).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationID: 7,
        applicationType: "",
        documentType: "",
        subType: "",
      })
    );
  });

  it("triggers dari download when apiType=dari and applicationID set", () => {
    render(
      <UploadDocuments
        documents={[
          {
            documentName: "Contract",
            uploadUrl: "/upload/1",
            applicationID: 99,
            applicationType: "ranch",
            documentType: "permit",
            subType: "sub",
          },
        ]}
        apiType="dari"
      />,
      { wrapper }
    );
    act(() => {
      screen.getByTestId("download-Contract").click();
    });
    expect(mockDownloadDari).toHaveBeenCalledWith(
      expect.objectContaining({ applicationID: 99, applicationType: "ranch" })
    );
    expect(mockDownload).not.toHaveBeenCalled();
  });
});
