import { useState } from "react";
import SearchIcon from "@/assets/svg/SearchIcon";
import DefaultIcon from "@/assets/svg/defaultIcon";
import SearchField from "./SearchField";
import FilterButton from "./FilterButton";
import DropdownFilter from "./DropdownFilter";
import ColumnButton from "./ColumnButton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import type { FilterBarProps } from "@shared/types";
export type { FilterBarProps };

const FilterBar = ({
  language = "en",

  // SearchField props
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  searchPlaceholder_ar = "بحث",
  searchColumns = [],
  selectedSearchColumns = [],
  onSearchColumnsChange,
  theme = "light",

  // FilterButton props
  filterButtonLabel = "All Filters",
  filterButtonLabel_ar = "جميع المرشحات",
  filterButtonCount = 0,
  filterButtonIcon,
  filterButtonClassName = "",

  // DropdownFilter props
  filterOptions = [],
  sortOptions = ["Newest First", "Oldest First"],
  applicationOptions = ["My Applications", "All Applications"],

  // Mobile props
  mobileColumnTitle = "View column",
  mobileColumnTitle_ar = "عرض العمود",

  // Reset functionality
  onReset,
  showResetButton = true,
  resetButtonLabel = "Default Filter",
  resetButtonLabel_ar = "المرشح الافتراضي",
}: FilterBarProps) => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const [internalSearchValue, setInternalSearchValue] = useState(searchValue);
  const [internalSelectedColumns, setInternalSelectedColumns] = useState<
    string[]
  >(selectedSearchColumns);

  const currentSearchValue = onSearchChange ? searchValue : internalSearchValue;
  const currentSelectedColumns = onSearchColumnsChange
    ? selectedSearchColumns
    : internalSelectedColumns;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    } else {
      setInternalSearchValue(e.target.value);
    }
  };

  const handleSearchColumnsChange = (cols: string[]) => {
    if (onSearchColumnsChange) {
      onSearchColumnsChange(cols);
    } else {
      setInternalSelectedColumns(cols);
    }
  };

  const resetFilters = () => {
    if (onReset) {
      onReset();
    } else {
      setInternalSearchValue("");
      setInternalSelectedColumns([]);
    }
    setFilterDropdownOpen(false);
  };

  const formatOptions = (options: string[]) =>
    options.map((opt) => ({
      label: opt,
      value: opt.toLowerCase().replace(/\s+/g, "_"),
      label_ar: opt, // Replace with actual Arabic translations if available
    }));

  return (
    <div>
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-s">
          {/* Search Input */}
          <div className="!hidden sm:!block">
            <SearchField
              value={currentSearchValue}
              onChange={handleSearchChange}
              placeholder={
                language === "en"
                  ? searchPlaceholder
                  : searchPlaceholder_ar || searchPlaceholder
              }
              columnsToSearch={searchColumns}
              selectedColumns={currentSelectedColumns}
              setSelectedColumns={handleSearchColumnsChange}
              theme={theme}
              language={language}
            />
          </div>

          {/* Mobile Search */}
          <div className="sm:!hidden !flex justify-center items-center border-[1.5px] border-grey-form-border w-10 h-10 bg-grey-form-back rounded-xxs">
            <SearchIcon />
          </div>

          {/* Filter Button */}
          <Popover
            open={filterDropdownOpen}
            onOpenChange={setFilterDropdownOpen}
          >
            <PopoverTrigger asChild>
              <div className="relative">
                <FilterButton
                  label={
                    language === "en" ? filterButtonLabel : filterButtonLabel_ar
                  }
                  count={filterButtonCount}
                  isActive={filterDropdownOpen}
                  icon={filterButtonIcon}
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className={filterButtonClassName}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 !w-[290px] sm:!w-[352px] mt-2 border-0 shadow">
              <DropdownFilter
                filterOptions={formatOptions(filterOptions)}
                sortOptions={formatOptions(sortOptions)}
                applicationOptions={formatOptions(applicationOptions)}
                language={language}
                theme={theme}
              />
            </PopoverContent>
          </Popover>

          {/* Reset Button */}
          {showResetButton && (
            <div
              className="!hidden sm:!flex relative items-center rounded-xxs sm:!gap-s sm:!px-xxs sm:!py-m cursor-pointer"
              onClick={resetFilters}
            >
              <div className="text-filter-button-text rounded-md px-2 py-1">
                <DefaultIcon className="text-filter-button-text" />
              </div>
              <span className="text-m !hidden sm:!block text-filter-button-text">
                {language === "en"
                  ? resetButtonLabel
                  : resetButtonLabel_ar || resetButtonLabel}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Sort */}
        <div className="sm:!hidden">
          <ColumnButton
            label={currentSelectedColumns[0] || "Add Col Name"}
            title={
              language === "en"
                ? mobileColumnTitle
                : mobileColumnTitle_ar || mobileColumnTitle
            }
            columns={searchColumns}
            selectedColumns={currentSelectedColumns}
            setSelectedColumns={handleSearchColumnsChange}
            type="singleSelect"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
