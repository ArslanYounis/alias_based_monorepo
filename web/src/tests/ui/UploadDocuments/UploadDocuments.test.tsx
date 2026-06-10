import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UploadDocuments } from "@platform/UploadDocuments";

// Mock useGetDownloadFile
vi.mock("@/hooks/useGetDownloadFile", () => ({
  useGetDownloadFile: vi.fn(() => ({
    data: undefined,
    isSuccess: false,
  })),
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

  it("triggers download when onDownloadClick is called and downloadUrl is set", async () => {
    const { useGetDownloadFile } = vi.mocked(
      await import("@/hooks/useGetDownloadFile")
    );
    const mockBlob = new Blob(["data"], { type: "application/pdf" });
    useGetDownloadFile.mockReturnValue({
      data: mockBlob,
      isSuccess: true,
    } as ReturnType<typeof useGetDownloadFile>);

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

    // The effect should have tried to create an anchor element
    expect(global.URL.createObjectURL).toHaveBeenCalled();
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
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
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
});
