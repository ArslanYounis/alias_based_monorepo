import { some } from "lodash";
import React, { useEffect } from "react";

import { Text } from "@platform/Text";
import { Radio } from "@platform/Radio";
import { Buttons } from "@platform/Buttons";
import { Container } from "@platform/Container";
import { Pagination } from "@platform/Pagination";
import { CustomDrawer } from "@platform/CustomDrawer";

import { ViewPlotDetail } from "../ViewPlotDetail";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface SearchResult {
  plotID?: number;
  landID?: number | null;
  districtNameAr?: string;
  districtNameEn?: string;
  districtNumber?: string;
  communityID?: number | null;
  communityNameAr?: string;
  communityNameEn?: string;
  communityNumber?: string;
  roadNameAr?: string;
  roadNameEn?: string;
  roadNumber?: string;
  plotNumber?: string;
  buildingNumber?: string | null;
  floorNumber?: string | null;
  unitNumber?: string | null;
  isBlocked?: boolean;
  isMortgaged?: boolean;
  landUseNameEn?: string;
  landUseNameAr?: string;
  propertyType?: number;
  municipalityID?: number;
  municipalityNameAr?: string;
  municipalityNameEn?: string;
  districtID?: number;
  roadID?: number;
}
interface SearchResultsModalProps {
  municipalityNameEn: string;
  municipalityNameAr?: string;
  zone: string;
  zone_ar?: string;
  sector: string;
  sector_ar?: string;
  pageSize: number;
  totalCount: number;
  results: SearchResult[];
  isLoading: boolean;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
  onCloseDrawer?: () => void;
  selected?: SearchResult[];
  onSubmit?: (val: SearchResult[]) => void;
  onSelectPlot?: () => void;
  onPageChange?: (page: number) => void;
  onSelectResult?: (result: SearchResult) => void;
}
const DariPlotSearchResult: React.FC<SearchResultsModalProps> = ({
  municipalityNameEn,
  municipalityNameAr,
  zone,
  zone_ar,
  sector,
  sector_ar,
  results,
  isLoading,
  pageSize,
  totalCount,
  onCloseDrawer,
  selected = [],
  language = "en",
  onPageChange,
  onSelectResult,
  platform = "web",
}) => {
  const [selectedIds, setSelectedIds] =
    React.useState<SearchResult[]>(selected);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleRadioSelect = (result: SearchResult) => {
    setSelectedIds([result]);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  useEffect(() => {
    setSelectedIds(selected);
  }, [selected]);

  // Get current page results
  const getCurrentPageResults = () => {
    if (!pageSize) return results;

    // If results likely represent a server page (only up to pageSize items) -> return directly
    if (results.length <= pageSize) {
      return results;
    }

    // Otherwise do client-side pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
  };

  const textColor = "text-text-default";

  const renderResultCard = (result: SearchResult, index: number) => {
    const isSelected = some(
      selectedIds,
      (val) => val.plotID === result?.plotID
    );

    return (
      <Container
        key={index}
        className={`mb-4 rounded-xs px-l py-m w-full min-h-[136px] flex flex-col justify-between cursor-pointer border border-cards-stroke ${
          isSelected
            ? "bg-cards-searchResult-selected"
            : "bg-cards-searchResult"
        }`}
        onClick={() => handleRadioSelect(result)}
      >
        <Container className="flex flex-row justify-between mb-s">
          <Text
            className={`text-bold-l text-text-default line-clamp-2 min-w-0 flex-1 me-xxs`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={result?.communityNameEn}
              value_ar={result?.communityNameAr || result?.communityNameEn}
            />
          </Text>
          <Container className="flex flex-row items-center gap-m shrink-0">
            <Buttons
              title="Owners"
              title_ar="المالكون"
              size="s"
              type="secondary"
              language={language}
              //   onClick={() => setOwnerPlotsDrawerOpen(true)}
            />
            <Buttons
              title="Details"
              title_ar="التفاصيل"
              size="s"
              type="secondary"
              language={language}
              onClick={() => {
                setDrawerOpen(true);
              }}
            />

            <Radio
              id={String(result?.plotID)}
              checked={isSelected}
              onChange={() => handleRadioSelect(result)}
            />
          </Container>
        </Container>
        {[
          {
            label: "Land Use",
            label_ar: "استخدام الأرض",
            value: result?.landUseNameEn,
            value_ar: result?.landUseNameAr || result.landUseNameEn,
          },
          {
            label: "Zone/District",
            label_ar: "رهن عقاري",
            value: result?.districtNameEn,
            value_ar: result?.districtNameAr,
          },
        ].map(({ label, label_ar, value, value_ar }, index, array) => (
          <Container
            key={label}
            className={`flex flex-row ${
              index !== array.length - 1
                ? "border-b pb-xs border-text-dimmed mb-xs"
                : ""
            }`}
          >
            <Container className="w-1/2">
              <Text className={`text-bold-m ${textColor}`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={label}
                  value_ar={label_ar || label}
                />
              </Text>
            </Container>
            <Container className="w-1/2">
              <Text className={`text-m break-words ${textColor}`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={value}
                  value_ar={value_ar || value}
                />
              </Text>
            </Container>
          </Container>
        ))}
      </Container>
    );
  };

  return (
    <Container dir={language === "ar" ? "rtl" : "ltr"}>
      <Container>
        <Text
          className={`${
            platform === "web" ? "text-heading-h1" : "text-heading-h3"
          } font-bold pb-xl text-text-default`}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value="Search Results"
            value_ar="نتائج البحث"
          />
        </Text>
        {isLoading ? (
          <Container className="text-text-default flex flex-row items-center justify-center">
            <SharedLanguageSwitchRenderer
              value="Loading..."
              value_ar="جارٍ التحميل..."
              language={language}
            />
          </Container>
        ) : (
          <>
            <Container className="flex flex-col gap-s pb-xl">
              <Text className={`text-m ${textColor}`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value="We returned"
                  value_ar="أعدنا"
                />{" "}
                <Text className="font-bold">
                  {results.length}{" "}
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="results"
                    value_ar="النتائج"
                  />
                </Text>{" "}
                <SharedLanguageSwitchRenderer
                  language={language}
                  value="for the following search criteria:"
                  value_ar="لمعايير البحث التالية:"
                />
              </Text>
              <Container className="flex flex-row items-center">
                {[
                  {
                    value: municipalityNameEn,
                    value_ar: municipalityNameAr || municipalityNameEn,
                  },
                  { value: zone, value_ar: zone_ar || zone },
                  { value: sector, value_ar: sector_ar || sector },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Text
                      className={`text-bold-m gap-xxs line-clamp-1 ${textColor}`}
                    >
                      <SharedLanguageSwitchRenderer
                        language={language}
                        value={item.value}
                        value_ar={item.value_ar}
                      />
                    </Text>
                    {idx < 2 && <Text className="text-text-dimmed">,</Text>}
                  </React.Fragment>
                ))}
                <Text className="text-text-dimmed mx-1">|</Text>
                <Container onClick={onCloseDrawer}>
                  <Text
                    className={`text-bold-m cursor-pointer hover:underline text-text-link-hover`}
                  >
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value="Edit"
                      value_ar="تعديل"
                    />
                  </Text>
                </Container>
              </Container>
            </Container>
            {getCurrentPageResults().map(renderResultCard)}
            <Container className="flex justify-between items-start">
              <Buttons
                title="Select Plot"
                title_ar="اختر القطعة"
                disabled={!selectedIds}
                size="l"
                language={language}
                onClick={() => {
                  if (selectedIds && selectedIds?.[0]) {
                    const selectedPlot = selectedIds[0];

                    if (onSelectResult) {
                      onSelectResult(selectedPlot);
                      onCloseDrawer?.();
                    }
                  }
                }}
              />
              <Container className="my-s">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                  showPageNumbers={true}
                  position="right"
                  pageSize={pageSize}
                  language={language}
                />
              </Container>
            </Container>
          </>
        )}
      </Container>
      {/* Plot Detail Drawer */}

      <CustomDrawer
        size="layer2"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {selectedIds && (
          <ViewPlotDetail
            language={language}
            plotIds={[String(selectedIds?.[0]?.plotID)]}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};
export default DariPlotSearchResult;
