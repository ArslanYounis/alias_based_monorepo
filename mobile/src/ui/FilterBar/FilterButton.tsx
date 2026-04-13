import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/src/ui/Text";
import { ListFilter } from "lucide-react-native";

type FilterButtonProps = {
  label?: string;
  count?: number;
  isActive?: boolean;
  icon?: React.ReactElement;
  onClick?: () => void;
  className?: string;
};

const FilterButton: React.FC<FilterButtonProps> = ({
  // label = "All Filters",
  count = 0,
  isActive = false,
  icon,
  onClick,
  className = "",
}) => {
  return (
    <Pressable
      onPress={onClick}
      className={`w-fit rounded-xxs relative flex-row gap-s py-s px-m ${
        isActive
          ? "bg-filter-button-bg-selected border border-filter-button-stroke-selected"
          : ""
      } ${className}`}
    >
      <View className="items-center flex-row gap-s">
        <View className="text-filter-button-text">
          {icon ? (
            icon
          ) : (
            <ListFilter
              size={20}
              color="currentColor"
              className="text-filter-button-text"
            />
          )}
        </View>
        {/* <Text className="text-base text-filter-button-text">{label}</Text> */}
        {count > 0 && (
          <View className="flex justify-center items-center w-5 h-5 border border-structure-primary-9">
            <Text className="text-structure-primary-9 text-xs">{count}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default FilterButton;
