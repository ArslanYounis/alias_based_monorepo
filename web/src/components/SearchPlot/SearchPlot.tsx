import type { SearchPlotProps } from "@shared/types";
import React, { useState } from "react";

export type { SearchPlotProps };

type TabKey = "plot" | "company" | "owner";

export const SearchPlot: React.FC<SearchPlotProps> = ({
  title = "Search Plot",
  title_ar,
  subtitle = "Choose a plot by type",
  subtitle_ar,
  ownerTypeOptions = {},
  initialOwnerType = "plot",
  enabledTabs = { plot: true, company: true, owner: true },
  onSubmit,
  language = "en",
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>(initialOwnerType);

  const plotLabel =
    language === "ar"
      ? ownerTypeOptions.plot_ar ?? ownerTypeOptions.plot ?? "By Plot"
      : ownerTypeOptions.plot ?? "By Plot";
  const companyLabel =
    language === "ar"
      ? ownerTypeOptions.company_ar ?? ownerTypeOptions.company ?? "By Company Owner"
      : ownerTypeOptions.company ?? "By Company Owner";
  const ownerLabel =
    language === "ar"
      ? ownerTypeOptions.owner_ar ?? ownerTypeOptions.owner ?? "By Owner"
      : ownerTypeOptions.owner ?? "By Owner";

  return (
    <div
      className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-text-default mb-2">
        {language === "ar" ? title_ar ?? title : title}
      </h3>
      <p className="text-sm text-text-dimmed mb-4">
        {language === "ar" ? subtitle_ar ?? subtitle : subtitle}
      </p>
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700 mb-4">
        {enabledTabs.plot !== false && (
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === "plot" ? "border-b-2 border-structure-primary-5 font-medium" : ""}`}
            onClick={() => setActiveTab("plot")}
          >
            {plotLabel}
          </button>
        )}
        {enabledTabs.company !== false && (
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === "company" ? "border-b-2 border-structure-primary-5 font-medium" : ""}`}
            onClick={() => setActiveTab("company")}
          >
            {companyLabel}
          </button>
        )}
        {enabledTabs.owner !== false && (
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === "owner" ? "border-b-2 border-structure-primary-5 font-medium" : ""}`}
            onClick={() => setActiveTab("owner")}
          >
            {ownerLabel}
          </button>
        )}
      </div>
      <div className="py-2">
        {activeTab === "plot" && <p className="text-sm text-text-dimmed">Plot search form</p>}
        {activeTab === "company" && <p className="text-sm text-text-dimmed">Company search form</p>}
        {activeTab === "owner" && <p className="text-sm text-text-dimmed">Owner search form</p>}
      </div>
      <button
        type="button"
        className="px-4 py-2 rounded bg-structure-primary-5 text-white"
        onClick={() => onSubmit?.({ activeTab } as Parameters<NonNullable<SearchPlotProps["onSubmit"]>>[0])}
      >
        {language === "ar" ? "بحث" : "Search"}
      </button>
    </div>
  );
};
