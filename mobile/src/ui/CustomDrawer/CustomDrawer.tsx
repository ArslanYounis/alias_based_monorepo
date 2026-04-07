import { Dimensions, View } from "react-native";
import type { CustomDrawerProps, DrawerSize } from "@shared/types";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

export type { CustomDrawerProps, DrawerSize };

export interface CustomDrawerRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

const drawerSnapPoints: Record<DrawerSize, number[]> = {
  layer1: [Math.round(SCREEN_HEIGHT * 0.9)],
  layer2: [Math.round(SCREEN_HEIGHT * 0.75)],
  layer3: [Math.round(SCREEN_HEIGHT * 0.6)],
};

export const CustomDrawer = forwardRef<CustomDrawerRef, CustomDrawerProps>(
  (
    {
      open,
      onOpenChange,
      size = "layer1",
      dismissible = true,
      children,
      header,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const isOpenRef = useRef(false);
    const [mounted, setMounted] = useState(false);

    const snapPoints = useMemo(() => drawerSnapPoints[size], [size]);

    const present = useCallback(() => {
      if (!isOpenRef.current) {
        setMounted(true);
        // BottomSheetModal needs a tick to mount before presenting
        requestAnimationFrame(() => {
          bottomSheetRef.current?.present();
        });
        isOpenRef.current = true;
        onOpenChange?.(true);
      }
    }, [onOpenChange]);

    const dismiss = useCallback(() => {
      if (isOpenRef.current) {
        bottomSheetRef.current?.dismiss();
        isOpenRef.current = false;
        onOpenChange?.(false);
      }
    }, [onOpenChange]);

    const toggle = useCallback(() => {
      if (isOpenRef.current) {
        dismiss();
      } else {
        present();
      }
    }, [present, dismiss]);

    useImperativeHandle(ref, () => ({ open: present, close: dismiss, toggle }), [
      present,
      dismiss,
      toggle,
    ]);

    // Controlled mode: react to `open` prop changes
    React.useEffect(() => {
      if (open === undefined) return; // uncontrolled mode
      if (open) {
        present();
      } else {
        dismiss();
      }
    }, [open, present, dismiss]);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          isOpenRef.current = false;
          onOpenChange?.(false);
          setMounted(false);
        }
      },
      [onOpenChange]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={dismissible ? "close" : "none"}
        />
      ),
      [dismissible]
    );

    if (!mounted) return null;

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        enableDynamicSizing={false}
        enablePanDownToClose={dismissible}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#fff" }}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingBottom: 24,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {header && <View style={{ marginBottom: 16 }}>{header}</View>}
          <View style={{ flex: 1 }}>{children}</View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

CustomDrawer.displayName = "CustomDrawer";
