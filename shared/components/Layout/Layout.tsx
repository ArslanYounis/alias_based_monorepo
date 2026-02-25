import React from "react";
import type { LayoutPropsWithSlots } from "@shared/types";

const defaultToast = { message: "", status: "success" as const };

/**
 * Shared Layout: structure and props only. Renders via injected slot components
 * (Container, Header, Sidebar=MenuColumn, Footer, Toast).
 * Web and mobile import from Group 0: Container, Header, MenuColumn, Footer, Toast.
 */
export const Layout: React.FC<LayoutPropsWithSlots> = ({
  children,
  language,
  theme,
  onToggleLanguage,
  isEditing = false,
  menuItems = [],
  breadcrumbItems = [],
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  toast = defaultToast,
  Container,
  Header,
  Sidebar,
  Footer,
  Toast,
}) => {
  const toastMessage = String(toast?.message ?? "").trim();
  const showToast = toastMessage.length > 0;

  return (
    <Container className="layout-root">
      <Container className="layout-row">
        {showSidebar && (
          <Sidebar language={language} theme={theme} isEditing={isEditing} />
        )}
        <Container className="layout-main">
          {showHeader && (
            <Header
              menuItems={menuItems}
              language={language}
              onToggleLanguage={onToggleLanguage}
              breadcrumbItems={breadcrumbItems}
              isEditing={isEditing}
            />
          )}
          {showToast && (
            <Container className="layout-toast-wrap">
              <Toast message={toast.message} status={toast.status} />
            </Container>
          )}
          <Container className="layout-children">{children}</Container>
        </Container>
      </Container>
      {showFooter && (
        <Container className="layout-footer">
          <Footer language={language} logoType="hub" />
        </Container>
      )}
    </Container>
  );
};

export default Layout;
