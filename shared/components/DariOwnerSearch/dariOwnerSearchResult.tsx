import { some } from "lodash";
import React, { useEffect } from "react";

import { Text } from "@platform/Text";
import { Radio } from "@platform/Radio";
import { Buttons } from "@platform/Buttons";
import { Container } from "@platform/Container";
import { Pagination } from "@platform/Pagination";
import { CustomDrawer } from "@platform/CustomDrawer";

import ViewOwnerDetail from "../ViewOwnerDetail/ViewOwnerDetail";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

import useGetDariOwnerDetail from "../../hooks/useGetDariOwnerDetail";
import { DariOwnerSearchResultProps } from "../../hooks/useGetSearchByDariOwner";

interface SearchResultsModalProps {
  ownerName?: string;
  isLoading: boolean;
  results: DariOwnerSearchResultProps[];
  pageSize?: number;
  totalCount?: number;
  onCloseDrawer?: () => void;
  selected?: DariOwnerSearchResultProps[];
  onSubmit?: (val: DariOwnerSearchResultProps[]) => void;
  language: "en" | "ar";
  onPageChange?: (page: number) => void;
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

const DariOwnerSearchResult: React.FC<SearchResultsModalProps> = ({
  results,
  isLoading,
  onCloseDrawer,
  selected = [],
  onSubmit = () => {},
  totalCount,
  onPageChange,
  language,
  pageSize,
  platform = "web",
}) => {
  const [selectedIds, setSelectedIds] =
    React.useState<DariOwnerSearchResultProps[]>(selected);
  const [selectedOwnerDetail, setSelectedOwnerDetail] =
    React.useState<DariOwnerSearchResultProps | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { data: ownerDetailData, isPending: isOwnerDetailLoading } =
    useGetDariOwnerDetail(selectedOwnerDetail?.ownerId);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const safePageSize = pageSize ?? 10;
  const safeTotalCount = totalCount ?? results.length;

  const totalPages = Math.ceil(safeTotalCount / safePageSize);

  const handleRadioSelect = (value: DariOwnerSearchResultProps) => {
    setSelectedIds([value]);
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
    // const startIndex = (1 - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
  };

  const renderResultCard = (
    result: DariOwnerSearchResultProps,
    index: number
  ) => {
    const isSelected = some(
      selectedIds,
      (val) => val.ownerId === result?.ownerId
    );

    return (
      <Container
        key={index}
        className={`mb-4 rounded-xs px-l py-m w-full min-h-[136px] flex flex-col justify-between cursor-pointer 
          border border-cards-stroke ${
            isSelected
              ? "bg-cards-searchResult-selected"
              : "bg-cards-searchResult"
          }`}
        onClick={() => handleRadioSelect(result)}
      >
        <Container className="flex justify-between mb-3">
          <Text
            className={`text-bold-l text-text-default line-clamp-1 mr-xxs`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={result?.ownerNameEn}
              value_ar={result?.ownerNameAr || result?.ownerNameEn}
            />
          </Text>
          <Container className="flex items-center gap-4">
            <Buttons
              title="Details"
              title_ar="التفاصيل"
              size="s"
              type="secondary"
              language={language}
              onClick={() => {
                setSelectedOwnerDetail(result); // Set current result
                setIsDrawerOpen(true); // Open drawer
              }}
            />

            <Radio
              id={String(result?.ownerId ?? "")}
              checked={isSelected}
              onChange={() => handleRadioSelect(result)}
            />
          </Container>
        </Container>
        {[
          {
            label: "Family Name",
            label_ar: "اسم العائلة",
            value: result?.familyNameEn,
            value_ar: result?.familyNameAr,
          },
          {
            label: "Owner Source",
            label_ar: "مصدر المالك",
            value: result?.ownerSource,
            value_ar: result?.ownerSource,
          },
        ].map(({ label, label_ar, value, value_ar }, index, array) => (
          <Container
            key={label}
            className={`flex ${
              index !== array.length - 1
                ? "border-b pb-2 border-text-dimmed mb-2"
                : ""
            }`}
          >
            <Container className="sm:w-1/2 w-full">
              <Text className={`text-bold-m text-text-default`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={label}
                  value_ar={label_ar || label}
                />
              </Text>
            </Container>
            <Container className="sm:w-1/2 w-full">
              <Text className={`text-m wrap-break-word text-text-default`}>
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

  const handleSelectOwner = () => {
    if (selectedIds?.length > 0) {
      onSubmit?.(selectedIds);
      onCloseDrawer?.();
    }
  };

  return (
    <Container dir={language === "ar" ? "rtl" : "ltr"}>
      <Container>
        <Text
          className={`${
            platform === "web" ? "text-heading-h1" : "text-heading-h3"
          } font-bold pb-8 text-text-default`}
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
            <Container className="flex flex-col gap-3 pb-8">
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
              <Container className="flex items-center gap-2">
                {/* <span className={`text-bold-m text-text-default`}>
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={ownerName}
                    value_ar={ownerName}
                  />
                </span>
                <span className="text-text-dimmed">|</span> */}
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
            {results.length > 0 && (
              <Container className="flex justify-between items-start">
                <Buttons
                  title="Select Owner"
                  title_ar="اختر المالك"
                  disabled={!selectedIds?.length}
                  size={platform === "web" ? "l" : "m"}
                  onClick={handleSelectOwner}
                  language={language}
                />
                <Container className="my-s">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showPageNumbers={true}
                    position="right"
                    pageSize={safePageSize}
                    totalCount={safeTotalCount}
                    language={language}
                  />
                </Container>
              </Container>
            )}
          </>
        )}
      </Container>

      <CustomDrawer
        size="layer2"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        {isOwnerDetailLoading ? (
          <Container className="text-text-default flex flex-row items-center justify-center">
            <SharedLanguageSwitchRenderer
              value="Loading..."
              value_ar="جارٍ التحميل..."
              language={language}
            />
          </Container>
        ) : (
          <ViewOwnerDetail
            ownerText=""
            ownerText_ar=""
            owner={{
              name: getLanguageSwitchText({
                language,
                value: ownerDetailData?.ownernameEn || "Unknown Owner",
                value_ar:
                  ownerDetailData?.ownernameAr ||
                  ownerDetailData?.ownernameEn ||
                  "مالك غير معروف",
              }),
              details: [
                {
                  label: "Nationality",
                  label_ar: "الجنسية",
                  value: ownerDetailData?.nationalityEn || "-",
                  value_ar: ownerDetailData?.nationalityAr || "-",
                },
                {
                  label: "Family Book Number",
                  label_ar: "رقم خلاصة القيد",
                  value: ownerDetailData?.familyBookNumber || "-",
                  value_ar: ownerDetailData?.familyBookNumber || "-",
                },
                {
                  label: "Service Status",
                  label_ar: "حالة الخدمة",
                  value: ownerDetailData?.onlineServiceStatus || "-",
                  value_ar: ownerDetailData?.onlineServiceStatus || "-",
                },
                {
                  label: "Passport Number",
                  label_ar: "رقم جواز السفر",
                  value: ownerDetailData?.passportNumber || "-",
                  value_ar: ownerDetailData?.passportNumber || "-",
                },
                {
                  label: "Tribe",
                  label_ar: "القبيلة",
                  value: ownerDetailData?.tribenameEn || "-",
                  value_ar: ownerDetailData?.tribenameAr || "-",
                },
              ],
            }}
            language={language}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};
export default DariOwnerSearchResult;
