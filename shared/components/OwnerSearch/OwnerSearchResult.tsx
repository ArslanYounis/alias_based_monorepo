import React, { useEffect } from "react";
import { some } from "lodash";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { Pagination } from "@platform/Pagination";
import { CustomDrawer } from "@platform/CustomDrawer";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import { useRanchRecipient } from "../../hooks/useRanchRecipient";
import ViewOwnerDetail from "../ViewOwnerDetail/ViewOwnerDetail";

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

interface OwnerSearchResultProps {
  ownerName: string;
  isLoading: boolean;
  results: IOwnerSearchResult[];
  pageSize: number;
  totalCount: number;
  onCloseDrawer?: () => void;
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
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

const OwnerSearchResult: React.FC<OwnerSearchResultProps> = ({
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
  platform = "web",
}) => {
  const [selectedIds, setSelectedIds] =
    React.useState<IOwnerSearchResult[]>(selected);
  const [selectedOwnerDetail, setSelectedOwnerDetail] =
    React.useState<IOwnerSearchResult | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.ceil(totalCount / pageSize);
  const { mutate: ranchRecipientMutation } = useRanchRecipient();

  const handleRadioSelect = (value: IOwnerSearchResult) => {
    setSelectedIds([value]);
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

  const handleSelectOwner = () => {
    if (selectedIds?.length > 0) {
      const firstOwnerId = selectedIds[0]?.ownerId;
      if (firstOwnerId) {
        ranchRecipientMutation(Number(firstOwnerId), {
          onSuccess: (data) => {
            if (data?.success && onSubmit) {
              onSubmit(selectedIds);
            }
            onCloseDrawer?.();
          },
        });
      }
    }
  };

  const renderResultCard = (result: IOwnerSearchResult, index: number) => {
    const isSelected = some(
      selectedIds,
      (val) => val.ownerId === result?.ownerId
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
        <Container className="flex flex-row justify-between mb-3">
          <Text className="text-bold-l text-text-default line-clamp-1 mr-xxs">
            <SharedLanguageSwitchRenderer
              language={language}
              value={result.ownerName_E}
              value_ar={result.ownerName_A || result.ownerName_E}
            />
          </Text>
          <Container className="flex flex-row items-center gap-4">
            <Buttons
              title="Details"
              title_ar="التفاصيل"
              size="s"
              type="secondary"
              language={language}
              onClick={() => {
                setSelectedOwnerDetail(result);
                setIsDetailDrawerOpen(true);
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
                ? "border-b pb-2 border-text-dimmed mb-2"
                : ""
            }`}
          >
            <Container className="w-1/2">
              <Text className="text-bold-m text-text-default">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={label}
                  value_ar={label_ar || label}
                />
              </Text>
            </Container>
            <Container className="w-1/2">
              <Text className="text-m break-words text-text-default">
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
            <Text className="text-m text-text-dimmed">
              <SharedLanguageSwitchRenderer
                value="Loading..."
                value_ar="جارٍ التحميل..."
                language={language}
              />
            </Text>
          </Container>
        ) : (
          <>
            <Container className="flex flex-col gap-3 pb-8">
              <Text className="text-m text-text-default">
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
                <Text className="text-bold-m text-text-default">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={ownerName}
                    value_ar={ownerName}
                  />
                </Text>
                <Text className="text-text-dimmed">|</Text>
                <Container onClick={onCloseDrawer}>
                  <Text className="text-bold-m cursor-pointer hover:underline text-text-link-hover">
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

      {/* Owner detail drawer */}
      <CustomDrawer
        size="layer2"
        language={language}
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
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
    </Container>
  );
};

export default OwnerSearchResult;
