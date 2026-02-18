import React from "react";
import type { AddMoreButtonProps } from "@shared/types";
import { View, Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { AddMoreButtonProps };

const AddMoreButton: React.FC<AddMoreButtonProps> = ({
  title = "",
  title_ar = "",
  language = "en",
  onClick = () => {},
  plusIcon = <Plus size={18} />,
}) => {
  return (
    <View className="flex flex-1 flex-row items-center gap-s">
      <Pressable
        onPress={onClick}
        className="w-full h-12 flex-row items-center px-4 rounded-[5px] bg-form-fields-file-upload-default"
      >
        <View className="mr-2 justify-center">{plusIcon}</View>
        <View className="flex-1 justify-center">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
            className="text-m font-normal text-text-default"
          />
        </View>
      </Pressable>
    </View>
  );
};

export default AddMoreButton;
