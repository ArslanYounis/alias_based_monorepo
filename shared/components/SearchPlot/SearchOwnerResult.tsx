import React, { useEffect } from "react";
import { some } from "lodash";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { Pagination } from "@platform/Pagination";
import { CustomDrawer } from "@platform/CustomDrawer";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import {
  useGetOwnerPlots,
  type IOwnerPlotsSearchResult,
} from "../../hooks/useGetOwnerPlots";
import ViewOwnerDetail from "../ViewOwnerDetail/ViewOwnerDetail";
import SearchOwnerPlotsResult from "./SearchOwnerPlotsResult";

export interface IOwnerSearchResult {
  id?: string;
  cityName?: string;
  ownerId: string;
  ownerName?: string;
  ownerName_ar?: string;
  nationalNumber?: string;
  moiUnifiedNumber?: string;
  nationalityName?: string;
  nationalityName_ar?: string;
  backgroundColor?: string;
  language?: boolean;
  ownerName_E?: string;
  ownerName_A?: string;
}

interface SearchResultsModalProps {
  ownerName: string;
  isLoading: boolean;
  results: IOwnerSearchResult[];
  pageSize: number;
  totalCount: number;
  onCloseDrawer?: () => void;
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerPlotsSearchResult) => void;
  language: "en" | "ar";
  onPageChange?: (page: number) => void;
  args?: string;
  platform?: "web" | "mobile";
}

const getLanguageSwitchText = ({
  language,
  value,
  value_ar,
}: {
  language: "en" | "ar";
  value?: string;
  value_ar?: string;
}): string => (language === "ar" ? value_ar || value || "" : value || "");

