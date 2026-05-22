import type { ReactElement } from "react";

export type FilterBarProps = {
  language?: "en" | "ar";
  theme?: "light" | "dark";

  // SearchField props
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  searchPlaceholder_ar?: string;
  searchColumns?: string[];
  selectedSearchColumns?: string[];
  onSearchColumnsChange?: (cols: string[]) => void;

  // FilterButton props
  filterButtonLabel?: string;
  filterButtonLabel_ar?: string;
  filterButtonCount?: number;
  filterButtonIcon?: ReactElement;
  filterButtonClassName?: string;

  // DropdownFilter props
  filterOptions?: string[];
  sortOptions?: string[];
  applicationOptions?: string[];

  // Column/sort label
  mobileColumnTitle?: string;
  mobileColumnTitle_ar?: string;

  // Reset functionality
  onReset?: () => void;
  showResetButton?: boolean;
  resetButtonLabel?: string;
  resetButtonLabel_ar?: string;
};
