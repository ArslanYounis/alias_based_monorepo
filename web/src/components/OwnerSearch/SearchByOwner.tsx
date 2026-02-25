import React, { useState } from "react";
import type {
  IOwnerSearchResult,
  SearchByOwnerPayload,
  SearchByOwnerProps,
  SearchByOwnerResponse,
} from "@shared/types";
import { TextInput } from "@/ui/TextInput";
import { NumberInput } from "@/ui/NumberInput";
import { Select } from "@/ui/Select";
import { MultiSelect } from "@/ui/MultiSelect";
import { Buttons } from "@/ui/Buttons";
import { CustomDrawer } from "@/ui/CustomDrawer";
import OwnerSearchResult from "./OwnerSearchResult";
import { SEARCH_BY_OWNER_OPTIONAL_FIELDS } from "./constants";

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

interface DrawerData {
  results: IOwnerSearchResult[];
  pageSize: number;
  totalCount: number;
  pageNumber: number;
  ownerName?: string;
  nationalNumber?: string;
  matchType?: string;
}

const SearchByOwner: React.FC<SearchByOwnerProps> = ({
  theme = "dark",
  language = "en",
  selected = [],
  onSubmit = () => {},
  onSearchByOwner,
}) => {
  const [nationalNumber, setNationalNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [matchType, setMatchType] = useState("1000");
  const [resultsDisplay, setResultsDisplay] = useState("5");
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [passportNumber, setPassportNumber] = useState("");
  const [abuDhabiArchiveNo, setAbuDhabiArchiveNo] = useState("");
  const [familyNoCity, setFamilyNoCity] = useState("");
  const [westernRegionArchiveNo, setWesternRegionArchiveNo] = useState("");
  const [moiUnifiedNumber, setMoiUnifiedNumber] = useState("");
  const [alAinArchiveNo, setAlAinArchiveNo] = useState("");

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const buildPayload = (pageNumber: number): SearchByOwnerPayload => {
    const pageSizeNum = Number(resultsDisplay) || 5;
    return {
      ownerName: ownerName || undefined,
      nationalNumber: nationalNumber || undefined,
      familyBookNumber: familyNoCity || undefined,
      cityNumber: familyNoCity || undefined,
      passPortNumber: passportNumber || undefined,
      moiUnifiedNumber: moiUnifiedNumber || undefined,
      matchTypeId: matchType || undefined,
      pageNumber,
      pageSize: pageSizeNum,
    };
  };

  const mapResponseToResults = (res: SearchByOwnerResponse): IOwnerSearchResult[] =>
    (res?.items?.map((item) => ({
      ...item,
      id: item?.ownerId != null ? String(item.ownerId) : undefined,
      ownerId: item?.ownerId != null ? String(item.ownerId) : "",
      ownerName: item?.ownerName ?? "",
    })) ?? []) as IOwnerSearchResult[];

  const handleSearch = async () => {
    setIsLoading(true);
    setDrawerData(null);
    const pageSizeNum = Number(resultsDisplay) || 5;
    try {
      if (onSearchByOwner) {
        const payload = buildPayload(0);
        const result = await onSearchByOwner(payload);
        const mapped = mapResponseToResults(result);
        setDrawerData({
          results: mapped,
          pageSize: pageSizeNum,
          totalCount: result?.totalCount ?? mapped.length,
          pageNumber: result?.pageNumber ?? 0,
          ownerName,
          nationalNumber,
          matchType,
        });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const mockResults: IOwnerSearchResult[] = [
          {
            ownerId: "1",
            ownerName: ownerName || "Sample Owner",
            nationalNumber: nationalNumber || "XXX-XXXXX-XXXX",
          },
        ];
        setDrawerData({
          results: mockResults,
          pageSize: pageSizeNum,
          totalCount: mockResults.length,
          pageNumber: 0,
          ownerName,
          nationalNumber,
          matchType,
        });
      }
      setDrawerOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (!drawerData || !onSearchByOwner) return;
    setIsLoading(true);
    try {
      const payload: SearchByOwnerPayload = {
        ...buildPayload(page - 1),
        ownerName: drawerData.ownerName,
        nationalNumber: drawerData.nationalNumber,
        matchTypeId: drawerData.matchType,
      };
      const result = await onSearchByOwner(payload);
      const mapped = mapResponseToResults(result);
      setDrawerData((prev) =>
        prev
          ? {
              ...prev,
              results: mapped,
              totalCount: result?.totalCount ?? prev.totalCount,
              pageNumber: result?.pageNumber ?? page - 1,
            }
          : null
      );
    } catch (e) {
      console.error("Owner search page change failed:", e);
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
      <div className="flex flex-1 flex-col gap-l" dir={language === "ar" ? "rtl" : "ltr"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-1 flex-col gap-l"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-l w-full">
            <NumberInput
              label="National Number"
              label_ar="الرقم الوطني"
              placeholder="National Number"
              placeholder_ar="الرقم الوطني"
              value={nationalNumber}
              onChange={setNationalNumber}
              language={language}
            />
            <TextInput
              label="Owner Name"
              label_ar="اسم المالك"
              placeholder="Owner Name"
              placeholder_ar="اسم المالك"
              value={ownerName}
              onChange={setOwnerName}
              language={language}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-l w-full">
            <TextInput
              label="Family Name"
              label_ar="اسم العائلة"
              placeholder="Family Name"
              placeholder_ar="اسم العائلة"
              value={familyName}
              onChange={setFamilyName}
              language={language}
            />
            <div />
          </div>

          {/* Optional fields — shown when user adds them via "Add search type" */}
          {visibleFields.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-l w-full">
              {visibleFields.includes("passportNumber") && (
                <TextInput
                  label="Passport Number"
                  label_ar="رقم الجواز"
                  placeholder="Passport Number"
                  placeholder_ar="رقم الجواز"
                  value={passportNumber}
                  onChange={setPassportNumber}
                  language={language}
                />
              )}
              {visibleFields.includes("abuDhabiArchiveNo") && (
                <NumberInput
                  label="Abu Dhabi Archive No."
                  label_ar="رقم أرشيف أبوظبي"
                  placeholder="Abu Dhabi Archive No."
                  placeholder_ar="رقم أرشيف أبوظبي"
                  value={abuDhabiArchiveNo}
                  onChange={setAbuDhabiArchiveNo}
                  language={language}
                />
              )}
              {visibleFields.includes("familyNoCity") && (
                <TextInput
                  label="Family No/City"
                  label_ar="رقم العائلة/المدينة"
                  placeholder="Family No/City"
                  placeholder_ar="رقم العائلة/المدينة"
                  value={familyNoCity}
                  onChange={setFamilyNoCity}
                  language={language}
                />
              )}
              {visibleFields.includes("westernRegionArchiveNo") && (
                <NumberInput
                  label="Western Region Archive No."
                  label_ar="رقم أرشيف المنطقة الغربية"
                  placeholder="Western Region Archive No."
                  placeholder_ar="رقم أرشيف المنطقة الغربية"
                  value={westernRegionArchiveNo}
                  onChange={setWesternRegionArchiveNo}
                  language={language}
                />
              )}
              {visibleFields.includes("moiUnifiedNumber") && (
                <NumberInput
                  label="MOI Unified Number"
                  label_ar="الرقم الموحد لوزارة الداخلية"
                  placeholder="MOI Unified Number"
                  placeholder_ar="الرقم الموحد لوزارة الداخلية"
                  value={moiUnifiedNumber}
                  onChange={setMoiUnifiedNumber}
                  language={language}
                />
              )}
              {visibleFields.includes("alAinArchiveNo") && (
                <NumberInput
                  label="Al Ain Archive Number"
                  label_ar="رقم أرشيف العين"
                  placeholder="Al Ain Archive Number"
                  placeholder_ar="رقم أرشيف العين"
                  value={alAinArchiveNo}
                  onChange={setAlAinArchiveNo}
                  language={language}
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-l pt-m w-full border-t border-border-light">
            <div className="grid grid-cols-2 gap-l">
              <Select
                label="Match Type"
                label_ar="نوع المطابقة"
                options={MATCH_TYPE_OPTIONS}
                value={matchType}
                onChange={setMatchType}
                language={language}
              />
              <Select
                label="Results to display"
                label_ar="النتائج المعروضة"
                options={RESULTS_DISPLAY_OPTIONS}
                value={resultsDisplay}
                onChange={setResultsDisplay}
                language={language}
              />
            </div>
            <div className="pt-m">
              <MultiSelect
                placeholder="Add search type"
                placeholder_ar="أضف نوع البحث"
                options={[...SEARCH_BY_OWNER_OPTIONAL_FIELDS]}
                value={visibleFields}
                onChange={(v) => setVisibleFields(Array.isArray(v) ? v : [])}
                language={language}
                showAddButton
              />
            </div>
          </div>

          <div>
            <Buttons
              title={isLoading ? "Searching..." : "Search"}
              title_ar={isLoading ? "جاري البحث" : "بحث"}
              type="secondary"
              onClick={handleSearch}
              language={language}
            />
          </div>
        </form>
      </div>

      <CustomDrawer
        size="layer1"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {drawerData && (
          <OwnerSearchResult
            results={drawerData.results}
            selected={selected}
            onSubmit={handleSubmitSelection}
            language={language}
            isLoading={isLoading}
            onClose={() => setDrawerOpen(false)}
            ownerName={drawerData.ownerName}
            pageSize={drawerData.pageSize}
            totalCount={drawerData.totalCount}
            currentPage={drawerData.pageNumber + 1}
            onPageChange={onSearchByOwner ? handlePageChange : undefined}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default SearchByOwner;