const SearchOwnerResult: React.FC<SearchResultsModalProps> = ({
  ownerName,
  results,
  isLoading,
  onCloseDrawer,
  selected = [],
  onSubmit = () => {},
  language,
  pageSize,
  totalCount,
  onPageChange,
  args: _args,
  platform = "web",
}) => {
  const [selectedIds, setSelectedIds] =
    React.useState<IOwnerSearchResult[]>(selected);
  const [selectedOwnerDetail, setSelectedOwnerDetail] =
    React.useState<IOwnerSearchResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isPlotsDrawerOpen, setIsPlotsDrawerOpen] = React.useState(false);
  const [plotsOwnerId, setPlotsOwnerId] = React.useState<string | null>(null);
  const [selectedPlots, setSelectedPlots] = React.useState<
    IOwnerPlotsSearchResult[]
  >([]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const {
    data: ownerPlots,
    refetch: fetchOwnerPlots,
    isFetching: isFetchingOwnerPlots,
  } = useGetOwnerPlots(plotsOwnerId ?? "");

  const selectOwnerForPlots = (
    owner: IOwnerSearchResult,
    options?: { openDrawer?: boolean }
  ) => {
    if (!owner?.id) return;
    setPlotsOwnerId(owner.id);
    setSelectedIds([owner]);
    setSelectedOwnerDetail(owner);
    if (options?.openDrawer) {
      setIsPlotsDrawerOpen(true);
    }
  };

  useEffect(() => {
    if (plotsOwnerId && isPlotsDrawerOpen) {
      fetchOwnerPlots();
    }
  }, [plotsOwnerId, isPlotsDrawerOpen, fetchOwnerPlots]);

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

  const handleSelectPlot = (plot: IOwnerPlotsSearchResult) => {
    setSelectedPlots([plot]);
  };

  const renderResultCard = (result: IOwnerSearchResult, index: number) => {
    const isSelected = some(
      selectedIds,
      (val) => val.ownerId === result?.ownerId
    );

    return (
      <Container
        key={index}
        className={`mb-m rounded-xs px-l py-m w-full min-h-[136px] flex flex-col justify-between cursor-pointer border border-cards-stroke ${
          isSelected
            ? "bg-cards-searchResult-selected"
            : "bg-cards-searchResult"
        }`}
      >
        <Container className="flex flex-row justify-between mb-s">
          <Text className={`text-bold-l text-text-default line-clamp-2 min-w-0 flex-1 me-xxs`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={result.ownerName_E}
              value_ar={result.ownerName_A || result.ownerName_E}
            />
          </Text>
          <Container className="flex flex-row items-center gap-m shrink-0">
            <Buttons
              title="Plots"
              title_ar="القطع"
              size="s"
              type="secondary"
              language={language}
              onClick={() => selectOwnerForPlots(result, { openDrawer: true })}
            />
            <Buttons
              title="Details"
              title_ar="التفاصيل"
              size="s"
              type="secondary"
              language={language}
              onClick={() => {
                setSelectedOwnerDetail(result);
                setIsDrawerOpen(true);
              }}
            />
          </Container>
        </Container>
        {[
          {
            label: "UAE Nation Number",
            label_ar: "الرقم الوطني الإماراتي",
            value: result.nationalNumber,
            value_ar: result.nationalNumber,
          },
          {
            label: "City",
            label_ar: "المدينة",
            value: result.cityName,
            value_ar: result.cityName,
          },
        ].map(({ label, label_ar, value, value_ar }, idx, array) => (
          <Container
            key={label}
            className={`flex flex-row ${
              idx !== array.length - 1
                ? "border-b pb-xs border-text-dimmed mb-xs"
                : ""
            }`}
          >
            <Container className="w-1/2">
              <Text className={`text-bold-m text-text-default`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={label}
                  value_ar={label_ar || label}
                />
              </Text>
            </Container>
            <Container className="w-1/2">
              <Text className={`text-m break-words text-text-default`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={value || ""}
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
          <Container className="text-text-default flex items-center justify-center">
            <Text className="text-m text-text-dimmed">Loading...</Text>
          </Container>
        ) : (
          <>
            <Container className="flex flex-col gap-s pb-xl">
              <Text className={`text-m text-text-default`}>
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
                    value_ar="نتائج"
                  />
                </Text>{" "}
                <SharedLanguageSwitchRenderer
                  language={language}
                  value="for the following search criteria:"
                  value_ar="لمعايير البحث التالية:"
                />
              </Text>
              <Container className="flex flex-row items-center gap-xs flex-wrap">
                <Text className={`text-bold-m text-text-default`}>
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={ownerName}
                    value_ar={ownerName}
                  />
                </Text>
                <Text className="text-text-dimmed">|</Text>
                <Container onClick={onCloseDrawer} className="cursor-pointer">
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
            {results.length > 0 && (
              <Container className="flex justify-end items-start">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showPageNumbers={true}
                  position="right"
                  pageSize={pageSize}
                  totalCount={totalCount}
                  language={language}
                />
              </Container>
            )}
          </>
        )}
      </Container>

      {/* Owner detail drawer */}
      <CustomDrawer
        size="layer2"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        <ViewOwnerDetail
          owner={{
            details: [
              {
                label: "UAE National ID",
                label_ar: "الهوية الوطنية الإماراتية",
                value: selectedOwnerDetail?.nationalNumber || "N/A",
                value_ar: selectedOwnerDetail?.nationalNumber || "N/A",
              },
              {
                label: "MOI Unified Number",
                label_ar: "الرقم الموحد لوزارة الداخلية",
                value: selectedOwnerDetail?.moiUnifiedNumber || "N/A",
                value_ar: selectedOwnerDetail?.moiUnifiedNumber || "N/A",
              },
              {
                label: "Archive Number",
                label_ar: "رقم الأرشيف",
                value: "--",
                value_ar: "--",
              },
              {
                label: "Nationality",
                label_ar: "الجنسية",
                value: selectedOwnerDetail?.nationalityName || "Unknown",
                value_ar: selectedOwnerDetail?.nationalityName_ar || "Unknown",
              },
              {
                label: "Special Nationality",
                label_ar: "الجنسية الخاصة",
                value: "--",
                value_ar: "--",
              },
              {
                label: "Share",
                label_ar: "مشاركة",
                value: "--",
                value_ar: "--",
              },
              {
                label: "Right Hold Type",
                label_ar: "نوع حق الملكية",
                value: "--",
                value_ar: "--",
              },
            ],
            name: getLanguageSwitchText({
              language,
              value: selectedOwnerDetail?.ownerName_E || "Unknown Owner",
              value_ar:
                selectedOwnerDetail?.ownerName_A ||
                selectedOwnerDetail?.ownerName_E ||
                "مالك غير معروف",
            }),
          }}
          language={language}
        />
      </CustomDrawer>

      {/* Owner plots drawer */}
      <CustomDrawer
        size="layer2"
        language={language}
        open={isPlotsDrawerOpen}
        onOpenChange={setIsPlotsDrawerOpen}
      >
        <SearchOwnerPlotsResult
          plots={ownerPlots?.ownerPlots}
          isLoading={isFetchingOwnerPlots}
          language={language}
          selectedPlots={selectedPlots}
          onSelectPlot={handleSelectPlot}
          onSubmit={onSubmit}
          onCloseDrawer={() => setIsPlotsDrawerOpen(false)}
        />
      </CustomDrawer>
    </Container>
  );
};

export default SearchOwnerResult;
