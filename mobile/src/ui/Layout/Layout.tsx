import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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
  onProfileClick?: () => void;
  active?: string;
  onPressMenu?: (menuItem: string) => void;
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
  onProfileClick,
  active,
  onPressMenu,
}) => {
  return (
    <View style={{ flex: 1, marginTop: topMargin, marginBottom: bottomMargin }}>
      {/* Fixed Header */}
      {showHeader && (
        <Container className="w-full bg-structure-header-background">
          <Header isEditing={isEditing} onAvatarPress={onProfileClick} />
        </Container>
      )}

      {/* Toast Message */}
      {String(toast?.message)?.trim() ? (
        <Container className="relative w-full flex justify-center">
          <Toast message={String(toast?.message)} status={toast?.status} />
        </Container>
      ) : null}

      {/* Scrollable Content Area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Footer */}
      {showFooter && (
        <Container
          className={`w-full bg-structure-footer-background ${
            isEditing ? "blur-xs pointer-events-none" : ""
          }`}
        >
          <Footer
            language={language}
            active={active}
            onPressMenu={onPressMenu}
          />
        </Container>
      )}
    </View>
  );
};
