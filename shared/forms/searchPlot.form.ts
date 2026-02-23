/**
 * SearchPlot form config: default values and validators per tab.
 * Use with TanStack Form in SearchPlot / PlotSearch (mobile + web).
 */
import {
  PlotSchema,
  PlotDefaultValues,
  CompanyOwnerSchema,
  CompanyOwnerDefaultValues,
  OwnerSchema,
  OwnerDefaultValues,
  type SearchPlotTabKey,
} from "../schemas";

export const SEARCH_PLOT_TABS: SearchPlotTabKey[] = ["plot", "company", "owner", "randomAllocation"];

export function getSearchPlotDefaultValues(tab: SearchPlotTabKey) {
  switch (tab) {
    case "plot":
      return { ...PlotDefaultValues };
    case "company":
      return { ...CompanyOwnerDefaultValues };
    case "owner":
      return { ...OwnerDefaultValues };
    default:
      return { ...PlotDefaultValues };
  }
}

export function getSearchPlotValidator(tab: SearchPlotTabKey) {
  switch (tab) {
    case "plot":
      return PlotSchema;
    case "company":
      return CompanyOwnerSchema;
    case "owner":
      return OwnerSchema;
    default:
      return PlotSchema;
  }
}

export {
  PlotDefaultValues,
  CompanyOwnerDefaultValues,
  OwnerDefaultValues,
  PlotSchema,
  CompanyOwnerSchema,
  OwnerSchema,
};
