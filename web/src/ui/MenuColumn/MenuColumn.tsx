import React from "react";
import type { LayoutSidebarProps } from "@shared/types";

/**
 * MenuColumn — Layout sidebar. Stub until full migration from ADREC
 * stories/Navigation/menuColumn.tsx (desktop collapsible + mobile drawer, menu items with icons).
 */
export const MenuColumn: React.FC<LayoutSidebarProps> = ({
  language,
  theme: _theme,
  isEditing,
}) => {
  return (
    <aside
      className={`hidden md:flex flex-col min-w-[200px] max-w-[240px] px-4 py-6 bg-structure-menu-background border-r border-structure-stroke-default ${
        isEditing ? "blur-sm pointer-events-none" : ""
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <span className="text-structure-menu-text font-medium">Menu</span>
      <span className="text-structure-menu-text text-sm mt-2">(MenuColumn stub — migrate from ADREC)</span>
    </aside>
  );
};
