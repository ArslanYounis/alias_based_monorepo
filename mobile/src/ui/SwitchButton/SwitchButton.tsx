import React from "react";
import { Switch } from "react-native";
import { Container } from "@platform/Container";
import type { SwitchButtonProps } from "@shared/types";
export type { SwitchButtonProps };

export const SwitchButton: React.FC<SwitchButtonProps> = ({
  type,
  onToggle,
}) => {
  return (
    <Container className="flex-row items-center gap-xs">
      <Container className="flex-row items-center">
        <Switch
          trackColor={{
            false: "#E5E7EB", // text-dimmed equivalent
            true: "#008DCB", // text-link equivalent
          }}
          thumbColor="#FFFFFF" // Base-White
          ios_backgroundColor="#E5E7EB"
          onValueChange={onToggle}
          value={type === "Standard"}
          style={{
            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust size to match web (48x24)
          }}
        />
      </Container>
    </Container>
  );
};
