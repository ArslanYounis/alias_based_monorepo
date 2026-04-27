import { some } from "lodash";
import React, { useEffect } from "react";

import { Text } from "@platform/Text";
import { Radio } from "@platform/Radio";
import { Buttons } from "@platform/Buttons";
import { Container } from "@platform/Container";
import { Pagination } from "@platform/Pagination";
import { CustomDrawer } from "@platform/CustomDrawer";

import { useDecreeDetails } from "@shared/hooks/useDecreeDetail";

import ViewOwnerDetail from "../ViewOwnerDetail/ViewOwnerDetail";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface ISearchAllotmentResult {
  id?: string;
  ownerId?: string;
  ownerName?: string;
  fullName?: string;
  landUse?: string;
  allotmentNameId?: string;
  familyBookNumber: string;
  nationalNumber?: string;
  tribe?: string;
  cityNo?: string;
}
interface SearchResultsModalProps {
  ownerName?: string;
  fullName?: string;
  isLoading: boolean;
  results: ISearchAllotmentResult[];
  pageSize: number;
  totalCount: number;
  onCloseDrawer?: () => void;
  selected?: ISearchAllotmentResult[];
  onSubmit?: (val: ISearchAllotmentResult[]) => void;
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

const SearchAllotmentResult: React.FC<SearchResultsModalProps> = ({
  results,
  isLoading,
  onCloseDrawer,
  selected = [],
  onSubmit = () => {},
  language,
  pageSize,
  totalCount,
  onPageChange,
  platform = "web",
}) => {
  const [selectedIds, setSelectedIds] =
    React.useState<ISearchAllotmentResult[]>(selected);
  const [selectedOwnerDetail, setSelectedOwnerDetail] =
    React.useState<ISearchAllotmentResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isDecreeDrawerOpen, setIsDecreeDrawerOpen] = React.useState(false);
  const [decreeId, setDecreeId] = React.useState<string | undefined>(undefined);
  const { data: decreeData, isLoading: isDecreeLoading } =
    useDecreeDetails(decreeId);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleRadioSelect = (value: ISearchAllotmentResult) => {
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
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
  };

  const renderResultCard = (result: ISearchAllotmentResult, index: number) => {
    const isSelected = some(
      selectedIds,
      (val) => val.allotmentNameId === result?.allotmentNameId
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
        <Container className="flex flex-row justify-between mb-s">
          <Text className={`text-bold-l text-text-default line-clamp-1 mr-xxs`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={result?.allotmentNameId}
              value_ar={result?.allotmentNameId}
            />
          </Text>
          <Container className="flex flex-row items-center gap-m shrink-0">
            <Buttons
              title="Decree"
              title_ar="مرسوم"
              size="s"
              type="secondary"
              language={language}
              onClick={() => {
                setSelectedOwnerDetail(result);
                setDecreeId(result?.id);
                setIsDecreeDrawerOpen(true);
              }}
            />
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
              id={String(result?.allotmentNameId)}
              checked={isSelected}
              onChange={() => handleRadioSelect(result)}
            />
          </Container>
        </Container>
        {[
          {
            label: "Full Name",
            label_ar: "الاسم الكامل",
            value: result?.ownerName,
            value_ar: result?.ownerName,
          },
          {
            label: "Land Use",
            label_ar: "استخدام الأراضي",
            value: result?.landUse,
            value_ar: result?.landUse,
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

  const handleSelectOwner = () => {
    if (selectedIds?.length > 0) {
      onSubmit(selectedIds);
      onCloseDrawer?.();
    }
  };

  return (
    <Container dir={language === "ar" ? "rtl" : "ltr"}>
      <Container>
        <Text className={`text-heading-h1 font-bold pb-8 text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Search Results"
            value_ar="نتائج البحث"
          />
        </Text>
        {isLoading ? (
          <Container className="text-text-default flex items-center justify-center">
            <SharedLanguageSwitchRenderer
              value="Loading..."
              value_ar="جارٍ التحميل..."
              language={language}
            />
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
              <Container className="flex flex-row items-center gap-2">
                {/* <Text className={`text-bold-m text-text-default`}>
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={ownerName}
                    value_ar={ownerName}
                  />
                </Text>
                <Text className="text-text-dimmed">|</Text> */}
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
                  title="Select Allotment"
                  title_ar="حدد التخصيص"
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
                    pageSize={pageSize}
                    totalCount={totalCount}
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
        <ViewOwnerDetail
          mainTitle="View Allotment Order"
          mainTitle_ar="عرض أمر التخصيص"
          ownerText="Allotment Order"
          ownerText_ar="أمر التخصيص"
          owner={{
            name: getLanguageSwitchText({
              language,
              value:
                selectedOwnerDetail?.allotmentNameId || "Unknown Allotment",
              value_ar:
                selectedOwnerDetail?.allotmentNameId || "تخصيص غير معروف",
            }),
            details: [
              {
                label: "Full Name",
                label_ar: "الاسم الكامل",
                value: selectedOwnerDetail?.ownerName || "N/A",
                value_ar: selectedOwnerDetail?.ownerName || "N/A",
              },
              {
                label: "National Number",
                label_ar: "الرقم الوطني",
                value: "N/A",
                value_ar: "N/A",
              },
              {
                label: "Family Number",
                label_ar: "رقم العائلة",
                value: selectedOwnerDetail?.familyBookNumber || "N/A",
                value_ar: selectedOwnerDetail?.familyBookNumber || "N/A",
              },
              {
                label: "Tribe Name",
                label_ar: "اسم القبيلة",
                value: "N/A",
                value_ar: "N/A",
              },
              {
                label: "Land Use",
                label_ar: "استخدام الأراضي",
                value: selectedOwnerDetail?.landUse || "N/A",
                value_ar: selectedOwnerDetail?.landUse || "N/A",
              },
              {
                label: "City Number",
                label_ar: "رقم المدينة",
                value: selectedOwnerDetail?.cityNo || "N/A",
                value_ar: selectedOwnerDetail?.cityNo || "N/A",
              },
            ],
          }}
          language={language}
        />
      </CustomDrawer>

      <CustomDrawer
        size="layer2"
        language={language}
        open={isDecreeDrawerOpen}
        onOpenChange={(open) => {
          setIsDecreeDrawerOpen(open);
          if (!open) setDecreeId(undefined);
        }}
      >
        {isDecreeLoading ? (
          <Container className="flex items-center justify-center">
            <SharedLanguageSwitchRenderer
              value="Loading"
              value_ar="تحميل"
              language={language}
            />
          </Container>
        ) : (
          <ViewOwnerDetail
            mainTitle=""
            mainTitle_ar=""
            ownerText="Decree"
            ownerText_ar="مرسوم"
            owner={{
              name: getLanguageSwitchText({
                language,
                value: decreeData?.decree?.decreeNumber || "-",
                value_ar: decreeData?.decree?.decreeNumber || "-",
              }),
              details: [
                {
                  label: "Decree Date",
                  label_ar: "تاريخ القرار",
                  value: decreeData?.decree?.decreeDateFormat || "-",
                  value_ar: decreeData?.decree?.decreeDateFormat || "-",
                },
                {
                  label: "Source Name",
                  label_ar: "اسم الجهة",
                  value: decreeData?.decree?.decreeSourceNameE || "-",
                  value_ar: decreeData?.decree?.decreeSourceNameA || "-",
                },
                {
                  label: "Decree Remarks",
                  label_ar: "ملاحظات القرار",
                  value: decreeData?.decree?.comments || "-",
                  value_ar: decreeData?.decree?.comments || "-",
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
export default SearchAllotmentResult;
