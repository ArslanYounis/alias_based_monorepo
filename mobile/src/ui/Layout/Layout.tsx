import React from "react";
import { View, ScrollView } from "react-native";
import { Toast } from "../Toast";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Container } from "@platform/Container";
import type { ToastProps } from "@shared/types";

export interface HeaderMenuItem {
  label: string;
  label_ar?: string;
  onClick: () => void;
  className?: string;
}

interface LayoutProps {
  children?: React.ReactNode;
  language?: "en" | "ar";
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  toast?: ToastProps;
  topMargin?: number;
  bottomMargin?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  language,
  isEditing = false,
  showHeader = true,
  showFooter = true,
  toast = { message: "", status: "success" },
  topMargin = 0,
  bottomMargin = 0,
}) => {
  return (
    <View style={{ flex: 1, marginTop: topMargin, marginBottom: bottomMargin }}>
      {/* Fixed Header */}
      {showHeader && (
        <Container className="w-full bg-structure-header-background">
          <Header isEditing={isEditing} />
        </Container>
      )}

      {/* Toast Message */}
      {String(toast?.message)?.trim() ? (
        <Container className="relative w-full flex justify-center">
          <Toast message={String(toast?.message)} status={toast?.status} />
        </Container>
      ) : null}

      {/* Scrollable Content Area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {children}
      </ScrollView>

      {/* Fixed Footer */}
      {showFooter && (
        <Container
          className={`w-full bg-structure-footer-background ${
            isEditing ? "blur-xs pointer-events-none" : ""
          }`}
        >
          <Footer language={language} />
        </Container>
      )}
    </View>
  );
};
