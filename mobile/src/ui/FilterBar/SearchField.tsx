import React, { useState } from "react";
import {
  View,
  TextInput,
  Modal,
  Pressable,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Search } from "lucide-react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import { CheckboxField } from "../CheckboxField";

interface SearchFieldProps {
  language?: "en" | "ar";
  value: string;
  onChange: (text: string) => void;
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
  columnsToSearch,
  selectedColumns = [],
  setSelectedColumns,
  chooseColumnsText = "Choose columns to search",
  chooseColumnsText_ar = "اختر الأعمدة للبحث",
}) => {
  const [active, setActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleInputFocus = () => {
    setActive(true);
    if (columnsToSearch && columnsToSearch.length > 0) {
      setDropdownOpen(true);
    }
  };

  const handleInputBlur = () => {
    setActive(false);
  };

  // const handleCheckboxChange = (col: string) => {
  //   if (!setSelectedColumns) return;
  //   if (selectedColumns.includes(col)) {
  //     setSelectedColumns(selectedColumns.filter((c) => c !== col));
  //   } else {
  //     setSelectedColumns([...selectedColumns, col]);
  //   }
  // };

  return (
    <Pressable onPress={handleInputFocus} onBlur={handleInputBlur}>
      <View
        className={`relative flex-row items-center justify-center rounded-sm h-[50px] gap-s ${
          dropdownOpen
            ? "bg-filter-search-selected-bg border-2 border-filter-search-selected-stroke px-s"
            : "bg-filter-search-bg border-2 border-filter-search-stroke"
        }`}
        style={{ width: dropdownOpen ? 150 : 50 }}
      >
        {dropdownOpen && (
          <TextInput
            placeholder={language === "ar" ? placeholder_ar : placeholder}
            className="flex-1 text-m text-filter-button-text"
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            textAlign={language === "ar" ? "right" : "left"}
          />
        )}
        <Search
          size={20}
          className={
            dropdownOpen
              ? "text-filter-search-selected-icon"
              : "text-filter-search-icon"
          }
          color={dropdownOpen ? "#3B82F6" : "#6B7280"}
        />
        {/* Column selector modal */}
        {/* <Modal
          visible={
            dropdownOpen && !!columnsToSearch && columnsToSearch.length > 0
          }
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  className="rounded-md p-6 bg-filter-dropdown-bg"
                  style={{
                    position: "absolute",
                    top: 120,
                    left: language === "ar" ? undefined : 16,
                    right: language === "ar" ? 16 : undefined,
                    width: 320,
                    boxShadow: "0px 16px 32px 0px #0000001A",
                  }}
                >
                  <Text className="text-bold-lg text-text-default mb-3">
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={chooseColumnsText}
                      value_ar={chooseColumnsText_ar}
                    />
                  </Text>
                  <ScrollView>
                    {columnsToSearch?.map((key) => (
                      <View key={key} className="mb-2">
                        <CheckboxField
                          id={key}
                          label={key}
                          label_ar={key}
                          checked={selectedColumns.includes(key)}
                          onChange={() => handleCheckboxChange(key)}
                          language={language}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal> */}
      </View>
    </Pressable>
  );
};

export default SearchField;
