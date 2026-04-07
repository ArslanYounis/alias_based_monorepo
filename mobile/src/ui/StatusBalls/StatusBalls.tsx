import React from "react";
import { Container } from "@platform/Container";
import LinearGradient from "react-native-linear-gradient";

import type { StatusBallsProps } from "@shared/types";
export type { StatusBallsProps };

export const StatusBalls: React.FC<StatusBallsProps> = ({
  status = "pending",
  width = 16,
  height = 16,
}) => {
  const ballWidth = typeof width === "string" ? parseInt(width, 10) : width;
  const ballHeight = typeof height === "string" ? parseInt(height, 10) : height;

  // Gradient configurations
  const getGradientColors = (status: string): string[] => {
    switch (status) {
      case "pending":
        return ["#D0D0D1", "#A0A0A4"];
      case "inProgress":
        return ["#4DABF7", "#1971C2"];
      case "complete":
        return ["#2F9E44", "#8CE99A"];
      case "failed":
        return ["#F69EA1", "#EE3E43"];
      default:
        return ["#D0D0D1", "#A0A0A4"];
    }
  };

  if (status === "fixed") {
    return (
      <Container style={{ width: ballWidth, height: ballHeight }}>
        <LinearGradient
          colors={["#2F9E44", "#8CE99A"]}
          style={{
            width: ballWidth,
            height: ballHeight,
            borderRadius: ballWidth / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LinearGradient
            colors={["#F69EA1", "#EE3E43"]}
            style={{
              width: ballWidth * 0.5,
              height: ballHeight * 0.5,
              borderRadius: (ballWidth * 0.5) / 2,
              borderWidth: 1,
              borderColor: "white",
            }}
          />
        </LinearGradient>
      </Container>
    );
  }

  if (status === "mixed") {
    return (
      <Container
        style={{ width: ballWidth, height: ballHeight, flexDirection: "row" }}
      >
        <LinearGradient
          colors={["#F69EA1", "#EE3E43"]}
          style={{
            width: "50%",
            height: "100%",
            borderTopLeftRadius: ballWidth / 2,
            borderBottomLeftRadius: ballWidth / 2,
          }}
        />
        <LinearGradient
          colors={["#2F9E44", "#8CE99A"]}
          style={{
            width: "50%",
            height: "100%",
            borderTopRightRadius: ballWidth / 2,
            borderBottomRightRadius: ballWidth / 2,
          }}
        />
      </Container>
    );
  }

  return (
    <LinearGradient
      colors={getGradientColors(status)}
      style={{
        width: ballWidth,
        height: ballHeight,
        borderRadius: ballWidth / 2,
      }}
    />
  );
};
