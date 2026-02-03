import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

export type DrawerSize = "layer1" | "layer2" | "layer3";

export interface CustomDrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DrawerSize;
  backgroundClassName?: string;
  showCloseButton?: boolean;
  className?: string;
  dismissible?: boolean;
  children?: React.ReactNode;
  language?: "en" | "ar";
  header?: React.ReactNode;
}

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
        {header && <View className="px-xxxl pb-lg">{header}</View>}

        <View className="flex-1 px-xxxl gap-xl overflow-y-auto pb-xl">
          {children}
        </View>
      </View>
    </BottomSheetModal>
  );
};
