/**
 * Tests for the shared GenericCard component.
 *
 * CardTitle, CardRow, Buttons, and UploadDocument are mocked to cut deep
 * dependency chains. All major branches are exercised: expand/collapse,
 * showMoreButton, hasDocuments, showFooterButtons, and language switching.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock CardTitle ─────────────────────────────────────────────────────────
jest.mock("@shared/components/CardTitle/CardTitle", () => {
  const React = require("react");
  const { TouchableOpacity, Text, View } = require("react-native");
  return {
    __esModule: true,
    default: ({
      title,
      title_ar,
      language,
      isExpandable,
      isExpanded,
      onToggleExpand,
    }: {
      title?: string;
      title_ar?: string;
      language?: string;
      isExpandable?: boolean;
      isExpanded?: boolean;
      onToggleExpand?: () => void;
    }) =>
      React.createElement(
        View,
        { testID: "card-title" },
        React.createElement(
          Text,
          null,
          language === "ar" ? title_ar || title : title
        ),
        isExpandable
          ? React.createElement(
              TouchableOpacity,
              { testID: "toggle-expand", onPress: onToggleExpand },
              React.createElement(Text, null, isExpanded ? "Collapse" : "Expand")
            )
          : null
      ),
  };
});

// ── Mock CardRow ──────────────────────────────────────────────────────────
jest.mock("@shared/components/CardRow/CardRow", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({
      label,
      value,
      rowVariant,
      isMoreShown,
      onToggleMore,
    }: {
      label?: string;
      value?: string;
      rowVariant?: string;
      isMoreShown?: boolean;
      onToggleMore?: () => void;
    }) => {
      const { TouchableOpacity } = require("react-native");
      if (rowVariant === "moreLink") {
        return React.createElement(
          TouchableOpacity,
          { testID: "more-link", onPress: onToggleMore },
          React.createElement(Text, null, isMoreShown ? "Less" : "More")
        );
      }
      return React.createElement(
        View,
        { testID: `card-row-${label || "row"}` },
        React.createElement(Text, null, label),
        React.createElement(Text, null, value)
      );
    },
  };
});

// ── Mock Buttons ──────────────────────────────────────────────────────────
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({
      title,
      onClick,
    }: {
      title?: string;
      onClick?: () => void;
    }) =>
      React.createElement(
        TouchableOpacity,
        { testID: `btn-${title || "no-title"}`, onPress: onClick },
        React.createElement(Text, null, title)
      ),
  };
});

// ── Mock UploadDocument ───────────────────────────────────────────────────
jest.mock("@platform/UploadDocument", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    UploadDocument: ({ documentName }: { documentName?: string }) =>
      React.createElement(
        View,
        { testID: "upload-document" },
        React.createElement(Text, null, documentName)
      ),
  };
});

import GenericCard from "@shared/components/GenericCard/GenericCard";

const basicRows = [
  { label: "Owner", value: "John Smith" },
  { label: "Plot No", value: "ABC-123" },
  { label: "Area", value: "500 sqm" },
  { label: "District", value: "Central" },
];

describe("GenericCard (shared component)", () => {
  // ── Default rendering ─────────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<GenericCard title="Plot Info" title_ar="معلومات القطعة" rowsData={[]} />);
  });

  it("renders the card title", () => {
    render(<GenericCard title="Plot Info" title_ar="معلومات القطعة" rowsData={[]} />);
    expect(screen.getByText("Plot Info")).toBeTruthy();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(
      <GenericCard
        title="Plot Info"
        title_ar="معلومات القطعة"
        rowsData={[]}
        language="ar"
      />
    );
    expect(screen.getByText("معلومات القطعة")).toBeTruthy();
  });

  it("renders row data", () => {
    render(
      <GenericCard
        title="Plot Info"
        title_ar="معلومات القطعة"
        rowsData={basicRows}
      />
    );
    expect(screen.getByText("Owner")).toBeTruthy();
    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  // ── Title section ─────────────────────────────────────────────────────────

  it("hides title section when showTitleSection=false", () => {
    render(
      <GenericCard
        title="Plot Info"
        title_ar="معلومات القطعة"
        rowsData={[]}
        showTitleSection={false}
      />
    );
    expect(screen.queryByTestId("card-title")).toBeNull();
  });

  // ── Expand / collapse (internal toggle) ──────────────────────────────────

  it("starts expanded by default (internal toggle)", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        isExpandable={true}
        handleToggleInternally={true}
      />
    );
    // Should show rows (expanded state)
    expect(screen.getByText("Owner")).toBeTruthy();
  });

  it("collapses and shows collapsed container when toggled (internal toggle)", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        isExpandable={true}
        handleToggleInternally={true}
      />
    );
    // Toggle to collapse
    fireEvent.press(screen.getByTestId("toggle-expand"));
    // In collapsed state, CardRow should not be shown (collapsed container shows label/value text)
    expect(screen.queryByTestId("card-row-Owner")).toBeNull();
  });

  it("uses external isExpanded when handleToggleInternally=false", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        isExpandable={true}
        handleToggleInternally={false}
        isExpanded={false}
        onToggleExpand={jest.fn()}
      />
    );
    // Collapsed: rows not shown, collapsed container shown
    expect(screen.queryByTestId("card-row-Owner")).toBeNull();
  });

  it("calls external onToggleExpand when handleToggleInternally=false", () => {
    const onToggle = jest.fn();
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        isExpandable={true}
        handleToggleInternally={false}
        isExpanded={true}
        onToggleExpand={onToggle}
      />
    );
    fireEvent.press(screen.getByTestId("toggle-expand"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  // ── Collapsed container label/value ──────────────────────────────────────

  it("shows cardTitleLabel and cardTitleValue in collapsed container", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        handleToggleInternally={false}
        isExpanded={false}
        cardTitleLabel="Summary"
        cardTitleValue="Plot ABC"
      />
    );
    // "Summary" appears in both CardTitle mock and collapsed container text
    expect(screen.getAllByText("Summary").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Plot ABC")).toBeTruthy();
  });

  // ── showMoreButton ────────────────────────────────────────────────────────

  it("shows only 3 rows when showMoreButton=true and isMoreShown starts false", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        showMoreButton={true}
        defaultShowMore={false}
      />
    );
    // Only first 3 rows visible
    expect(screen.getByTestId("card-row-Owner")).toBeTruthy();
    expect(screen.queryByTestId("card-row-District")).toBeNull();
  });

  it("shows all rows after clicking More link", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        showMoreButton={true}
        defaultShowMore={false}
      />
    );
    fireEvent.press(screen.getByTestId("more-link"));
    expect(screen.getByTestId("card-row-District")).toBeTruthy();
  });

  it("shows all rows when defaultShowMore=true", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={basicRows}
        showMoreButton={true}
        defaultShowMore={true}
      />
    );
    expect(screen.getByTestId("card-row-District")).toBeTruthy();
  });

  // ── Documents section ─────────────────────────────────────────────────────

  it("renders documents when hasDocuments=true and documents provided", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        hasDocuments={true}
        documents={[
          {
            id: "doc1",
            documentName: "Title Deed",
            isUploaded: true,
          },
        ]}
      />
    );
    expect(screen.getByTestId("upload-document")).toBeTruthy();
    expect(screen.getByText("Title Deed")).toBeTruthy();
  });

  it("does not render documents section when hasDocuments=false", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        hasDocuments={false}
        documents={[{ id: "doc1", documentName: "Title Deed", isUploaded: true }]}
      />
    );
    expect(screen.queryByTestId("upload-document")).toBeNull();
  });

  it("does not render documents when documents array is empty", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        hasDocuments={true}
        documents={[]}
      />
    );
    expect(screen.queryByTestId("upload-document")).toBeNull();
  });

  // ── Buttons ───────────────────────────────────────────────────────────────

  it("renders footer buttons when showFooterButtons=true", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        showFooterButtons={true}
        footerButton={[{ title: "Submit", type: "primary" }]}
      />
    );
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  it("does not render footer buttons when showFooterButtons=false", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        showFooterButtons={false}
        footerButton={[{ title: "Submit", type: "primary" }]}
      />
    );
    expect(screen.queryByText("Submit")).toBeNull();
  });

  it("calls footer button onClick when pressed", () => {
    const onClick = jest.fn();
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        showFooterButtons={true}
        footerButton={[{ title: "Submit", onClick }]}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Submit"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── cardTitleLabel shown inside expanded card ─────────────────────────────

  it("renders cardTitleLabel inside expanded card content when provided", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        cardTitleLabel="Section Header"
        cardTitleLabel_ar="رأس القسم"
      />
    );
    expect(screen.getByText("Section Header")).toBeTruthy();
  });

  it("renders Arabic cardTitleLabel inside expanded card content when language is 'ar'", () => {
    render(
      <GenericCard
        title="Info"
        title_ar="معلومات"
        rowsData={[]}
        cardTitleLabel="Section Header"
        cardTitleLabel_ar="رأس القسم"
        language="ar"
      />
    );
    expect(screen.getByText("رأس القسم")).toBeTruthy();
  });
});
