import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll={false}
        enableResetScrollToCoords={false}
        extraScrollHeight={20}
      >
        {children}
      </KeyboardAwareScrollView>

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
