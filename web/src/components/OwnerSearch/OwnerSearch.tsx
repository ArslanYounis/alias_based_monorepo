import React, { useState } from "react";
import type { OwnerSearchMainProps } from "@shared/types";
import OwnerIcon from "@/assets/svg/ownerIcon";
import CompanyIcon from "@/assets/svg/companyIcon";
import { RadioCard } from "@/ui/RadioCard";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import SearchByOwner from "./SearchByOwner";
import SearchByCompanyOwner from "./SearchByCompanyOwner";

const DEFAULT_OWNER_TYPE_OPTIONS = {
  company: "By Company Owner",
  company_ar: "حسب مالك الشركة",
  owner: "By Owner",
  owner_ar: "حسب المالك",
};

const OwnerSearch: React.FC<OwnerSearchMainProps> = ({
  title = "",
  title_ar = "",
  subtitle = "",
  subtitle_ar = "",
  ownerTypeOptions = DEFAULT_OWNER_TYPE_OPTIONS,
  initialOwnerType = "company",
  theme = "dark",
  selected = [],
  onSubmit = () => {},
  language = "en",
}) => {
  const [ownerType, setOwnerType] = useState<"owner" | "company">(
    initialOwnerType
  );

  const handleOwnerTypeChange = (id?: string) => {
    if (id) setOwnerType(id as "owner" | "company");
  };

  return (
    <div
      className="flex flex-1 flex-col"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {!!title && (
        <p className="text-heading-h2 font-bold text-text-default mb-[14px]">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
          />
        </p>
      )}
      {!!subtitle && (
        <p className="text-m text-text-default mb-8">
          <SharedLanguageSwitchRenderer
            language={language}
            value={subtitle}
            value_ar={subtitle_ar || subtitle}
          />
        </p>
      )}

      {/* RadioCard Selection — order matches ADREC: company first, then owner */}
      <div className="mb-8 flex flex-row justify-center items-center gap-[32px]">
        <RadioCard
          icon={
            <CompanyIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
          }
          label={ownerTypeOptions.company}
          label_ar={ownerTypeOptions.company_ar}
          iconLocation="top"
          clicked={ownerType === "company"}
          id="company"
          onClick={handleOwnerTypeChange}
          language={language}
        />
        <RadioCard
          icon={
            <OwnerIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
          }
          label={ownerTypeOptions.owner}
          label_ar={ownerTypeOptions.owner_ar}
          iconLocation="top"
          clicked={ownerType === "owner"}
          id="owner"
          onClick={handleOwnerTypeChange}
          language={language}
        />
      </div>

      {ownerType === "company" && (
        <SearchByCompanyOwner
          theme={theme}
          selected={selected}
          onSubmit={onSubmit}
          language={language}
        />
      )}
      {ownerType === "owner" && (
        <SearchByOwner
          theme={theme}
          selected={selected}
          onSubmit={onSubmit}
          language={language}
        />
      )}
    </div>
  );
};

export default OwnerSearch;
