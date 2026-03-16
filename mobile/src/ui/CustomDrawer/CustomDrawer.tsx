import { View } from "react-native";
import type { CustomDrawerProps, DrawerSize } from "@shared/types";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

export type { CustomDrawerProps, DrawerSize };

const drawerSnapPoints: Record<DrawerSize, string[]> = {
  layer1: ["90%"],
  layer2: ["75%"],
  layer3: ["60%"],
};

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onOpenChange,
  size = "layer1",
  dismissible = true,
  children,
  header,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => drawerSnapPoints[size], [size]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onOpenChange?.(false);
      }
    },
    [onOpenChange]
  );

  // control open / close
  useEffect(() => {
    if (open) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [open]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enablePanDownToClose={dismissible}
      onChange={handleSheetChanges}
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
          overflow: "scroll",
        }}
      >
        {header && <View style={{ marginBottom: 16 }}>{header}</View>}

        <View style={{ flex: 1 }}>{children}</View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
