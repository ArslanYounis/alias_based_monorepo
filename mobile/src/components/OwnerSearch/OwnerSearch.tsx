import React, { useState } from "react";
import { View, Text } from "react-native"; // Text used for title/subtitle and icon placeholders
import type { OwnerSearchMainProps } from "@shared/types";
import { RadioCard } from "~/src/ui/RadioCard";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import SearchByOwner from "./SearchByOwner";
import SearchByCompanyOwner from "./SearchByCompanyOwner";

const DEFAULT_OWNER_TYPE_OPTIONS = {
  company: "By Company Owner",
  company_ar: "حسب مالك الشركة",
  owner: "By Owner",
  owner_ar: "حسب المالك",
};

// Placeholder icons (mobile can add real SVGs later)
const OwnerIconPlaceholder = () => (
  <View style={{ width: 50, height: 50, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>O</Text>
  </View>
);
const CompanyIconPlaceholder = () => (
  <View style={{ width: 50, height: 50, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>C</Text>
  </View>
);

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
    <View className="flex flex-1 flex-col" style={language === "ar" ? { direction: "rtl" } : undefined}>
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
        <Text className="text-m text-text-default mb-8">
          <SharedLanguageSwitchRenderer
            language={language}
            value={subtitle}
            value_ar={subtitle_ar || subtitle}
          />
        </Text>
      )}

      <View className="mb-8 flex flex-row justify-center items-center gap-8">
        <RadioCard
          icon={<CompanyIconPlaceholder />}
          label={ownerTypeOptions.company}
          label_ar={ownerTypeOptions.company_ar}
          iconLocation="top"
          clicked={ownerType === "company"}
          id="company"
          onClick={handleOwnerTypeChange}
          language={language}
        />
        <RadioCard
          icon={<OwnerIconPlaceholder />}
          label={ownerTypeOptions.owner}
          label_ar={ownerTypeOptions.owner_ar}
          iconLocation="top"
          clicked={ownerType === "owner"}
          id="owner"
          onClick={handleOwnerTypeChange}
          language={language}
        />
      </View>

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
    </View>
  );
};

export default OwnerSearch;
