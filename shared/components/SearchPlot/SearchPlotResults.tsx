import React, { useEffect } from "react";
import { some } from "lodash";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Radio } from "@platform/Radio";
import { Buttons } from "@platform/Buttons";
import { Pagination } from "@platform/Pagination";
import { CustomDrawer } from "@platform/CustomDrawer";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import ViewPlotDetail from "../ViewPlotDetail/ViewPlotDetail";

export interface SearchResult {
  plotId: string;
  ownerId?: string;
  plotNumber: string;
  plotNumber_ar?: string;
  landUseName: string;
  landUseName_ar?: string;
  districtName?: string;
  districtName_ar?: string;
  communityName?: string;
  hasMortgage?: boolean | string;
  code: string;
  code_ar?: string;
  backgroundColor?: string;
}

interface SearchResultsModalProps {
  args: string;
  municipality: string;
  municipality_ar?: string;
  zone: string;
  zone_ar?: string;
  sector: string;
  sector_ar?: string;
  pageSize: number;
  totalCount: number;
  results: SearchResult[];
  isLoading: boolean;
  language?: "en" | "ar";
  onCloseDrawer?: () => void;
  selected?: SearchResult[];
  onSubmit?: (val: SearchResult[]) => void;
  onSelectPlot?: () => void;
  onPageChange?: (page: number) => void;
  onSelectResult?: (result: SearchResult) => void;
  platform?: "web" | "mobile";
}

const SearchPlotResults: React.FC<SearchResultsModalProps> = ({
  municipality,
  municipality_ar,
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
  const [isOwnerPlotsDrawerOpen, setOwnerPlotsDrawerOpen] =
    React.useState(false);
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

  const getCurrentPageResults = () => {
    if (!pageSize) return results;
    if (results.length <= pageSize) return results;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
  };

  const textColor = "text-text-default";

  const renderResultCard = (result: SearchResult, index: number) => {
    const isSelected = some(
      selectedIds,
      (val) => val.plotId === result?.plotId
    );

    return (
      <Container
        key={index}
        className={`mb-m rounded-xs px-l py-m w-full min-h-[136px] flex flex-col justify-between cursor-pointer border border-cards-stroke ${
          isSelected
            ? "bg-cards-searchResult-selected"
            : "bg-cards-searchResult"
        }`}
        onClick={() => handleRadioSelect(result)}
      >
        <Container className="flex flex-row justify-between mb-s">
          <Text className={`text-bold-l line-clamp-2 min-w-0 flex-1 me-s ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={result?.communityName}
              value_ar={result?.communityName}
            />
          </Text>
          <Container className="flex flex-row flex-wrap items-center gap-m shrink-0">
            <Buttons
              title="Owners"
              title_ar="المالكون"
              size="s"
              type="secondary"
              language={language}
              onClick={() => setOwnerPlotsDrawerOpen(true)}
            />
            <Buttons
              title="Details"
              title_ar="التفاصيل"
              size="s"
              type="secondary"
              language={language}
              onClick={() => setDrawerOpen(true)}
            />
            <Radio
              id={result?.plotId}
              checked={isSelected}
              onChange={() => handleRadioSelect(result)}
            />
          </Container>
        </Container>
        {[
          {
            label: "Land Use",
            label_ar: "استخدام الأرض",
            value: result?.landUseName,
            value_ar: result?.landUseName_ar || result.landUseName,
          },
          {
            label: "Zone/District",
            label_ar: "رهن عقاري",
            value: result?.districtName,
            value_ar: result?.districtName,
          },
        ].map(({ label, label_ar, value, value_ar }, idx, array) => (
          <Container
            key={label}
            className={`flex flex-row ${
              idx !== array.length - 1
                ? "border-b border-text-dimmed pb-xs mb-xs"
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
          } font-bold mb-m text-text-default`}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value="Search Results"
            value_ar="نتائج البحث"
          />
        </Text>
        {isLoading ? (
          <Container className="text-text-default flex items-center justify-center">
            <Text className="text-m text-text-dimmed">
              <SharedLanguageSwitchRenderer
                language={language}
                value="Loading..."
                value_ar="جارٍ التحميل..."
              />
            </Text>
          </Container>
        ) : (
          <>
            <Container className="flex flex-col gap-s mb-xl">
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
              <Container className="flex flex-row items-center flex-wrap gap-y-xs">
                {[
                  {
                    value: municipality,
                    value_ar: municipality_ar || municipality,
                  },
                  { value: zone, value_ar: zone_ar || zone },
                  { value: sector, value_ar: sector_ar || sector },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Text
                      className={`text-bold-m gap-xxs line-clamp-2 ${textColor}`}
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
                size={platform === "web" ? "l" : "m"}
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
              <Container className="my-m">
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
            plotIds={[selectedIds?.[0]?.plotId]}
          />
        )}
      </CustomDrawer>

      {/* Plot Owners Drawer */}
      <CustomDrawer
        size="layer2"
        language={language}
        open={isOwnerPlotsDrawerOpen}
        onOpenChange={setOwnerPlotsDrawerOpen}
      >
        <Container className="p-l">
          <Text className="text-m text-text-dimmed">
            <SharedLanguageSwitchRenderer
              language={language}
              value="Loading owner plots..."
              value_ar="جارٍ تحميل قطع المالك..."
            />
          </Text>
        </Container>
      </CustomDrawer>
    </Container>
  );
};

export default SearchPlotResults;
