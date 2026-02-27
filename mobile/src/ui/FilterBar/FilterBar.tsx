import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Search, RotateCcw } from "lucide-react-native";
import SearchField from "./SearchField";
import FilterButton from "./FilterButton";
import DropdownFilter from "./DropdownFilter";
import ColumnButton from "./ColumnButton";

export type FilterBarProps = {
  language?: "en" | "ar";

  // SearchField props
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
  searchPlaceholder_ar?: string;
  searchColumns?: string[];
  selectedSearchColumns?: string[];
  onSearchColumnsChange?: (cols: string[]) => void;
  theme?: "light" | "dark";

  // FilterButton props
  filterButtonLabel?: string;
  filterButtonLabel_ar?: string;
  filterButtonCount?: number;
  filterButtonIcon?: React.ReactElement;
  filterButtonClassName?: string;

  // DropdownFilter props
  filterOptions?: string[];
  sortOptions?: string[];
  applicationOptions?: string[];

  // Mobile props
  mobileColumnTitle?: string;
  mobileColumnTitle_ar?: string;

  // Reset functionality
  onReset?: () => void;
  showResetButton?: boolean;
  resetButtonLabel?: string;
  resetButtonLabel_ar?: string;
};

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

  const handleSearchChange = (text: string) => {
    if (onSearchChange) {
      onSearchChange(text);
    } else {
      setInternalSearchValue(text);
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
      label_ar: opt,
    }));

  return (
    <View>
      <View
        className="flex-row items-center justify-start"
        style={{ flexDirection: language === "ar" ? "row-reverse" : "row" }}
      >
        <View
          className="flex-row items-center gap-s"
          style={{ flexDirection: language === "ar" ? "row-reverse" : "row" }}
        >
          {/* Search Input */}
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

          {/* Filter Button */}
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

          {/* Reset Button */}
          {showResetButton && (
            <Pressable
              className="flex-row items-center rounded-xxs gap-s px-xxs py-m"
              onPress={resetFilters}
            >
              <View className="rounded-md px-2 py-1">
                <RotateCcw size={20} className="text-filter-button-text" color="#6B7280" />
              </View>
              <Text className="text-base text-filter-button-text">
                {language === "en"
                  ? resetButtonLabel
                  : resetButtonLabel_ar || resetButtonLabel}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Column Button — replaces mobile sort behaviour */}
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
      </View>

      {/* Filter Dropdown Modal */}
      <Modal
        visible={filterDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterDropdownOpen(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={{
                  position: "absolute",
                  top: 100,
                  left: language === "ar" ? undefined : 16,
                  right: language === "ar" ? 16 : undefined,
                  width: 320,
                }}
              >
                <DropdownFilter
                  filterOptions={formatOptions(filterOptions)}
                  sortOptions={formatOptions(sortOptions)}
                  applicationOptions={formatOptions(applicationOptions)}
                  language={language}
                  theme={theme}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default FilterBar;
