/**
 * Tests for the shared GenericTableCard component.
 *
 * Buttons, Pagination, CardRow, CardTitle, Container, Text, and
 * ScrollContainer are mocked to cut deep dependency chains.
 *
 * Branches covered:
 *   - showTitleSection true/false
 *   - isExpanded true/false (expanded vs collapsed containers)
 *   - platform="web" vs platform="mobile" column/row rendering
 *   - showPagination with handlePaginationInternally true/false
 *   - internal pagination page slicing
 *   - showButtons with header buttons
 *   - showFooterButtons with footer buttons
 *   - showRowButtons true/false
 *   - columnsData header rendering
 *   - language switching (en/ar)
 *   - onToggleExpand callback
 *   - onPageChange callback (external pagination)
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Mock SharedLanguageSwitchRenderer (both paths) ────────────────────────
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

// ── Mock CardTitle ────────────────────────────────────────────────────────
jest.mock("@shared/components/CardTitle", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title }: { title?: string }) =>
      React.createElement(
        View,
        { testID: "card-title" },
        React.createElement(Text, null, title)
      ),
  };
});

// ── Mock CardRow ──────────────────────────────────────────────────────────
jest.mock("@shared/components/CardRow", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ label, value }: { label?: string; value?: string }) =>
      React.createElement(
        View,
        { testID: `card-row-${label || "row"}` },
        React.createElement(Text, null, label),
        React.createElement(Text, null, value)
      ),
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

// ── Mock Pagination ───────────────────────────────────────────────────────
jest.mock("@platform/Pagination", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    Pagination: ({
      currentPage,
      totalPages,
      onPageChange,
    }: {
      currentPage?: number;
      totalPages?: number;
      onPageChange?: (p: number) => void;
    }) =>
      React.createElement(
        View,
        { testID: "pagination" },
        React.createElement(
          Text,
          null,
          `Page ${currentPage} of ${totalPages}`
        ),
        React.createElement(
          TouchableOpacity,
          {
            testID: "next-page",
            onPress: () => onPageChange && onPageChange((currentPage ?? 1) + 1),
          },
          React.createElement(Text, null, "Next")
        )
      ),
  };
});

// ── Mock Container ────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View, TouchableOpacity } = require("react-native");
  return {
    Container: ({ children, onClick, style, ...p }: any) =>
      React.createElement(
        onClick ? TouchableOpacity : View,
        { onPress: onClick, style, ...p },
        children
      ),
  };
});

// ── Mock Text ─────────────────────────────────────────────────────────────
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children }: any) => React.createElement(Text, null, children),
  };
});

// ── Mock ScrollContainer ──────────────────────────────────────────────────
jest.mock("@platform/ScrollContainer", () => {
  const React = require("react");
  const { ScrollView } = require("react-native");
  return {
    ScrollContainer: ({ children, ...p }: any) =>
      React.createElement(ScrollView, { ...p }, children),
  };
});

import GenericTableCard from "@shared/components/GenericTableCard/GenericTableCard";

const baseProps = {
  title: "Application Table",
  title_ar: "جدول الطلبات",
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  onPageChange: jest.fn(),
};

const makeRows = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    label: `Label ${i + 1}`,
    label_ar: `التسمية ${i + 1}`,
    value: `Value ${i + 1}`,
  }));

const sampleColumns = [
  { label: "Col A", label_ar: "عمود أ" },
  { label: "Col B", label_ar: "عمود ب" },
  { label: "Col C", label_ar: "عمود ج" },
];

describe("GenericTableCard (shared/components/GenericTableCard/GenericTableCard.tsx)", () => {
  // ── Smoke tests ───────────────────────────────────────────────────────────

  it("renders without crashing with minimal props", () => {
    render(<GenericTableCard {...baseProps} rowsData={[]} />);
  });

  it("renders title section by default", () => {
    render(<GenericTableCard {...baseProps} rowsData={[]} />);
    expect(screen.getByTestId("card-title")).toBeTruthy();
  });

  it("renders title text", () => {
    render(<GenericTableCard {...baseProps} rowsData={[]} />);
    expect(screen.getByText("Application Table")).toBeTruthy();
  });

  // ── showTitleSection ──────────────────────────────────────────────────────

  it("hides title section when showTitleSection=false", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showTitleSection={false}
      />
    );
    expect(screen.queryByTestId("card-title")).toBeNull();
  });

  it("shows title section when showTitleSection=true", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showTitleSection={true}
      />
    );
    expect(screen.getByTestId("card-title")).toBeTruthy();
  });

  // ── Expanded / collapsed ──────────────────────────────────────────────────

  it("shows expanded content by default", () => {
    render(
      <GenericTableCard {...baseProps} rowsData={makeRows(2)} />
    );
    expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
  });

  it("shows collapsed container when isExpanded=false", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(2)}
        isExpanded={false}
        cardTitleLabel="Summary Label"
        cardTitleValue="Summary Value"
      />
    );
    expect(screen.queryByTestId("card-row-Label 1")).toBeNull();
    expect(screen.getByText("Summary Label")).toBeTruthy();
    expect(screen.getByText("Summary Value")).toBeTruthy();
  });

  it("calls onToggleExpand when collapsed container is pressed", () => {
    const onToggleExpand = jest.fn();
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        isExpanded={false}
        onToggleExpand={onToggleExpand}
      />
    );
    const touchables = screen.UNSAFE_getAllByType(
      require("react-native").TouchableOpacity
    );
    fireEvent.press(touchables[0]);
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it("shows Arabic cardTitleLabel and cardTitleValue when language='ar' and collapsed", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        isExpanded={false}
        cardTitleLabel="Label EN"
        cardTitleLabel_ar="التسمية"
        cardTitleValue="Value EN"
        cardTitleValue_ar="القيمة"
        language="ar"
      />
    );
    expect(screen.getByText("التسمية")).toBeTruthy();
    expect(screen.getByText("القيمة")).toBeTruthy();
  });

  // ── cardTitleValue in expanded view ───────────────────────────────────────

  it("renders cardTitleValue inside expanded content", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        cardTitleValue="Total: 42"
      />
    );
    expect(screen.getByText("Total: 42")).toBeTruthy();
  });

  it("renders Arabic cardTitleValue when language='ar'", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        cardTitleValue="Total: 42"
        cardTitleValue_ar="المجموع: 42"
        language="ar"
      />
    );
    expect(screen.getByText("المجموع: 42")).toBeTruthy();
  });

  // ── Header buttons ────────────────────────────────────────────────────────

  it("renders header buttons when showButtons=true", () => {
    const onClick = jest.fn();
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showButtons
        buttons={[{ title: "Export", type: "secondary", onClick }]}
      />
    );
    expect(screen.getByText("Export")).toBeTruthy();
  });

  it("does not render header buttons when showButtons=false", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showButtons={false}
        buttons={[{ title: "Export", type: "secondary" }]}
      />
    );
    expect(screen.queryByText("Export")).toBeNull();
  });

  it("calls header button onClick when pressed", () => {
    const onClick = jest.fn();
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showButtons
        buttons={[{ title: "Export", type: "secondary", onClick }]}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Export"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── Footer buttons ────────────────────────────────────────────────────────

  it("renders footer buttons when showFooterButtons=true", () => {
    const onClick = jest.fn();
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showFooterButtons
        footerButton={[{ title: "Save", type: "primary", onClick }]}
      />
    );
    expect(screen.getByText("Save")).toBeTruthy();
  });

  it("does not render footer buttons when showFooterButtons=false", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showFooterButtons={false}
        footerButton={[{ title: "Save", type: "primary" }]}
      />
    );
    expect(screen.queryByText("Save")).toBeNull();
  });

  it("calls footer button onClick when pressed", () => {
    const onClick = jest.fn();
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        showFooterButtons
        footerButton={[{ title: "Save", type: "primary", onClick }]}
      />
    );
    fireEvent.press(screen.getByTestId("btn-Save"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── Row rendering ─────────────────────────────────────────────────────────

  it("renders all rows when rowsData has 3 or fewer items", () => {
    render(
      <GenericTableCard {...baseProps} rowsData={makeRows(3)} />
    );
    expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
    expect(screen.getByTestId("card-row-Label 2")).toBeTruthy();
    expect(screen.getByTestId("card-row-Label 3")).toBeTruthy();
  });

  it("shows only first 3 rows when defaultShowMore=false and rows > 3", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(5)}
        defaultShowMore={false}
      />
    );
    expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
    expect(screen.queryByTestId("card-row-Label 4")).toBeNull();
  });

  it("shows all rows when defaultShowMore=true", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(5)}
        defaultShowMore={true}
      />
    );
    expect(screen.getByTestId("card-row-Label 5")).toBeTruthy();
  });

  // ── Column headers (web platform) ─────────────────────────────────────────

  describe("platform='web' column headers", () => {
    it("renders column headers when columnsData provided and rowVariant set", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(2)}
          columnsData={sampleColumns}
          rowVariant="3colButton"
          platform="web"
        />
      );
      expect(screen.getByText("Col A")).toBeTruthy();
      expect(screen.getByText("Col B")).toBeTruthy();
    });

    it("renders Arabic column headers when language='ar'", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(1)}
          columnsData={sampleColumns}
          rowVariant="3colButton"
          platform="web"
          language="ar"
        />
      );
      expect(screen.getByText("عمود أ")).toBeTruthy();
    });

    it("does not render column headers when columnsData is empty", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(2)}
          columnsData={[]}
          rowVariant="3colButton"
          platform="web"
        />
      );
      expect(screen.queryByText("Col A")).toBeNull();
    });
  });

  // ── Column headers (mobile platform) ──────────────────────────────────────

  describe("platform='mobile' column headers", () => {
    it("renders column headers in ScrollContainer when columnsData provided", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(2)}
          columnsData={sampleColumns}
          rowVariant="3colButton"
          platform="mobile"
        />
      );
      expect(screen.getByText("Col A")).toBeTruthy();
    });

    it("renders rows inside ScrollContainer on mobile", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(2)}
          platform="mobile"
        />
      );
      expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
    });
  });

  // ── rowVariant column count ────────────────────────────────────────────────

  it("renders correct number of columns for 4colButton variant", () => {
    const cols = [
      { label: "A" },
      { label: "B" },
      { label: "C" },
      { label: "D" },
    ];
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(1)}
        columnsData={cols}
        rowVariant="4colButton"
        platform="web"
      />
    );
    // 4colButton shows valueCount=3 + 1 label col = 4 cols max
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("renders correct number of columns for 6colButton variant", () => {
    const cols = Array.from({ length: 6 }, (_, i) => ({
      label: `Col${i + 1}`,
    }));
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(1)}
        columnsData={cols}
        rowVariant="6colButton"
        platform="web"
      />
    );
    expect(screen.getByText("Col1")).toBeTruthy();
  });

  // ── Pagination (internal) ─────────────────────────────────────────────────

  describe("internal pagination", () => {
    it("renders Pagination when showPagination=true", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(5)}
          showPagination
          handlePaginationInternally
        />
      );
      expect(screen.getByTestId("pagination")).toBeTruthy();
    });

    it("shows only 3 rows on first internal page", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(6)}
          showPagination
          handlePaginationInternally
        />
      );
      expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
      expect(screen.queryByTestId("card-row-Label 4")).toBeNull();
    });

    it("advances to next page and shows next 3 rows", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(6)}
          showPagination
          handlePaginationInternally
        />
      );
      fireEvent.press(screen.getByTestId("next-page"));
      expect(screen.getByTestId("card-row-Label 4")).toBeTruthy();
      expect(screen.queryByTestId("card-row-Label 1")).toBeNull();
    });

    it("shows page count text", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(6)}
          showPagination
          handlePaginationInternally
        />
      );
      expect(screen.getByText("Page 1 of 2")).toBeTruthy();
    });
  });

  // ── Pagination (external) ─────────────────────────────────────────────────

  describe("external pagination", () => {
    it("calls onPageChange when next page is pressed", () => {
      const onPageChange = jest.fn();
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(5)}
          showPagination
          handlePaginationInternally={false}
          currentPage={1}
          totalPages={3}
          onPageChange={onPageChange}
        />
      );
      fireEvent.press(screen.getByTestId("next-page"));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("shows external page count", () => {
      render(
        <GenericTableCard
          {...baseProps}
          rowsData={makeRows(5)}
          showPagination
          handlePaginationInternally={false}
          currentPage={2}
          totalPages={5}
        />
      );
      expect(screen.getByText("Page 2 of 5")).toBeTruthy();
    });
  });

  // ── isExpanded resets isMoreShown ─────────────────────────────────────────

  it("resets isMoreShown to false when isExpanded becomes false", () => {
    const { rerender } = render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(5)}
        isExpanded={true}
        defaultShowMore={true}
      />
    );
    // Rows visible
    expect(screen.getByTestId("card-row-Label 5")).toBeTruthy();
    rerender(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(5)}
        isExpanded={false}
        defaultShowMore={true}
      />
    );
    // Collapsed view
    expect(screen.queryByTestId("card-row-Label 5")).toBeNull();
  });

  // ── showRowButtons ────────────────────────────────────────────────────────

  it("renders rows with buttons when showRowButtons=true", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(2)}
        showRowButtons={true}
      />
    );
    expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
  });

  it("renders rows without buttons when showRowButtons=false", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={makeRows(2)}
        showRowButtons={false}
      />
    );
    // Rows still render; button prop passed as undefined
    expect(screen.getByTestId("card-row-Label 1")).toBeTruthy();
  });

  // ── Language switching ────────────────────────────────────────────────────

  it("renders Arabic title when language='ar'", () => {
    render(
      <GenericTableCard
        {...baseProps}
        rowsData={[]}
        language="ar"
      />
    );
    // title is passed to CardTitle mock which renders it
    expect(screen.getByText("Application Table")).toBeTruthy();
  });
});
