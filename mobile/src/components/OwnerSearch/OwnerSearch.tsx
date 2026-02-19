import type { OwnerSearchProps } from "@shared/types";
import React, { useState } from "react";
import { View, Text } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
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
  const companyLabel = language === "ar" ? ownerTypeOptions.company_ar ?? ownerTypeOptions.company ?? "By Company Owner" : ownerTypeOptions.company ?? "By Company Owner";
  const ownerLabel = language === "ar" ? ownerTypeOptions.owner_ar ?? ownerTypeOptions.owner ?? "By Owner" : ownerTypeOptions.owner ?? "By Owner";

  return (
    <View style={{ padding: 16, backgroundColor: theme === "dark" ? "#262626" : "#f5f5f5", borderRadius: 8 }}>
      {(title || title_ar) && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            <SharedLanguageSwitchRenderer language={language} value={title} value_ar={title_ar} />
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <RadioCard id="company" label={companyLabel} label_ar={ownerTypeOptions.company_ar} iconLocation="left" language={language} clicked={ownerType === "company"} onClick={(id) => setOwnerType(id as "company")} />
        <RadioCard id="owner" label={ownerLabel} label_ar={ownerTypeOptions.owner_ar} iconLocation="left" language={language} clicked={ownerType === "owner"} onClick={(id) => setOwnerType(id as "owner")} />
      </View>
      <Buttons type="primary" size="m" title={language === "ar" ? "بحث" : "Search"} onClick={() => onSubmit?.({ ownerType, selected } as Parameters<NonNullable<OwnerSearchProps["onSubmit"]>>[0])} language={language} />
    </View>
  );
};
