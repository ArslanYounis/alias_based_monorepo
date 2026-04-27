import { useState } from "react";
import { Text } from "@platform/Text";
import { RadioCard } from "@platform/RadioCard";
import { Container } from "@platform/Container";
import { OwnerIcon, CompanyIcon } from "@platform/icons";

import SearchByOwner from "./searchByOwner";
import SearchByCompanyOwner from "./searchByComapnyOnwer";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import { DariOwnerSearchResultProps } from "../../hooks/useGetSearchByDariOwner";

interface DariOwnerTypeOptions {
  owner: string;
  owner_ar: string;
  company: string;
  company_ar: string;
}

export interface DariOwnerSearchProps {
  selected?: DariOwnerSearchResultProps[];
  onSubmit?: (val: DariOwnerSearchResultProps[]) => void;
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: DariOwnerTypeOptions;
  initialOwnerType?: "owner" | "company";
  language?: "en" | "ar";
  showTabs?: boolean;
  platform?: "web" | "mobile";
}

const DariOwnerSearch = ({
  title = "",
  title_ar = "",
  subtitle = "",
  subtitle_ar = "",
  ownerTypeOptions = {
    company: "By Company Owner",
    company_ar: "حسب مالك الشركة",
    owner: "By Owner",
    owner_ar: "حسب المالك",
  },
  initialOwnerType = "owner",
  selected = [],
  onSubmit = () => {},
  language = "en",
  showTabs = true,
  platform = "web",
}: DariOwnerSearchProps) => {
  const [ownerType, setOwnerType] = useState<"owner" | "company">(
    initialOwnerType
  );

  const handleOwnerTypeChange = (id?: string) => {
    if (id) {
      setOwnerType(id as "owner" | "company");
    }
  };

  return (
    <Container className="flex flex-1 flex-col">
      {!!title && (
        <Text className={`text-heading-h2 font-bold text-text-default mb-3.5`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
          />
        </Text>
      )}
      {subtitle && (
        <Text className={`text-m text-text-default mb-8`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={subtitle}
            value_ar={subtitle_ar || subtitle}
          />
        </Text>
      )}
      {/* RadioCard Selection */}
      {showTabs !== false && (
        <Container className="mb-8 flex flex-row justify-center items-center gap-[32px]">
          <RadioCard
            icon={
              <OwnerIcon className="w-[30px]! h-[30px]! sm:w-[50px]! sm:h-[50px]!" />
            }
            label={ownerTypeOptions.owner}
            label_ar={ownerTypeOptions.owner_ar}
            iconLocation="top"
            clicked={ownerType === "owner"}
            id="owner"
            onClick={handleOwnerTypeChange}
            language={language}
          />
          <RadioCard
            icon={
              <CompanyIcon className="w-[30px]! h-[30px]! sm:w-[50px]! sm:h-[50px]!" />
            }
            label={ownerTypeOptions.company}
            label_ar={ownerTypeOptions.company_ar}
            iconLocation="top"
            clicked={ownerType === "company"}
            id="company"
            onClick={handleOwnerTypeChange}
            language={language}
          />
        </Container>
      )}
      {/* Conditional Forms */}
      {ownerType === "owner" && (
        <SearchByOwner
          selected={selected}
          onSubmit={onSubmit}
          language={language}
          platform={platform}
        />
      )}
      {ownerType === "company" && (
        <SearchByCompanyOwner
          selected={selected}
          onSubmit={onSubmit}
          language={language}
          platform={platform}
        />
      )}
    </Container>
  );
};

export default DariOwnerSearch;
