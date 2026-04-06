import { useMemo, type ReactNode } from "react";
import * as LucideIcons from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { iconRegistry } from "~/lib-index";

export interface IconProp {
  iconName: string;
  iconColor: string;
  iconType?: "remote" | "lucide";
  iconWidth?: number;
  iconHeight?: number;
}

export const useRenderIcon = (
  iconProp: IconProp | null | undefined,
  additionalProps?: Record<string, unknown>,
): ReactNode => {
  const iconData = useMemo(() => {
    if (!iconProp || !iconProp.iconName) return null;

    if (iconProp.iconType === "lucide") {
      const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[
        iconProp.iconName
      ];
      if (!IconComponent) return null;
      return {
        type: "lucide" as const,
        IconComponent,
        color: iconProp.iconColor || "#000000",
        width: iconProp.iconWidth ?? 24,
        height: iconProp.iconHeight ?? 24,
      };
    }

    const iconItem = iconRegistry[iconProp.iconName];
    if (!iconItem) return null;

    return {
      type: "remote" as const,
      IconComponent: iconItem.component,
      color: iconProp.iconColor || iconItem.iconColor,
    };
  }, [iconProp]);

  if (!iconData) return null;

  if (iconData.type === "lucide") {
    const { IconComponent, color, width } = iconData;
    return (
      <IconComponent
        color={color}
        size={width}
        {...additionalProps}
      />
    );
  }

  const { IconComponent, color } = iconData;
  return <IconComponent color={color} {...additionalProps} />;
};
