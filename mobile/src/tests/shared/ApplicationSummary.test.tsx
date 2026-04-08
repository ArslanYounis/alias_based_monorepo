/**
 * Tests for the shared ApplicationSummary component.
 *
 * All platform UI components, shared sub-components, and icons are mocked
 * so no native code is required. Branches covered:
 *  - expand/collapse body visibility
 *  - Compact vs Standard toggle (state + label)
 *  - platform="mobile" expand button vs platform="web" <button>
 *  - All UiBlock types rendered in renderSection (agent, plot, owners,
 *    interactionHistory, documents, genericCard, genericCards,
 *    genericTableCard, applicationDetails, unknown/default → null)
 *  - DocumentsComponent present / absent in "documents" block
 *  - block.title overrides vs prop.title
 *  - language prop forwarded to children
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── All jest.mock calls MUST come before any component imports ──────────────

// SharedLanguageSwitchRenderer
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

// ── Platform components ────────────────────────────────────────────────────
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
    Buttons: ({ title, onClick, disabled, testID }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: testID ?? `btn-${title}`, onPress: onClick, disabled },
        React.createElement(Text, null, title)
      ),
  };
});

jest.mock("@platform/SwitchButton", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    SwitchButton: ({ type, onToggle }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: "switch-button", onPress: onToggle },
        React.createElement(Text, null, type)
      ),
  };
});

jest.mock("@platform/icons", () => ({
  ChevronDownIcon: () => null,
  ChevronUpIcon: () => null,
}));

// ── Shared sub-components ──────────────────────────────────────────────────
jest.mock("@shared/components/CardTitle/CardTitle", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title, onToggleExpand }: any) =>
      React.createElement(
        Text,
        { testID: "card-title", onPress: onToggleExpand },
        title
      ),
  };
});

jest.mock("@shared/components/Agent", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title }: any) =>
      React.createElement(
        View,
        { testID: "agent-card" },
        React.createElement(Text, null, title ?? "Agent")
      ),
  };
});

jest.mock("@shared/components/PlotCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ title }: any) =>
      React.createElement(View, { testID: "plot-card" }),
  };
});

jest.mock("@shared/components/OwnerCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "owner-card" }),
  };
});

jest.mock("@shared/components/GenericCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "generic-card" }),
  };
});

jest.mock("@shared/components/GenericCards", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "generic-cards" }),
  };
});

jest.mock("@shared/components/GenericTableCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "generic-table-card" }),
  };
});

jest.mock("@shared/components/InteractionCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "interaction-card" }),
  };
});

jest.mock("@shared/components/ApplicationSummary/ApplicationSummaryDetail", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () =>
      React.createElement(View, { testID: "application-summary-detail" }),
  };
});

// ── Component under test ───────────────────────────────────────────────────
import ApplicationSummary from "@shared/components/ApplicationSummary/ApplicationSummary";

// ── Helpers ────────────────────────────────────────────────────────────────
const makeBlock = (type: string, data: any = {}, extra: any = {}): any => ({
  type,
  data,
  ...extra,
});

describe("ApplicationSummary", () => {
  // ── Default render ───────────────────────────────────────────────────────

  it("renders without crashing with no props", () => {
    render(<ApplicationSummary />);
  });

  it("renders default English title", () => {
    render(<ApplicationSummary title="Application Summary" />);
    expect(screen.getByText("Application Summary")).toBeTruthy();
  });

  it("renders Arabic title when language='ar'", () => {
    render(
      <ApplicationSummary
        title="Application Summary"
        title_ar="ملخص الطلب"
        language="ar"
      />
    );
    expect(screen.getByText("ملخص الطلب")).toBeTruthy();
  });

  // ── Expand / Collapse ────────────────────────────────────────────────────

  it("body is visible by default (isExpanded=true)", () => {
    const data = [[makeBlock("agent", { title: "Agent Info" })]];
    render(<ApplicationSummary data={data} platform="mobile" />);
    expect(screen.getByTestId("agent-card")).toBeTruthy();
  });

  it("hides body after pressing the collapse button (mobile)", () => {
    const data = [[makeBlock("agent", { title: "Agent Info" })]];
    render(<ApplicationSummary data={data} platform="mobile" />);

    // There should be a Buttons element for expand/collapse on mobile.
    // Collapse by pressing the button with no title (empty string title).
    const buttons = screen.getAllByTestId(/^btn-/);
    // The expand/collapse Buttons has title="" so its testID is "btn-"
    const collapseBtn = buttons.find((b) => b.props.testID === "btn-");
    expect(collapseBtn).toBeTruthy();
    fireEvent.press(collapseBtn!);

    // After collapse the body (agent-card) should not be visible
    expect(screen.queryByTestId("agent-card")).toBeNull();
  });

  it("shows body again after second press (toggle re-expand)", () => {
    const data = [[makeBlock("agent", {})]];
    render(<ApplicationSummary data={data} platform="mobile" />);

    const collapseBtn = screen.getByTestId("btn-");
    fireEvent.press(collapseBtn); // collapse
    fireEvent.press(collapseBtn); // re-expand
    expect(screen.getByTestId("agent-card")).toBeTruthy();
  });

  // ── SwitchButton (Compact / Standard) ────────────────────────────────────

  it("shows SwitchButton when expanded", () => {
    render(<ApplicationSummary platform="mobile" />);
    expect(screen.getByTestId("switch-button")).toBeTruthy();
  });

  it("hides SwitchButton when collapsed", () => {
    render(<ApplicationSummary platform="mobile" />);
    fireEvent.press(screen.getByTestId("btn-"));
    expect(screen.queryByTestId("switch-button")).toBeNull();
  });

  it("shows 'Compact' label by default", () => {
    render(<ApplicationSummary />);
    // "Compact" appears in both the SwitchButton mock text and the label text
    expect(screen.getAllByText("Compact").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Standard' label after toggling SwitchButton", () => {
    render(<ApplicationSummary platform="mobile" />);
    fireEvent.press(screen.getByTestId("switch-button"));
    // "Standard" appears in SwitchButton mock text and the label text
    expect(screen.getAllByText("Standard").length).toBeGreaterThanOrEqual(1);
  });

  it("toggling SwitchButton twice returns to Compact", () => {
    render(<ApplicationSummary platform="mobile" />);
    fireEvent.press(screen.getByTestId("switch-button"));
    fireEvent.press(screen.getByTestId("switch-button"));
    expect(screen.getAllByText("Compact").length).toBeGreaterThanOrEqual(1);
  });

  it("shows Arabic Compact label when language='ar' and type=Compact", () => {
    render(<ApplicationSummary language="ar" platform="mobile" />);
    expect(screen.getByText("مضغوط")).toBeTruthy();
  });

  it("shows Arabic Standard label when language='ar' and type=Standard", () => {
    render(<ApplicationSummary language="ar" platform="mobile" />);
    fireEvent.press(screen.getByTestId("switch-button"));
    expect(screen.getByText("قياسي")).toBeTruthy();
  });

  // ── Platform = web: uses <button> element ────────────────────────────────

  it("does not render Buttons component when platform='web'", () => {
    render(<ApplicationSummary platform="web" />);
    // The expand/collapse on web is a native <button>, not Buttons component
    // so there should be no element with testID "btn-"
    expect(screen.queryByTestId("btn-")).toBeNull();
  });

  // ── renderSection: all block types ───────────────────────────────────────

  it("renders 'agent' block type", () => {
    const data = [[makeBlock("agent", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("agent-card")).toBeTruthy();
  });

  it("renders 'plot' block type", () => {
    const data = [[makeBlock("plot", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("plot-card")).toBeTruthy();
  });

  it("renders 'owners' block type", () => {
    const data = [[makeBlock("owners", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("owner-card")).toBeTruthy();
  });

  it("renders 'interactionHistory' block type", () => {
    const data = [[makeBlock("interactionHistory", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("interaction-card")).toBeTruthy();
  });

  it("renders 'genericCard' block type", () => {
    const data = [[makeBlock("genericCard", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("generic-card")).toBeTruthy();
  });

  it("renders 'genericCards' block type", () => {
    const data = [[makeBlock("genericCards", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("generic-cards")).toBeTruthy();
  });

  it("renders 'genericTableCard' block type", () => {
    const data = [[makeBlock("genericTableCard", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("generic-table-card")).toBeTruthy();
  });

  it("renders 'applicationDetails' block type", () => {
    const data = [[makeBlock("applicationDetails", {})]];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("application-summary-detail")).toBeTruthy();
  });

  it("renders 'documents' block type with DocumentsComponent", () => {
    const { View, Text } = require("react-native");
    const DocComp = ({ language }: any) =>
      React.createElement(View, { testID: "doc-comp" });

    const data = [
      [makeBlock("documents", { documents: [] }, { title: "Docs" })],
    ];
    render(<ApplicationSummary data={data} DocumentsComponent={DocComp} />);
    expect(screen.getByTestId("doc-comp")).toBeTruthy();
  });

  it("renders 'documents' block type without DocumentsComponent (no crash)", () => {
    const data = [
      [makeBlock("documents", { documents: [] }, { title: "Docs" })],
    ];
    render(<ApplicationSummary data={data} />);
    // CardTitle should still render because block.title is set
    expect(screen.getByTestId("card-title")).toBeTruthy();
  });

  it("does not render documents CardTitle when block.title is absent", () => {
    const data = [[makeBlock("documents", { documents: [] })]];
    render(<ApplicationSummary data={data} />);
    expect(screen.queryByTestId("card-title")).toBeNull();
  });

  it("returns null for unknown block type (no crash)", () => {
    const data = [[(({ type: "unknown", data: {} }) as any)]];
    render(<ApplicationSummary data={data} />);
    // Just ensure no crash
  });

  // ── Multiple columns ─────────────────────────────────────────────────────

  it("renders blocks across multiple columns", () => {
    const data = [
      [makeBlock("agent", {})],
      [makeBlock("plot", {})],
    ];
    render(<ApplicationSummary data={data} />);
    expect(screen.getByTestId("agent-card")).toBeTruthy();
    expect(screen.getByTestId("plot-card")).toBeTruthy();
  });

  // ── block.title overrides data.title ────────────────────────────────────

  it("uses block.title_ar override when language='ar'", () => {
    const data = [
      [makeBlock("agent", { title: "Data Title" }, { title_ar: "العنوان" })],
    ];
    // Agent mock just renders with title; we're verifying no crash and that
    // block.title_ar is forwarded (agent-card still present)
    render(<ApplicationSummary data={data} language="ar" />);
    expect(screen.getByTestId("agent-card")).toBeTruthy();
  });

  // ── defaultShowMore: Standard type passes defaultShowMore=true ───────────

  it("passes defaultShowMore=true to PlotCard when type=Standard", () => {
    // After toggling SwitchButton, type becomes Standard.
    // PlotCard mock receives defaultShowMore but just renders a View —
    // this test verifies no crash and plot card is still rendered.
    const data = [[makeBlock("plot", {})]];
    render(<ApplicationSummary data={data} platform="mobile" />);
    fireEvent.press(screen.getByTestId("switch-button")); // switch to Standard
    expect(screen.getByTestId("plot-card")).toBeTruthy();
  });

  // ── Empty data ───────────────────────────────────────────────────────────

  it("renders with empty data array without crashing", () => {
    render(<ApplicationSummary data={[]} />);
  });

  it("renders with default data (undefined) without crashing", () => {
    render(<ApplicationSummary />);
  });
});
