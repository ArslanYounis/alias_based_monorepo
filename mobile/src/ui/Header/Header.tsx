import type { HeaderProps } from "@shared/types";
import React from "react";
import { Avatar } from "../Avatar";
import { IconButton } from "../IconButton";
import { Breadcrumb } from "../Breadcrumb";
import StatusUp from "~/assets/svg/icons/StatusUp";
import Settings from "~/assets/svg/icons/Settings";
import { View, Pressable } from "react-native";
// import SelectArrow from "~/assets/svg/icons/SelectArrow";
// import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { HeaderProps };
export type { HeaderMenuItem } from "@shared/types";

export const Header: React.FC<HeaderProps> = ({
  language = "en",
  // checkinButtonText = "Checkin",
  // checkinButtonText_ar = "تسجيل الحضور",
  // userName = "Farzana",
  // userName_ar = "فرزانه",
  avatarUrl,
  // languageText = "Language:",
  // languageText_ar = "اللغة:",
  // onToggleLanguage,
  isEditing = false,
  breadcrumbItems = [],
  onAvatarPress,
}) => {
  return (
    <View
      className={`bg-white px-4 pt-4 pb-3 ${isEditing ? "opacity-50" : ""}`}
    >
      {/* Breadcrumb (mobile-friendly) */}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <View className="mb-3">
          <Breadcrumb items={breadcrumbItems} language={language} />
        </View>
      )}

      {/* Header Row — direction managed by platform */}
      <View className="flex-row items-center justify-between">
        {/* Left Icons */}
        <View className="flex-row items-center gap-3">
          <IconButton icon={<Settings className="text-text-default" />} />
          <IconButton icon={<StatusUp className="text-text-default" />} />
        </View>

        {/* Right Section */}
        <View className="flex-row items-center gap-3">
          {/* Language Button */}
          {/* <Buttons
            title={`English`}
            title_ar={`العربية`}
            size="s"
            type="primary"
            language={language}
            onClick={onToggleLanguage}
          /> */}

          {/* Check-in Button */}
          {/* <Buttons
            title={language === "ar" ? checkinButtonText_ar : checkinButtonText}
            size="s"
            type="secondary"
          /> */}

          {/* Avatar */}
          <Pressable
            onPress={onAvatarPress}
            className="flex-row items-center gap-2"
          >
            <Avatar imageUrl={avatarUrl} status="complete" />
            {/* <Text className="text-base font-bold text-text-default">
              <SharedLanguageSwitchRenderer
                language={language}
                value={userName}
                value_ar={userName_ar}
              />
            </Text> */}
            {/* <SelectArrow className="text-text-default" /> */}
          </Pressable>
        </View>
      </View>
    </View>
  );
};
