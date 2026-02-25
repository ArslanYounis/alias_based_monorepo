import React, { useState } from "react";
import type { IOwnerSearchResult, OwnerSearchResultProps } from "@shared/types";
import { Radio } from "@/ui/Radio";
import { Buttons } from "@/ui/Buttons";
import { Pagination } from "@/ui/Pagination";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

const OwnerSearchResult: React.FC<OwnerSearchResultProps> = ({
  results,
  selected = [],
  onSubmit,
  language = "en",
  isLoading = false,
  onClose,
  ownerName,
  pageSize = 10,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
}) => {
  const [selectedIds, setSelectedIds] = useState<IOwnerSearchResult[]>(selected);
  const [picked, setPicked] = useState<IOwnerSearchResult | null>(
    selectedIds[0] ?? null
  );

  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const showPagination =
    totalCount > pageSize && totalPages > 1 && onPageChange != null;

  const handleRadioChange = (ownerId: string) => {
    const item = results.find((r) => r.ownerId === ownerId);
    if (item) {
      setPicked(item);
      setSelectedIds([item]);
    }
  };

  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };

  const handleSubmit = () => {
    if (picked) onSubmit?.([picked]);
  };

  if (results.length === 0 && !isLoading) {
    return (
      <div className="rounded-xs px-l py-m border border-cards-stroke text-text-dimmed text-m">
        No results. Try different search criteria.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xs px-l py-m border border-cards-stroke text-text-dimmed text-m">
        <SharedLanguageSwitchRenderer
          language={language}
          value="Loading..."
          value_ar="جارٍ التحميل..."
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col gap-l mt-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-heading-h1 font-bold pb-8 text-text-default">
        <SharedLanguageSwitchRenderer
          language={language}
          value="Search Results"
          value_ar="نتائج البحث"
        />
      </h1>

      <div className="flex flex-col gap-3 pb-8">
        <p className="text-m text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value="We returned"
            value_ar="أعدنا"
          />{" "}
          <span className="font-bold">
            {results.length}{" "}
            <SharedLanguageSwitchRenderer
              language={language}
              value="results"
              value_ar="نتائج"
            />
          </span>{" "}
          <SharedLanguageSwitchRenderer
            language={language}
            value="for the following search criteria:"
            value_ar="لمعايير البحث التالية:"
          />
        </p>
        {(ownerName != null && ownerName !== "") || onClose ? (
          <div className="flex items-center gap-2">
            {ownerName != null && ownerName !== "" && (
              <span className="text-bold-m text-text-default">{ownerName}</span>
            )}
            {ownerName && onClose && <span className="text-text-dimmed">|</span>}
            {onClose && (
              <span
                className="text-bold-m cursor-pointer hover:underline text-text-link-hover"
                onClick={onClose}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClose();
                  }
                }}
              >
                <SharedLanguageSwitchRenderer
                  language={language}
                  value="Edit"
                  value_ar="تعديل"
                />
              </span>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {results.map((result, index) => {
          const name =
            language === "ar"
              ? result.ownerName_ar || result.ownerName || ""
              : result.ownerName || result.ownerName_ar || "";
          const isSelected = picked?.ownerId === result.ownerId;
          return (
            <div
              key={result.ownerId ?? index}
              className={`rounded-xs px-l py-m w-full min-h-[80px] flex flex-col justify-between cursor-pointer border ${
                isSelected
                  ? "border-form-fields-default bg-button-radio-card-selected-disabled"
                  : "border-cards-stroke"
              }`}
              onClick={() => handleRadioChange(result.ownerId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRadioChange(result.ownerId);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Radio
                  id={result.ownerId}
                  name="owner-result"
                  checked={picked?.ownerId === result.ownerId}
                  onChange={(id) => handleRadioChange(id)}
                />
                <span className="text-bold-m text-text-default">{name}</span>
              </div>
              {result.nationalNumber && (
                <span className="text-s text-text-dimmed ml-6">
                  {result.nationalNumber}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-start mt-4 gap-4 flex-wrap">
        <Buttons
          title="Select Owner"
          title_ar="اختر المالك"
          type="primary"
          onClick={handleSubmit}
          disabled={!picked}
          language={language}
        />
        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers
            position="right"
            pageSize={pageSize}
            totalCount={totalCount}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default OwnerSearchResult;
