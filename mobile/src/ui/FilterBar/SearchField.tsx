import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Search } from "lucide-react-native";

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
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const openModal = () => {
    setModalVisible(true);
    // auto-focus after modal mounts
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable onPress={openModal}>
        <View className="flex-row items-center justify-center rounded-sm h-[50px] bg-filter-search-bg border-2 border-filter-search-stroke" style={{ width: 50 }}>
          <Search size={20} color="#6B7280" />
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", paddingHorizontal: 24 }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="flex-row items-center rounded-sm bg-filter-search-selected-bg border-2 border-filter-search-selected-stroke px-s" style={{ height: 50 }}>
                <Search size={20} color="#3B82F6" />
                <TextInput
                  ref={inputRef}
                  placeholder={language === "ar" ? placeholder_ar : placeholder}
                  className="flex-1 text-m text-filter-button-text ml-2"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  textAlign={language === "ar" ? "right" : "left"}
                  autoFocus
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default SearchField;
