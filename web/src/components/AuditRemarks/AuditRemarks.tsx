import type { AuditRemarksProps } from "@shared/types";
import React from "react";

export type { AuditRemarksProps };

export const AuditRemarks: React.FC<AuditRemarksProps> = ({
  title = "Audit Remarks",
  title_ar,
  registrationRemarks,
  theme = "dark",
  agent,
  applicationDetails = [],
  plots = [],
  owners = [],
  value,
  onChange,
  onOwnerClick,
  onPlotClick,
  language = "en",
}) => {
  return (
    <div
      className={`rounded-lg p-4 ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-text-default mb-4">
        {language === "ar" ? title_ar ?? title : title}
      </h3>
      {agent && (
        <p className="text-sm text-text-dimmed mb-2">
          {agent.name} · {agent.email}
        </p>
      )}
      {applicationDetails.length > 0 && (
        <div className="mb-4">
          {applicationDetails.map((app, i) => (
            <p key={i} className="text-sm text-text-default">
              {app.applicationNumber} · {app.referenceNumber}
            </p>
          ))}
        </div>
      )}
      {plots.length > 0 && (
        <div className="mb-4">
          {plots.map((plot, i) => (
            <button
              key={i}
              type="button"
              className="block text-left text-sm text-text-default hover:underline"
              onClick={() => onPlotClick?.({ plot } as Parameters<NonNullable<AuditRemarksProps["onPlotClick"]>>[0])}
            >
              {plot.code} · {plot.address}
            </button>
          ))}
        </div>
      )}
      {owners.length > 0 && (
        <div className="mb-4">
          {owners.map((owner, i) => (
            <button
              key={i}
              type="button"
              className="block text-left text-sm text-text-default hover:underline"
              onClick={() => onOwnerClick?.({ owner } as Parameters<NonNullable<AuditRemarksProps["onOwnerClick"]>>[0])}
            >
              {owner.name}
            </button>
          ))}
        </div>
      )}
      <textarea
        className="w-full p-3 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-text-default"
        rows={4}
        placeholder={language === "ar" ? "ملاحظات" : "Remarks"}
        value={value ?? ""}
        onChange={(e) => onChange?.(e as unknown as Parameters<NonNullable<AuditRemarksProps["onChange"]>>[0])}
      />
    </div>
  );
};
