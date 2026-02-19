import type { ViewPlotDetailProps } from "@shared/types";
import React from "react";

export type { ViewPlotDetailProps };

export const ViewPlotDetail: React.FC<ViewPlotDetailProps> = ({
  plotTitle = "Plot Title",
  plotTitle_ar,
  plotIds = [],
  ownerText = "Owner",
  ownerText_ar,
  showOwnerDetails = true,
  theme = "dark",
  language = "en",
}) => {
  return (
    <div
      className={`rounded-lg p-4 ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-text-default mb-4">
        {language === "ar" ? plotTitle_ar ?? plotTitle : plotTitle}
      </h3>
      {plotIds.length > 0 && (
        <p className="text-sm text-text-dimmed mb-2">
          IDs: {plotIds.join(", ")}
        </p>
      )}
      {showOwnerDetails && (
        <p className="text-sm text-text-default">
          {language === "ar" ? ownerText_ar ?? ownerText : ownerText}
        </p>
      )}
    </div>
  );
};
