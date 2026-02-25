import React, { useState } from "react";
import { View } from "react-native";
import type { IOwnerSearchResult } from "@shared/types";
import { TextInput } from "~/src/ui/TextInput";
import { NumberInput } from "~/src/ui/NumberInput";
import { Select } from "~/src/ui/Select";
import { MultiSelect } from "~/src/ui/MultiSelect";
import { Buttons } from "~/src/ui/Buttons";
import { CustomDrawer } from "~/src/ui/CustomDrawer";
import OwnerSearchResult from "./OwnerSearchResult";
import { SEARCH_BY_COMPANY_OWNER_OPTIONAL_FIELDS } from "./constants";

const MATCH_TYPE_OPTIONS = [
  { value: "1000", label: "Contains", label_ar: "يحتوي على" },
  { value: "1001", label: "Start With", label_ar: "يبدأ بـ" },
  { value: "1002", label: "Ends With", label_ar: "ينتهي بـ" },
  { value: "1004", label: "Exact", label_ar: "مطابق تمامًا" },
];

const RESULTS_DISPLAY_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" },
];

export interface SearchByCompanyOwnerProps {
  theme?: "light" | "dark";
  language: "en" | "ar";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
}

interface DrawerData {
  results: IOwnerSearchResult[];
  pageSize: number;
  totalCount: number;
  pageNumber: number;
  companyName?: string;
}

const SearchByCompanyOwner: React.FC<SearchByCompanyOwnerProps> = ({
  theme = "dark",
  language = "en",
  selected = [],
  onSubmit = () => {},
}) => {
  const [companyName, setCompanyName] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [matchType, setMatchType] = useState("1000");
  const [resultsDisplay, setResultsDisplay] = useState("5");
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [tradeLicense, setTradeLicense] = useState("");
  const [westernRegionArchiveNo, setWesternRegionArchiveNo] = useState("");
  const [abuDhabiArchiveNo, setAbuDhabiArchiveNo] = useState("");
  const [alAinArchiveNo, setAlAinArchiveNo] = useState("");

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setDrawerData(null);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const mockResults: IOwnerSearchResult[] = [
        {
          ownerId: "c1",
          ownerName: companyName || "Sample Company",
          companyName: companyName || "Sample Company",
        },
      ];
      const pageSize = Number(resultsDisplay) || 5;
      setDrawerData({
        results: mockResults,
        pageSize,
        totalCount: mockResults.length,
        pageNumber: 0,
        companyName,
      });
      setDrawerOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSelection = (val: IOwnerSearchResult[]) => {
    onSubmit(val);
    setDrawerOpen(false);
  };

  return (
    <>
      <View className="flex flex-1 flex-col gap-l">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <TextInput
              label="Company Name"
              label_ar="اسم الشركة"
              placeholder="Company Name"
              placeholder_ar="اسم الشركة"
              value={companyName}
              onChange={setCompanyName}
              language={language}
            />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <NumberInput
              label="Certificate Number"
              label_ar="رقم الشهادة"
              placeholder="Certificate Number"
              placeholder_ar="رقم الشهادة"
              value={certificateNumber}
              onChange={setCertificateNumber}
              language={language}
            />
          </View>
        </View>

        {visibleFields.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {visibleFields.includes("tradeLicense") && (
              <View style={{ flex: 1, minWidth: 140 }}>
                <NumberInput
                  label="Trade License"
                  label_ar="رخصة تجارية"
                  placeholder="Trade License"
                  placeholder_ar="رخصة تجارية"
                  value={tradeLicense}
                  onChange={setTradeLicense}
                  language={language}
                />
              </View>
            )}
            {visibleFields.includes("westernRegionArchiveNo") && (
              <View style={{ flex: 1, minWidth: 140 }}>
                <NumberInput
                  label="Western Region Archive No."
                  label_ar="رقم أرشيف المنطقة الغربية"
                  placeholder="Western Region Archive No."
                  placeholder_ar="رقم أرشيف المنطقة الغربية"
                  value={westernRegionArchiveNo}
                  onChange={setWesternRegionArchiveNo}
                  language={language}
                />
              </View>
            )}
            {visibleFields.includes("abuDhabiArchiveNo") && (
              <View style={{ flex: 1, minWidth: 140 }}>
                <NumberInput
                  label="Abu Dhabi Archive No."
                  label_ar="رقم أرشيف أبوظبي"
                  placeholder="Abu Dhabi Archive No."
                  placeholder_ar="رقم أرشيف أبوظبي"
                  value={abuDhabiArchiveNo}
                  onChange={setAbuDhabiArchiveNo}
                  language={language}
                />
              </View>
            )}
            {visibleFields.includes("alAinArchiveNo") && (
              <View style={{ flex: 1, minWidth: 140 }}>
                <NumberInput
                  label="Al Ain Archive No."
                  label_ar="رقم أرشيف العين"
                  placeholder="Al Ain Archive No."
                  placeholder_ar="رقم أرشيف العين"
                  value={alAinArchiveNo}
                  onChange={setAlAinArchiveNo}
                  language={language}
                />
              </View>
            )}
          </View>
        )}

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Select
              label="Match Type"
              label_ar="نوع المطابقة"
              options={MATCH_TYPE_OPTIONS}
              value={matchType}
              onChange={setMatchType}
              language={language}
            />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Select
              label="Results to display"
              label_ar="النتائج المعروضة"
              options={RESULTS_DISPLAY_OPTIONS}
              value={resultsDisplay}
              onChange={setResultsDisplay}
              language={language}
            />
          </View>
        </View>

        <MultiSelect
          placeholder="Add search type"
          placeholder_ar="أضف نوع البحث"
          options={[...SEARCH_BY_COMPANY_OWNER_OPTIONAL_FIELDS]}
          value={visibleFields}
          onChange={(v) => setVisibleFields(Array.isArray(v) ? v : [])}
          language={language}
          showAddButton
        />

        <Buttons
          title={isLoading ? "Searching..." : "Search"}
          title_ar={isLoading ? "جاري البحث" : "بحث"}
          type="secondary"
          onClick={handleSearch}
          language={language}
        />
      </View>

      <CustomDrawer
        size="layer1"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {drawerData ? (
          <OwnerSearchResult
            results={drawerData.results}
            selected={selected}
            onSubmit={handleSubmitSelection}
            language={language}
            isLoading={isLoading}
            onClose={() => setDrawerOpen(false)}
            ownerName={drawerData.companyName}
            pageSize={drawerData.pageSize}
            totalCount={drawerData.totalCount}
            currentPage={drawerData.pageNumber + 1}
          />
        ) : null}
      </CustomDrawer>
    </>
  );
};

export default SearchByCompanyOwner;
