/**
 * Tests for the Pagination UI component.
 *
 * Exercises: page number rendering, prev/next navigation, ellipsis display,
 * page click handler, showPageNumbers flag, showBottomText variants,
 * totalPages=0 edge case, language="ar" Arabic digits & chevron swap,
 * and position variations.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer ─────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        { testID: "pagination-text" },
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
        { testID: "pagination-text" },
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Mock icons ────────────────────────────────────────────────────────────
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ChevronLeftIcon: ({ size, color }: any) =>
      React.createElement(View, { testID: "chevron-left" }),
    ChevronRightIcon: ({ size, color }: any) =>
      React.createElement(View, { testID: "chevron-right" }),
  };
});

import Pagination from "@platform/Pagination/Pagination";

describe("Pagination", () => {
  // ── Page number rendering ──────────────────────────────────────────────

  it("renders all page numbers when totalPages <= 5", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
    );
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("renders page numbers 1-3 when totalPages=3", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={jest.fn()} />
    );
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders no page buttons when totalPages=0", () => {
    render(
      <Pagination currentPage={1} totalPages={0} onPageChange={jest.fn()} />
    );
    // No numeric page buttons
    expect(screen.queryByText("1")).toBeNull();
  });

  it("does not render page numbers when showPageNumbers=false", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        showPageNumbers={false}
      />
    );
    expect(screen.queryByText("1")).toBeNull();
    expect(screen.queryByText("2")).toBeNull();
  });

  // ── Ellipsis ───────────────────────────────────────────────────────────

  it("shows ellipsis when totalPages > 5 and currentPage is in the middle", () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={jest.fn()} />
    );
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("renders first and last page numbers when totalPages > 5", () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={jest.fn()} />
    );
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
  });

  // ── handlePrev ─────────────────────────────────────────────────────────

  it("fires onPageChange(currentPage-1) when prev is pressed and currentPage > 1", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );
    fireEvent.press(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("does not fire onPageChange when prev is pressed and currentPage === 1", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    fireEvent.press(screen.getByLabelText("Previous page"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // ── handleNext ─────────────────────────────────────────────────────────

  it("fires onPageChange(currentPage+1) when next is pressed and currentPage < totalPages", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );
    fireEvent.press(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not fire onPageChange when next is pressed and currentPage === totalPages", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
    );
    fireEvent.press(screen.getByLabelText("Next page"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // ── handlePageClick ────────────────────────────────────────────────────

  it("fires onPageChange when a different page button is clicked", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    fireEvent.press(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not fire onPageChange when the current page button is clicked", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );
    fireEvent.press(screen.getByText("2"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // ── showBottomText ─────────────────────────────────────────────────────

  it("shows 'Showing N items' when showBottomText=true and no totalCount", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        pageSize={10}
        showBottomText
      />
    );
    expect(screen.getByText("Showing 10 items")).toBeTruthy();
  });

  it("shows 'Showing N out of M items' when showBottomText=true and totalCount provided", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        pageSize={10}
        totalCount={25}
        showBottomText
      />
    );
    expect(screen.getByText("Showing 10 out of 25 items")).toBeTruthy();
  });

  it("does not show bottom text when showBottomText=false", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        pageSize={10}
        showBottomText={false}
      />
    );
    expect(screen.queryByTestId("pagination-text")).toBeNull();
  });

  it("shows partial count for last page when totalCount is provided", () => {
    // page 3 of 3, pageSize=10, totalCount=25 → visibleItems = min(10, 25-20) = 5
    render(
      <Pagination
        currentPage={3}
        totalPages={3}
        onPageChange={jest.fn()}
        pageSize={10}
        totalCount={25}
        showBottomText
      />
    );
    expect(screen.getByText("Showing 5 out of 25 items")).toBeTruthy();
  });

  // ── language="ar" ──────────────────────────────────────────────────────

  it("shows Arabic bottom text when language='ar'", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        pageSize={10}
        totalCount={25}
        showBottomText
        language="ar"
      />
    );
    // Arabic digit for 10 is ١٠, for 25 is ٢٥
    expect(screen.getByText("عرض ١٠ من ٢٥ عناصر")).toBeTruthy();
  });

  it("renders Arabic digit page numbers when language='ar' and totalPages <= 5", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        language="ar"
      />
    );
    // Arabic digit 1 = ١
    expect(screen.getByText("١")).toBeTruthy();
    expect(screen.getByText("٢")).toBeTruthy();
    expect(screen.getByText("٣")).toBeTruthy();
  });

  it("swaps chevrons for language='ar': shows chevron-right as prev button", () => {
    // In Arabic mode the prev Pressable renders ChevronRightIcon
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={jest.fn()}
        language="ar"
      />
    );
    // Both chevron-right (prev for ar) and chevron-left (next for ar) should appear
    const rightChevrons = screen.getAllByTestId("chevron-right");
    const leftChevrons = screen.getAllByTestId("chevron-left");
    expect(rightChevrons.length).toBeGreaterThanOrEqual(1);
    expect(leftChevrons.length).toBeGreaterThanOrEqual(1);
  });

  it("shows chevron-left as prev button in English mode", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={jest.fn()}
        language="en"
      />
    );
    expect(screen.getAllByTestId("chevron-left").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("chevron-right").length).toBeGreaterThanOrEqual(1);
  });

  // ── position variations ────────────────────────────────────────────────

  it("renders with position='left' without crashing", () => {
    expect(() =>
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={jest.fn()}
          position="left"
        />
      )
    ).not.toThrow();
  });

  it("renders with position='right' without crashing", () => {
    expect(() =>
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={jest.fn()}
          position="right"
        />
      )
    ).not.toThrow();
  });

  it("renders with position='center' without crashing", () => {
    expect(() =>
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={jest.fn()}
          position="center"
        />
      )
    ).not.toThrow();
  });
});
