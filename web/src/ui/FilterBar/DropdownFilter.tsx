import React, { useState } from "react";
import FilterIcon from "@/assets/svg/filterIcon";
import { RadioField } from "@/ui/RadioField";
import { CheckboxField } from "@/ui/CheckboxField";

interface DropdownFilterProps {
  filterOptions?: { label: string; value: string; label_ar?: string }[];
  sortOptions?: { label: string; value: string; label_ar?: string }[];
  applicationOptions?: { label: string; value: string; label_ar?: string }[];
  language?: "en" | "ar";
  theme?: "light" | "dark";
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  filterOptions = [
    { label: "Actions", value: "actions" },
    { label: "Critical", value: "critical" },
  ],
  sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
  ],
  applicationOptions = [
    { label: "My Applications", value: "my" },
    { label: "All Applications", value: "all" },
  ],
  language = "en",
}) => {
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter");
  const [selectedApp, setSelectedApp] = useState(
    applicationOptions.length > 0 ? applicationOptions[0].value : "",
  );
  const [checkedFilters, setCheckedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedSort, setSelectedSort] = useState(
    sortOptions.length > 0 ? sortOptions[0].value : "",
  );

  const filterByText = language === "ar" ? "تصفية حسب" : "Filter By";
  const sortByText = language === "ar" ? "ترتيب حسب" : "Sort By";

  return (
    <div
      className={`w-full max-w-md rounded-xs shadow p-l bg-filter-dropdown-bg text-Base-Black`}
    >
      <div
        className="flex gap-xxs mb-4 text-m"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <button
          className={`flex-1 px-xs py-s rounded-t-xs border-b ${
            activeTab === "filter"
              ? "bg-structure-primary-9 text-button-primary-default-text border-structure-primary-9"
              : "text-text-default border-structure-primary-9"
          }`}
          onClick={() => setActiveTab("filter")}
        >
          <span className="flex gap-s items-center justify-center">
            <FilterIcon /> {filterByText}
          </span>
        </button>
        <button
          className={`flex-1 px-xs py-s rounded-t-xs border-b ${
            activeTab === "sort"
              ? "bg-structure-primary-9 text-button-primary-default-text border-structure-primary-9"
              : "text-text-default border-structure-primary-9"
          }`}
          onClick={() => setActiveTab("sort")}
        >
          <span className="flex gap-s items-center justify-center">
            <FilterIcon /> {sortByText}
          </span>
        </button>
      </div>

      {activeTab === "filter" ? (
        <>
          {applicationOptions.length > 0 && (
            <div className="mb-4" dir={language === "ar" ? "rtl" : "ltr"}>
              {applicationOptions.map((option) => (
                <div key={option.value} className="mb-2">
                  <RadioField
                    id={option.value}
                    label={option.label}
                    label_ar={option.label_ar}
                    checked={selectedApp}
                    onChange={(value) => setSelectedApp(value)}
                    language={language}
                  />
                </div>
              ))}
            </div>
          )}
          {filterOptions.length > 0 && (
            <div dir={language === "ar" ? "rtl" : "ltr"}>
              {filterOptions.map((option) => (
                <div key={option.value} className="mb-2">
                  <CheckboxField
                    id={option.value}
                    label={option.label}
                    label_ar={option.label_ar}
                    checked={!!checkedFilters[option.value]}
                    onChange={(id, checked) =>
                      setCheckedFilters((f) => ({
                        ...f,
                        [id]: !!checked,
                      }))
                    }
                    language={language}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        sortOptions.length > 0 && (
          <div dir={language === "ar" ? "rtl" : "ltr"}>
            {sortOptions.map((option) => (
              <div key={option.value} className="mb-2">
                <RadioField
                  id={option.value}
                  label={option.label}
                  label_ar={option.label_ar}
                  checked={selectedSort}
                  onChange={(value) => setSelectedSort(value)}
                  language={language}
                />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default DropdownFilter;
