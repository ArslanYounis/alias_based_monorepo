/**
 * Tests for the shared ByPlot search form component.
 * Covers: rendering form fields, search button, hook interactions,
 * drawer rendering, platform variants.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── TanStack Query mock ──────────────────────────────────────────────────────
const mockMutateAsync = jest.fn(() => Promise.resolve({ items: [], pageNumber: 0, totalCount: 0 }));
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
    state: { values: { municipality: "", zone: "", sector: "" }, isSubmitted: false },
    baseStore: { subscribe: jest.fn(), getState: jest.fn(() => ({ values: {} })) },
    resetField: jest.fn(),
  })),
  useStore: jest.fn((store: any, selector: any) => ""),
}));

// ── Hook mocks ───────────────────────────────────────────────────────────────
jest.mock("@shared/hooks/useGetSearchByPlot", () => ({
  getSearchByPlot: jest.fn(),
}));
jest.mock("@shared/hooks/useGetMunicipality", () => ({
  useGetMunicipality: jest.fn(() => ({ options: [], isPending: false })),
}));
jest.mock("@shared/hooks/useGetDistrict", () => ({
  useGetDistrict: jest.fn(() => ({ options: [], isPending: false })),
}));
jest.mock("@shared/hooks/useGetCommunity", () => ({
  useGetCommunity: jest.fn(() => ({ options: [], isPending: false })),
}));
jest.mock("@shared/hooks/useGetRoads", () => ({
  useGetRoads: jest.fn(() => ({ options: [], isPending: false })),
}));
jest.mock("@shared/hooks/useGetLandUsage", () => ({
  useGetLandUsage: jest.fn(() => ({ options: [], isPending: false })),
}));
jest.mock("../../hooks/useGetSearchByPlot", () => ({
  getSearchByPlot: jest.fn(),
}), { virtual: true });
jest.mock("../../hooks/useGetMunicipality", () => ({
  useGetMunicipality: jest.fn(() => ({ options: [], isPending: false })),
}), { virtual: true });
jest.mock("../../hooks/useGetDistrict", () => ({
  useGetDistrict: jest.fn(() => ({ options: [], isPending: false })),
}), { virtual: true });
jest.mock("../../hooks/useGetCommunity", () => ({
  useGetCommunity: jest.fn(() => ({ options: [], isPending: false })),
}), { virtual: true });
jest.mock("../../hooks/useGetRoads", () => ({
  useGetRoads: jest.fn(() => ({ options: [], isPending: false })),
}), { virtual: true });
jest.mock("../../hooks/useGetLandUsage", () => ({
  useGetLandUsage: jest.fn(() => ({ options: [], isPending: false })),
}), { virtual: true });

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
jest.mock("@platform/Select/Select", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Select: (p: any) => React.createElement(View, { testID: "select" }) };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { TextInput: (p: any) => React.createElement(View, { testID: "text-input" }) };
});
jest.mock("@platform/TextInput/TextInput", () => {
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
      onChange?.(["plotNumber", "landuseId", "publicHouseNumber", "plotFileNumber"]);
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
  CalendarIcon: () => null,
}));

// ── Sub-component mocks ──────────────────────────────────────────────────────
jest.mock("@shared/components/SearchPlot/SearchPlotResults", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ onPageChange }: any) => {
      React.useEffect(() => { onPageChange?.(2); }, []);
      return React.createElement(View, { testID: "search-plot-results" });
    },
  };
});

// ── Constants mock ───────────────────────────────────────────────────────────
jest.mock("@shared/components/SearchPlot/constants", () => ({
  PlotSchema: { parse: jest.fn(), _def: {} },
  PlotDefaultValues: { municipality: "", zone: "", sector: "", road: "", plotNumber: "", landuseId: "", publicHouseNumber: "", plotFileNumber: "", matchType: "", resultsDisplay: "" },
  SearchByPlotOptionalFields: [],
  MatchTypeOptions: [{ value: "1", value_ar: "١", label: "Contains", label_ar: "يحتوي" }],
  ResultsDisplayOptions: [{ value: "10", value_ar: "١٠", label: "10", label_ar: "١٠" }],
}));

import ByPlot from "@shared/components/SearchPlot/ByPlot";

describe("ByPlot", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    render(<ByPlot language="en" />);
  });

  it("renders municipality select", () => {
    render(<ByPlot language="en" />);
    expect(screen.getAllByTestId("select").length).toBeGreaterThan(0);
  });

  it("renders multiselect for optional fields", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("multi-select")).toBeTruthy();
  });

  it("renders search button", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders in mobile platform mode", () => {
    render(<ByPlot language="en" platform="mobile" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders in Arabic language", () => {
    render(<ByPlot language="ar" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("does not show drawer by default", () => {
    render(<ByPlot language="en" />);
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });

  it("search button is disabled when isPending is true", () => {
    const { useMutation } = require("@tanstack/react-query");
    (useMutation as jest.Mock).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: true });
    render(<ByPlot language="en" />);
    const btn = screen.getByTestId("btn-Search");
    expect(btn.props.disabled).toBe(true);
  });

  it("opens drawer after successful search submit", async () => {
    const { act } = require("@testing-library/react-native");
    render(<ByPlot language="en" />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(screen.getByTestId("custom-drawer")).toBeTruthy();
  });
});
