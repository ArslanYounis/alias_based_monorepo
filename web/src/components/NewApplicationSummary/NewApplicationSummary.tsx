import type { NewApplicationSummaryProps } from "@shared/types";
import React, { useState } from "react";

export type { NewApplicationSummaryProps };

export const NewApplicationSummary: React.FC<NewApplicationSummaryProps> = ({
  title = "Application Summary",
  title_ar,
  applicationId,
  onPressPlotView,
  onPressOwnerAction,
  language = "en",
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left bg-neutral-50 dark:bg-neutral-800"
        onClick={() => setExpanded((e) => !e)}
      >
        <h3 className="text-lg font-bold text-text-default">
          {language === "ar" ? title_ar ?? title : title}
        </h3>
        <span className="text-text-dimmed">{expanded ? "▼" : "▶"}</span>
      </button>
      {expanded && (
        <div className="p-4">
          {applicationId && (
            <p className="text-sm text-text-dimmed mb-4">
              ID: {applicationId}
            </p>
          )}
          <button
            type="button"
            className="text-sm text-structure-primary-5 hover:underline"
            onClick={() => onPressPlotView?.()}
          >
            {language === "ar" ? "عرض القطعة" : "View plot"}
          </button>
          <button
            type="button"
            className="ml-4 text-sm text-structure-primary-5 hover:underline"
            onClick={() => onPressOwnerAction?.("edit", {})}
          >
            {language === "ar" ? "إجراء المالك" : "Owner action"}
          </button>
        </div>
      )}
    </div>
  );
};
