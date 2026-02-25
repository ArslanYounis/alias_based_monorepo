import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { OwnerSearchResultProps } from "@shared/types";
import { Radio } from "~/src/ui/Radio";
import { Buttons } from "~/src/ui/Buttons";
import { Pagination } from "~/src/ui/Pagination";
import SharedLanguageSwitchRenderer from "~/src/components/shared/SharedLanguageSwitchRenderer";

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
  const [selectedIds, setSelectedIds] = useState(selected);
  const [picked, setPicked] = useState(selected[0] ?? null);

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

  const handleSubmit = () => {
    if (picked) onSubmit?.([picked]);
  };

  if (results.length === 0 && !isLoading) {
    return (
      <View className="rounded-xs px-l py-m border border-cards-stroke mt-4">
        <Text className="text-text-dimmed text-m">
          No results. Try different search criteria.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="rounded-xs px-l py-m border border-cards-stroke mt-4">
        <Text className="text-text-dimmed text-m">
          <SharedLanguageSwitchRenderer
            language={language}
            value="Loading..."
            value_ar="جارٍ التحميل..."
          />
        </Text>
      </View>
    );
  }

  return (
    <View className="flex flex-1 flex-col gap-l mt-4">
      <Text className="text-heading-h1 font-bold pb-8 text-text-default">
        <SharedLanguageSwitchRenderer
          language={language}
          value="Search Results"
          value_ar="نتائج البحث"
        />
      </Text>

      <View className="flex flex-col gap-3 pb-8">
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
        {(ownerName != null && ownerName !== "") || onClose ? (
          <View className="flex flex-row items-center gap-2">
            {ownerName != null && ownerName !== "" && (
              <Text className="text-bold-m text-text-default">{ownerName}</Text>
            )}
            {ownerName && onClose && (
              <Text className="text-text-dimmed">|</Text>
            )}
            {onClose && (
              <Pressable onPress={onClose} className="py-1">
                <Text className="text-bold-m text-text-link-hover">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Edit"
                    value_ar="تعديل"
                  />
                </Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>

      {results.map((result, index) => {
        const name =
          language === "ar"
            ? result.ownerName_ar || result.ownerName || ""
            : result.ownerName || result.ownerName_ar || "";
        return (
          <Pressable
            key={result.ownerId ?? index}
            onPress={() => handleRadioChange(result.ownerId)}
            className={`rounded-xs px-l py-m min-h-[80px] flex flex-col justify-between border mt-2 ${
              picked?.ownerId === result.ownerId
                ? "border-form-fields-default bg-button-radio-card-selected-disabled"
                : "border-cards-stroke"
            }`}
          >
            <View className="flex flex-row items-center gap-2">
              <Radio
                id={result.ownerId}
                name="owner-result"
                checked={picked?.ownerId === result.ownerId}
                onChange={(id) => handleRadioChange(id)}
              />
              <Text className="text-bold-m text-text-default">{name}</Text>
            </View>
            {result.nationalNumber ? (
              <Text className="text-s text-text-dimmed ml-6">
                {result.nationalNumber}
              </Text>
            ) : null}
          </Pressable>
        );
      })}

      <View className="mt-4 flex flex-row justify-between items-center flex-wrap gap-4">
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
            onPageChange={onPageChange}
            showPageNumbers
            position="right"
            pageSize={pageSize}
            totalCount={totalCount}
            language={language}
          />
        )}
      </View>
    </View>
  );
};

export default OwnerSearchResult;
