// import React from "react";
// import { Layout as SharedLayout } from "@shared/components/Layout";
// import { Container } from "@/ui/Container";
// import { Header } from "@/ui/Header";
// import { MenuColumn } from "@/ui/MenuColumn";
// import { Footer } from "@/ui/Footer";
// import { Toast } from "@/ui/Toast";
// import type { LayoutProps, ToastProps } from "@shared/types";

// export type { LayoutProps };

// export const Layout: React.FC<LayoutProps> = (props) => {
//   return (
//     <SharedLayout
//       {...props}
//       Container={Container}
//       Header={Header}
//       Sidebar={MenuColumn}
//       Footer={Footer}
//       Toast={Toast as React.ComponentType<ToastProps>}
//     />
//   );
// };

import React from "react";
import { Toast } from "../Toast";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { MenuColumn } from "../MenuColumn";
import { Container } from "@platform/Container";
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
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  menuItems?: HeaderMenuItem[];
  breadcrumbItems?: BreadcrumbProps["items"];
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  toast?: ToastProps;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  language,
  onToggleLanguage,
  isEditing = false,
  menuItems = [],
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  breadcrumbItems = [],
  toast = { message: "", status: "success" },
}) => {
  return (
    <Container className="w-screen flex-1 h-[100vh] overflow-hidden">
      <div className="flex w-full">
        {showSidebar && (
          <MenuColumn language={language} isEditing={isEditing} />
        )}

        <div className="relative w-full overflow-auto h-[calc(100vh-80px)]">
          {showHeader && (
            <Header
              menuItems={menuItems}
              language={language}
              onToggleLanguage={onToggleLanguage}
              breadcrumbItems={breadcrumbItems}
              isEditing={isEditing}
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
    </Container>
  );
};
