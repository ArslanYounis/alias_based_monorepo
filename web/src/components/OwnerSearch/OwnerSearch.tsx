import type { OwnerSearchProps } from "@shared/types";
import React, { useState } from "react";
import { RadioCard } from "../../ui/RadioCard";
import { Buttons } from "../../ui/Buttons";

export type { OwnerSearchProps };

export const OwnerSearch: React.FC<OwnerSearchProps> = ({
  title,
  title_ar,
  theme = "dark",
  ownerTypeOptions = {},
  selected = [],
  onSubmit,
  language = "en",
}) => {
  const [ownerType, setOwnerType] = useState<"company" | "owner">("owner");
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
      className={`rounded-lg p-4 ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {(title || title_ar) && (
        <h3 className="text-lg font-bold text-text-default mb-4">
          {language === "ar" ? title_ar ?? title : title}
        </h3>
      )}
      <div className="flex flex-wrap gap-4 mb-4">
        <RadioCard
          id="company"
          label={companyLabel}
          label_ar={ownerTypeOptions.company_ar}
          iconLocation="left"
          language={language}
          clicked={ownerType === "company"}
          onClick={(id) => setOwnerType(id as "company")}
        />
        <RadioCard
          id="owner"
          label={ownerLabel}
          label_ar={ownerTypeOptions.owner_ar}
          iconLocation="left"
          language={language}
          clicked={ownerType === "owner"}
          onClick={(id) => setOwnerType(id as "owner")}
        />
      </div>
      <Buttons
        type="primary"
        size="m"
        title={language === "ar" ? "بحث" : "Search"}
        onClick={() => onSubmit?.({ ownerType, selected } as Parameters<NonNullable<OwnerSearchProps["onSubmit"]>>[0])}
        language={language}
      />
    </div>
  );
};
