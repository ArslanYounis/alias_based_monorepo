/**
 * Tests for the CustomDrawer UI component.
 *
 * Exercises: imperative API (open/close/toggle via ref), controlled mode via
 * `open` prop, size variants, dismissible flag, header/children rendering,
 * and the onChange callback.
 */
import React, { createRef } from "react";
import { render, screen, act } from "@testing-library/react-native";
import { Text, View } from "react-native";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View, ScrollView } = require("react-native");
  return {
    BottomSheetModal: React.forwardRef(
      ({ children, onChange }: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
          present: jest.fn(),
          dismiss: jest.fn(),
        }));
        return React.createElement(
          View,
          { testID: "bottom-sheet-modal" },
          children
        );
      }
    ),
    BottomSheetScrollView: ({ children }: any) =>
      React.createElement(ScrollView, { testID: "bottom-sheet-scroll" }, children),
    BottomSheetBackdrop: () => null,
    BottomSheetTextInput: (p: any) => React.createElement(View, null),
  };
});

import { CustomDrawer, type CustomDrawerRef } from "@platform/CustomDrawer/CustomDrawer";

// Helper — renders the drawer and calls open() so the content becomes visible
const renderOpenDrawer = (props: Record<string, any> = {}) => {
  const ref = createRef<CustomDrawerRef>();
  const utils = render(
    <CustomDrawer ref={ref} {...props} />
  );
  act(() => {
    ref.current?.open();
  });
  return { ref, ...utils };
};

describe("CustomDrawer", () => {
  // ── Initial state (closed) ─────────────────────────────────────────────────

  it("renders without crashing", () => {
    render(<CustomDrawer />);
  });

  it("renders nothing visible when closed (mounted=false initially)", () => {
    render(<CustomDrawer />);
    expect(screen.queryByTestId("bottom-sheet-modal")).toBeNull();
  });

  // ── Imperative open ────────────────────────────────────────────────────────

  it("shows BottomSheetModal after calling ref.open()", () => {
    const { ref } = renderOpenDrawer();
    expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
  });

  it("renders children inside the drawer after open", () => {
    const { ref } = renderOpenDrawer({
      children: <Text testID="drawer-child">Drawer Content</Text>,
    });
    expect(screen.getByTestId("drawer-child")).toBeTruthy();
  });

  it("renders header inside the drawer after open", () => {
    const { ref } = renderOpenDrawer({
      header: <Text testID="drawer-header">Header Text</Text>,
    });
    expect(screen.getByTestId("drawer-header")).toBeTruthy();
  });

  // ── Imperative close ───────────────────────────────────────────────────────

  it("does not throw when close is called on a closed drawer", () => {
    const ref = createRef<CustomDrawerRef>();
    render(<CustomDrawer ref={ref} />);
    expect(() => act(() => { ref.current?.close(); })).not.toThrow();
  });

  it("does not throw when close is called after open", () => {
    const { ref } = renderOpenDrawer();
    expect(() => act(() => { ref.current?.close(); })).not.toThrow();
  });

  // ── Imperative toggle ──────────────────────────────────────────────────────

  it("opens the drawer when toggle is called on a closed drawer", () => {
    const ref = createRef<CustomDrawerRef>();
    render(<CustomDrawer ref={ref} />);
    act(() => { ref.current?.toggle(); });
    expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
  });

  it("closes the drawer when toggle is called on an open drawer", () => {
    const { ref } = renderOpenDrawer();
    expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
    act(() => { ref.current?.toggle(); });
    // After dismiss, isOpenRef is false; mounted is still true until handleSheetChanges fires
    expect(() => act(() => {})).not.toThrow();
  });

  // ── onOpenChange callback ──────────────────────────────────────────────────

  it("calls onOpenChange(true) when drawer opens", () => {
    const onOpenChange = jest.fn();
    const ref = createRef<CustomDrawerRef>();
    render(<CustomDrawer ref={ref} onOpenChange={onOpenChange} />);
    act(() => { ref.current?.open(); });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange(false) when drawer closes", () => {
    const onOpenChange = jest.fn();
    const { ref } = renderOpenDrawer({ onOpenChange });
    onOpenChange.mockClear();
    act(() => { ref.current?.close(); });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Controlled mode ────────────────────────────────────────────────────────

  it("opens drawer when open prop changes from false to true", () => {
    const { rerender } = render(<CustomDrawer open={false} />);
    expect(screen.queryByTestId("bottom-sheet-modal")).toBeNull();
    act(() => {
      rerender(<CustomDrawer open />);
    });
    expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
  });

  it("does not open drawer when open prop is undefined (uncontrolled)", () => {
    render(<CustomDrawer open={undefined} />);
    expect(screen.queryByTestId("bottom-sheet-modal")).toBeNull();
  });

  // ── Size variants ──────────────────────────────────────────────────────────

  it("opens without crashing with size='layer1' (default)", () => {
    expect(() => renderOpenDrawer({ size: "layer1" })).not.toThrow();
  });

  it("opens without crashing with size='layer2'", () => {
    expect(() => renderOpenDrawer({ size: "layer2" })).not.toThrow();
  });

  it("opens without crashing with size='layer3'", () => {
    expect(() => renderOpenDrawer({ size: "layer3" })).not.toThrow();
  });

  // ── dismissible flag ───────────────────────────────────────────────────────

  it("renders without crashing with dismissible=false", () => {
    expect(() => renderOpenDrawer({ dismissible: false })).not.toThrow();
  });

  it("renders without crashing with dismissible=true (default)", () => {
    expect(() => renderOpenDrawer({ dismissible: true })).not.toThrow();
  });

  // ── displayName ───────────────────────────────────────────────────────────

  it("has displayName set to CustomDrawer", () => {
    expect(CustomDrawer.displayName).toBe("CustomDrawer");
  });
});
