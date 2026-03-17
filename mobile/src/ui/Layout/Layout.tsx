// import React from "react";
// import { Layout as SharedLayout } from "@shared/components/Layout";
// import { Container } from "~/src/ui/Container";
// import { Header } from "~/src/ui/Header";
// import { MenuColumn } from "~/src/ui/MenuColumn";
// import { Footer } from "~/src/ui/Footer";
// import { Toast } from "~/src/ui/Toast";
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
import { Container } from "@platform/Container";
import type { ToastProps } from "@shared/types";
import { ScrollView } from "react-native";

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
  showHeader?: boolean;
  showFooter?: boolean;
  toast?: ToastProps;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  language,
  isEditing = false,
  showHeader = true,
  showFooter = true,
  toast = { message: "", status: "success" },
}) => {
  return (
    <Container className="relative w-full h-[90vh] flex flex-col overflow-hidden">
      {/* Sticky Header */}
      {showHeader && (
        <Container className="sticky top-0 z-50 w-full bg-structure-header-background">
          <Header isEditing={isEditing} />
        </Container>
      )}

      {/* Toast Message - Positioned absolutely to overlay content */}
      <Container className="relative w-full flex justify-center">
        {String(toast?.message)?.trim() && (
          <Toast message={String(toast?.message)} status={toast?.status} />
        )}
      </Container>

      {/* Scrollable Content Area */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      {/* Sticky Footer */}
      {showFooter && (
        <Container
          className={`sticky bottom-0 w-full z-50 bg-structure-footer-background ${
            isEditing ? "blur-xs pointer-events-none" : ""
          }`}
        >
          <Footer language={language} />
        </Container>
      )}
    </Container>
  );
};
