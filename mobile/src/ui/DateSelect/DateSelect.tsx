import type { DateSelectProps } from "@shared/types";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import InfoSVG from "~/assets/svg/icons/Info";
import SelectArrow from "~/assets/svg/icons/SelectArrow";
import { Caption } from "../Caption";

export type { DateSelectProps };

export const DateSelect: React.FC<DateSelectProps> = ({
  placeholder = "Select date",
  placeholder_ar = "اختر التاريخ",
  hasError = false,
  label,
  label_ar,
  disabled = false,
  onDateChange,
  infoText,
  infoText_ar,
  required = false,
  // errMessage,
  // errMessage_ar,
  errorMessage,
  errorMessage_ar,
  // caption,
  // caption_ar,
  captionLeft,
  captionLeft_ar,
  captionRight,
  captionRight_ar,
  // captionPosition = "left",
  language = "en",
  value,
  testId,
}) => {
  const controlledDate = value ? new Date(value) : undefined;
  const [date, setDate] = useState<Date | undefined>(controlledDate);
  const [showPicker, setShowPicker] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      setDate(selected);
      onDateChange?.(selected);
    }
  };

  const displayDate = date
    ? language === "ar"
      ? date.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    : "";

  return (
    <View className="flex flex-col gap-[10px]" testID={testId}>
      {label && (
        <View className="flex flex-row items-center gap-1">
          <SharedLanguageSwitchRenderer
            language={language}
            value={label}
            value_ar={label_ar}
          />
          {required && (
            <Text className="text-form-fields-error text-xs">*</Text>
          )}
          {infoText && (
            <Pressable onPress={() => setShowInfo((v) => !v)}>
              <InfoSVG width={14} height={14} />
            </Pressable>
          )}
        </View>
      )}
      {showInfo && infoText && (
        <View className="bg-filter-dropdown-bg px-2 py-1 rounded">
          <SharedLanguageSwitchRenderer
            language={language}
            value={infoText}
            value_ar={infoText_ar}
          />
        </View>
      )}
      <Pressable
        disabled={disabled}
        onPress={() => setShowPicker(true)}
        className={`flex flex-row items-center justify-between h-[50px] px-m rounded-[5px] border
          ${
            disabled
              ? "opacity-60 bg-form-fields-input-form-bg border-form-fields-input-form-border"
              : hasError
              ? "bg-form-fields-input-form-bg border-form-fields-error"
              : "bg-form-fields-input-form-bg border-form-fields-input-form-border"
          }
        `}
      >
        <Text
          className={`text-s font-normal
            ${
              date
                ? "text-text-default"
                : hasError
                ? "text-form-fields-error"
                : "text-form-fields-input-form-placeholder"
            }
          `}
        >
          {date
            ? displayDate
            : language === "ar"
            ? placeholder_ar || placeholder
            : placeholder}
        </Text>
        <SelectArrow color="#6B7280" />
      </Pressable>
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="max-h-[70%] rounded-t-xl bg-white p-l dark:bg-neutral-900"
          >
            <Text className="mb-m text-bold-l text-text-default">
              {date
                ? displayDate
                : language === "ar"
                ? placeholder_ar || placeholder
                : placeholder}
            </Text>
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleChange}
              disabled={disabled}
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                className="mt-m rounded-[5px] bg-form-fields-input-form-border py-m"
                activeOpacity={0.7}
              >
                <Text className="text-center text-m font-medium text-text-default">
                  {language === "ar" ? "تم" : "Done"}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {/* {hasError && errMessage && (
        <Text className="text-xs text-form-fields-error">
          <SharedLanguageSwitchRenderer
            language={language}
            value={errMessage}
            value_ar={errMessage_ar}
          />
        </Text>
      )}
      {caption && (
        <Text
          className={`text-bold-xs ${
            disabled
              ? "text-text-dimmed"
              : "text-form-fields-captions-text-color"
          } ${captionPosition === "right" ? "text-right" : "text-left"}`}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value={caption}
            value_ar={caption_ar}
          />
        </Text>
      )} */}
      {(captionLeft ||
        captionRight ||
        captionLeft_ar ||
        captionRight_ar ||
        (hasError && (errorMessage || errorMessage_ar))) && (
        <Caption
          language={language}
          captionLeft={captionLeft}
          captionLeft_ar={captionLeft_ar}
          captionRight={captionRight}
          captionRight_ar={captionRight_ar}
          hasError={hasError}
          errorMessage={errorMessage}
          errorMessage_ar={errorMessage_ar}
          disabled={disabled}
        />
      )}
    </View>
  );
};
