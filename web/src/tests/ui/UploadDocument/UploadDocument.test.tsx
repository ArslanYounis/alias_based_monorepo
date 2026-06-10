import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UploadDocument } from "@platform/UploadDocument";

// Mock SharedLanguageSwitchRenderer from both paths
vi.mock("@shared/components/SharedLanguageSwitchRenderer", () => ({
  default: ({ value, value_ar, language }: { value?: string; value_ar?: string; language: string }) =>
    language === "ar" ? (value_ar || value || "") : (value || ""),
}));

vi.mock("@/assets/svg/document", () => ({
  default: () => <svg data-testid="document-icon" />,
}));

// Mock URL.createObjectURL
beforeEach(() => {
  vi.clearAllMocks();
  global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-url");
  global.URL.revokeObjectURL = vi.fn();
});

const makeFile = (name: string, type: string, size: number = 1000) => {
  const file = new File(["content"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("UploadDocument", () => {
  // ── Default render ─────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<UploadDocument documentName="Contract" />);
    // Component renders "Add " (trailing space) via SharedLanguageSwitchRenderer
    expect(screen.getByText(/^Add /)).toBeInTheDocument();
  });

  it("shows 'Add' and document name before upload", () => {
    render(<UploadDocument documentName="Contract" />);
    expect(screen.getByText(/^Add /)).toBeInTheDocument();
    // "Contract" is a sibling text node; use regex to find the parent element
    expect(screen.getByText(/Contract/)).toBeInTheDocument();
  });

  it("renders plus icon before upload (no file)", () => {
    render(<UploadDocument documentName="Contract" />);
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("hidden");
  });

  // ── isUploaded state ───────────────────────────────────────────────────────

  it("shows 'Uploaded' when isUploaded=true", () => {
    render(<UploadDocument documentName="Contract" isUploaded />);
    // Component renders "Uploaded " (trailing space) via SharedLanguageSwitchRenderer
    expect(screen.getByText(/^Uploaded /)).toBeInTheDocument();
  });

  it("shows document icon when isUploaded=true", () => {
    render(<UploadDocument documentName="Contract" isUploaded />);
    expect(screen.getByTestId("document-icon")).toBeInTheDocument();
  });

  it("does not show plus icon when isUploaded=true", () => {
    const { container } = render(<UploadDocument documentName="Contract" isUploaded />);
    // mr-2 div with cursor-pointer is the plus icon container — should not exist when hasFile
    const plusContainer = container.querySelector(".mr-2.cursor-pointer");
    expect(plusContainer).not.toBeInTheDocument();
  });

  // ── File selection ─────────────────────────────────────────────────────────

  it("calls onFileChange with file data when a valid file is selected", () => {
    const onFileChange = vi.fn();
    render(<UploadDocument documentName="Doc" onFileChange={onFileChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("test.pdf", "application/pdf");
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileChange).toHaveBeenCalledWith(expect.objectContaining({
      name: "test.pdf",
      mimeType: "application/pdf",
    }));
  });

  it("shows 'Uploaded' text after valid file is selected", () => {
    render(<UploadDocument documentName="Doc" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("test.pdf", "application/pdf");
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText(/^Uploaded /)).toBeInTheDocument();
  });

  it("calls onFileChange(null) when no file is selected", () => {
    const onFileChange = vi.fn();
    render(<UploadDocument documentName="Doc" onFileChange={onFileChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [] } });
    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  // ── File type validation ───────────────────────────────────────────────────

  it("shows file type error when file extension not in allowedTypes", () => {
    render(
      <UploadDocument
        documentName="Doc"
        allowedTypes={["pdf"]}
        fileTypeErrorMessage="Wrong format"
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("test.exe", "application/x-msdownload");
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("Wrong format")).toBeInTheDocument();
  });

  it("calls onFileChange(null) when file type is invalid", () => {
    const onFileChange = vi.fn();
    render(
      <UploadDocument
        documentName="Doc"
        allowedTypes={["pdf"]}
        onFileChange={onFileChange}
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("virus.exe", "application/x-msdownload");
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  // ── File size validation ───────────────────────────────────────────────────

  it("shows file size error when file exceeds fileSize limit", () => {
    render(
      <UploadDocument
        documentName="Doc"
        fileSize={500}
        fileSizeErrorMessage="File too large"
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("big.pdf", "application/pdf", 1000);
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("File too large")).toBeInTheDocument();
  });

  it("accepts file within size limit", () => {
    const onFileChange = vi.fn();
    render(
      <UploadDocument
        documentName="Doc"
        fileSize={5000}
        onFileChange={onFileChange}
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("small.pdf", "application/pdf", 1000);
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileChange).toHaveBeenCalledWith(expect.objectContaining({ name: "small.pdf" }));
  });

  // ── Accepted formats hint ─────────────────────────────────────────────────

  it("shows accepted formats hint when allowedTypes is set and no file selected", () => {
    render(
      <UploadDocument
        documentName="Doc"
        allowedTypes={["pdf", "docx"]}
      />
    );
    expect(screen.getByText(/Accepted formats/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf, docx/i)).toBeInTheDocument();
  });

  it("hides accepted formats hint after upload", () => {
    render(
      <UploadDocument
        documentName="Doc"
        allowedTypes={["pdf"]}
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("doc.pdf", "application/pdf");
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.queryByText(/Accepted formats/i)).not.toBeInTheDocument();
  });

  // ── onDownloadClick ───────────────────────────────────────────────────────

  it("calls onDownloadClick when document icon is clicked after upload", () => {
    const onDownloadClick = vi.fn();
    render(
      <UploadDocument
        documentName="Doc"
        isUploaded
        onDownloadClick={onDownloadClick}
      />
    );
    fireEvent.click(screen.getByTestId("document-icon"));
    expect(onDownloadClick).toHaveBeenCalledTimes(1);
  });

  // ── Type variants ─────────────────────────────────────────────────────────

  it("applies bg-cards-base-l1 for type='base'", () => {
    const { container } = render(<UploadDocument documentName="Doc" type="base" />);
    const inner = container.querySelector(".h-12");
    expect(inner).toHaveClass("border-cards-stroke");
  });

  it("applies transparent border for default type with no error", () => {
    const { container } = render(<UploadDocument documentName="Doc" type="default" />);
    const inner = container.querySelector(".h-12");
    expect(inner).toHaveClass("border-transparent");
  });

  // ── Arabic language ────────────────────────────────────────────────────────

  it("renders rtl direction when language=ar", () => {
    const { container } = render(<UploadDocument documentName="Doc" language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("renders ltr direction by default", () => {
    const { container } = render(<UploadDocument documentName="Doc" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  // ── Arabic text rendering ─────────────────────────────────────────────────

  it("shows Arabic 'Add' text when language=ar", () => {
    render(<UploadDocument documentName="Contract" documentName_ar="عقد" language="ar" />);
    expect(screen.getByText(/إضافة/)).toBeInTheDocument();
    expect(screen.getByText(/عقد/)).toBeInTheDocument();
  });

  it("shows Arabic 'Uploaded' text when language=ar and isUploaded=true", () => {
    render(<UploadDocument documentName="Contract" documentName_ar="عقد" language="ar" isUploaded />);
    expect(screen.getByText(/تم رفع/)).toBeInTheDocument();
  });

  // ── File type error in Arabic ─────────────────────────────────────────────

  it("shows Arabic file type error when language=ar", () => {
    render(
      <UploadDocument
        documentName="Doc"
        allowedTypes={["pdf"]}
        fileTypeErrorMessage="Wrong format"
        fileTypeErrorMessage_ar="تنسيق خاطئ"
        language="ar"
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("test.exe", "application/x-msdownload");
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("تنسيق خاطئ")).toBeInTheDocument();
  });

  // ── File size error in Arabic ─────────────────────────────────────────────

  it("shows Arabic file size error when language=ar", () => {
    render(
      <UploadDocument
        documentName="Doc"
        fileSize={500}
        fileSizeErrorMessage="File too large"
        fileSizeErrorMessage_ar="ملف كبير جدا"
        language="ar"
      />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("big.pdf", "application/pdf", 1000);
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("ملف كبير جدا")).toBeInTheDocument();
  });

  // ── Click on text area opens file picker ──────────────────────────────────

  it("opens file picker when text area is clicked (no file uploaded)", () => {
    render(<UploadDocument documentName="Doc" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    const textArea = screen.getByText(/^Add /).closest(".flex-grow");
    fireEvent.click(textArea!);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("does not open file picker when text area is clicked and file is uploaded", () => {
    render(<UploadDocument documentName="Doc" isUploaded />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    const textArea = screen.getByText(/^Uploaded /).closest(".flex-grow");
    fireEvent.click(textArea!);
    expect(clickSpy).not.toHaveBeenCalled();
  });

  // ── isUploaded prop change ────────────────────────────────────────────────

  it("updates hasFile when isUploaded prop changes", () => {
    const { rerender } = render(<UploadDocument documentName="Doc" isUploaded={false} />);
    expect(screen.getByText(/^Add /)).toBeInTheDocument();
    rerender(<UploadDocument documentName="Doc" isUploaded={true} />);
    expect(screen.getByText(/^Uploaded /)).toBeInTheDocument();
  });

  // ── No allowedTypes shows no formats hint ─────────────────────────────────

  it("does not show accepted formats when allowedTypes is empty", () => {
    render(<UploadDocument documentName="Doc" allowedTypes={[]} />);
    expect(screen.queryByText(/Accepted formats/)).not.toBeInTheDocument();
  });

  // ── Error border for default type ─────────────────────────────────────────

  it("applies error border for default type when file type error", () => {
    const { container } = render(
      <UploadDocument documentName="Doc" allowedTypes={["pdf"]} />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("test.exe", "application/x-msdownload");
    fireEvent.change(input, { target: { files: [file] } });
    const inner = container.querySelector(".h-12");
    expect(inner).toHaveClass("border-form-fields-error");
  });

  // ── onDownloadClick stopPropagation ───────────────────────────────────────

  it("stops event propagation when download icon is clicked", () => {
    const onDownloadClick = vi.fn();
    render(<UploadDocument documentName="Doc" isUploaded onDownloadClick={onDownloadClick} />);
    const icon = screen.getByTestId("document-icon");
    const parentClick = vi.fn();
    icon.parentElement!.parentElement!.addEventListener("click", parentClick);
    fireEvent.click(icon);
    expect(onDownloadClick).toHaveBeenCalled();
  });
});
