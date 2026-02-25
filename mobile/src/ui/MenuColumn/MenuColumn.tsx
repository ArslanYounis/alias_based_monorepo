import React from "react";
import { View, Text } from "react-native";
import type { LayoutSidebarProps } from "@shared/types";

/**
 * MenuColumn — Layout sidebar. Stub until full migration from ADREC
 * stories/Navigation/menuColumn.tsx.
 */
export const MenuColumn: React.FC<LayoutSidebarProps> = ({
  language,
  theme: _theme,
  isEditing,
}) => {
  return (
    <View
      className={`w-[200px] p-4 border-r border-structure-stroke-default bg-structure-menu-background ${
        isEditing ? "opacity-60" : ""
      }`}
    >
      <Text className="font-semibold text-structure-menu-text mb-2">Menu</Text>
      <Text className="text-sm text-structure-menu-text">(MenuColumn stub — migrate from ADREC)</Text>
    </View>
  );
};
