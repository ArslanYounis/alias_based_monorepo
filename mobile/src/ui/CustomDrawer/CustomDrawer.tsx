import type { CustomDrawerProps, DrawerSize } from "@shared/types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

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
  backgroundClassName,
  className,
  dismissible = false,
  showCloseButton = true,
  children,
  language = "en",
  header,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => drawerSnapPoints[size], [size]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={dismissible ? "close" : "none"}
      />
    ),
    [dismissible]
  );

  // Sync open state with modal present/dismiss
  useEffect(() => {
    if (open) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [open]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={dismissible}
      onDismiss={() => onOpenChange?.(false)}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "transparent" }}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
    >
      <View
        className={`
          flex-1 rounded-t-2xl
          ${backgroundClassName ?? "bg-white"}
          ${className ?? ""}
        `}
      >
        {showCloseButton && (
          <TouchableOpacity
            onPress={() => onOpenChange?.(false)}
            style={{ alignSelf: language === "ar" ? "flex-start" : "flex-end", margin: 16 }}
            accessibilityLabel={language === "ar" ? "إغلاق" : "Close"}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>✕</Text>
          </TouchableOpacity>
        )}
        {header && <View className="px-xxxl pb-lg">{header}</View>}

        <View className="flex-1 px-xxxl gap-xl overflow-y-auto pb-xl">
          {children}
        </View>
      </View>
    </BottomSheetModal>
  );
};
