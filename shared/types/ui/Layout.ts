import type { ReactNode, ComponentType } from "react";
import type { HeaderMenuItem, HeaderProps } from "./Header";
import type { FooterProps } from "./Footer";
import type { ToastProps } from "./Toast";
import type { BreadcrumbItem } from "./Breadcrumb";

/** Public Layout props (ADREC contract). No platform primitives. */
export interface LayoutProps {
  children: ReactNode;
  language?: "en" | "ar";
  theme?: "light" | "dark";
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  menuItems?: HeaderMenuItem[];
  breadcrumbItems?: BreadcrumbItem[];
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  toast?: ToastProps;
}

/** Props passed by Layout to the Container slot. */
export interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
}

/** Props passed by Layout to the Sidebar slot (MenuColumn). */
export interface LayoutSidebarProps {
  language?: "en" | "ar";
  theme?: "light" | "dark";
  isEditing?: boolean;
}

/** Slot components injected by web or mobile. */
export interface LayoutSlots {
  Container: ComponentType<LayoutContainerProps>;
  Header: ComponentType<HeaderProps>;
  Sidebar: ComponentType<LayoutSidebarProps>;
  Footer: ComponentType<FooterProps>;
  Toast: ComponentType<ToastProps>;
}

/** Layout props used internally: public props + slots. */
export type LayoutPropsWithSlots = LayoutProps & LayoutSlots;
