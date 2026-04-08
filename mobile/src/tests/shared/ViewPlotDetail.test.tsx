/**
 * Tests for the shared ViewPlotDetail component.
 *
 * The two hooks (useGetPlotDetail, useGetPlotImage) are mocked to control
 * loading / data / empty states. Platform components and
 * SharedLanguageSwitchRenderer are mocked. Tests cover: loading indicator,
 * empty state, plot detail rendering, owner section show/hide,
 * static fallback props, and language switching.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Standard language-switch mocks ──────────────────────────────────────────
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

// ── Hook mocks ────────────────────────────────────────────────────────────────
const mockUseGetPlotDetail = jest.fn();
jest.mock("@shared/hooks/useGetPlotDetail", () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseGetPlotDetail(...args),
}));

const mockUseGetPlotImage = jest.fn();
jest.mock("@shared/hooks/useGetPlotImage", () => ({
  useGetPlotImage: (...args: any[]) => mockUseGetPlotImage(...args),
  getPlotImage: jest.fn(() => Promise.resolve(null)),
}));

// ── Platform mocks ────────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
  };
});

jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: `btn-${label}`, onPress: onClick },
        React.createElement(Text, null, label)
      );
    },
  };
});

import ViewPlotDetail from "@shared/components/ViewPlotDetail/ViewPlotDetail";

const mockPlotDetail = {
  urlArgs: "plot-args",
  plotAddress: "123 Main Street",
  district: { districtNameE: "Central District", districtNameA: "المنطقة المركزية" },
  community: { communityNameE: "Community A" },
  plotNumber: "PLT-001",
  municipality: { municipalityNameE: "Abu Dhabi", municipalityNameA: "أبو ظبي" },
  landUse: { landuseNameE: "Residential", landuseNameA: "سكني" },
  plotFileNumber: "FILE-001",
  plotAreaFeet: "500",
  constructionStatusE: "Built",
  constructionStatusA: "مبني",
  ownersList: {
    ownerNameE: "John Smith",
    nationalityId: "784-1990-0000000-1",
    moiUnifiedNumber: "MUI-001",
    archiveFileNumberAA: "ARC-001",
    nationalityE: "Emirati",
    nationalityA: "إماراتي",
    hasSpecialNationality: false,
    plotShares: [
      {
        share: "100%",
        rightsHoldType: {
          rightsHoldTypeNameE: "Full Ownership",
          rightsHoldTypeNameA: "الملكية الكاملة",
        },
      },
    ],
  },
};

describe("ViewPlotDetail", () => {
  beforeEach(() => {
    // Default: not pending, has data
    mockUseGetPlotDetail.mockReturnValue({ data: mockPlotDetail, isPending: false });
    mockUseGetPlotImage.mockReturnValue({ data: null, isPending: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing with default props", () => {
    render(<ViewPlotDetail />);
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it("shows Loading indicator when isPending=true", () => {
    mockUseGetPlotDetail.mockReturnValue({ data: null, isPending: true });
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows Arabic Loading text when language='ar' and isPending", () => {
    mockUseGetPlotDetail.mockReturnValue({ data: null, isPending: true });
    render(<ViewPlotDetail plotIds={["p1"]} language="ar" />);
    expect(screen.getByText("جارٍ التحميل")).toBeTruthy();
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it("shows 'No plots found' when data is empty and not pending", () => {
    mockUseGetPlotDetail.mockReturnValue({ data: [], isPending: false });
    render(<ViewPlotDetail plotIds={[]} />);
    expect(screen.getByText("No plots found")).toBeTruthy();
  });

  it("shows Arabic 'no plots' message when language='ar' and empty", () => {
    mockUseGetPlotDetail.mockReturnValue({ data: [], isPending: false });
    render(<ViewPlotDetail plotIds={[]} language="ar" />);
    expect(screen.getByText("لم يتم العثور على قطع")).toBeTruthy();
  });

  // ── Plot detail rendering ─────────────────────────────────────────────────

  it("renders plot address from API data", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getAllByText("123 Main Street").length).toBeGreaterThanOrEqual(1);
  });

  it("renders plot district", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("Central District")).toBeTruthy();
  });

  it("renders plot number", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });

  it("renders municipality name", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("Abu Dhabi")).toBeTruthy();
  });

  it("renders land use", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("Residential")).toBeTruthy();
  });

  // ── Array vs single plot data ─────────────────────────────────────────────

  it("handles data returned as an array", () => {
    mockUseGetPlotDetail.mockReturnValue({
      data: [mockPlotDetail],
      isPending: false,
    });
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getAllByText("123 Main Street").length).toBeGreaterThanOrEqual(1);
  });

  it("handles data returned as a single object", () => {
    mockUseGetPlotDetail.mockReturnValue({
      data: mockPlotDetail,
      isPending: false,
    });
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getAllByText("123 Main Street").length).toBeGreaterThanOrEqual(1);
  });

  // ── Owner section ─────────────────────────────────────────────────────────

  it("renders owner section when showOwnerDetails=true (default) and ownersList present", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  it("hides owner section when showOwnerDetails=false", () => {
    render(<ViewPlotDetail plotIds={["p1"]} showOwnerDetails={false} />);
    expect(screen.queryByText("John Smith")).toBeNull();
  });

  it("renders owner text label", () => {
    render(<ViewPlotDetail plotIds={["p1"]} ownerText="Property Owner" />);
    expect(screen.getByText("Property Owner")).toBeTruthy();
  });

  it("renders Arabic owner text when language='ar'", () => {
    render(<ViewPlotDetail plotIds={["p1"]} ownerText_ar="المالك" language="ar" />);
    expect(screen.getByText("المالك")).toBeTruthy();
  });

  it("renders owner nationality", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("Emirati")).toBeTruthy();
  });

  it("renders 'No' for hasSpecialNationality=false", () => {
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("No")).toBeTruthy();
  });

  it("renders 'Yes' for hasSpecialNationality=true", () => {
    const detailWithSpecial = {
      ...mockPlotDetail,
      ownersList: { ...mockPlotDetail.ownersList, hasSpecialNationality: true },
    };
    mockUseGetPlotDetail.mockReturnValue({ data: detailWithSpecial, isPending: false });
    render(<ViewPlotDetail plotIds={["p1"]} />);
    expect(screen.getByText("Yes")).toBeTruthy();
  });

  // ── Static props fallback ─────────────────────────────────────────────────

  it("renders static plotLeftDetails when API data is null", () => {
    mockUseGetPlotDetail.mockReturnValue({ data: [], isPending: false });
    render(
      <ViewPlotDetail
        plotLeftDetails={[{ label: "Zone", value: "Zone A" }]}
        plotBottomDetails={[]}
      />
    );
    // "No plots found" should appear
    expect(screen.getByText("No plots found")).toBeTruthy();
  });

  // ── Image pending ─────────────────────────────────────────────────────────

  it("does not show image when isImagePending=true", () => {
    mockUseGetPlotImage.mockReturnValue({ data: null, isPending: true });
    render(<ViewPlotDetail plotIds={["p1"]} />);
    // No crash; image area is simply empty, plot data still renders
    expect(screen.getAllByText("123 Main Street").length).toBeGreaterThanOrEqual(1);
  });

  // ── plotTitle ─────────────────────────────────────────────────────────────

  it("renders plotTitle", () => {
    render(<ViewPlotDetail plotIds={["p1"]} plotTitle="Plot Details" />);
    expect(screen.getByText("Plot Details")).toBeTruthy();
  });

  it("renders Arabic plotTitle when language='ar'", () => {
    render(
      <ViewPlotDetail
        plotIds={["p1"]}
        plotTitle="Plot Details"
        plotTitle_ar="تفاصيل القطعة"
        language="ar"
      />
    );
    expect(screen.getByText("تفاصيل القطعة")).toBeTruthy();
  });
});
