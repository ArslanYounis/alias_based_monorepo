import type { DateSelectProps } from "@shared/types";
import { Caption } from "../Caption";
import InfoSVG from "~/assets/svg/icons/Info";
import React, { useEffect, useState } from "react";
import CalendarIcon from "~/assets/svg/icons/Calendar";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";

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
  errorMessage,
  errorMessage_ar,
  captionLeft,
  captionLeft_ar,
  captionRight,
  captionRight_ar,
  language = "en",
  value,
  testId,
}) => {
  const controlledDate = value ? new Date(value) : undefined;
  const [date, setDate] = useState<Date | undefined>(controlledDate);
  const [tempDate, setTempDate] = useState<Date | undefined>(controlledDate);
  const [showPicker, setShowPicker] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
        setTempDate(parsed);
      }
    } else {
      setDate(undefined);
      setTempDate(undefined);
    }
  }, [value]);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selected) {
        setDate(selected);
        setTempDate(selected);
        onDateChange?.(selected);
      } else {
        setTempDate(date);
      }
      return;
    }
    if (selected) {
      setTempDate(selected);
    }
  };

  const handleDone = () => {
    setShowPicker(false);
    if (tempDate) {
      setDate(tempDate);
      onDateChange?.(tempDate);
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempDate(date);
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

  const displayTempDate = tempDate
    ? language === "ar"
      ? tempDate.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : tempDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    : "";

  return (
    <View className="flex flex-col gap-[10px]" testID={testId}>
      {label && (
        <View className="flex flex-row items-center gap-xxs">
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
        <View className="bg-filter-dropdown-bg px-xs py-xxs rounded">
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
        className={`flex flex-row items-center justify-between h-[50px] px-m rounded-xxs border
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
        <CalendarIcon color={hasError ? "#ee3e43" : "#414149"} />
      </Pressable>
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={tempDate ?? new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          disabled={disabled}
        />
      )}
      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="flex-1 justify-end bg-black/50"
            onPress={handleCancel}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              className="max-h-[70%] rounded-t-xl bg-white p-l dark:bg-neutral-900"
            >
              <Text className="mb-m text-bold-l text-text-default">
                {tempDate
                  ? displayTempDate
                  : language === "ar"
                  ? placeholder_ar || placeholder
                  : placeholder}
              </Text>
              <DateTimePicker
                value={tempDate ?? new Date()}
                mode="date"
                display="spinner"
                onChange={handleChange}
                disabled={disabled}
              />
              <TouchableOpacity
                onPress={handleDone}
                className="mt-m rounded-[5px] bg-form-fields-input-form-border py-m"
                activeOpacity={0.7}
              >
                <Text className="text-center text-m font-medium text-text-default">
                  {language === "ar" ? "تم" : "Done"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

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
