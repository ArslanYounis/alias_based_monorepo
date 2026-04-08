/**
 * Tests for the shared CardRow component.
 *
 * Buttons, Fields, and icon components are mocked to avoid deep dependency chains.
 * All RowVariant types are exercised.
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
      title_ar,
      language,
      onClick,
      testID,
    }: {
      title?: string;
      title_ar?: string;
      language?: string;
      onClick?: () => void;
      testID?: string;
    }) =>
      React.createElement(
        TouchableOpacity,
        { onPress: onClick, testID: testID || `btn-${title || "no-title"}` },
        React.createElement(Text, null, language === "ar" ? title_ar || title : title)
      ),
  };
});

// ── Mock Fields ──────────────────────────────────────────────────────────
jest.mock("@platform/Fields", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Fields: ({ value, type }: { value?: string; type?: string }) =>
      React.createElement(
        View,
        { testID: `field-${type || "text"}` },
        React.createElement(Text, null, value)
      ),
  };
});

// ── Mock icons ────────────────────────────────────────────────────────────
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ChevronDownIcon: ({ size }: { size?: number }) =>
      React.createElement(View, { testID: "chevron-down" }),
    ChevronUpIcon: ({ size }: { size?: number }) =>
      React.createElement(View, { testID: "chevron-up" }),
  };
});

import CardRow from "@shared/components/CardRow/CardRow";

describe("CardRow (shared component)", () => {
  // ── default variant ───────────────────────────────────────────────────────

  it("renders without crashing (default variant)", () => {
    render(<CardRow label="Owner" value="John" />);
  });

  it("renders label and value in default variant", () => {
    render(<CardRow label="Owner" value="John Smith" />);
    expect(screen.getByText("Owner")).toBeTruthy();
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  it("renders Arabic label and value in default variant", () => {
    render(
      <CardRow
        label="Owner"
        label_ar="المالك"
        value="John"
        value_ar="جون"
        language="ar"
      />
    );
    expect(screen.getByText("المالك")).toBeTruthy();
    expect(screen.getByText("جون")).toBeTruthy();
  });

  it("renders empty value gracefully in default variant", () => {
    expect(() =>
      render(<CardRow label="Owner" value="" />)
    ).not.toThrow();
  });

  // ── defaultNoBorder variant ───────────────────────────────────────────────

  it("renders without crashing (defaultNoBorder variant)", () => {
    render(
      <CardRow label="Plot No" value="123" rowVariant="defaultNoBorder" />
    );
    expect(screen.getByText("Plot No")).toBeTruthy();
    expect(screen.getByText("123")).toBeTruthy();
  });

  // ── bottom variant ────────────────────────────────────────────────────────

  it("renders without crashing (bottom variant)", () => {
    render(
      <CardRow
        label="Community"
        value="Al Ain"
        rowVariant="bottom"
        extraItems={[{ label: "District", value: "Zone 1" }]}
      />
    );
    expect(screen.getByText("Community")).toBeTruthy();
    expect(screen.getByText("Al Ain")).toBeTruthy();
  });

  it("renders extra items in bottom variant", () => {
    render(
      <CardRow
        label="Community"
        value="Al Ain"
        rowVariant="bottom"
        extraItems={[{ label: "District", value: "Zone 1" }]}
      />
    );
    expect(screen.getByText("District")).toBeTruthy();
    expect(screen.getByText("Zone 1")).toBeTruthy();
  });

  // ── field variant ─────────────────────────────────────────────────────────

  it("renders a field input in field variant", () => {
    render(
      <CardRow
        label="Name"
        value="John"
        rowVariant="field"
        fieldType="text"
        inputProps={{ onChange: jest.fn() }}
      />
    );
    expect(screen.getByTestId("field-text")).toBeTruthy();
  });

  it("renders multiple field items in field variant", () => {
    render(
      <CardRow
        label="Name"
        value="John"
        rowVariant="field"
        extraItems={[{ label: "Email", value: "j@test.com", fieldType: "text" }]}
      />
    );
    const fields = screen.getAllByTestId("field-text");
    expect(fields.length).toBeGreaterThanOrEqual(2);
  });

  // ── rowImage variant ──────────────────────────────────────────────────────

  it("renders label/value pairs in rowImage variant", () => {
    render(
      <CardRow
        label="Plot Area"
        value="500 sqm"
        rowVariant="rowImage"
        extraItems={[
          { label: "Land Use", value: "Residential" },
          { label: "District", value: "Central" },
        ]}
      />
    );
    expect(screen.getByText("Plot Area")).toBeTruthy();
    expect(screen.getByText("500 sqm")).toBeTruthy();
  });

  // ── colButton variants ────────────────────────────────────────────────────

  it("renders 3colButton variant with label and 2 value columns", () => {
    render(
      <CardRow
        label="Owner"
        value="Col 1"
        rowVariant="3colButton"
        extraItems={[{ value: "Col 2" }]}
      />
    );
    expect(screen.getByText("Owner")).toBeTruthy();
  });

  it("renders button in 3colButton variant when button prop provided", () => {
    const onBtnClick = jest.fn();
    render(
      <CardRow
        label="Owner"
        value="Val"
        rowVariant="3colButton"
        extraItems={[{ value: "Col 2" }]}
        button={{ title: "Action", onClick: onBtnClick }}
      />
    );
    expect(screen.getByText("Action")).toBeTruthy();
  });

  it("calls button.onClick when button is pressed in 3colButton variant", () => {
    const onBtnClick = jest.fn();
    render(
      <CardRow
        label="Owner"
        value="Val"
        rowVariant="3colButton"
        extraItems={[{ value: "Col 2" }]}
        button={{ title: "Action", onClick: onBtnClick }}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Action"));
    expect(onBtnClick).toHaveBeenCalledTimes(1);
  });

  it("renders 4colButton variant without crashing", () => {
    render(
      <CardRow
        label="Label"
        value="V1"
        rowVariant="4colButton"
        extraItems={[{ value: "V2" }, { value: "V3" }]}
      />
    );
    expect(screen.getByText("Label")).toBeTruthy();
  });

  it("renders 5colButton variant without crashing", () => {
    render(
      <CardRow
        label="Label"
        value="V1"
        rowVariant="5colButton"
        extraItems={[{ value: "V2" }, { value: "V3" }, { value: "V4" }]}
      />
    );
    expect(screen.getByText("Label")).toBeTruthy();
  });

  it("renders 6colButton variant without crashing", () => {
    render(
      <CardRow
        label="Label"
        value="V1"
        rowVariant="6colButton"
        extraItems={[{ value: "V2" }, { value: "V3" }, { value: "V4" }, { value: "V5" }]}
      />
    );
    expect(screen.getByText("Label")).toBeTruthy();
  });

  // ── moreLink variant ──────────────────────────────────────────────────────

  it("renders 'Less' button when isMoreShown=true in moreLink variant", () => {
    render(
      <CardRow rowVariant="moreLink" isMoreShown={true} onToggleMore={jest.fn()} />
    );
    expect(screen.getByText("Less")).toBeTruthy();
  });

  it("renders 'More' button when isMoreShown=false in moreLink variant", () => {
    render(
      <CardRow rowVariant="moreLink" isMoreShown={false} onToggleMore={jest.fn()} />
    );
    expect(screen.getByText("More")).toBeTruthy();
  });

  it("renders Arabic 'أقل' when isMoreShown=true in moreLink variant with ar language", () => {
    render(
      <CardRow
        rowVariant="moreLink"
        isMoreShown={true}
        onToggleMore={jest.fn()}
        language="ar"
      />
    );
    expect(screen.getByText("أقل")).toBeTruthy();
  });

  it("renders Arabic 'أكثر' when isMoreShown=false in moreLink variant with ar language", () => {
    render(
      <CardRow
        rowVariant="moreLink"
        isMoreShown={false}
        onToggleMore={jest.fn()}
        language="ar"
      />
    );
    expect(screen.getByText("أكثر")).toBeTruthy();
  });

  it("calls onToggleMore when moreLink button is pressed", () => {
    const toggle = jest.fn();
    render(
      <CardRow rowVariant="moreLink" isMoreShown={true} onToggleMore={toggle} />
    );
    fireEvent.press(screen.getByTestId("btn-Less"));
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("renders with no props without crashing", () => {
    expect(() => render(<CardRow />)).not.toThrow();
  });

  it("renders Arabic value_ar when provided and language is 'ar'", () => {
    render(
      <CardRow
        label="Area"
        label_ar="المنطقة"
        value="Residential"
        value_ar="سكني"
        language="ar"
      />
    );
    expect(screen.getByText("سكني")).toBeTruthy();
  });
});
