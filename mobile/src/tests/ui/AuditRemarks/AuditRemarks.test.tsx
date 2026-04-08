/**
 * Tests for the mobile AuditRemarks component.
 *
 * Buttons and DocumentIcon are mocked. SharedLanguageSwitchRenderer is
 * mocked so English/Arabic branch tests are deterministic without the
 * real renderer. All conditional sections are exercised: title display,
 * agent image vs placeholder, applicationDetails loop, plots loop with
 * View button, owners loop with View/Edit/Plots buttons, documents
 * section, and registrationRemarks display.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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

// ── Buttons mock ──────────────────────────────────────────────────────────
jest.mock("~/src/ui/Buttons", () => {
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

// ── DocumentIcon mock ─────────────────────────────────────────────────────
jest.mock("~/assets/svg/icons/Document", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: "document-icon" }),
  };
});

import AuditRemarks from "~/src/ui/AuditRemarks/AuditRemarks";

const mockAgent = {
  name: "Alice Smith",
  email: "alice@example.com",
  phone: "+971-50-000-0000",
  image: "",
};

const mockAgentWithImage = {
  ...mockAgent,
  image: "https://example.com/avatar.png",
};

const mockApplicationDetails = [
  {
    applicationNumber: "APP-001",
    applicationDate: "2024-01-01",
    referenceNumber: "REF-001",
  },
];

const mockPlots = [
  {
    code: "PLT-001",
    municipality: "Abu Dhabi",
    zone: "Zone A",
    sector: "Sector 1",
    address: "123 Main St",
  },
];

const mockOwners = [
  {
    name: "John Doe",
    familyBook: "FB-001",
    city: "Abu Dhabi",
    propertyCard: "PC-001",
  },
];

const mockDocuments = [
  {
    documentNameE: "Title Deed",
    documentNameA: "صك الملكية",
    downloadUrl: "https://example.com/doc.pdf",
  },
];

describe("AuditRemarks", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing with minimal props", () => {
    render(<AuditRemarks agent={mockAgent} />);
  });

  // ── Title rendering ──────────────────────────────────────────────────────

  it("renders title when title prop provided", () => {
    render(<AuditRemarks agent={mockAgent} title="Review Application" />);
    expect(screen.getByText("Review Application")).toBeTruthy();
  });

  it("does not render title element when title is not provided", () => {
    render(<AuditRemarks agent={mockAgent} />);
    expect(screen.queryByText("Review Application")).toBeNull();
  });

  it("renders Arabic title when language='ar' and title_ar provided", () => {
    render(
      <AuditRemarks
        agent={mockAgent}
        title="Review Application"
        title_ar="مراجعة الطلب"
        language="ar"
      />
    );
    expect(screen.getByText("مراجعة الطلب")).toBeTruthy();
  });

  // ── Agent section ────────────────────────────────────────────────────────

  it("renders agent name", () => {
    render(<AuditRemarks agent={mockAgent} />);
    expect(screen.getByText("Alice Smith")).toBeTruthy();
  });

  it("renders agent email", () => {
    render(<AuditRemarks agent={mockAgent} />);
    expect(screen.getByText("alice@example.com")).toBeTruthy();
  });

  it("renders agent phone", () => {
    render(<AuditRemarks agent={mockAgent} />);
    expect(screen.getByText("+971-50-000-0000")).toBeTruthy();
  });

  it("renders agent image when image URL is provided", () => {
    render(<AuditRemarks agent={mockAgentWithImage} />);
    // Image renders - no crash expected
    expect(screen.getByText("Alice Smith")).toBeTruthy();
  });

  it("renders placeholder view when agent has no image", () => {
    render(<AuditRemarks agent={mockAgent} />);
    // agent.image is falsy → placeholder View rendered, agent info still present
    expect(screen.getByText("alice@example.com")).toBeTruthy();
  });

  // ── Auditor remarks TextInput ────────────────────────────────────────────

  it("renders Auditor Remarks section heading", () => {
    render(<AuditRemarks agent={mockAgent} />);
    expect(screen.getByText("Auditor Remarks")).toBeTruthy();
  });

  it("passes value to the remarks TextInput", () => {
    render(<AuditRemarks agent={mockAgent} value="Some remarks" />);
    expect(screen.getByDisplayValue("Some remarks")).toBeTruthy();
  });

  it("calls onChange when remarks TextInput changes", () => {
    const onChange = jest.fn();
    render(<AuditRemarks agent={mockAgent} onChange={onChange} />);
    const inputs = screen.getAllByPlaceholderText("");
    fireEvent.changeText(inputs[0], "New remarks");
    expect(onChange).toHaveBeenCalledWith("New remarks");
  });

  // ── Application Details ──────────────────────────────────────────────────

  it("renders Application Details section heading", () => {
    render(<AuditRemarks agent={mockAgent} applicationDetails={mockApplicationDetails} />);
    expect(screen.getByText("Application Details")).toBeTruthy();
  });

  it("renders application number", () => {
    render(<AuditRemarks agent={mockAgent} applicationDetails={mockApplicationDetails} />);
    expect(screen.getByText("APP-001")).toBeTruthy();
  });

  it("renders application date", () => {
    render(<AuditRemarks agent={mockAgent} applicationDetails={mockApplicationDetails} />);
    expect(screen.getByText("2024-01-01")).toBeTruthy();
  });

  it("renders reference number", () => {
    render(<AuditRemarks agent={mockAgent} applicationDetails={mockApplicationDetails} />);
    expect(screen.getByText("REF-001")).toBeTruthy();
  });

  it("renders empty application details section without crashing", () => {
    render(<AuditRemarks agent={mockAgent} applicationDetails={[]} />);
    expect(screen.getByText("Application Details")).toBeTruthy();
  });

  // ── Plot section ─────────────────────────────────────────────────────────

  it("renders Plot section heading", () => {
    render(<AuditRemarks agent={mockAgent} plots={mockPlots} />);
    expect(screen.getByText("Plot")).toBeTruthy();
  });

  it("renders plot code", () => {
    render(<AuditRemarks agent={mockAgent} plots={mockPlots} />);
    expect(screen.getByText("PLT-001")).toBeTruthy();
  });

  it("renders plot municipality", () => {
    render(<AuditRemarks agent={mockAgent} plots={mockPlots} />);
    expect(screen.getByText("Abu Dhabi")).toBeTruthy();
  });

  it("calls onPlotClick with plot data and 'view' action when View button pressed", () => {
    const onPlotClick = jest.fn();
    render(<AuditRemarks agent={mockAgent} plots={mockPlots} onPlotClick={onPlotClick} />);
    fireEvent.press(screen.getByTestId("btn-View"));
    expect(onPlotClick).toHaveBeenCalledWith({ PlotData: mockPlots[0], action: "view" });
  });

  it("renders Arabic View label for plots when language='ar'", () => {
    render(<AuditRemarks agent={mockAgent} plots={mockPlots} language="ar" />);
    expect(screen.getAllByTestId("btn-عرض").length).toBeGreaterThanOrEqual(1);
  });

  // ── Owner section ────────────────────────────────────────────────────────

  it("renders Owner section heading", () => {
    render(<AuditRemarks agent={mockAgent} owners={mockOwners} />);
    expect(screen.getByText("Owner")).toBeTruthy();
  });

  it("renders owner name", () => {
    render(<AuditRemarks agent={mockAgent} owners={mockOwners} />);
    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("renders owner family book value", () => {
    render(<AuditRemarks agent={mockAgent} owners={mockOwners} />);
    expect(screen.getByText("FB-001")).toBeTruthy();
  });

  it("calls onOwnerClick with 'view' action when View button pressed", () => {
    const onOwnerClick = jest.fn();
    render(<AuditRemarks agent={mockAgent} owners={mockOwners} onOwnerClick={onOwnerClick} />);
    fireEvent.press(screen.getByTestId("btn-View"));
    expect(onOwnerClick).toHaveBeenCalledWith({ ownerData: mockOwners[0], action: "view" });
  });

  it("calls onOwnerClick with 'edit' action when Edit button pressed", () => {
    const onOwnerClick = jest.fn();
    render(<AuditRemarks agent={mockAgent} owners={mockOwners} onOwnerClick={onOwnerClick} />);
    fireEvent.press(screen.getByTestId("btn-Edit"));
    expect(onOwnerClick).toHaveBeenCalledWith({ ownerData: mockOwners[0], action: "edit" });
  });

  it("calls onOwnerClick with 'plot' action when Plots button pressed", () => {
    const onOwnerClick = jest.fn();
    render(<AuditRemarks agent={mockAgent} owners={mockOwners} onOwnerClick={onOwnerClick} />);
    fireEvent.press(screen.getByTestId("btn-Plots"));
    expect(onOwnerClick).toHaveBeenCalledWith({ ownerData: mockOwners[0], action: "plot" });
  });

  // ── Documents section ────────────────────────────────────────────────────

  it("renders Supporting Documents heading when documents provided", () => {
    render(<AuditRemarks agent={mockAgent} documents={mockDocuments} />);
    expect(screen.getByText("Supporting Documents")).toBeTruthy();
  });

  it("does not render Supporting Documents heading when documents is empty", () => {
    render(<AuditRemarks agent={mockAgent} documents={[]} />);
    expect(screen.queryByText("Supporting Documents")).toBeNull();
  });

  it("renders document English name", () => {
    render(<AuditRemarks agent={mockAgent} documents={mockDocuments} />);
    expect(screen.getByText("Title Deed")).toBeTruthy();
  });

  it("renders document Arabic name when language='ar'", () => {
    render(<AuditRemarks agent={mockAgent} documents={mockDocuments} language="ar" />);
    expect(screen.getByText("صك الملكية")).toBeTruthy();
  });

  it("renders document icon for each document", () => {
    render(<AuditRemarks agent={mockAgent} documents={mockDocuments} />);
    expect(screen.getByTestId("document-icon")).toBeTruthy();
  });

  it("calls onDocumentPress with downloadUrl when document pressed", () => {
    const onDocumentPress = jest.fn();
    render(
      <AuditRemarks
        agent={mockAgent}
        documents={mockDocuments}
        onDocumentPress={onDocumentPress}
      />
    );
    fireEvent.press(screen.getByText("Title Deed"));
    expect(onDocumentPress).toHaveBeenCalledWith("https://example.com/doc.pdf");
  });

  // ── Registration Remarks section ─────────────────────────────────────────

  it("renders Registration Remarks section when registrationRemarks=true", () => {
    render(<AuditRemarks agent={mockAgent} registrationRemarks={true} />);
    expect(screen.getByText("Registration Remarks")).toBeTruthy();
  });

  it("does not render Registration Remarks section when registrationRemarks is falsy", () => {
    render(<AuditRemarks agent={mockAgent} />);
    expect(screen.queryByText("Registration Remarks")).toBeNull();
  });

  // ── RTL direction ────────────────────────────────────────────────────────

  it("renders in Arabic (RTL) mode without crashing", () => {
    render(<AuditRemarks agent={mockAgent} language="ar" />);
    expect(screen.getByText("الوكيل")).toBeTruthy();
  });
});
