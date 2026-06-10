import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ViewPlotDetail from "@shared/components/ViewPlotDetail/ViewPlotDetail";

// Mock hooks used by the component
vi.mock("@shared/hooks/useGetPlotDetail", () => ({
  default: vi.fn(),
  useGetPlotDetail: vi.fn(),
}));

vi.mock("@shared/hooks/useGetPlotImage", () => ({
  useGetPlotImage: vi.fn(() => ({ data: null, isPending: false })),
}));

import useGetPlotDetail from "@shared/hooks/useGetPlotDetail";

const mockPlotDetail = {
  plotAddress: "123 Main Street, Dubai",
  plotNumber: "PLT-001",
  plotFileNumber: "FILE-001",
  plotAreaFeet: "5000 sqft",
  constructionStatusE: "Under Construction",
  constructionStatusA: "قيد الإنشاء",
  urlArgs: "plot-args-1",
  district: { districtNameE: "Downtown", districtNameA: "وسط المدينة" },
  community: { communityNameE: "Sector 5", communityNameA: "القطاع 5" },
  municipality: { municipalityNameE: "Dubai Municipality", municipalityNameA: "بلدية دبي" },
  landUse: { landuseNameE: "Residential", landuseNameA: "سكني" },
  ownersList: {
    ownerNameE: "John Smith",
    nationalityId: "784-1990-1234567-1",
    moiUnifiedNumber: "MOI-001",
    archiveFileNumberAA: "ARCH-001",
    nationalityE: "Emirati",
    nationalityA: "إماراتي",
    hasSpecialNationality: false,
    plotShares: [
      {
        share: "100%",
        rightsHoldType: {
          rightsHoldTypeNameE: "Freehold",
          rightsHoldTypeNameA: "تملك حر",
        },
      },
    ],
  },
};

