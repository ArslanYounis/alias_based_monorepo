import React from "react";
import type { PaginationProps } from "@shared/types";
import LessThenArrow from "@/assets/svg/arrowLeft";
import GreaterArrow from "@/assets/svg/arrowRight";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

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

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[position];

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
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <nav
        className={`flex items-center space-x-xs text-m font-sans ${alignmentClass} text-text-default`}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={`cursor-pointer focus:outline-none ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          {language === "en" ? (
            <LessThenArrow className="text-text-default" />
          ) : (
            <GreaterArrow className="text-text-default" />
          )}
        </button>

        {showPageNumbers &&
          pages.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className={`select-none text-Dark-6`}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`cursor-pointer w-[42px] h-[40px] flex items-center justify-center rounded-[10px] text-m font-normal
                  ${
                    currentPage === page
                      ? "bg-structure-primary-1 border border-structure-primary-9 text-text-default"
                      : "hover:border-structure-primary-4 hover:border text-Dark-6 hover:text-text-default"
                  }
                  }`}
              >
                {language === "ar" ? toArabicDigits(page) : page}
              </button>
            )
          )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={`text-text-default cursor-pointer focus:outline-none ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
        >
          {language === "en" ? (
            <GreaterArrow className="text-text-default" />
          ) : (
            <LessThenArrow className="text-text-default" />
          )}
        </button>
      </nav>
      {showBottomText && (
        <div className={`mt-2 mr-2 text-s text-end text-text-default`}>
          {totalCount === undefined ? (
            <SharedLanguageSwitchRenderer
              language={language}
              value={`Showing ${visibleItems} items`}
              value_ar={`عرض ${visibleItems} عناصر`}
            />
          ) : (
            <SharedLanguageSwitchRenderer
              language={language}
              value={`Showing ${visibleItems} out of ${totalCount} items`}
              value_ar={`عرض ${toArabicDigits(
                visibleItems
              )} من ${toArabicDigits(totalCount)} عناصر`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;
