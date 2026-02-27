import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@/assets/svg/SearchIcon";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import { CheckboxField } from "@/ui/CheckboxField";

interface SearchFieldProps {
  language?: "en" | "ar";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  placeholder_ar?: string;
  className?: string;
  theme?: "light" | "dark";
  columnsToSearch?: string[];
  selectedColumns?: string[];
  setSelectedColumns?: (cols: string[]) => void;
  chooseColumnsText?: string;
  chooseColumnsText_ar?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
  language = "en",
  value,
  onChange,
  placeholder = "Search",
  placeholder_ar = "بحث",
  className = "",
  columnsToSearch,
  selectedColumns = [],
  setSelectedColumns,
  chooseColumnsText = "Choose columns to search",
  chooseColumnsText_ar = "اختر الأعمدة للبحث",
}) => {
  const [active, setActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setActive(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleInputClick = () => {
    setActive(true);
    if (columnsToSearch && columnsToSearch.length > 0) {
      setDropdownOpen(true);
    }
  };

  const handleInputBlur = () => {
    setActive(false);
    // Don't close dropdown here, let click outside handle it
  };

  const handleCheckboxChange = (col: string) => {
    if (!setSelectedColumns) return;

    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== col));
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`flex items-center rounded-sm py-s px-m gap-s transition-all duration-300 ${
          active || dropdownOpen
            ? "bg-filter-search-selected-bg border-2 border-filter-search-selected-stroke w-[360px]"
            : "bg-filter-search-bg border-2 border-filter-search-stroke w-[212px]"
        } ${className}`}
        onClick={handleInputClick}
      >
        <input
          type="text"
          placeholder={language === "ar" ? placeholder_ar : placeholder}
          className={`outline-none bg-transparent w-full text-m text-filter-button-text placeholder:text-filter-search-placeholder`}
          value={value}
          onChange={onChange}
          onFocus={handleInputClick}
          onBlur={handleInputBlur}
        />
        <SearchIcon
          className={`${
            active || dropdownOpen
              ? "text-filter-search-selected-icon"
              : "text-filter-search-icon"
          }`}
        />
      </div>
      {dropdownOpen && columnsToSearch && columnsToSearch.length > 0 && (
        <div
          className={`absolute ${
            language === "en" ? "left-0" : "right-0"
          } top-10 w-[360px] mt-6 rounded-md p-6 z-10 bg-filter-dropdown-bg`}
          style={{ boxShadow: "0px 16px 32px 0px #0000001A" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            <h2 className={`text-bold-lg text-text-default`}>
              <SharedLanguageSwitchRenderer
                language={language}
                value={chooseColumnsText}
                value_ar={chooseColumnsText_ar}
              />
            </h2>
            {columnsToSearch.map((key) => (
              <div
                key={key}
                className="flex items-center space-s cursor-pointer mb-2"
              >
                <CheckboxField
                  id={key}
                  label={key}
                  label_ar={key}
                  checked={selectedColumns.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                  language={language}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchField;
