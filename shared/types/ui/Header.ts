import type { BreadcrumbItem } from "./Breadcrumb";

export interface HeaderMenuItem {
  label: string;
  label_ar?: string;
  onClick: () => void;
  className?: string;
}

export interface HeaderProps {
  language?: "en" | "ar";
  checkinButtonText?: string;
  checkinButtonText_ar?: string;
  notificationsAriaLabel?: string;
  notificationsAriaLabel_ar?: string;
  notificationCount?: number;
  userName?: string;
  userName_ar?: string;
  avatarUrl?: string;
  languageText?: string;
  languageText_ar?: string;
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  menuItems?: HeaderMenuItem[];
  breadcrumbItems?: BreadcrumbItem[];
}
