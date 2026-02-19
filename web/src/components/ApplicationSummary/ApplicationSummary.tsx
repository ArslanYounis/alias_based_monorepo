import type { ApplicationSummaryProps } from "@shared/types";
import React from "react";

export type { ApplicationSummaryProps };

export const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  title = "Application Summary",
  title_ar,
  data = [],
  language = "en",
}) => {
  return (
    <div
      className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="p-4 text-lg font-bold text-text-default bg-neutral-50 dark:bg-neutral-800">
        {language === "ar" ? title_ar ?? title : title}
      </h3>
      <div className="p-4 grid gap-4">
        {Array.isArray(data) &&
          data.flat().map((section: unknown, i: number) => (
            <div
              key={i}
              className="p-3 rounded bg-neutral-50 dark:bg-neutral-800 text-sm text-text-default"
            >
              {typeof section === "object" && section !== null && "type" in section
                ? String((section as { type?: string }).type)
                : "—"}
            </div>
          ))}
      </div>
    </div>
  );
};
