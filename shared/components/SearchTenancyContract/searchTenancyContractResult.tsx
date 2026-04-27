import { some } from "lodash";
import React, { useEffect } from "react";

import { Text } from "@platform/Text";
import { Radio } from "@platform/Radio";
import { Buttons } from "@platform/Buttons";
import { Container } from "@platform/Container";
import { Pagination } from "@platform/Pagination";

import { TenancyContractItem } from "../../hooks/useGetTenancyContracts";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

interface SearchResultsModalProps {
  pageSize: number;
  totalCount: number;
  results: TenancyContractItem[];
  isLoading: boolean;
  language?: "en" | "ar";
  onCloseDrawer?: () => void;
  selected?: TenancyContractItem[];
  onSubmit?: (val: TenancyContractItem[]) => void;
  onSelectPlot?: () => void;
  onPageChange?: (page: number) => void;
  onSelectResult?: (result: TenancyContractItem) => void;
  /**
   * When true, treat `results` as already being for `currentPage` (server pagination),
   * and don't do additional client-side slicing.
   */
  isServerPaginated?: boolean;
  platform?: "web" | "mobile";
}
const SearchTenancyContractResults: React.FC<SearchResultsModalProps> = ({
  results,
  isLoading,
  pageSize,
  totalCount,
  onCloseDrawer,
  selected = [],
  language = "en",
  onSubmit,
  onPageChange,
  onSelectResult,
  isServerPaginated,
  platform = "web",
}) => {
  const [selectedIds, setSelectedIds] =
    React.useState<TenancyContractItem[]>(selected);

  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleRadioSelect = (result: TenancyContractItem) => {
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
    if (isServerPaginated) return results;
    if (!pageSize) return results;

    // If results likely represent a server page (only up to pageSize items) -> return directly
    if (results?.length <= pageSize) {
      return results;
    }

    // Otherwise do client-side pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
  };

  const textColor = "text-text-default";

  const renderResultCard = (result: TenancyContractItem, index: number) => {
    const isSelected = some(
      selectedIds,
      (val) => val.tenancyContractId === result?.tenancyContractId
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
          <Text className={`text-bold-l ${textColor}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={result?.contractNumber}
              value_ar={result?.contractNumber}
            />
          </Text>
          <Container className="flex flex-row items-center gap-m">
            <Buttons
              title="Plots"
              title_ar="المؤامرات"
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
            />

            <Radio
              id={result?.tenancyContractId ?? ""}
              checked={isSelected}
              onChange={() => handleRadioSelect(result)}
            />
          </Container>
        </Container>
        {[
          {
            label: "Tenancy Contract Type",
            label_ar: "نوع عقد الإيجار",
            value: result.isRenew === 0 ? "New Tenancy" : "Renew Tenancy",
            value_ar: result.isRenew === 0 ? "New Tenancy" : "Renew Tenancy",
          },
          {
            label: "Contract Date",
            label_ar: "تاريخ العقد",
            value: result?.startDate,
            value_ar: result?.startDate,
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
        <Text className={`text-heading-h1 font-bold mb-4 text-text-default`}>
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
            <Container className="flex flex-col gap-3 mb-8">
              <Text className={`text-m ${textColor}`}>
                <SharedLanguageSwitchRenderer
                  language={language}
                  value="We returned"
                  value_ar="أعدنا"
                />{" "}
                <Text className="font-bold">
                  {pageSize}{" "}
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
              <Container
                className="flex flex-row items-center"
                onClick={onCloseDrawer}
              >
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
            {getCurrentPageResults().map(renderResultCard)}
            <Container className="flex justify-between items-start">
              <Buttons
                title="Select Tenancy Agreement"
                title_ar="حدد اتفاقية الإيجار"
                disabled={!selectedIds?.[0]}
                size={platform === "web" ? "l" : "m"}
                language={language}
                onClick={() => {
                  const selectedContract = selectedIds[0];
                  if (!selectedContract) return;

                  // Primary callback used by external consumers.
                  onSubmit?.([selectedContract]);
                  // Keep backward compatibility if any internal consumer uses this callback.
                  onSelectResult?.(selectedContract);
                  onCloseDrawer?.();
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
    </Container>
  );
};
export default SearchTenancyContractResults;
