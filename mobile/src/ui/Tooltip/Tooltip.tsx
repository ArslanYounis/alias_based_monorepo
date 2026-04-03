import type { TooltipProps, TooltipDirectionType } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { Text } from "@platform/Text";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { TooltipProps, TooltipDirectionType };

const directionClasses: Record<
  TooltipDirectionType,
  { wrapper: string; arrow: string }
> = {
  "top-left": {
    wrapper: "absolute top-0 left-4 -translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-primary-chrome-6",
  },
  "top-center": {
    wrapper: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-primary-chrome-6",
  },
  "top-right": {
    wrapper: "absolute top-0 right-4 translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-primary-chrome-6",
  },
  "bottom-left": {
    wrapper: "absolute bottom-0 left-4 -translate-x-1/2 translate-y-1/2",
    arrow:
      "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-primary-chrome-6",
  },
  "bottom-center": {
    wrapper: "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    arrow:
      "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-primary-chrome-6",
  },
  "bottom-right": {
    wrapper: "absolute bottom-0 right-4 translate-x-1/2 translate-y-1/2",
    arrow:
      "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-primary-chrome-6",
  },
  "left-top": {
    wrapper: "absolute top-4 left-0 -translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-primary-chrome-6",
  },
  "left-center": {
    wrapper: "absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-primary-chrome-6",
  },
  "left-bottom": {
    wrapper: "absolute bottom-4 left-0 -translate-x-1/2 translate-y-1/2",
    arrow:
      "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-primary-chrome-6",
  },
  "right-top": {
    wrapper: "absolute top-4 right-0 translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-primary-chrome-6",
  },
  "right-center": {
    wrapper: "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
    arrow:
      "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-primary-chrome-6",
  },
  "right-bottom": {
    wrapper: "absolute bottom-4 right-0 translate-x-1/2 translate-y-1/2",
    arrow:
      "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-primary-chrome-6",
  },
  none: { wrapper: "", arrow: "" },
};

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  text_ar,
  language = "en",
  direction = "none",
}) => {
  const styles = directionClasses[direction];
  return (
    <View className="relative w-fit max-w-[150px] bg-primary-chrome-6 rounded-lg px-3 py-4 text-center">
      <Text>
        <SharedLanguageSwitchRenderer
          language={language}
          value={text}
          value_ar={text_ar}
          className="text-base-white"
        />
      </Text>
      {direction !== "none" && (
        <View className={styles.wrapper}>
          <View className={styles.arrow} />
        </View>
      )}
    </View>
  );
};
