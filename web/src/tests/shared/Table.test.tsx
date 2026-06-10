import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Table from "@shared/components/Table/Table";
import type {
  ApplicationData,
  ColumnDefinition,
} from "@shared/components/Table/Table";

const columns: ColumnDefinition[] = [
  { header: "Application", header_ar: "الطلب", accessorKey: "applicationTitle" },
  { header: "Status", header_ar: "الحالة", accessorKey: "status" },
  { header: "Date", header_ar: "التاريخ", accessorKey: "timeDate" },
];

const sampleData: ApplicationData[] = [
  {
    applicationTitle: "Land Registration",
    applicationTitle_ar: "تسجيل الأرض",
    location: "Dubai",
    location_ar: "دبي",
    timeDate: "2024-01-10",
    daysRemaining: "5 days",
    daysRemaining_ar: "5 أيام",
    id: "app-001",
    currentStep: 2,
    onCardClick: undefined,
    additionalColumns: [
      {
        action: "Under Review",
        action_ar: "قيد المراجعة",
        stepName: "Step 1",
        stepName_ar: "الخطوة 1",
        type: "action",
      },
    ],
  },
];

describe("Table (shared component – web platform)", () => {
  it("renders without crashing with no data", () => {
    render(<Table data={[]} columns={columns} language="en" />);
  });

  it("renders column headers for non-empty data in English", () => {
    render(<Table data={sampleData} columns={columns} language="en" />);
    expect(screen.getByText("Application")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders column headers in Arabic when language is 'ar'", () => {
    render(<Table data={sampleData} columns={columns} language="ar" />);
    expect(screen.getByText("الطلب")).toBeInTheDocument();
    expect(screen.getByText("الحالة")).toBeInTheDocument();
  });

  it("does not render headers when data is empty", () => {
    render(<Table data={[]} columns={columns} language="en" />);
    expect(screen.queryByText("Application")).not.toBeInTheDocument();
  });

  it("renders application title in English", () => {
    render(<Table data={sampleData} columns={columns} language="en" />);
    expect(screen.getByText("Land Registration")).toBeInTheDocument();
  });

  it("renders application title in Arabic", () => {
    render(<Table data={sampleData} columns={columns} language="ar" />);
    expect(screen.getByText("تسجيل الأرض")).toBeInTheDocument();
  });

  it("renders additional column cards", () => {
    render(<Table data={sampleData} columns={columns} language="en" />);
    expect(screen.getByText("Under Review")).toBeInTheDocument();
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("renders multiple rows", () => {
    const multiData: ApplicationData[] = [
      ...sampleData,
      {
        applicationTitle: "Road Permit",
        applicationTitle_ar: "تصريح طريق",
        location: "Abu Dhabi",
        location_ar: "أبوظبي",
        timeDate: "2024-02-01",
        daysRemaining: "3 days",
        id: "app-002",
        currentStep: 1,
        additionalColumns: [],
      },
    ];
    render(<Table data={multiData} columns={columns} language="en" />);
    expect(screen.getByText("Land Registration")).toBeInTheDocument();
    expect(screen.getByText("Road Permit")).toBeInTheDocument();
  });

  it("passes onCardClick to ApplicationCard without throwing", () => {
    const onClick = vi.fn();
    const dataWithClick = [{ ...sampleData[0], onCardClick: onClick }];
    // Just verify the component renders with onCardClick prop without crashing
    render(<Table data={dataWithClick} columns={columns} language="en" />);
    expect(screen.getByText("Land Registration")).toBeInTheDocument();
  });

  it("renders in mobile platform without crashing", () => {
    render(
      <Table data={sampleData} columns={columns} language="en" platform="mobile" />
    );
  });

  it("renders with undefined data (uses empty array)", () => {
    render(<Table data={undefined} columns={columns} language="en" />);
  });
});
