/**
 * Mobile tests for the shared SearchByCompanyOwner component.
 * Covers: field/label rendering (en/ar), mutation submit + drawer open,
 * pagination, nullish fallback mapping, empty items, mutation/pagination errors,
 * mobile platform, selected prop.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockSearchByCompanyOwner = jest.fn(() =>
  Promise.resolve({
    items: [
      {
        allotmentNameId: 1,
        companyName: "Acme",
        tradeNumber: "T1",
        certificateNumber: "C1",
        familyBookNumber: "FB1",
      },
    ],
    pageNumber: 0,
    totalCount: 1,
    pageSize: 5,
  })
);

jest.mock("@shared/hooks/useSearchByCompanyOwner", () => ({
  searchByCompanyOwner: (...args: unknown[]) =>
    mockSearchByCompanyOwner(...(args as [])),
}));

jest.mock("axios");

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Container: ({ children, ...p }: any) => React.createElement(View, p, children) };
});
const labelInput = () => (props: any) => {
  const React = require("react");
  const { View, Text, TextInput } = require("react-native");
  const text = props.language === "ar" && props.label_ar ? props.label_ar : props.label;
  return React.createElement(View, null, [
    React.createElement(Text, { key: "l" }, text),
    React.createElement(TextInput, {
      key: "i",
      testID: `input-${props.label}`,
      value: props.value,
      onChangeText: props.onChange,
    }),
  ]);
};
jest.mock("@platform/TextInput", () => ({ TextInput: labelInput() }));
jest.mock("@platform/NumberInput", () => ({ NumberInput: labelInput() }));
jest.mock("@platform/MultiSelect", () => ({ MultiSelect: () => null }));
jest.mock("@platform/Select", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Select: (props: any) => {
      const text = props.language === "ar" && props.label_ar ? props.label_ar : props.label;
      return React.createElement(View, { testID: `select-${props.label}` },
        React.createElement(Text, null, text));
    },
  };
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: `btn-${title}`, onPress: onClick, disabled },
        React.createElement(Text, null, label)
      );
    },
  };
});
jest.mock("@platform/icons", () => ({ SearchIcon: () => null }));
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CustomDrawer: ({ children, open }: any) =>
      open ? React.createElement(View, { testID: "custom-drawer" }, children) : null,
  };
});

jest.mock("@shared/components/SearchAllotment/searchAllotmentResult", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: "allotment-result" }, [
        React.createElement(Text, { key: "c" }, `results:${props.results?.length ?? 0}`),
        React.createElement(
          TouchableOpacity,
          { key: "n", testID: "next-page", onPress: () => props.onPageChange?.(2) },
          React.createElement(Text, null, "next")
        ),
      ]),
  };
});

import SearchByCompanyOwner from "@shared/components/SearchAllotment/searchByCompanyOwner";

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("SearchByCompanyOwner", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders Company Name label", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Company Name")).toBeTruthy();
  });

  it("renders Certificate Number and Trade License labels", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Certificate Number")).toBeTruthy();
    expect(screen.getByText("Trade License")).toBeTruthy();
  });

  it("renders Match Type and Results to Display selects", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    expect(screen.getByText("Match Type")).toBeTruthy();
    expect(screen.getByText("Results to Display")).toBeTruthy();
  });

  it("renders Arabic labels when language=ar", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="ar" />);
    expect(screen.getByText("اسم الشركة")).toBeTruthy();
    expect(screen.getByText("رقم الشهادة")).toBeTruthy();
    expect(screen.getByText("بحث")).toBeTruthy();
  });

  it("renders with mobile platform", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" platform="mobile" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  it("renders with selected prop", () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" selected={[]} />);
    expect(screen.getByText("Company Name")).toBeTruthy();
  });

  it("calls searchByCompanyOwner mutation and opens result drawer on Search press", async () => {
    const onSubmit = jest.fn();
    renderWithQueryClient(<SearchByCompanyOwner language="en" onSubmit={onSubmit} />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(mockSearchByCompanyOwner).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId("allotment-result")).toBeTruthy());
  });

  it("triggers handlePageChange via result pagination", async () => {
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(screen.getByTestId("allotment-result")).toBeTruthy());
    mockSearchByCompanyOwner.mockClear();
    fireEvent.press(screen.getByTestId("next-page"));
    await waitFor(() => expect(mockSearchByCompanyOwner).toHaveBeenCalledTimes(1));
  });

  it("uses Arabic default values when language=ar", async () => {
    renderWithQueryClient(<SearchByCompanyOwner language="ar" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(mockSearchByCompanyOwner).toHaveBeenCalled());
  });

  it("maps items with missing fields (nullish fallbacks)", async () => {
    mockSearchByCompanyOwner.mockResolvedValueOnce({
      items: [
        {
          allotmentNameId: null,
          companyName: null,
          tradeNumber: null,
          certificateNumber: null,
          familyBookNumber: null,
        },
        {},
      ],
      pageNumber: 0,
      totalCount: 2,
      pageSize: 5,
    } as any);
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(screen.getByText("results:2")).toBeTruthy());
  });

  it("handles empty items response", async () => {
    mockSearchByCompanyOwner.mockResolvedValueOnce({
      items: undefined,
      pageNumber: 0,
      totalCount: 0,
      pageSize: 5,
    } as any);
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(screen.getByText("results:0")).toBeTruthy());
  });

  it("handles pagination fetch error gracefully", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(screen.getByTestId("allotment-result")).toBeTruthy());
    mockSearchByCompanyOwner.mockRejectedValueOnce(new Error("page fail"));
    fireEvent.press(screen.getByTestId("next-page"));
    await waitFor(() => expect(errSpy).toHaveBeenCalled());
    errSpy.mockRestore();
  });

  it("handles mutation error gracefully", async () => {
    mockSearchByCompanyOwner.mockRejectedValueOnce(new Error("boom"));
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() => expect(mockSearchByCompanyOwner).toHaveBeenCalled());
    errSpy.mockRestore();
  });

  it("handles non-Error rejection (unknown error branch)", async () => {
    mockSearchByCompanyOwner.mockRejectedValueOnce("string failure");
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderWithQueryClient(<SearchByCompanyOwner language="en" />);
    fireEvent.press(screen.getByTestId("btn-Search"));
    await waitFor(() =>
      expect(errSpy).toHaveBeenCalledWith("Unknown error", "string failure")
    );
    errSpy.mockRestore();
  });
});
