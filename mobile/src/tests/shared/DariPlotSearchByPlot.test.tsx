/**
 * Mobile tests for the shared DariPlotSearch ByPlot form component.
 * Covers: form field rendering, search button, en/ar, platform variants,
 * dynamic optional fields via MultiSelect, submit -> payload build -> drawer,
 * onSelectResult forwarding, server pagination, and error handling.
 *
 * @tanstack/react-form is mocked with a small store-backed fake so the real
 * onSubmit handler (payload building) runs; @tanstack/react-query's useMutation
 * is mocked to capture the search call.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";

// ── Mutation mock ────────────────────────────────────────────────────────────
const mockMutateAsync = jest.fn(() =>
  Promise.resolve({
    result: {
      properties: [
        {
          plotID: 1,
          plotNumber: "PN-1",
          landUseNameEn: "Residential",
          communityNameEn: "Community 100",
        },
      ],
      totalCount: 1,
      pageNumber: 0,
    },
  })
);
let mockIsPending = false;
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending,
  })),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: any) => children,
}));

// ── Form mock (store-backed so onSubmit runs with real values) ───────────────
const formValues: Record<string, any> = {};
let submitFn: ((args: { value: any }) => any) | undefined;
jest.mock("@tanstack/react-form", () => {
  const React = require("react");
  return {
    useForm: (opts: any) => {
      submitFn = opts?.onSubmit;
      // seed defaults once
      Object.entries(opts?.defaultValues || {}).forEach(([k, v]) => {
        if (!(k in formValues)) formValues[k] = v;
      });
      const store = { values: formValues };
      return {
        Field: ({ children, name }: any) =>
          children({
            state: {
              value: formValues[name] ?? "",
              meta: { errors: [], isTouched: false },
            },
            handleChange: (v: any) => {
              formValues[name] = v;
            },
            handleBlur: jest.fn(),
            name,
          }),
        handleSubmit: () => opts?.onSubmit?.({ value: { ...formValues } }),
        state: { values: formValues, isSubmitted: false },
        baseStore: store,
        resetField: (name: string) => {
          formValues[name] = "";
        },
      };
    },
    useStore: (store: any, selector: any) => selector(store),
  };
});

// ── Hook mocks ───────────────────────────────────────────────────────────────
const municipalityData = [
  {
    municipalityID: 1,
    municipalityNameEn: "Abu Dhabi",
    municipalityNameAr: "أبوظبي",
    districtID: 10,
    districtNameEn: "District 10",
    districtNameAr: "حي 10",
    communityID: 100,
    communityNameEn: "Community 100",
    communityNameAr: "مجتمع 100",
    roadID: 1000,
    roadNameEn: "Road 1000",
    roadNameAr: "طريق 1000",
  },
];
jest.mock("@shared/hooks/useGetDariMunicipality", () => ({
  useGetDariMunicipality: jest.fn(() => ({
    data: municipalityData,
    isPending: false,
  })),
}));
jest.mock("@shared/hooks/useGetDariLanduses", () => ({
  useGetDariLanduses: jest.fn(() => ({
    data: [
      { landUseID: 5, landUseNameEn: "Residential", landUseNameAr: "سكني" },
    ],
    isPending: false,
  })),
}));
jest.mock("@shared/hooks/useGetSearchByDariPlot", () => ({
  getSearchByDariPlot: jest.fn(),
}));

// ── Platform mocks ───────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, ...p }: any) =>
      React.createElement(View, p, children),
  };
});
jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...p }: any) => React.createElement(Text, p, children),
  };
});
jest.mock("@platform/Select", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Select: ({ label, language, label_ar }: any) =>
      React.createElement(
        View,
        { testID: `select-${label}` },
        React.createElement(Text, null, language === "ar" ? label_ar : label)
      ),
  };
});
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    TextInput: ({ label }: any) =>
      React.createElement(
        View,
        { testID: `text-input-${label}` },
        React.createElement(Text, null, label)
      ),
  };
});
jest.mock("@platform/NumberInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    NumberInput: ({ label }: any) =>
      React.createElement(
        View,
        { testID: `number-input-${label}` },
        React.createElement(Text, null, label)
      ),
  };
});
jest.mock("@platform/MultiSelect", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    MultiSelect: ({ onChange }: any) => {
      (global as any).__multiSelectOnChange = onChange;
      return React.createElement(View, { testID: "multi-select" });
    },
  };
});
jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) =>
      React.createElement(
        View,
        { testID: `btn-${title}`, onPress: onClick, isDisabled: !!disabled },
        React.createElement(Text, null, language === "ar" ? title_ar : title)
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
}));

// ── Result drawer body mock ──────────────────────────────────────────────────
jest.mock("@shared/components/DariPlotSearch/dariPlotSearchResult", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(
        View,
        { testID: "dari-results" },
        React.createElement(
          Text,
          { testID: "results-count" },
          String(props.results?.length ?? 0)
        ),
        React.createElement(
          TouchableOpacity,
          { testID: "trigger-page-change", onPress: () => props.onPageChange?.(2) },
          React.createElement(Text, null, "Page 2")
        ),
        React.createElement(
          TouchableOpacity,
          {
            testID: "trigger-select",
            onPress: () => props.onSelectResult?.({ plotID: 1 }),
          },
          React.createElement(Text, null, "Select")
        )
      ),
  };
});

import ByPlot from "@shared/components/DariPlotSearch/byPlot";

const resetForm = () => {
  for (const k of Object.keys(formValues)) delete formValues[k];
};

describe("DariPlotSearch ByPlot (mobile)", () => {
  beforeEach(() => {
    mockMutateAsync.mockClear();
    mockIsPending = false;
    resetForm();
    submitFn = undefined;
  });

  // ── Render & labels ─────────────────────────────────────────────────────────
  it("renders without crashing", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("select-Municipality")).toBeTruthy();
  });

  it("renders Zone/District select", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("select-Zone/District")).toBeTruthy();
  });

  it("renders Sector/Community select", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("select-Sector/Community")).toBeTruthy();
  });

  it("renders Road select", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("select-Road")).toBeTruthy();
  });

  it("renders Match Type select", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("select-Match Type")).toBeTruthy();
  });

  it("renders Results to Display select", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("select-Results to Display")).toBeTruthy();
  });

  it("renders the optional-fields multiselect", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("multi-select")).toBeTruthy();
  });

  it("renders Search button", () => {
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  // ── Arabic ──────────────────────────────────────────────────────────────────
  it("renders Arabic labels when language=ar", () => {
    render(<ByPlot language="ar" />);
    expect(screen.getByText("البلدية")).toBeTruthy();
    expect(screen.getByText("المنطقة")).toBeTruthy();
  });

  it("renders Arabic search button", () => {
    render(<ByPlot language="ar" />);
    expect(screen.getByText("بحث")).toBeTruthy();
  });

  // ── Platform ────────────────────────────────────────────────────────────────
  it("renders on mobile platform without crashing", () => {
    render(<ByPlot language="en" platform="mobile" />);
    expect(screen.getByTestId("btn-Search")).toBeTruthy();
  });

  // ── Default & selected props ────────────────────────────────────────────────
  it("passes selected prop without crash", () => {
    render(<ByPlot language="en" selected={[{ plotID: 1, plotNumber: "PN-1" }]} />);
    expect(screen.getByTestId("select-Municipality")).toBeTruthy();
  });

  it("search button is disabled when mutation is pending", () => {
    mockIsPending = true;
    render(<ByPlot language="en" />);
    expect(screen.getByTestId("btn-Search").props.isDisabled).toBe(true);
  });

  // ── Drawer default ──────────────────────────────────────────────────────────
  it("does not show the results drawer by default", () => {
    render(<ByPlot language="en" />);
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });

  // ── Dynamic optional fields via MultiSelect ─────────────────────────────────
  it("adds dynamic optional fields when selected in the multiselect", async () => {
    render(<ByPlot language="en" />);
    await act(async () => {
      (global as any).__multiSelectOnChange?.([
        "landuseId",
        "plotNumber",
        "publicHouseNumber",
        "plotFileNumber",
        "plotAddress",
      ]);
    });
    expect(screen.getByTestId("select-Land Use")).toBeTruthy();
    expect(screen.getByTestId("text-input-Plot Number")).toBeTruthy();
    expect(screen.getByTestId("number-input-Public House Number")).toBeTruthy();
    expect(screen.getByTestId("number-input-Plot File Number")).toBeTruthy();
    expect(screen.getByTestId("text-input-Plot Address")).toBeTruthy();
  });

  it("clears removed dynamic fields when deselected", async () => {
    render(<ByPlot language="en" />);
    await act(async () => {
      (global as any).__multiSelectOnChange?.(["plotNumber"]);
    });
    expect(screen.getByTestId("text-input-Plot Number")).toBeTruthy();
    await act(async () => {
      (global as any).__multiSelectOnChange?.([]);
    });
    expect(screen.queryByTestId("text-input-Plot Number")).toBeNull();
  });

  // ── Submit flow ─────────────────────────────────────────────────────────────
  it("submits, calls the search API and opens the results drawer", async () => {
    render(<ByPlot language="en" />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(screen.getByTestId("dari-results")).toBeTruthy();
    expect(screen.getByTestId("results-count").props.children).toBe("1");
  });

  it("sends municipalityID and districtID in the search payload", async () => {
    render(<ByPlot language="en" />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    const payload = mockMutateAsync.mock.calls[0][0] as any;
    expect(payload.municipalityID).toBe(1);
    expect(payload.districtID).toBe(10);
    expect(payload.propertyType).toBe(1);
    expect(payload.page).toBe(0);
  });

  it("includes optional sector/road/landuse/plot fields in payload when filled", async () => {
    render(<ByPlot language="en" />);
    await act(async () => {
      (global as any).__multiSelectOnChange?.([
        "landuseId",
        "plotNumber",
        "plotAddress",
        "plotFileNumber",
        "publicHouseNumber",
      ]);
    });
    Object.assign(formValues, {
      municipality: "1",
      zone: "10",
      sector: "100",
      road: "1000",
      landuseId: "5",
      plotNumber: "PN-9",
      plotAddress: "Addr-1",
      plotFileNumber: "FN-2",
      publicHouseNumber: "PH-3",
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    const payload = mockMutateAsync.mock.calls.at(-1)![0] as any;
    expect(payload.communityID).toBe(100);
    expect(payload.roadID).toBe(1000);
    expect(payload.landUseID).toBe(5);
    expect(payload.plotNumber).toBe("PN-9");
    expect(payload.plotAddress).toBe("Addr-1");
    expect(payload.plotfileNumber).toBe("FN-2");
    expect(payload.publicHouseNumber).toBe("PH-3");
  });

  it("forwards a selected result via onSelectResult", async () => {
    const onSelectResult = jest.fn();
    render(<ByPlot language="en" onSelectResult={onSelectResult} />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    fireEvent.press(screen.getByTestId("trigger-select"));
    expect(onSelectResult).toHaveBeenCalledWith({ plotID: 1 });
  });

  it("handles pagination via onPageChange (refetches 0-based page)", async () => {
    render(<ByPlot language="en" />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    mockMutateAsync.mockClear();
    await act(async () => {
      fireEvent.press(screen.getByTestId("trigger-page-change"));
    });
    const payload = mockMutateAsync.mock.calls[0][0] as any;
    expect(payload.page).toBe(1);
  });

  it("falls back to empty labels when option lookups miss", async () => {
    render(<ByPlot language="en" />);
    // IDs that don't exist in the municipality dataset -> find() returns undefined
    Object.assign(formValues, {
      municipality: "999",
      zone: "888",
      sector: "777",
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(screen.getByTestId("dari-results")).toBeTruthy();
  });

  it("logs and recovers when a pagination fetch rejects", async () => {
    render(<ByPlot language="en" />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockMutateAsync.mockRejectedValueOnce(new Error("page boom"));
    await act(async () => {
      fireEvent.press(screen.getByTestId("trigger-page-change"));
    });
    expect(errSpy).toHaveBeenCalled();
    // Drawer remains open after a failed pagination fetch.
    expect(screen.getByTestId("dari-results")).toBeTruthy();
    errSpy.mockRestore();
  });

  it("swallows search API errors without opening the drawer", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("boom"));
    render(<ByPlot language="en" />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByTestId("btn-Search"));
    });
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(screen.queryByTestId("dari-results")).toBeNull();
  });

  it("submits in Arabic with Arabic match/result defaults", async () => {
    render(<ByPlot language="ar" />);
    formValues.municipality = "1";
    formValues.zone = "10";
    await act(async () => {
      fireEvent.press(screen.getByText("بحث"));
    });
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(screen.getByTestId("dari-results")).toBeTruthy();
  });
});
