import { useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { RadioCard } from "@platform/RadioCard";
import { PlotIcon, OwnerIcon, CompanyIcon } from "@platform/icons";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import ByPlot from "./ByPlot";
import ByOwner from "./ByOwner";
import ByCompanyOwner from "./ByCompanyOwner";
import type { SearchResult } from "./SearchPlotResults";
import type { IOwnerPlotsSearchResult } from "./SearchOwnerPlotsResult";
import { ScrollContainer } from "@platform/ScrollContainer";

interface PlotTypeOptions {
  plot: string;
  plot_ar: string;
  company: string;
  company_ar: string;
  owner: string;
  owner_ar: string;
  randomAllocation: string;
  randomAllocation_ar: string;
}

export interface SearchPlotProps {
  selected?: SearchResult[] | null;
  onSubmit?: (val: SearchResult | IOwnerPlotsSearchResult) => void;
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: PlotTypeOptions;
  initialOwnerType?: "plot" | "company" | "owner" | "randomAllocation";
  theme?: "light" | "dark";
  language?: "en" | "ar";
  args?: string;
  enabledTabs?: {
    plot?: boolean;
    company?: boolean;
    owner?: boolean;
    randomAllocation?: boolean;
  };
  platform?: "web" | "mobile";
}

const SearchPlot = ({
  args = "",
  title = "",
  title_ar = "",
  subtitle = "",
  subtitle_ar = "",
  ownerTypeOptions = {
    plot: "By Plot",
    plot_ar: "حسب قطعة الأرض",
    company: "By Company Owner",
    company_ar: "حسب مالك الشركة",
    owner: "By Owner",
    owner_ar: "حسب المالك",
    randomAllocation: "Random Allocation",
    randomAllocation_ar: "التخصيص العشوائي",
  },
  initialOwnerType = "plot",
  selected = [],
  onSubmit = () => {},
  language = "en",
  enabledTabs = {
    plot: true,
    company: true,
    owner: true,
    randomAllocation: true,
  },
  platform = "web",
}: SearchPlotProps) => {
  const allowedTabs = {
    plot: enabledTabs.plot !== false,
    company: enabledTabs.company === true,
    owner: enabledTabs.owner === true,
    randomAllocation: enabledTabs.randomAllocation === true,
  };

  const safeSelected = Array.isArray(selected) ? selected : [];

  const [ownerType, setOwnerType] = useState<
    "plot" | "owner" | "company" | "randomAllocation"
  >(allowedTabs[initialOwnerType] ? initialOwnerType : "plot");

  const handleOwnerTypeChange = (id?: string) => {
    if (id) {
      setOwnerType(id as "plot" | "owner" | "company" | "randomAllocation");
    }
  };

  return (
    <Container
      className="flex flex-col w-full"
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

      {/* Owner Type Selection */}
      {platform === "web" ? (
        <Container className="flex flex-row gap-l mb-xl">
          <RadioCard
            icon={
              <PlotIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
            }
            label={ownerTypeOptions.plot}
            label_ar={ownerTypeOptions.plot_ar}
            iconLocation="top"
            clicked={ownerType === "plot"}
            id="plot"
            onClick={handleOwnerTypeChange}
            language={language}
          />
          {allowedTabs?.company && (
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
          )}
          {allowedTabs?.owner && (
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
          )}
          {allowedTabs?.randomAllocation && (
            <RadioCard
              icon={
                <OwnerIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
              }
              label={ownerTypeOptions.randomAllocation}
              label_ar={ownerTypeOptions.randomAllocation_ar}
              iconLocation="top"
              clicked={ownerType === "randomAllocation"}
              id="randomAllocation"
              language={language}
              disabled={true}
            />
          )}
        </Container>
      ) : (
        <ScrollContainer horizontal className="flex flex-row gap-xs w-full">
          <Container className="flex flex-row gap-l mb-xl">
            <RadioCard
              icon={
                <PlotIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
              }
              label={ownerTypeOptions.plot}
              label_ar={ownerTypeOptions.plot_ar}
              iconLocation="top"
              clicked={ownerType === "plot"}
              id="plot"
              onClick={handleOwnerTypeChange}
              language={language}
            />
            {allowedTabs?.company && (
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
            )}
            {allowedTabs?.owner && (
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
            )}
            {allowedTabs?.randomAllocation && (
              <RadioCard
                icon={
                  <OwnerIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
                }
                label={ownerTypeOptions.randomAllocation}
                label_ar={ownerTypeOptions.randomAllocation_ar}
                iconLocation="top"
                clicked={ownerType === "randomAllocation"}
                id="randomAllocation"
                language={language}
                disabled={true}
              />
            )}
          </Container>
        </ScrollContainer>
      )}

      {/* Render the selected form */}
      {ownerType === "plot" && allowedTabs?.plot && (
        <ByPlot
          args={args}
          selected={safeSelected}
          language={language}
          onSelectResult={(result) => onSubmit?.(result)}
          platform={platform}
        />
      )}
      {ownerType === "company" && allowedTabs?.company && (
        <ByCompanyOwner
          args={args}
          selected={safeSelected?.map((item) => ({
            ...item,
            ownerId: item?.ownerId ?? "",
          }))}
          language={language}
          onSubmit={(result) => onSubmit?.(result)}
          platform={platform}
        />
      )}
      {ownerType === "owner" && allowedTabs?.owner && (
        <ByOwner
          args={args}
          selected={safeSelected?.map((item) => ({
            ...item,
            ownerId: item.ownerId ?? "",
          }))}
          language={language}
          onSubmit={(result) => onSubmit?.(result)}
          platform={platform}
        />
      )}
    </Container>
  );
};

export default SearchPlot;
