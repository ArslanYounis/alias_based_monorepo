export interface BreadcrumbItem {
  label: string;
  label_ar?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  selectedItemIndex?: number;
  isSelectedHover?: boolean;
  language?: "en" | "ar";
}
