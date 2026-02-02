import React, { useEffect, useMemo, useRef } from "react";
import { View, Pressable, Text } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

// import CrossIcon from "@/assets/svg/crossIcon";
// import BackDrawer from "@/assets/svg/backDrawer";

export type DrawerSize = "layer1" | "layer2" | "layer3";

export interface CustomDrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "left" | "right"; // kept for API compatibility
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
  showCloseButton = true,
  dismissible = true,
  children,
  language = "en",
  header,
  className,
}) => {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => drawerSnapPoints[size], [size]);

  // Open / Close sync
  useEffect(() => {
    if (open) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [open]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={open ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={dismissible}
      onClose={() => onOpenChange?.(false)}
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
        {/* Close Button */}
        {showCloseButton && (
          <View
            className={`flex-row px-6 pt-4 ${
              language === "ar" ? "justify-start" : "justify-end"
            }`}
          >
            <Pressable onPress={() => onOpenChange?.(false)}>
              {size === "layer1" ? (
                // <CrossIcon />
                <Text>close</Text>
              ) : (
                // <BackDrawer
                //   className={language === "ar" ? "rotate-180" : ""}
                // />
                <Text>open</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* Header */}
        {header && <View className="px-6 pb-4">{header}</View>}

        {/* Body */}
        <View className="flex-1 px-6 pb-6">{children}</View>
      </View>
    </BottomSheet>
  );
};