describe("ViewPlotDetail (shared component – web platform)", () => {
  beforeEach(() => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: [mockPlotDetail],
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
  });

  it("renders without crashing with no plotIds", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={[]} />);
  });

  it("shows loading state when isPending is true", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: undefined,
      isPending: true,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text when language is 'ar'", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: undefined,
      isPending: true,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={["1"]} language="ar" />);
    expect(screen.getByText("جارٍ التحميل")).toBeInTheDocument();
  });

  it("shows 'No plots found' message when data is empty and not loading", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={[]} language="en" />);
    expect(screen.getByText("No plots found")).toBeInTheDocument();
  });

  it("shows Arabic 'No plots found' when language is 'ar'", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={[]} language="ar" />);
    expect(screen.getByText("لم يتم العثور على قطع")).toBeInTheDocument();
  });

  it("renders plot address", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    // Address appears in heading and as a detail row value
    const addressEls = screen.getAllByText("123 Main Street, Dubai");
    expect(addressEls.length).toBeGreaterThan(0);
  });

  it("renders plot left details (Zone/District)", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Zone/District")).toBeInTheDocument();
    expect(screen.getByText("Downtown")).toBeInTheDocument();
  });

  it("renders plot bottom details (Plot Number)", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Plot Number")).toBeInTheDocument();
    expect(screen.getByText("PLT-001")).toBeInTheDocument();
  });

  it("renders Land Use detail", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Land Use")).toBeInTheDocument();
    expect(screen.getByText("Residential")).toBeInTheDocument();
  });

  it("renders owner section when showOwnerDetails is true (default)", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" showOwnerDetails={true} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("does not render owner section when showOwnerDetails is false", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" showOwnerDetails={false} />);
    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
  });

  it("renders owner details (Nationality)", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" showOwnerDetails={true} />);
    expect(screen.getByText("Nationality")).toBeInTheDocument();
    expect(screen.getByText("Emirati")).toBeInTheDocument();
  });

  it("renders View button for owner section", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" showOwnerDetails={true} />);
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("renders plotTitle when provided", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        plotTitle="Plot Details"
        plotTitle_ar="تفاصيل القطعة"
        language="en"
      />
    );
    expect(screen.getByText("Plot Details")).toBeInTheDocument();
  });

  it("renders ownerText in English", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        ownerText="Owner"
        ownerText_ar="المالك"
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("Owner")).toBeInTheDocument();
  });

  it("renders ownerText in Arabic", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        ownerText="Owner"
        ownerText_ar="المالك"
        language="ar"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("المالك")).toBeInTheDocument();
  });

  it("renders multiple plots", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: [
        mockPlotDetail,
        { ...mockPlotDetail, plotAddress: "456 Second Street, Dubai", plotNumber: "PLT-002" },
      ],
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={["1", "2"]} language="en" />);
    // Each address appears in heading + detail row (getAllByText handles duplicates)
    expect(screen.getAllByText("123 Main Street, Dubai").length).toBeGreaterThan(0);
    expect(screen.getAllByText("456 Second Street, Dubai").length).toBeGreaterThan(0);
  });

  // ── Owner share rendering ─────────────────────────────────────────────────

  it("renders owner share percentage", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders rights hold type", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("Right Hold Types")).toBeInTheDocument();
    expect(screen.getByText("Freehold")).toBeInTheDocument();
  });

  // ── Arabic field values ───────────────────────────────────────────────────

  it("renders Arabic labels for left details when language is ar", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="ar" />);
    // Labels render in Arabic
    expect(screen.getByText("عنوان القطعة")).toBeInTheDocument();
    expect(screen.getByText("المنطقة / الحي")).toBeInTheDocument();
    expect(screen.getByText("القطاع")).toBeInTheDocument();
  });

  it("renders Arabic labels for bottom details when language is ar", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="ar" />);
    expect(screen.getByText("رقم القطعة")).toBeInTheDocument();
    expect(screen.getByText("البلدية")).toBeInTheDocument();
  });

  it("renders Arabic owner labels when language is ar", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="ar"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("الهوية الوطنية الإماراتية")).toBeInTheDocument();
    expect(screen.getByText("الجنسية")).toBeInTheDocument();
  });

  it("renders Arabic owner nationality when language is ar", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="ar"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("إماراتي")).toBeInTheDocument();
  });

  it("renders Arabic rights hold type name when language is ar", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="ar"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("تملك حر")).toBeInTheDocument();
  });

  // ── plotCode / plotNumber rendering ────────────────────────────────────────

  it("renders plot file number", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Plot File Number")).toBeInTheDocument();
    expect(screen.getByText("FILE-001")).toBeInTheDocument();
  });

  it("renders plot area in feet", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("5000 sqft")).toBeInTheDocument();
  });

  // ── Special nationality rendering ─────────────────────────────────────────

  it("renders 'No' for hasSpecialNationality=false in English", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("Special Nationality")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders 'Yes' for hasSpecialNationality=true in English", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: [{
        ...mockPlotDetail,
        ownersList: {
          ...mockPlotDetail.ownersList,
          hasSpecialNationality: true,
        },
      }],
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  // ── RTL direction for Arabic ──────────────────────────────────────────────

  it("applies rtl direction for Arabic language", () => {
    const { container } = render(
      <ViewPlotDetail plotIds={["1"]} language="ar" />
    );
    const rtlEl = container.querySelector('[style*="rtl"]') as HTMLElement;
    expect(rtlEl).toBeTruthy();
  });

  // ── plotTitle Arabic rendering ────────────────────────────────────────────

  it("renders Arabic plotTitle when language is ar", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        plotTitle="Plot Details"
        plotTitle_ar="تفاصيل القطعة"
        language="ar"
      />
    );
    expect(screen.getByText("تفاصيل القطعة")).toBeInTheDocument();
  });

  // ── Data as single object (not array) ─────────────────────────────────────

  it("handles single plot detail object (not wrapped in array)", () => {
    vi.mocked(useGetPlotDetail).mockReturnValue({
      data: mockPlotDetail,
      isPending: false,
    } as ReturnType<typeof useGetPlotDetail>);
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getAllByText("123 Main Street, Dubai").length).toBeGreaterThan(0);
  });

  // ── Owner MOI and archive fields ──────────────────────────────────────────

  it("renders MOI Unified Number", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("MOI Unified Number")).toBeInTheDocument();
    expect(screen.getByText("MOI-001")).toBeInTheDocument();
  });

  it("renders Archive Number", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="en"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("Archive Number")).toBeInTheDocument();
    expect(screen.getByText("ARCH-001")).toBeInTheDocument();
  });

  // ── Sector / community rendering ──────────────────────────────────────────

  it("renders Sector label and value", () => {
    render(<ViewPlotDetail plotIds={["1"]} language="en" />);
    expect(screen.getByText("Sector")).toBeInTheDocument();
    expect(screen.getByText("Sector 5")).toBeInTheDocument();
  });

  // ── View button in Arabic ─────────────────────────────────────────────────

  it("renders Arabic View button when language is ar", () => {
    render(
      <ViewPlotDetail
        plotIds={["1"]}
        language="ar"
        showOwnerDetails={true}
      />
    );
    expect(screen.getByText("منظر")).toBeInTheDocument();
  });
});
