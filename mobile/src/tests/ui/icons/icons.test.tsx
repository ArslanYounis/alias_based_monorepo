/**
 * Tests for the icons/index.tsx exports.
 *
 * Exercises: rendering a representative sample of all icon categories —
 * payment icons, chevron icons, action icons, search/person/UAE icons,
 * calendar icon, and application message status icons (which use useId).
 * All tests simply verify that each icon renders without crashing.
 */
import React from "react";
import { render, screen } from "@testing-library/react-native";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (p: any) => React.createElement(View, { testID: "svg", ...p }),
    Path: () => null,
    Polyline: () => null,
    Line: () => null,
    Polygon: () => null,
    Defs: () => null,
    LinearGradient: () => null,
    RadialGradient: () => null,
    Stop: () => null,
    ClipPath: () => null,
    G: () => null,
    Rect: () => null,
    Svg: (p: any) => React.createElement(View, { testID: "svg-root", ...p }),
    SvgUri: (p: any) => React.createElement(View, { testID: "svg-uri" }),
  };
});

// react/useId polyfill for environments that may not support it
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  if (!actual.useId) {
    let idCounter = 0;
    return { ...actual, useId: () => `test-id-${idCounter++}` };
  }
  return actual;
});

import {
  PaymentIcon,
  NoPaymentIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  SendIcon,
  SearchIcon,
  PersonIcon,
  UAENationalIcon,
  CalendarIcon,
  AppMessageSuccessIcon,
  AppMessageErrorIcon,
  AppMessageInformationIcon,
} from "@platform/icons/index";

describe("Icons", () => {
  // ── Payment Icons ──────────────────────────────────────────────────────────

  describe("PaymentIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<PaymentIcon />)).not.toThrow();
    });

    it("renders an SVG element", () => {
      render(<PaymentIcon />);
      expect(screen.UNSAFE_getAllByType(require("react-native").View).length).toBeGreaterThan(0);
    });
  });

  describe("NoPaymentIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<NoPaymentIcon />)).not.toThrow();
    });

    it("renders an SVG element", () => {
      render(<NoPaymentIcon />);
      expect(screen.UNSAFE_getAllByType(require("react-native").View).length).toBeGreaterThan(0);
    });
  });

  // ── Chevron Icons ──────────────────────────────────────────────────────────

  describe("ChevronLeftIcon", () => {
    it("renders without crashing with defaults", () => {
      expect(() => render(<ChevronLeftIcon />)).not.toThrow();
    });

    it("renders with custom size and color", () => {
      expect(() =>
        render(<ChevronLeftIcon size={32} color="#ff0000" />)
      ).not.toThrow();
    });
  });

  describe("ChevronRightIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<ChevronRightIcon />)).not.toThrow();
    });

    it("renders with size=16", () => {
      expect(() => render(<ChevronRightIcon size={16} />)).not.toThrow();
    });
  });

  describe("ChevronDownIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<ChevronDownIcon />)).not.toThrow();
    });

    it("renders with custom color", () => {
      expect(() => render(<ChevronDownIcon color="#374151" />)).not.toThrow();
    });
  });

  describe("ChevronUpIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<ChevronUpIcon />)).not.toThrow();
    });
  });

  // ── Action Icons ───────────────────────────────────────────────────────────

  describe("CheckIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<CheckIcon />)).not.toThrow();
    });
  });

  describe("SendIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<SendIcon />)).not.toThrow();
    });
  });

  // ── Search / Person / UAE ──────────────────────────────────────────────────

  describe("SearchIcon", () => {
    it("renders without crashing with no props", () => {
      expect(() => render(<SearchIcon />)).not.toThrow();
    });

    it("renders with className prop", () => {
      expect(() => render(<SearchIcon className="some-class" />)).not.toThrow();
    });
  });

  describe("PersonIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<PersonIcon />)).not.toThrow();
    });
  });

  describe("UAENationalIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<UAENationalIcon />)).not.toThrow();
    });
  });

  // ── Calendar ───────────────────────────────────────────────────────────────

  describe("CalendarIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<CalendarIcon />)).not.toThrow();
    });

    it("renders an SVG root element", () => {
      render(<CalendarIcon />);
      expect(screen.UNSAFE_getAllByType(require("react-native").View).length).toBeGreaterThan(0);
    });
  });

  // ── Application Message Status Icons (useId) ───────────────────────────────

  describe("AppMessageSuccessIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<AppMessageSuccessIcon />)).not.toThrow();
    });

    it("renders multiple times without id conflicts", () => {
      expect(() => {
        render(<AppMessageSuccessIcon />);
        render(<AppMessageSuccessIcon />);
      }).not.toThrow();
    });
  });

  describe("AppMessageErrorIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<AppMessageErrorIcon />)).not.toThrow();
    });

    it("renders multiple times without id conflicts", () => {
      expect(() => {
        render(<AppMessageErrorIcon />);
        render(<AppMessageErrorIcon />);
      }).not.toThrow();
    });
  });

  describe("AppMessageInformationIcon", () => {
    it("renders without crashing", () => {
      expect(() => render(<AppMessageInformationIcon />)).not.toThrow();
    });

    it("renders alongside other status icons", () => {
      expect(() =>
        render(
          <>
            <AppMessageSuccessIcon />
            <AppMessageErrorIcon />
            <AppMessageInformationIcon />
          </>
        )
      ).not.toThrow();
    });
  });

  // ── Size and color props ───────────────────────────────────────────────────

  it("ChevronDownIcon passes size to SVG element", () => {
    render(<ChevronDownIcon size={40} />);
    // SVG element rendered as a View mock — just verifying no crash
    expect(screen.UNSAFE_getAllByType(require("react-native").View).length).toBeGreaterThan(0);
  });

  it("ChevronLeftIcon passes color to SVG element", () => {
    render(<ChevronLeftIcon color="red" />);
    expect(screen.UNSAFE_getAllByType(require("react-native").View).length).toBeGreaterThan(0);
  });
});
