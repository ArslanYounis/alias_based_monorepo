import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import { RadioField } from "../RadioField";
import { CheckboxField } from "../CheckboxField";

interface ColumnButtonProps {
  label?: string;
  title?: string;
  columns?: string[];
  isDark?: boolean;
  selectedColumns?: string[];
  setSelectedColumns?: (cols: string[]) => void;
  type?: "singleSelect" | "multiSelect";
}

const ColumnButton: React.FC<ColumnButtonProps> = ({
  label = "Column 1 Name",
  title = "View Column",
  columns,
  isDark = false,
  selectedColumns = [],
  setSelectedColumns,
  type = "singleSelect",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    if (!columns || columns.length === 0) return;
    setDropdownOpen((open) => !open);
  };

  const handleOptionClick = (col: string) => {
    if (!setSelectedColumns) return;
    if (type === "singleSelect") {
      setSelectedColumns([col]);
      setDropdownOpen(false);
    } else {
      if (selectedColumns.includes(col)) {
        setSelectedColumns(selectedColumns.filter((c) => c !== col));
      } else {
        setSelectedColumns([...selectedColumns, col]);
      }
    }
  };

  const handleRadioChange = (value: string) => {
    handleOptionClick(value);
  };

  return (
    <View className="relative">
      <Pressable
        className="flex-row items-center gap-s px-m py-xxs rounded-xxs"
        style={{ width: "auto", maxWidth: 150, height: 50 }}
        onPress={handleButtonClick}
      >
        <Text className="text-Dark-6">{label}</Text>
        <ChevronDown size={18} color="#374151" />
      </Pressable>

      <Modal
        visible={dropdownOpen && !!columns && columns.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                className="rounded-xs p-l bg-filter-dropdown-bg"
                style={{
                  width: "95%",
                  maxHeight: 280,
                }}
              >
                <Text className="text-bold-l mb-[24px] text-text-default">
                  {title}
                </Text>

                <ScrollView>
                  {columns?.map((col) => (
                    <View key={col} className="mb-2">
                      {type === "multiSelect" ? (
                        <CheckboxField
                          id={col}
                          label={col}
                          checked={selectedColumns.includes(col)}
                          onChange={() => handleOptionClick(col)}
                          theme={isDark ? "dark" : "light"}
                        />
                      ) : (
                        <RadioField
                          id={col}
                          label={col}
                          checked={selectedColumns[0]}
                          onChange={handleRadioChange}
                          theme={isDark ? "dark" : "light"}
                        />
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ColumnButton;
