import type { FilterBarProps } from "@shared/types";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

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
  const searchValue =
    typeof controlledSearchValue === "string" ? controlledSearchValue : internalSearch;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, padding: 8, backgroundColor: theme === "dark" ? "#262626" : "#f5f5f5", borderRadius: 8 }}>
      <TextInput
        value={searchValue}
        onChangeText={(v) => {
          if (onSearchChange) onSearchChange({ target: { value: v } } as Parameters<NonNullable<FilterBarProps["onSearchChange"]>>[0]);
          else setInternalSearch(v);
        }}
        placeholder={language === "ar" ? "بحث" : "Search"}
        style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, borderWidth: 1, borderColor: "#d4d4d4" }}
      />
      {onReset && (
        <TouchableOpacity onPress={onReset} style={{ padding: 8 }}>
          <Text style={{ color: "#171717" }}>{language === "ar" ? "إعادة تعيين" : "Reset"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
