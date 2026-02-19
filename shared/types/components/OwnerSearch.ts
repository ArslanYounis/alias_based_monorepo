export interface OwnerSearchOwnerTypeOptions {
  company?: string;
  company_ar?: string;
  owner?: string;
  owner_ar?: string;
}

export interface OwnerSearchProps {
  title?: string;
  title_ar?: string;
  theme?: "light" | "dark";
  ownerTypeOptions?: OwnerSearchOwnerTypeOptions;
  selected?: unknown[];
  onSubmit?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
