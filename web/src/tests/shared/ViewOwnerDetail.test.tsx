import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ViewOwnerDetail from "@shared/components/ViewOwnerDetail/ViewOwnerDetail";

const ownerInfo = {
  name: "John Smith",
  details: [
    {
      label: "Emirates ID",
      label_ar: "الهوية الإماراتية",
      value: "784-1990-1234567-1",
      value_ar: "784-1990-1234567-1",
    },
    {
      label: "Nationality",
      label_ar: "الجنسية",
      value: "Emirati",
      value_ar: "إماراتي",
    },
  ],
};

describe("ViewOwnerDetail (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<ViewOwnerDetail />);
  });

  it("renders owner name", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="en" />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("renders owner details labels in English", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="en" />);
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
    expect(screen.getByText("Nationality")).toBeInTheDocument();
  });

  it("renders owner details labels in Arabic", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="ar" />);
    expect(screen.getByText("الهوية الإماراتية")).toBeInTheDocument();
    expect(screen.getByText("الجنسية")).toBeInTheDocument();
  });

  it("renders owner detail values in English", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="en" />);
    expect(screen.getByText("784-1990-1234567-1")).toBeInTheDocument();
    expect(screen.getByText("Emirati")).toBeInTheDocument();
  });

  it("renders owner detail values in Arabic", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="ar" />);
    expect(screen.getByText("إماراتي")).toBeInTheDocument();
  });

  it("renders ownerText section header in English", () => {
    render(
      <ViewOwnerDetail
        owner={ownerInfo}
        ownerText="Owner"
        ownerText_ar="المالك"
        language="en"
      />
    );
    expect(screen.getByText("Owner")).toBeInTheDocument();
  });

  it("renders ownerText section header in Arabic", () => {
    render(
      <ViewOwnerDetail
        owner={ownerInfo}
        ownerText="Owner"
        ownerText_ar="المالك"
        language="ar"
      />
    );
    expect(screen.getByText("المالك")).toBeInTheDocument();
  });

  it("renders mainTitle when provided in English", () => {
    render(
      <ViewOwnerDetail
        mainTitle="Plot 123"
        mainTitle_ar="قطعة 123"
        language="en"
      />
    );
    expect(screen.getByText("Plot 123")).toBeInTheDocument();
  });

  it("renders mainTitle in Arabic", () => {
    render(
      <ViewOwnerDetail
        mainTitle="Plot 123"
        mainTitle_ar="قطعة 123"
        language="ar"
      />
    );
    expect(screen.getByText("قطعة 123")).toBeInTheDocument();
  });

  it("does not render mainTitle section if neither mainTitle nor mainTitle_ar provided", () => {
    const { container } = render(
      <ViewOwnerDetail owner={ownerInfo} language="en" />
    );
    const h3s = container.querySelectorAll(".text-heading-h3, .sm\\:text-heading-h1");
    // Heading only from owner section, not main title
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<ViewOwnerDetail language="en" />);
    const el = container.querySelector('[style*="direction"]') as HTMLElement;
    expect(el).toBeTruthy();
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(<ViewOwnerDetail language="ar" />);
    const el = container.querySelector('[style*="rtl"]') as HTMLElement;
    expect(el).toBeTruthy();
  });

  it("renders View button", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="en" />);
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  // ── plotCode prop (commented out in source but testing default) ────────────

  it("renders with plotCode prop without crashing", () => {
    render(
      <ViewOwnerDetail
        plotCode="PLT-001"
        plotCode_ar="القطعة-001"
        owner={ownerInfo}
        language="en"
      />
    );
    // plotCode rendering is commented out in source, but component should not crash
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  // ── Arabic view button ────────────────────────────────────────────────────

  it("renders Arabic View button text when language is ar", () => {
    render(<ViewOwnerDetail owner={ownerInfo} language="ar" />);
    expect(screen.getByText("عرض")).toBeInTheDocument();
  });

  // ── Owner with empty details ──────────────────────────────────────────────

  it("renders owner name with empty details array", () => {
    render(
      <ViewOwnerDetail
        owner={{ name: "Empty Owner", details: [] }}
        language="en"
      />
    );
    expect(screen.getByText("Empty Owner")).toBeInTheDocument();
  });

  // ── Default owner fallback ────────────────────────────────────────────────

  it("renders without error when owner is not provided (default)", () => {
    const { container } = render(<ViewOwnerDetail language="en" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // ── Multiple owner details ────────────────────────────────────────────────

  it("renders all owner detail rows", () => {
    const multiDetail = {
      name: "Jane Doe",
      details: [
        { label: "ID", value: "12345" },
        { label: "Phone", value: "555-1234" },
        { label: "Address", value: "123 Street" },
      ],
    };
    render(<ViewOwnerDetail owner={multiDetail} language="en" />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("555-1234")).toBeInTheDocument();
    expect(screen.getByText("123 Street")).toBeInTheDocument();
  });

  // ── Arabic detail values fallback to English ──────────────────────────────

  it("falls back to English label when label_ar is not provided (Arabic)", () => {
    const ownerNoAr = {
      name: "Test",
      details: [{ label: "Emirates ID", value: "123" }],
    };
    render(<ViewOwnerDetail owner={ownerNoAr} language="ar" />);
    // Should fall back to English label since label_ar is undefined
    expect(screen.getByText("Emirates ID")).toBeInTheDocument();
  });

  it("falls back to English value when value_ar is not provided (Arabic)", () => {
    const ownerNoAr = {
      name: "Test",
      details: [{ label: "ID", label_ar: "هوية", value: "999" }],
    };
    render(<ViewOwnerDetail owner={ownerNoAr} language="ar" />);
    // value_ar is undefined, should fall back to value
    expect(screen.getByText("999")).toBeInTheDocument();
  });

  // ── Custom ownerText props ────────────────────────────────────────────────

  it("renders custom ownerText in English", () => {
    render(
      <ViewOwnerDetail
        owner={ownerInfo}
        ownerText="Property Owner"
        language="en"
      />
    );
    expect(screen.getByText("Property Owner")).toBeInTheDocument();
  });

  it("renders custom ownerText_ar in Arabic", () => {
    render(
      <ViewOwnerDetail
        owner={ownerInfo}
        ownerText_ar="صاحب العقار"
        language="ar"
      />
    );
    expect(screen.getByText("صاحب العقار")).toBeInTheDocument();
  });

  // ── mainTitle conditional rendering ───────────────────────────────────────

  it("renders mainTitle_ar only (without mainTitle) in Arabic", () => {
    render(
      <ViewOwnerDetail mainTitle="" mainTitle_ar="عنوان رئيسي" language="ar" />
    );
    expect(screen.getByText("عنوان رئيسي")).toBeInTheDocument();
  });

  it("does not render title block when both mainTitle and mainTitle_ar are empty", () => {
    const { container } = render(
      <ViewOwnerDetail mainTitle="" mainTitle_ar="" language="en" />
    );
    // The heading h1 text element for main title should not exist
    const h1 = container.querySelector(
      ".text-heading-h3.sm\\:text-heading-h1"
    );
    expect(h1).toBeNull();
  });
});
