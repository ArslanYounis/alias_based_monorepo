import type { BreadcrumbProps } from "@shared/types";
import React from "react";
import { View, Text, Pressable } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { BreadcrumbProps };

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [
    { label: "Home", label_ar: "الرئيسية" },
    { label: "Level 1", label_ar: "المستوى 1" },
  ],
  selectedItemIndex,
  isSelectedHover,
  language = "en",
}) => {
  const finalSelectedItemIndex =
    selectedItemIndex !== undefined ? selectedItemIndex : items.length - 1;

  return (
    <View className="py-xxs" style={{ flexDirection: "row" }}>
      {items.map((item, index) => {
        const isSelected = index === finalSelectedItemIndex;

        return (
          <View key={index} className="flex-row items-center">
            {index > 0 && <Text className="px-s text-text-dimmed">/</Text>}

            <Pressable
              disabled={!item.onClick}
              onPress={item.onClick}
              className={isSelected ? "" : ""}
            >
              <Text
                className={
                  isSelected ? "text-text-default" : "text-text-dimmed"
                }
              >
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={item.label}
                  value_ar={item.label_ar}
                />
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};
