import { useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { RadioCard } from "@platform/RadioCard";
import { OwnerIcon, CompanyIcon } from "@platform/icons";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import OwnerSearchByOwner from "./OwnerSearchByOwner";
import OwnerSearchByCompanyOwner from "./OwnerSearchByCompanyOwner";
import type { IOwnerSearchResult } from "./OwnerSearchResult";

interface OwnerTypeOptions {
  company: string;
  company_ar: string;
  owner: string;
  owner_ar: string;
}

export interface OwnerSearchProps {
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: OwnerTypeOptions;
  initialOwnerType?: "company" | "owner";
  theme?: "light" | "dark";
  language?: "en" | "ar";
  args?: string;
  platform?: "web" | "mobile";
}

const OwnerSearch = ({
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
  initialOwnerType = "company",
  theme: _theme = "dark",
  selected = [],
  onSubmit = () => {},
  language = "en",
  args = "",
  platform = "web",
}: OwnerSearchProps) => {
  const [ownerType, setOwnerType] = useState<"owner" | "company">(
    initialOwnerType
  );

  const handleOwnerTypeChange = (id?: string) => {
    if (id) {
      setOwnerType(id as "owner" | "company");
    }
  };

  return (
    <Container
      className="flex flex-col w-full shrink-0"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {!!title && (
        <Text className="text-heading-h2 font-bold text-text-default mb-[14px]">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
          />
        </Text>
      )}
      {!!subtitle && (
        <Text className="text-m text-text-default mb-xl">
          <SharedLanguageSwitchRenderer
            language={language}
            value={subtitle}
            value_ar={subtitle_ar || subtitle}
          />
        </Text>
      )}

      {/* RadioCard Tab Selection */}
      <Container className="mb-xl flex flex-row justify-center items-center gap-xl">
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
      </Container>

      {/* Conditional Forms */}
      {ownerType === "company" && (
        <OwnerSearchByCompanyOwner
          selected={selected}
          onSubmit={onSubmit}
          language={language}
          args={args}
          platform={platform}
        />
      )}
      {ownerType === "owner" && (
        <OwnerSearchByOwner
          selected={selected}
          onSubmit={onSubmit}
          language={language}
          args={args}
          platform={platform}
        />
      )}
    </Container>
  );
};

export default OwnerSearch;
