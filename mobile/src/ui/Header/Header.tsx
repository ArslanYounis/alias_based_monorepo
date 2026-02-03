import React from "react";
import { Avatar } from "../Avatar";
import { Buttons } from "../Buttons";
import { IconButton } from "../IconButton";
import { Breadcrumb } from "../Breadcrumb";
import StatusUp from "~/assets/svg/icons/StatusUp";
import Settings from "~/assets/svg/icons/Settings";
import { View, Text, Pressable } from "react-native";
import SelectArrow from "~/assets/svg/icons/SelectArrow";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export interface HeaderMenuItem {
  label: string;
  label_ar?: string;
  onClick: () => void;
}

export interface HeaderProps {
  language?: "en" | "ar";
  checkinButtonText?: string;
  checkinButtonText_ar?: string;
  userName?: string;
  userName_ar?: string;
  avatarUrl?: string;
  languageText?: string;
  languageText_ar?: string;
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  menuItems?: HeaderMenuItem[];
  breadcrumbItems?: {
    label: string;
    label_ar?: string;
    onPress?: () => void;
  }[];
  onAvatarPress?: () => void; // 👈 mobile menu trigger
}

export const Header: React.FC<HeaderProps> = ({
  language = "en",
  checkinButtonText = "Checkin",
  checkinButtonText_ar = "تسجيل الحضور",
  userName = "Farzana",
  userName_ar = "فرزانه",
  avatarUrl,
  languageText = "Language:",
  languageText_ar = "اللغة:",
  onToggleLanguage,
  isEditing = false,
  breadcrumbItems = [],
  onAvatarPress,
}) => {
  const isRTL = language === "ar";

  return (
    <View
      className={`bg-white px-4 pt-4 pb-3 ${isEditing ? "opacity-50" : ""}`}
    >
      {/* Breadcrumb (mobile-friendly) */}
      {breadcrumbItems.length > 0 && (
        <View className="mb-3">
          <Breadcrumb items={breadcrumbItems} language={language} />
        </View>
      )}

      {/* Header Row */}
      <View
        className={`flex-row items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        {/* Left Icons */}
        <View className="flex-row items-center gap-3">
          <IconButton icon={<Settings className="text-text-default" />} />
          <IconButton icon={<StatusUp className="text-text-default" />} />
        </View>

        {/* Right Section */}
        <View
          className={`flex-row items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Language Button */}
          <Buttons
            title={`English`}
            title_ar={`العربية`}
            size="s"
            type="primary"
            language={language}
            onClick={onToggleLanguage}
          />

          {/* Check-in Button */}
          <Buttons
            title={language === "ar" ? checkinButtonText_ar : checkinButtonText}
            size="s"
            type="secondary"
          />

          {/* Avatar */}
          <Pressable
            onPress={onAvatarPress}
            className={`flex-row items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar imageUrl={avatarUrl} status="complete" />
            <Text className="text-base font-bold text-text-default">
              <SharedLanguageSwitchRenderer
                language={language}
                value={userName}
                value_ar={userName_ar}
              />
            </Text>
            <SelectArrow className="text-text-default" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
