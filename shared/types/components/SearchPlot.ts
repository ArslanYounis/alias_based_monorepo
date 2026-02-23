export interface SearchPlotOwnerTypeOptions {
  plot?: string;
  plot_ar?: string;
  company?: string;
  company_ar?: string;
  owner?: string;
  owner_ar?: string;
  randomAllocation?: string;
  randomAllocation_ar?: string;
}

/** Tab key for SearchPlot (matches source NewApplicationSearchPlotProps). */
export type SearchPlotOwnerType = "plot" | "company" | "owner" | "randomAllocation";

export interface SearchPlotEnabledTabs {
  plot?: boolean;
  company?: boolean;
  owner?: boolean;
  randomAllocation?: boolean;
}

/** Result from plot search (by plot). */
export interface SearchPlotResult {
  plotId?: number;
  ownerId?: string;
  [key: string]: unknown;
}

export interface SearchPlotProps {
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: SearchPlotOwnerTypeOptions;
  initialOwnerType?: SearchPlotOwnerType;
  enabledTabs?: SearchPlotEnabledTabs;
  /** Pre-selected results (e.g. from plot/owner/company search). */
  selected?: SearchPlotResult[] | null;
  onSubmit?: (result: SearchPlotResult) => void;
  /** Optional request/context argument passed to search forms. */
  args?: string;
  theme?: "light" | "dark";
  language?: "en" | "ar";
}
