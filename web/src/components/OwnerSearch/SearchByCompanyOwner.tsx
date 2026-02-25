import React, { useState } from "react";
import type {
  IOwnerSearchResult,
  SearchByCompanyOwnerPayload,
  SearchByCompanyOwnerResponse,
  SearchByCompanyOwnerProps,
} from "@shared/types";
import { TextInput } from "@/ui/TextInput";
import { NumberInput } from "@/ui/NumberInput";
import { Select } from "@/ui/Select";
import { MultiSelect } from "@/ui/MultiSelect";
import { Buttons } from "@/ui/Buttons";
import { CustomDrawer } from "@/ui/CustomDrawer";
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

interface DrawerData {
  results: IOwnerSearchResult[];
  pageSize: number;
  totalCount: number;
  pageNumber: number;
  companyName?: string;
  matchType?: string;
}

const mapCompanyResponseToResults = (
  res: SearchByCompanyOwnerResponse
): IOwnerSearchResult[] =>
  (res?.items?.map((item) => ({
    ...item,
    id: item?.ownerId != null ? String(item.ownerId) : undefined,
    ownerId: item?.ownerId != null ? String(item.ownerId) : "",
    ownerName: (item as { companyName?: string }).companyName ?? item?.ownerName ?? "",
    companyName: (item as { companyName?: string }).companyName,
  })) ?? []) as IOwnerSearchResult[];

const SearchByCompanyOwner: React.FC<SearchByCompanyOwnerProps> = ({
  theme = "dark",
  language = "en",
  selected = [],
  onSubmit = () => {},
  onSearchByCompanyOwner,
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

  const buildPayload = (pageNumber: number): SearchByCompanyOwnerPayload => {
    const pageSizeNum = Number(resultsDisplay) || 5;
    return {
      companyName: companyName || undefined,
      certificateNumber: certificateNumber || undefined,
      tradeLicense: tradeLicense || undefined,
      westernRegionArchiveNo: westernRegionArchiveNo || undefined,
      abuDhabiArchiveNo: abuDhabiArchiveNo || undefined,
      alAinArchiveNo: alAinArchiveNo || undefined,
      matchType: matchType || undefined,
      pageNumber,
      pageSize: pageSizeNum,
    };
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setDrawerData(null);
    const pageSizeNum = Number(resultsDisplay) || 5;
    try {
      if (onSearchByCompanyOwner) {
        const payload = buildPayload(0);
        const result = await onSearchByCompanyOwner(payload);
        const mapped = mapCompanyResponseToResults(result);
        setDrawerData({
          results: mapped,
          pageSize: pageSizeNum,
          totalCount: result?.totalCount ?? mapped.length,
          pageNumber: result?.pageNumber ?? 0,
          companyName,
          matchType,
        });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        const mockResults: IOwnerSearchResult[] = [
          {
            ownerId: "c1",
            ownerName: companyName || "Sample Company",
            companyName: companyName || "Sample Company",
          },
        ];
        setDrawerData({
          results: mockResults,
          pageSize: pageSizeNum,
          totalCount: mockResults.length,
          pageNumber: 0,
          companyName,
          matchType,
        });
      }
      setDrawerOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (!drawerData || !onSearchByCompanyOwner) return;
    setIsLoading(true);
    try {
      const payload: SearchByCompanyOwnerPayload = {
        ...buildPayload(page - 1),
        companyName: drawerData.companyName,
        matchType: drawerData.matchType,
      };
      const result = await onSearchByCompanyOwner(payload);
      const mapped = mapCompanyResponseToResults(result);
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
      console.error("Company owner search page change failed:", e);
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
            <TextInput
              label="Company Name"
              label_ar="اسم الشركة"
              placeholder="Company Name"
              placeholder_ar="اسم الشركة"
              value={companyName}
              onChange={setCompanyName}
              language={language}
            />
            <NumberInput
              label="Certificate Number"
              label_ar="رقم الشهادة"
              placeholder="Certificate Number"
              placeholder_ar="رقم الشهادة"
              value={certificateNumber}
              onChange={setCertificateNumber}
              language={language}
            />
          </div>

          {/* Optional fields */}
          {visibleFields.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-l w-full">
              {visibleFields.includes("tradeLicense") && (
                <NumberInput
                  label="Trade License"
                  label_ar="رخصة تجارية"
                  placeholder="Trade License"
                  placeholder_ar="رخصة تجارية"
                  value={tradeLicense}
                  onChange={setTradeLicense}
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
              {visibleFields.includes("alAinArchiveNo") && (
                <NumberInput
                  label="Al Ain Archive No."
                  label_ar="رقم أرشيف العين"
                  placeholder="Al Ain Archive No."
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
                options={[...SEARCH_BY_COMPANY_OWNER_OPTIONAL_FIELDS]}
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
            ownerName={drawerData.companyName}
            pageSize={drawerData.pageSize}
            totalCount={drawerData.totalCount}
            currentPage={drawerData.pageNumber + 1}
            onPageChange={onSearchByCompanyOwner ? handlePageChange : undefined}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default SearchByCompanyOwner;
