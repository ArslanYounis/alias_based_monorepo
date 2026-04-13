import React from "react";
import type { PaginationProps } from "@shared/types";
import { View, Pressable } from "react-native";
import { Text } from "~/src/ui/Text";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { PaginationProps };

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 4,
  position = "center",
  language = "en",
  pageSize,
  totalCount,
  showBottomText = true,
}) => {
  const toArabicDigits = (value: string | number) => {
    return String(value).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
  };

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 0) return pages;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const middleCount = maxVisiblePages - 2;
    const half = Math.floor(middleCount / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    if (end - start + 1 < middleCount) end = start + middleCount - 1;

    if (start < 2) {
      start = 2;
      end = start + middleCount - 1;
    }
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - (middleCount - 1);
      if (start < 2) start = 2;
    }

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    if (totalPages > 1) {
      if (end < totalPages - 1) {
        pages.push(totalPages - 1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const justifyContent =
    position === "left"
      ? "flex-start"
      : position === "right"
      ? "flex-end"
      : "center";

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) onPageChange(page);
  };

  const pages = getPageNumbers();

  const visibleItems =
    totalCount === undefined
      ? pageSize
      : Math.min(
          pageSize,
          Math.max(0, totalCount - (currentPage - 1) * pageSize)
        );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent,
          gap: 8,
        }}
      >
        <Pressable
          onPress={handlePrev}
          disabled={currentPage === 1}
          accessibilityLabel="Previous page"
          style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          {language === "en" ? (
            <ChevronLeftIcon size={24} color="currentColor" />
          ) : (
            <ChevronRightIcon size={24} color="currentColor" />
          )}
        </Pressable>

        {showPageNumbers &&
          pages.map((page, idx) =>
            page === "..." ? (
              <Text key={`ellipsis-${idx}`} className="text-text-dimmed text-m">
                ...
              </Text>
            ) : (
              <Pressable
                key={page}
                onPress={() => handlePageClick(page)}
                className={`w-[42px] h-[40px] items-center justify-center rounded-[10px] ${
                  currentPage === page
                    ? "bg-structure-primary-1 border border-structure-primary-9"
                    : "border border-transparent"
                }`}
              >
                <Text
                  className={`text-m ${
                    currentPage === page ? "text-text-default" : "text-text-dimmed"
                  }`}
                >
                  {language === "ar" ? toArabicDigits(page) : page}
                </Text>
              </Pressable>
            )
          )}

        <Pressable
          onPress={handleNext}
          disabled={currentPage === totalPages}
          accessibilityLabel="Next page"
          style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          {language === "en" ? (
            <ChevronRightIcon size={24} color="currentColor" />
          ) : (
            <ChevronLeftIcon size={24} color="currentColor" />
          )}
        </Pressable>
      </View>

      {showBottomText && (
        <View className="mt-2 me-2" style={{ alignItems: "flex-end" }}>
          {totalCount === undefined ? (
            <SharedLanguageSwitchRenderer
              language={language}
              value={`Showing ${visibleItems} items`}
              value_ar={`عرض ${visibleItems} عناصر`}
              className="text-s text-text-default"
            />
          ) : (
            <SharedLanguageSwitchRenderer
              language={language}
              value={`Showing ${visibleItems} out of ${totalCount} items`}
              value_ar={`عرض ${toArabicDigits(
                visibleItems
              )} من ${toArabicDigits(totalCount)} عناصر`}
              className="text-s text-text-default"
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Pagination;
