import type { FilterBarProps } from "@shared/types";
import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export type { FilterBarProps };

export const FilterBar: React.FC<FilterBarProps> = ({
  theme = "dark",
  sortOptions = ["Newest First", "Oldest First"],
  applicationOptions = ["My Applications", "All Applications"],
  searchValue: controlledSearchValue,
  onSearchChange,
  onReset,
  language = "en",
}) => {
  const [internalSearch, setInternalSearch] = useState("");
  const [open, setOpen] = useState(false);
  const searchValue =
    typeof controlledSearchValue === "string"
      ? controlledSearchValue
      : internalSearch;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (onSearchChange) onSearchChange({ target: { value: v } } as Parameters<NonNullable<FilterBarProps["onSearchChange"]>>[0]);
    else setInternalSearch(v);
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <input
        type="search"
        value={searchValue}
        onChange={handleSearch}
        placeholder={language === "ar" ? "بحث" : "Search"}
        className="flex-1 min-w-[120px] px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-text-default"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-text-default"
          >
            {language === "ar" ? "ترتيب" : "Sort"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="flex flex-col gap-1">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className="text-left px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {opt}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {applicationOptions.length > 0 && (
        <select
          className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-text-default"
          aria-label="Application filter"
        >
          {applicationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          {language === "ar" ? "إعادة تعيين" : "Reset"}
        </button>
      )}
    </div>
  );
};
