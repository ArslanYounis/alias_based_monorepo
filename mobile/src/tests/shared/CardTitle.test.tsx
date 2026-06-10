/**
 * Tests for the shared CardTitle component.
 *
 * Buttons and icon components are mocked to cut deep dependency chains.
 * All meaningful branches are exercised: variants, expandable, status,
 * buttons, description, bilingual support, and platform layout.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock Buttons ──────────────────────────────────────────────────────────
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({
      title,
      onClick,
      "aria-label": ariaLabel,
    }: {
      title?: string;
      onClick?: () => void;
      "aria-label"?: string;
    }) =>
      React.createElement(
        TouchableOpacity,
        { onPress: onClick, testID: "btn-" + (title || "icon") },
        React.createElement(Text, null, title)
      ),
  };
});

// ── Mock icons ────────────────────────────────────────────────────────────
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ChevronDownIcon: () => React.createElement(View, { testID: "chevron-down" }),
    ChevronUpIcon: () => React.createElement(View, { testID: "chevron-up" }),
  };
});

import CardTitle from "@shared/components/CardTitle/CardTitle";

const baseProps = {
  title: "Plot Information",
  title_ar: "معلومات القطعة",
};

describe("CardTitle (shared component)", () => {
  // ── Default rendering ─────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<CardTitle {...baseProps} />);
  });

  it("renders the English title by default", () => {
    render(<CardTitle {...baseProps} />);
    expect(screen.getByText("Plot Information")).toBeTruthy();
  });

  // ── Language switching ────────────────────────────────────────────────────

  it("renders Arabic title when language is 'ar'", () => {
    render(<CardTitle {...baseProps} language="ar" />);
    expect(screen.getByText("معلومات القطعة")).toBeTruthy();
  });

  it("falls back to title when title_ar is empty and language is 'ar'", () => {
    render(<CardTitle title="English" title_ar="" language="ar" />);
    expect(screen.getByText("English")).toBeTruthy();
  });

  // ── Variants ─────────────────────────────────────────────────────────────

  it("renders with 'large' variant without crashing", () => {
    render(<CardTitle {...baseProps} variant="large" />);
    expect(screen.getByText("Plot Information")).toBeTruthy();
  });

  it("renders with 'medium' variant without crashing", () => {
    render(<CardTitle {...baseProps} variant="medium" />);
    expect(screen.getByText("Plot Information")).toBeTruthy();
  });

  it("renders with 'small' variant without crashing", () => {
    render(<CardTitle {...baseProps} variant="small" />);
    expect(screen.getByText("Plot Information")).toBeTruthy();
  });

  // ── Description ───────────────────────────────────────────────────────────

  it("renders description when provided", () => {
    render(
      <CardTitle
        {...baseProps}
        description="Some description"
        description_ar="وصف"
      />
    );
    expect(screen.getByText("Some description")).toBeTruthy();
  });

  it("renders Arabic description when language is 'ar'", () => {
    render(
      <CardTitle
        {...baseProps}
        description="Description"
        description_ar="وصف"
        language="ar"
      />
    );
    expect(screen.getByText("وصف")).toBeTruthy();
  });

  // ── SubText ───────────────────────────────────────────────────────────────

  it("renders subText when provided", () => {
    render(<CardTitle {...baseProps} subText="Sub info" subText_ar="معلومات" />);
    expect(screen.getByText("Sub info")).toBeTruthy();
  });

  it("renders Arabic subText when language is 'ar'", () => {
    render(
      <CardTitle {...baseProps} subText="Sub info" subText_ar="معلومات" language="ar" />
    );
    expect(screen.getByText("معلومات")).toBeTruthy();
  });

  // ── Status badge ──────────────────────────────────────────────────────────

  it("renders status badge when status is provided", () => {
    render(<CardTitle {...baseProps} status="Pending" status_ar="قيد الانتظار" />);
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders Arabic status when language is 'ar'", () => {
    render(
      <CardTitle
        {...baseProps}
        status="Pending"
        status_ar="قيد الانتظار"
        language="ar"
      />
    );
    expect(screen.getByText("قيد الانتظار")).toBeTruthy();
  });

  // ── Expandable ────────────────────────────────────────────────────────────

  it("renders chevron-down when isExpandable=true and isExpanded=false (web platform)", () => {
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={false}
        platform="web"
      />
    );
    expect(screen.getByTestId("chevron-down")).toBeTruthy();
  });

  it("renders chevron-up when isExpandable=true and isExpanded=true (web platform)", () => {
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={true}
        platform="web"
      />
    );
    expect(screen.getByTestId("chevron-up")).toBeTruthy();
  });

  it("calls onToggleExpand when expand button is clicked (web)", () => {
    const onToggle = jest.fn();
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={false}
        onToggleExpand={onToggle}
        platform="web"
      />
    );
    // HTML <button> uses onClick; getByLabelText finds via aria-label
    const expandBtn = screen.getByLabelText("Expand");
    fireEvent(expandBtn, "click");
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleExpand when collapse button is clicked (web)", () => {
    const onToggle = jest.fn();
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={true}
        onToggleExpand={onToggle}
        platform="web"
      />
    );
    const collapseBtn = screen.getByLabelText("Collapse");
    fireEvent(collapseBtn, "click");
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders chevron-down expand toggle on mobile platform (Container, not Buttons)", () => {
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={false}
        platform="mobile"
      />
    );
    // On mobile the toggle is a Container wrapping ChevronDownIcon, not a Buttons.
    expect(screen.getByTestId("chevron-down")).toBeTruthy();
    expect(screen.queryByTestId("btn-icon")).toBeNull();
  });

  it("renders chevron-up collapse toggle on mobile platform when isExpanded=true", () => {
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={true}
        platform="mobile"
      />
    );
    expect(screen.getByTestId("chevron-up")).toBeTruthy();
    expect(screen.queryByTestId("btn-icon")).toBeNull();
  });

  it("calls default onToggleExpand when no handler is provided (covers default () => {} branch)", () => {
    render(
      <CardTitle
        {...baseProps}
        isExpandable={true}
        isExpanded={false}
        platform="web"
      />
    );
    // Click without providing onToggleExpand — calls the default () => {} handler
    const expandBtn = screen.getByLabelText("Expand");
    expect(() => fireEvent(expandBtn, "click")).not.toThrow();
  });

  it("does not render expand toggle when isExpandable is false", () => {
    render(<CardTitle {...baseProps} isExpandable={false} platform="web" />);
    expect(screen.queryByLabelText("Expand")).toBeNull();
    expect(screen.queryByLabelText("Collapse")).toBeNull();
  });

  // ── Buttons ───────────────────────────────────────────────────────────────

  it("renders buttons when showButtons=true and buttons provided", () => {
    render(
      <CardTitle
        {...baseProps}
        showButtons={true}
        buttons={[{ title: "Edit", type: "secondary" }]}
      />
    );
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("does not render buttons when showButtons=false", () => {
    render(
      <CardTitle
        {...baseProps}
        showButtons={false}
        buttons={[{ title: "Edit", type: "secondary" }]}
      />
    );
    expect(screen.queryByText("Edit")).toBeNull();
  });

  it("renders titleButtons when showTitleButtons=true and isExpandable=false", () => {
    render(
      <CardTitle
        {...baseProps}
        showTitleButtons={true}
        isExpandable={false}
        titleButtons={[{ title: "View", type: "primary" }]}
      />
    );
    expect(screen.getByText("View")).toBeTruthy();
  });

  it("does not render titleButtons when isExpandable=true", () => {
    render(
      <CardTitle
        {...baseProps}
        showTitleButtons={true}
        isExpandable={true}
        titleButtons={[{ title: "View", type: "primary" }]}
        platform="web"
      />
    );
    // titleButtons are hidden when isExpandable is true
    expect(screen.queryByText("View")).toBeNull();
  });

  // ── Description with subText ─────────────────────────────────────────────

  it("renders subText alongside description", () => {
    render(
      <CardTitle
        {...baseProps}
        description="Some description"
        description_ar="وصف"
        subText="Sub info"
        subText_ar="معلومات"
        language="en"
      />
    );
    expect(screen.getByText("Some description")).toBeTruthy();
    expect(screen.getByText("Sub info")).toBeTruthy();
  });

  it("renders Arabic description and subText when language is 'ar'", () => {
    render(
      <CardTitle
        {...baseProps}
        description="Description"
        description_ar="وصف"
        subText="Sub"
        subText_ar="فرعي"
        language="ar"
      />
    );
    expect(screen.getByText("وصف")).toBeTruthy();
    expect(screen.getByText("فرعي")).toBeTruthy();
  });

  // ── Buttons with mobileIcon on mobile platform ───────────────────────────

  it("renders buttons with mobileIcon on mobile platform", () => {
    render(
      <CardTitle
        {...baseProps}
        showButtons={true}
        platform="mobile"
        buttons={[
          {
            title: "Edit",
            type: "secondary",
            mobileIcon: { iconName: "Edit", iconColor: "#000", iconType: "lucide" },
          },
        ]}
      />
    );
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("renders titleButtons with mobileIcon on mobile platform", () => {
    render(
      <CardTitle
        {...baseProps}
        showTitleButtons={true}
        isExpandable={false}
        platform="mobile"
        titleButtons={[
          {
            title: "View",
            type: "primary",
            mobileIcon: { iconName: "Eye", iconColor: "#000", iconType: "lucide" },
          },
        ]}
      />
    );
    expect(screen.getByText("View")).toBeTruthy();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("does not throw without optional props", () => {
    expect(() =>
      render(<CardTitle title="Title" title_ar="عنوان" />)
    ).not.toThrow();
  });

  it("renders correctly without border when showBorder=false", () => {
    render(<CardTitle {...baseProps} showBorder={false} />);
    expect(screen.getByText("Plot Information")).toBeTruthy();
  });
});
