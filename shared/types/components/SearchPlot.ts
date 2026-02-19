export interface SearchPlotOwnerTypeOptions {
  plot?: string;
  plot_ar?: string;
  company?: string;
  company_ar?: string;
  owner?: string;
  owner_ar?: string;
}

export interface SearchPlotProps {
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: SearchPlotOwnerTypeOptions;
  initialOwnerType?: "plot" | "company" | "owner";
  enabledTabs?: { plot?: boolean; company?: boolean; owner?: boolean };
  selected?: unknown;
  onSubmit?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
