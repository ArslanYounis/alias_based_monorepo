import React from "react";
import type { PromptProps } from "@shared/types";
import { View } from "react-native";
import { Buttons } from "../Buttons";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { PromptProps };

const Prompt: React.FC<PromptProps> = ({
  title,
  title_ar,
  subtitle,
  subtitle_ar,
  yesText = "Yes",
  yesText_ar = "نعم",
  noText = "No",
  noText_ar = "لا",
  onYesClick,
  onNoClick,
  language = "en",
}) => {
  return (
    // <View style={{ gap: 24 }}>
    <View className="gap-m">
      <SharedLanguageSwitchRenderer
        value={title}
        value_ar={title_ar}
        language={language}
        className="text-heading-h3 font-bold text-text-default"
      />
      <SharedLanguageSwitchRenderer
        value={subtitle}
        value_ar={subtitle_ar}
        language={language}
        className="text-m text-text-default"
      />
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Buttons
          title={noText}
          title_ar={noText_ar}
          onClick={onNoClick}
          type="delete"
          language={language}
          size="m"
        />
        <Buttons
          title={yesText}
          title_ar={yesText_ar}
          onClick={onYesClick}
          type="secondary"
          language={language}
          size="m"
        />
      </View>
    </View>
  );
};

export default Prompt;
