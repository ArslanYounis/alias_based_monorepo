import type { ProfileIconStatusProps } from "@shared/types";
import React from "react";
import { View, StyleSheet } from "react-native";

import AwaySvg from "~/assets/svg/statusSvg/Away";
import ArrowSvg from "~/assets/svg/statusSvg/Arrow";
import OnlineSvg from "~/assets/svg/statusSvg/Online";
import FailedSvg from "~/assets/svg/statusSvg/failed";

export type { ProfileIconStatusProps };

export const ProfileIconStatus: React.FC<ProfileIconStatusProps> = ({
  status,
  width = 18,
  height = 18,
}) => {
  const w = typeof width === "number" ? width : 18;
  const h = typeof height === "number" ? height : 18;
  const renderIcon = () => {
    switch (status) {
      case "pending":
        return <AwaySvg width={w} height={h} />;
      case "inProgress":
        return <ArrowSvg width={w} height={h} />;
      case "complete":
        return <OnlineSvg width={w} height={h} />;
      case "failed":
        return <FailedSvg width={w} height={h} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: w,
          height: h,
          borderRadius: w / 2,
        },
      ]}
    >
      {renderIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
