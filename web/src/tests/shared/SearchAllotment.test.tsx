import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock sub-components to avoid deep rendering / hooks
vi.mock("@shared/components/SearchAllotment/searchByOwner", () => ({
  __esModule: true,
  default: (props: { onSubmit?: (v: unknown) => void; selected?: unknown[] }) => (
    <div data-testid="by-owner">
      <button
        data-testid="by-owner-submit"
        onClick={() => props.onSubmit?.([{ ownerId: "1" }])}
      >
        Submit Owner
      </button>
      {props.selected && props.selected.length > 0 && (
        <span data-testid="by-owner-selected">selected</span>
      )}
    </div>
  ),
}));

vi.mock("@shared/components/SearchAllotment/searchByCompanyOwner", () => ({
  __esModule: true,
  default: (props: { onSubmit?: (v: unknown) => void }) => (
    <div data-testid="by-company-owner">
      <button
        data-testid="by-company-submit"
        onClick={() => props.onSubmit?.([{ companyId: "1" }])}
      >
        Submit Company
      </button>
    </div>
  ),
}));

import SearchAllotment from "@shared/components/SearchAllotment/searchAllotment";

const defaultProps = {
  title: "Search Allotment",
  title_ar: "بحث عن التخصيص",
  subtitle: "Find your allotment",
  subtitle_ar: "ابحث عن التخصيص الخاص بك",
};

describe("SearchAllotment", () => {
  it("renders title", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByText("Search Allotment")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByText("Find your allotment")).toBeInTheDocument();
  });

  it("renders Arabic title when language=ar", () => {
    render(<SearchAllotment {...defaultProps} language="ar" />);
    expect(screen.getByText("بحث عن التخصيص")).toBeInTheDocument();
  });

  it("shows SearchByOwner by default (initialOwnerType=owner)", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });

  it("renders default owner type radio cards", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(screen.getByText("By Owner")).toBeInTheDocument();
    expect(screen.getByText("By Company Owner")).toBeInTheDocument();
  });

  it("renders Arabic radio card labels when language=ar", () => {
    render(<SearchAllotment {...defaultProps} language="ar" />);
    expect(screen.getByText("حسب المالك")).toBeInTheDocument();
    expect(screen.getByText("حسب مالك الشركة")).toBeInTheDocument();
  });

  it("switches to SearchByCompanyOwner when Company card clicked", () => {
    render(<SearchAllotment {...defaultProps} />);
    fireEvent.click(screen.getByText("By Company Owner"));
    expect(screen.getByTestId("by-company-owner")).toBeInTheDocument();
  });

  it("switches back to SearchByOwner after switching to company", () => {
    render(<SearchAllotment {...defaultProps} />);
    fireEvent.click(screen.getByText("By Company Owner"));
    expect(screen.getByTestId("by-company-owner")).toBeInTheDocument();
    fireEvent.click(screen.getByText("By Owner"));
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });

  it("starts on company when initialOwnerType='company'", () => {
    render(<SearchAllotment {...defaultProps} initialOwnerType="company" />);
    expect(screen.getByTestId("by-company-owner")).toBeInTheDocument();
  });

  it("calls onSubmit when SearchByOwner submits", () => {
    const onSubmit = vi.fn();
    render(<SearchAllotment {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByTestId("by-owner-submit"));
    expect(onSubmit).toHaveBeenCalledWith([{ ownerId: "1" }]);
  });

  it("calls onSubmit when SearchByCompanyOwner submits", () => {
    const onSubmit = vi.fn();
    render(<SearchAllotment {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("By Company Owner"));
    fireEvent.click(screen.getByTestId("by-company-submit"));
    expect(onSubmit).toHaveBeenCalledWith([{ companyId: "1" }]);
  });

  it("passes selected prop to SearchByOwner", () => {
    render(
      <SearchAllotment {...defaultProps} selected={[{ familyBookNumber: "1" }] as any} />
    );
    expect(screen.getByTestId("by-owner-selected")).toBeInTheDocument();
  });

  it("hides tabs when showTabs=false", () => {
    render(<SearchAllotment {...defaultProps} showTabs={false} />);
    expect(screen.queryByText("By Owner")).not.toBeInTheDocument();
    expect(screen.queryByText("By Company Owner")).not.toBeInTheDocument();
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });

  it("renders custom ownerTypeOptions labels", () => {
    render(
      <SearchAllotment
        {...defaultProps}
        ownerTypeOptions={{
          company: "Corp",
          company_ar: "شركة",
          owner: "Person",
          owner_ar: "شخص",
        }}
      />
    );
    expect(screen.getByText("Corp")).toBeInTheDocument();
    expect(screen.getByText("Person")).toBeInTheDocument();
  });

  it("renders without title or subtitle", () => {
    const { container } = render(<SearchAllotment />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText("Search Allotment")).not.toBeInTheDocument();
  });

  it("renders with mobile platform", () => {
    render(<SearchAllotment {...defaultProps} platform="mobile" />);
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });

  it("uses default onSubmit without throwing when none provided", () => {
    render(<SearchAllotment {...defaultProps} />);
    expect(() =>
      fireEvent.click(screen.getByTestId("by-owner-submit"))
    ).not.toThrow();
  });

  it("ignores invalid radio id (handleOwnerTypeChange no-op)", () => {
    render(<SearchAllotment {...defaultProps} />);
    // Clicking the already-active Owner card keeps owner view rendered
    fireEvent.click(screen.getByText("By Owner"));
    expect(screen.getByTestId("by-owner")).toBeInTheDocument();
  });
});
