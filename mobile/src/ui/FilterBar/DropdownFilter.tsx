import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Filter } from "lucide-react-native";
import { RadioField } from "../RadioField";
import { CheckboxField } from "../CheckboxField";

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
  theme = "light",
}) => {
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter");
  const [selectedApp, setSelectedApp] = useState(
    applicationOptions.length > 0 ? applicationOptions[0].value : ""
  );
  const [checkedFilters, setCheckedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedSort, setSelectedSort] = useState(
    sortOptions.length > 0 ? sortOptions[0].value : ""
  );

  const filterByText = language === "ar" ? "تصفية حسب" : "Filter By";
  const sortByText = language === "ar" ? "ترتيب حسب" : "Sort By";

  return (
    <View className="w-full rounded-xs p-l bg-filter-dropdown-bg">
      {/* Tabs */}
      <View
        className="flex-row gap-xxs mb-4"
        style={{ flexDirection: language === "ar" ? "row-reverse" : "row" }}
      >
        <Pressable
          className={`flex-1 px-xs py-s rounded-t-xs border-b items-center justify-center ${
            activeTab === "filter"
              ? "bg-structure-primary-9 border-structure-primary-9"
              : "border-structure-primary-9"
          }`}
          onPress={() => setActiveTab("filter")}
        >
          <View className="flex-row gap-s items-center justify-center">
            <Filter
              size={16}
              color={activeTab === "filter" ? "#fff" : "#000"}
            />
            <Text
              className={`text-m ${
                activeTab === "filter"
                  ? "text-button-primary-default-text"
                  : "text-text-default"
              }`}
            >
              {filterByText}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-1 px-xs py-s rounded-t-xs border-b items-center justify-center ${
            activeTab === "sort"
              ? "bg-structure-primary-9 border-structure-primary-9"
              : "border-structure-primary-9"
          }`}
          onPress={() => setActiveTab("sort")}
        >
          <View className="flex-row gap-s items-center justify-center">
            <Filter size={16} color={activeTab === "sort" ? "#fff" : "#000"} />
            <Text
              className={`text-m ${
                activeTab === "sort"
                  ? "text-button-primary-default-text"
                  : "text-text-default"
              }`}
            >
              {sortByText}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === "filter" ? (
        <ScrollView>
          {applicationOptions.length > 0 && (
            <View
              className="mb-4"
              style={{
                alignItems: language === "ar" ? "flex-end" : "flex-start",
              }}
            >
              {applicationOptions.map((option) => (
                <View key={option.value} className="mb-2">
                  <RadioField
                    id={option.value}
                    label={option.label}
                    label_ar={option.label_ar}
                    checked={selectedApp}
                    onChange={(id) => setSelectedApp(id)}
                    language={language}
                  />
                </View>
              ))}
            </View>
          )}
          {filterOptions.length > 0 && (
            <View
              style={{
                alignItems: language === "ar" ? "flex-end" : "flex-start",
              }}
            >
              {filterOptions.map((option) => (
                <View key={option.value} className="mb-2">
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
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        sortOptions.length > 0 && (
          <View
            style={{
              alignItems: language === "ar" ? "flex-end" : "flex-start",
            }}
          >
            {sortOptions.map((option) => (
              <View key={option.value} className="mb-2">
                <RadioField
                  id={option.value}
                  label={option.label}
                  label_ar={option.label_ar}
                  checked={selectedSort}
                  onChange={(id) => setSelectedSort(id)}
                  language={language}
                />
              </View>
            ))}
          </View>
        )
      )}
    </View>
  );
};

export default DropdownFilter;
