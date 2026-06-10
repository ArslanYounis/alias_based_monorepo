import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ApplicationDetail from "@shared/components/ApplicationDetail/ApplicationDetail";

// Mock the data-fetching hook so we control what it returns
vi.mock("@shared/hooks/useGetApplicationDetails", () => ({
  useGetApplicationDetails: vi.fn(),
}));

import { useGetApplicationDetails } from "@shared/hooks/useGetApplicationDetails";

const mockData = {
  result: {
    application: {
      applicationNumber: "APP-2024-001",
      applicationCreatedDate: "2024-01-15",
      applicationReferenceNumber: "REF-001",
    },
    owners: [
      {
        ownerNameE: "John Smith",
        ownerNameA: "جون سميث",
      },
    ],
    plot: {
      plotNumber: "PLT-001",
    },
    steps: [
      {
        stepConst: "Submit Application",
        status: 2,
        actionUser: { userNameE: "Admin", userNameA: "المسؤول" },
        actionDate: "2024-01-15",
      },
      {
        stepConst: "Review",
        status: 1,
        actionUser: { userNameE: "Reviewer", userNameA: "المراجع" },
        actionDate: "",
      },
    ],
    documents: [
      {
        documentNameE: "ID Document",
        documentNameA: "وثيقة الهوية",
        attachmentList: [
          {
            downloadUrl: "https://example.com/doc.pdf",
          },
        ],
      },
      {
        documentNameE: "Passport",
        documentNameA: "جواز السفر",
        attachmentList: [],
      },
    ],
  },
};

const baseProps = {
  applicationId: "app-1",
  applicationTitle: "Land Application",
  applicationTitle_ar: "طلب أرض",
  language: "en" as const,
};

describe("ApplicationDetail (shared component – web platform)", () => {
  beforeEach(() => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetApplicationDetails>);
  });

  it("renders without crashing", () => {
    render(<ApplicationDetail {...baseProps} />);
  });

  it("shows loading state", () => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetApplicationDetails>);
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text when language is 'ar'", () => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetApplicationDetails>);
    render(<ApplicationDetail {...baseProps} language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetApplicationDetails>);
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Error loading application details.")).toBeInTheDocument();
  });

  it("shows Arabic error text when language is 'ar'", () => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetApplicationDetails>);
    render(<ApplicationDetail {...baseProps} language="ar" />);
    expect(screen.getByText("خطأ في تحميل تفاصيل التطبيق.")).toBeInTheDocument();
  });

  it("renders the application title in English", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Land Application")).toBeInTheDocument();
  });

  it("renders the application title in Arabic", () => {
    render(<ApplicationDetail {...baseProps} language="ar" />);
    expect(screen.getByText("طلب أرض")).toBeInTheDocument();
  });

  it("renders Application Number label and value", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Application Number")).toBeInTheDocument();
    expect(screen.getByText("APP-2024-001")).toBeInTheDocument();
  });

  it("renders Arabic labels when language is 'ar'", () => {
    render(<ApplicationDetail {...baseProps} language="ar" />);
    expect(screen.getByText("رقم الطلب")).toBeInTheDocument();
  });

  it("renders owner section with owner name in English", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
  });

  it("renders owner name in Arabic", () => {
    render(<ApplicationDetail {...baseProps} language="ar" />);
    expect(screen.getByText("جون سميث")).toBeInTheDocument();
  });

  it("renders owner action buttons in English", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    // View may appear multiple times (owner View + plot View)
    expect(screen.getAllByText("View").length).toBeGreaterThan(0);
    expect(screen.getByText("Plots")).toBeInTheDocument();
    expect(screen.getByText("Edit Contact")).toBeInTheDocument();
  });

  it("calls onOwnerClick with 'view' action", () => {
    const onOwnerClick = vi.fn();
    render(
      <ApplicationDetail {...baseProps} language="en" onOwnerClick={onOwnerClick} />
    );
    // Click the first "View" button (owner view)
    fireEvent.click(screen.getAllByText("View")[0]);
    expect(onOwnerClick).toHaveBeenCalledWith({
      ownerData: mockData.result.owners[0],
      action: "view",
    });
  });

  it("calls onOwnerClick with 'plot' action", () => {
    const onOwnerClick = vi.fn();
    render(
      <ApplicationDetail {...baseProps} language="en" onOwnerClick={onOwnerClick} />
    );
    fireEvent.click(screen.getByText("Plots"));
    expect(onOwnerClick).toHaveBeenCalledWith({
      ownerData: mockData.result.owners[0],
      action: "plot",
    });
  });

  it("renders plot section with plot number", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("PLT-001")).toBeInTheDocument();
  });

  it("renders interaction history section", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Interaction History")).toBeInTheDocument();
    expect(screen.getByText("Submit Application")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders Complete badge for completed step", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("renders documents section", () => {
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("ID Document")).toBeInTheDocument();
    expect(screen.getByText("Passport")).toBeInTheDocument();
  });

  it("calls onDocumentOpen when document with attachment is clicked", () => {
    const onDocumentOpen = vi.fn();
    render(
      <ApplicationDetail
        {...baseProps}
        language="en"
        onDocumentOpen={onDocumentOpen}
      />
    );
    fireEvent.click(screen.getByText("ID Document"));
    expect(onDocumentOpen).toHaveBeenCalledWith("https://example.com/doc.pdf");
  });

  it("does not call onDocumentOpen for document without attachment", () => {
    const onDocumentOpen = vi.fn();
    render(
      <ApplicationDetail
        {...baseProps}
        language="en"
        onDocumentOpen={onDocumentOpen}
      />
    );
    fireEvent.click(screen.getByText("Passport"));
    expect(onDocumentOpen).not.toHaveBeenCalled();
  });

  it("renders no owner section when owners array is empty", () => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: { result: { ...mockData.result, owners: [] } },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetApplicationDetails>);
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.queryByText("Owner")).not.toBeInTheDocument();
  });

  it("renders no plot section when plot is null", () => {
    vi.mocked(useGetApplicationDetails).mockReturnValue({
      data: { result: { ...mockData.result, plot: null } },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetApplicationDetails>);
    render(<ApplicationDetail {...baseProps} language="en" />);
    expect(screen.queryByText("Plot")).not.toBeInTheDocument();
  });
});
