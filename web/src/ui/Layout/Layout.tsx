import React from "react";
import { Toast } from "../Toast";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { MenuColumn } from "../MenuColumn";
import type { BreadcrumbProps, ToastProps } from "@shared/types";

export interface HeaderMenuItem {
  label: string;
  label_ar?: string;
  onClick: () => void;
  className?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  language?: "en" | "ar";
  theme?: "light" | "dark";
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  menuItems?: HeaderMenuItem[];
  breadcrumbItems?: BreadcrumbProps["items"];
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  toast?: ToastProps;
  userName?: string;
  userNameAr?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  language,
  theme,
  onToggleLanguage,
  isEditing = false,
  menuItems = [],
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  breadcrumbItems = [],
  toast = { message: "", status: "success" },
  userName,
  userNameAr,
}) => {
  return (
    <div className="w-screen flex-1 h-[100vh] overflow-hidden">
      <div className="flex w-full">
        {showSidebar && (
          <MenuColumn language={language} theme={theme} isEditing={isEditing} />
        )}

        <div className="relative w-full overflow-auto h-[calc(100vh-80px)]">
          {showHeader && (
            <Header
              menuItems={menuItems}
              language={language}
              onToggleLanguage={onToggleLanguage}
              breadcrumbItems={breadcrumbItems}
              isEditing={isEditing}
              userName={userName}
              userName_ar={userNameAr}
            />
          )}

          <div className="relative w-full flex justify-center">
            {String(toast?.message)?.trim() && (
              <Toast message={String(toast?.message)} status={toast?.status} />
            )}
          </div>
          <div>{children}</div>
        </div>
      </div>
      {showFooter && (
        <div
          className={`absolute bottom-0 w-full z-50 bg-structure-footer-background  ${
            isEditing ? "blur-xs pointer-events-none" : ""
          }`}
        >
          <Footer language={language} />
        </div>
      )}
    </div>
  );
};
