/**
 * Tests for the shared SearchTenancyContract container (mobile platform).
 *
 * getTenancyContracts (driving useMutation) and axios are mocked; the results
 * child + CustomDrawer are mocked so we can inspect what gets passed and drive
 * pagination/submit/close callbacks. Platform inputs are mocked with simple RN
 * elements. The real @tanstack/react-form + react-query drive submit logic.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── axios (used indirectly by the hook module) ───────────────────────────────
jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn(() => Promise.resolve({ data: { result: {} } })) },
}));

// ── data fetcher used by useMutation ─────────────────────────────────────────
const mockGetTenancyContracts = jest.fn();
jest.mock("@shared/hooks/useGetTenancyContracts", () => ({
  getTenancyContracts: (...args: unknown[]) => mockGetTenancyContracts(...args),
}));

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, ...p }: any) => React.createElement(View, p, children),
  };
});
jest.mock("@platform/Label", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Label: ({ label, label_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && label_ar ? label_ar : label
      ),
  };
});
jest.mock("@platform/Select", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Select: ({ label, label_ar, language }: any) =>
      React.createElement(
        View,
        null,
        React.createElement(
          Text,
          null,
          language === "ar" && label_ar ? label_ar : label
        )
      ),
  };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    TextInput: ({ label, label_ar, language }: any) =>
      React.createElement(
        View,
        null,
        React.createElement(
          Text,
          null,
          language === "ar" && label_ar ? label_ar : label
        )
      ),
  };
});
jest.mock("@platform/RadioField", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    RadioField: ({ label, label_ar, language, onChange }: any) => {
      const text = language === "ar" && label_ar ? label_ar : label;
      return React.createElement(
        TouchableOpacity,
        { testID: `radio-${label}`, onPress: onChange },
        React.createElement(Text, null, text)
      );
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
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SearchIcon: () => React.createElement(View, { testID: "search-icon" }),
    CalendarIcon: () => React.createElement(View, { testID: "calendar-icon" }),
  };
});

// ── Results child + drawer ───────────────────────────────────────────────────
jest.mock("@shared/components/SearchTenancyContract/searchTenancyContractResult", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(
        View,
        { testID: "results" },
        React.createElement(Text, { testID: "results-count" }, String(props.results.length)),
        React.createElement(Text, { testID: "results-total" }, String(props.totalCount)),
        React.createElement(Text, { testID: "results-pagesize" }, String(props.pageSize)),
        React.createElement(
          TouchableOpacity,
          { testID: "results-page", onPress: () => props.onPageChange?.(2) },
          React.createElement(Text, null, "page")
        ),
        React.createElement(
          TouchableOpacity,
          { testID: "results-submit", onPress: () => props.onSubmit?.(props.results) },
          React.createElement(Text, null, "submit")
        ),
        React.createElement(
          TouchableOpacity,
          { testID: "results-close", onPress: () => props.onCloseDrawer?.() },
          React.createElement(Text, null, "close")
        )
      ),
  };
});
jest.mock("@platform/CustomDrawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  const CustomDrawer = ({ children, open }: any) =>
    open ? React.createElement(View, { testID: "drawer" }, children) : null;
  return { CustomDrawer };
});

import SearchTenancyContract from "@shared/components/SearchTenancyContract/searchTenancyContract";

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

beforeEach(() => {
  mockGetTenancyContracts.mockReset();
});

describe("SearchTenancyContract (shared component – mobile platform)", () => {
  // ── Default render ───────────────────────────────────────────────────────────
  it("renders the contract type radios", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.getByText("New Tenancy")).toBeTruthy();
    expect(screen.getByText("Renew Tenancy")).toBeTruthy();
  });

  it("renders the form labels", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.getByText("Contract Number")).toBeTruthy();
    expect(screen.getByText("Contract Start Date")).toBeTruthy();
    expect(screen.getByText("Match Type")).toBeTruthy();
    expect(screen.getByText("Results to Display")).toBeTruthy();
  });

  it("renders the Search button", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.getByText("Search")).toBeTruthy();
  });

  it("does not show the drawer/results before searching", () => {
    renderWithClient(<SearchTenancyContract />);
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  // ── Arabic ───────────────────────────────────────────────────────────────────
  it("renders Arabic labels when language=ar", () => {
    renderWithClient(<SearchTenancyContract language="ar" />);
    expect(screen.getByText("نوع عقد الايجار")).toBeTruthy();
    expect(screen.getByText("بحث")).toBeTruthy();
  });

  // ── Contract type selection ──────────────────────────────────────────────────
  it("allows switching the contract type radio", () => {
    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Renew Tenancy"));
    expect(screen.getByText("Renew Tenancy")).toBeTruthy();
  });

  // ── Search submit → opens drawer with mapped results ─────────────────────────
  it("submits the search, opens the drawer and passes mapped results", async () => {
    mockGetTenancyContracts.mockResolvedValue({
      items: [
        { tenancyContractId: "1", contractNumber: "CN-1", startDate: "2026-01-01", isRenew: 0 },
        { tenancyContractId: "2", contractNumber: "CN-2", startDate: "2026-01-02", isRenew: 1 },
      ],
      totalCount: 2,
      pageNumber: 0,
    });

    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));

    await waitFor(() => expect(screen.getByTestId("drawer")).toBeTruthy());
    expect(screen.getByTestId("results-count").props.children).toBe("2");
    expect(screen.getByTestId("results-total").props.children).toBe("2");
    expect(mockGetTenancyContracts).toHaveBeenCalledTimes(1);
  });

  it("sends contractType '0' for new and pageNumber 0 in the payload", async () => {
    mockGetTenancyContracts.mockResolvedValue({ items: [], totalCount: 0, pageNumber: 0 });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalled());
    const payload = mockGetTenancyContracts.mock.calls[0][0];
    expect(payload).toMatchObject({ contractType: "0", pageNumber: 0 });
    expect(payload.pageSize).toBe(5);
  });

  it("sends contractType '1' when renew is selected", async () => {
    mockGetTenancyContracts.mockResolvedValue({ items: [], totalCount: 0, pageNumber: 0 });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Renew Tenancy"));
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalled());
    expect(mockGetTenancyContracts.mock.calls[0][0]).toMatchObject({ contractType: "1" });
  });

  it("handles a response with no items (defaults to empty results)", async () => {
    mockGetTenancyContracts.mockResolvedValue({ totalCount: 0, pageNumber: 0 });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeTruthy());
    expect(screen.getByTestId("results-count").props.children).toBe("0");
  });

  // ── Search submit error path ─────────────────────────────────────────────────
  it("does not open the drawer when the search request fails", async () => {
    mockGetTenancyContracts.mockRejectedValue(new Error("boom"));
    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalled());
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  // ── Pagination via child callback ────────────────────────────────────────────
  it("re-fetches with the next page number when onPageChange fires", async () => {
    mockGetTenancyContracts
      .mockResolvedValueOnce({
        items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
        totalCount: 10,
        pageNumber: 0,
      })
      .mockResolvedValueOnce({
        items: [{ tenancyContractId: "2", contractNumber: "CN-2", startDate: "y", isRenew: 0 }],
        totalCount: 10,
        pageNumber: 1,
      });

    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeTruthy());

    fireEvent.press(screen.getByTestId("results-page"));
    await waitFor(() => expect(mockGetTenancyContracts).toHaveBeenCalledTimes(2));
    expect(mockGetTenancyContracts.mock.calls[1][0]).toMatchObject({ pageNumber: 1 });
  });

  it("logs an error and keeps the drawer open when pagination fetch fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetTenancyContracts
      .mockResolvedValueOnce({
        items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
        totalCount: 10,
        pageNumber: 0,
      })
      .mockRejectedValueOnce(new Error("page boom"));

    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeTruthy());

    fireEvent.press(screen.getByTestId("results-page"));
    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(screen.getByTestId("drawer")).toBeTruthy();
    consoleSpy.mockRestore();
  });

  // ── Child callbacks: submit + close ──────────────────────────────────────────
  it("forwards onSubmit from the results child to the consumer", async () => {
    const onSubmit = jest.fn();
    mockGetTenancyContracts.mockResolvedValue({
      items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
      totalCount: 1,
      pageNumber: 0,
    });
    renderWithClient(<SearchTenancyContract onSubmit={onSubmit} />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeTruthy());
    fireEvent.press(screen.getByTestId("results-submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("closes the drawer when the results child requests it", async () => {
    mockGetTenancyContracts.mockResolvedValue({
      items: [{ tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 }],
      totalCount: 1,
      pageNumber: 0,
    });
    renderWithClient(<SearchTenancyContract />);
    fireEvent.press(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByTestId("drawer")).toBeTruthy());
    fireEvent.press(screen.getByTestId("results-close"));
    await waitFor(() => expect(screen.queryByTestId("drawer")).toBeNull());
  });

  // ── Platform / selected props ────────────────────────────────────────────────
  it("renders with mobile platform", () => {
    renderWithClient(<SearchTenancyContract platform="mobile" />);
    expect(screen.getByText("Search")).toBeTruthy();
  });

  it("accepts a selected prop without crashing", () => {
    renderWithClient(
      <SearchTenancyContract
        selected={[
          { tenancyContractId: "1", contractNumber: "CN-1", startDate: "x", isRenew: 0 },
        ]}
      />
    );
    expect(screen.getByText("Search")).toBeTruthy();
  });
});
