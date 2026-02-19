export interface FilterBarProps {
  theme?: "light" | "dark";
  sortOptions?: string[];
  applicationOptions?: string[];
  searchValue?: string;
  onSearchChange?: (e: { target: { value: string } }) => void;
  onReset?: () => void;
  language?: "en" | "ar";
}
