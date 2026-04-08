/**
 * Tests for the shared ByOwner search form component.
 * Covers: rendering fields, search button, drawer, platform variants, Arabic.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";

// ── TanStack Query mock ──────────────────────────────────────────────────────
const mockMutateAsync = jest.fn(() =>
  Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 })
);
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(() => ({ data: undefined, isPending: false, isError: false })),
  useMutation: jest.fn(() => ({ mutateAsync: mockMutateAsync, isPending: false })),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: any) => children,
}));

// ── TanStack Form mock ───────────────────────────────────────────────────────
jest.mock("@tanstack/react-form", () => ({
  useForm: jest.fn((opts: any) => ({
    Field: ({ children, name }: any) =>
      children({
        state: { value: "", meta: { errors: [], isTouched: false } },
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        name,
      }),
    handleSubmit: jest.fn(() => opts?.onSubmit?.({ value: opts?.defaultValues || {} })),
    Subscribe: ({ children }: any) => children({ canSubmit: true, isSubmitting: false }),
    state: { values: {}, isSubmitted: false },
    resetField: jest.fn(),
  })),
  useStore: jest.fn(() => ""),
}));

// ── Hook/API mocks ───────────────────────────────────────────────────────────
jest.mock("../../hooks/useGetSearchByOwner", () => ({
  getSearchByOwner: jest.fn(),
}), { virtual: true });
jest.mock("@shared/hooks/useGetSearchByOwner", () => ({
  getSearchByOwner: jest.fn(),
  useGetSearchByOwner: jest.fn(() => ({ mutate: jest.fn(), data: null, isPending: false })),
}));

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Container: ({ children, ...p }: any) => React.createElement(View, p, children) };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Text: ({ children, ...p }: any) => React.createElement(Text, p, children) };
});
jest.mock("@platform/Select", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Select: (p: any) => React.createElement(View, { testID: "select" }) };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { TextInput: (p: any) => React.createElement(View, { testID: "text-input" }) };
});
jest.mock("@platform/NumberInput", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { NumberInput: ({ onChange }: any) => {
    onChange?.("test");
    return React.createElement(View, { testID: "number-input" });
  }};
});
jest.mock("@platform/MultiSelect", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { MultiSelect: ({ onChange }: any) => {
    React.useEffect(() => {
      onChange?.(["passportNumber", "abuDhabiArchiveNo", "familyNoCity", "westernRegionArchiveNo", "moiUnifiedNumber", "alAinArchiveNo"]);
    }, []);
    return React.createElement(View, { testID: "multi-select" });
  }};
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Buttons: ({ title, onClick, disabled }: any) =>
      React.createElement(
        View,
        { testID: `btn-${title}`, onPress: onClick, disabled },
        React.createElement(Text, null, title)
      ),
  };
});
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  const CustomDrawer = ({ children, open }: any) =>
    open ? React.createElement(View, { testID: "custom-drawer" }, children) : null;
  return { CustomDrawer };
});
jest.mock("@platform/icons", () => ({
  SearchIcon: () => null,
  PersonIcon: () => null,
  UAENationalIcon: () => null,
}));

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/SearchPlot/SearchOwnerResult", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ onPageChange }: any) => {
      React.useEffect(() => { onPageChange?.(2); }, []);
      return React.createElement(View, { testID: "search-owner-result" });
    },
  };
});

// ── Constants mock ───────────────────────────────────────────────────────────
jest.mock("@shared/components/SearchPlot/constants", () => ({
  OwnerSchema: { parse: jest.fn(), _def: {} },
  OwnerDefaultValues: { nationalNumber: "", ownerName: "", familyName: "", matchType: "", resultsDisplay: "" },
  SearchByOwnerOptionalFields: [],
  MatchTypeOptions: [{ value: "1", value_ar: "١", label: "Contains", label_ar: "يحتوي" }],
  ResultsDisplayOptions: [{ value: "10", value_ar: "١٠", label: "10", label_ar: "١٠" }],
}));

import ByOwner from "@shared/components/SearchPlot/ByOwner";

describe("ByOwner", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<ByOwner language="en" />);
  });

  it("renders national number input", () => {
    render(<ByOwner language="en" />);
    expect(screen.getAllByTestId("number-input").length).toBeGreaterThan(0);
  });

  it("renders owner name text input", () => {
    render(<ByOwner language="en" />);
    expect(screen.getAllByTestId("text-input").length).toBeGreaterThan(0);
  });

  it("renders match type and results display selects", () => {
    render(<ByOwner language="en" />);
    expect(screen.getAllByTestId("select").length).toBeGreaterThan(0);
  });

  it("renders multiselect for optional fields", () => {
    render(<ByOwner language="en" />);
    expect(screen.getByTestId("multi-select")).toBeTruthy();
  });

  it("renders Search button", () => {
    render(<ByOwner language="en" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders Arabic search button when language=ar", () => {
    render(<ByOwner language="ar" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders in mobile platform", () => {
    render(<ByOwner language="en" platform="mobile" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("does not show drawer by default", () => {
    render(<ByOwner language="en" />);
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });

  it("search button is disabled when isPending=true", () => {
    const { useMutation } = require("@tanstack/react-query");
    (useMutation as jest.Mock).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: true });
    render(<ByOwner language="en" />);
    const btn = screen.getByTestId("btn-Search");
    expect(btn.props.disabled).toBe(true);
  });

  it("opens drawer after successful search submit", async () => {
    render(<ByOwner language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.getByTestId("custom-drawer")).toBeTruthy();
  });
});
