import type { FormFieldProps } from "@shared/types";
import React, {
  type SVGProps,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type NativeSyntheticEvent,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { Checkbox } from "../Checkbox";
import { AddButton } from "../AddButton";
import { DateSelect } from "../DateSelect";
import { CheckRadioLabel } from "../CheckRadioLabel";
import SelectArrow from "~/assets/svg/icons/SelectArrow";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { FormFieldProps, Option } from "@shared/types";

export const Fields: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  placeholder_ar,
  value,
  onChange,
  hasError = false,
  errorMessage,
  errorMessage_ar,
  language = "en",
  icon,
  options = [],
  disabled = false,
  currencySymbol = "AED",
  phoneCode = "+971",
  selectType = "single",
  title,
  title_ar,
  isPrint_Archive = false,
  showAddButton = false,
  id,
  ariaLabel,
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
    }
  }, [isOpen]);

  const selectedItems = React.useMemo(() => {
    if (selectType === "multi") {
      const raw = value || internalValue;
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      return raw
        .split(/,|\s/)
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  }, [value, internalValue, selectType]);

  useEffect(() => {
    if (type !== "select" || value !== "") {
      setInternalValue(value);
    }
  }, [value, type]);

  const filteredOptions = React.useMemo(() => {
    if (!searchValue.trim()) return options;
    const lower = searchValue.toLowerCase();
    return options.filter((option) => {
      const label =
        language === "ar" ? option.label_ar || option.label : option.label;
      return label?.toLowerCase().includes(lower);
    });
  }, [options, searchValue, language]);

  const bottomSheetSelectRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (type !== "select") return;
    if (isOpen) {
      bottomSheetSelectRef.current?.present();
    } else {
      bottomSheetSelectRef.current?.dismiss();
    }
  }, [isOpen, type]);

  const renderSelectBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const formatUAEID = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 13)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
      7,
      13
    )}-${digits.slice(13, 14)}`;
  };

  const handleSelect = (id: string) => {
    if (selectType === "single") {
      setInternalValue(id);
      onChange(id);
      setIsOpen(false);
    } else {
      const isSelected = selectedItems.includes(id);
      let nextItems: string[];
      if (isSelected) {
        nextItems = selectedItems.filter((i) => i !== id);
      } else {
        nextItems = [...selectedItems, id];
      }
      const nextValue = nextItems.join(", ");
      setInternalValue(nextValue);
      onChange(nextValue);
    }
  };

  const baseInputClass = `w-full ${
    isPrint_Archive
      ? "py-xs px-xs !h-[36px]"
      : type === "textarea"
      ? "p-m gap-m !h-[100px]"
      : "p-m gap-m !h-[50px]"
  } font-normal text-s text-text-default rounded-[5px] focus:outline-none placeholder:text-form-fields-input-form-placeholder`;

  const getInputClasses = () => {
    if (disabled) {
      return "bg-form-fields-input-form-bg text-form-fields-input-form-placeholder border border-form-fields-input-form-border cursor-not-allowed opacity-60 placeholder:text-form-fields-input-form-placeholder";
    }
    if (hasError) {
      return "border border-form-fields-error placeholder-form-fields-error text-form-fields-error bg-form-fields-input-form-bg placeholder:text-form-fields-input-form-placeholder";
    }
    return "bg-form-fields-input-form-bg text-form-fields-input-form-placeholder border border-form-fields-input-form-border placeholder:text-form-fields-input-form-placeholder";
  };

  const getIconColor = () => {
    if (hasError) return "text-form-fields-error";
    if (disabled) return "text-form-fields-input-form-icon";
    return "text-form-fields-input-form-icon";
  };

  const renderIcon = (iconNode: ReactNode): ReactNode => {
    if (isValidElement<SVGProps<SVGSVGElement>>(iconNode)) {
      const existingClassName =
        (iconNode.props as { className?: string }).className ?? "";
      const existingStyle =
        (iconNode.props as { style?: React.CSSProperties }).style ?? {};
      return cloneElement(
        iconNode as React.ReactElement<
          SVGProps<SVGSVGElement> & {
            className?: string;
            style?: React.CSSProperties;
          }
        >,
        {
          className: `${existingClassName} ${getIconColor()}`.trim(),
          style: { ...existingStyle },
        }
      );
    }
    return iconNode;
  };

  const renderPrefix = (symbolOrCode: ReactNode | string) => {
    if (typeof symbolOrCode === "string") {
      return (
        <Text
          className={`text-m font-normal pointer-events-none ${getIconColor()}`}
        >
          {symbolOrCode}
        </Text>
      );
    }
    if (isValidElement(symbolOrCode)) {
      return cloneElement(
        symbolOrCode as React.ReactElement<Record<string, unknown>>,
        { style: { color: getIconColor() } }
      );
    }
    return symbolOrCode;
  };

  const renderError = () =>
    hasError && errorMessage ? (
      <View className="mt-1 w-full">
        <Text className="text-form-fields-error text-xs font-medium">
          <SharedLanguageSwitchRenderer
            language={language}
            value={errorMessage}
            value_ar={errorMessage_ar}
          />
        </Text>
      </View>
    ) : null;

  const inputProps = {
    placeholder:
      language === "en" ? placeholder : placeholder_ar || placeholder,
    disabled,
    value: value ? value : internalValue,
    onChange: (e: NativeSyntheticEvent<{ text: string }>) => {
      const text = e.nativeEvent.text;
      onChange(text);
      setInternalValue(text);
    },
    className: `${baseInputClass} ${getInputClasses()} ${
      icon ? "px-xxl" : ""
    }`.trim(),
  };

  if (type === "textarea") {
    return (
      <View>
        <TextInput
          multiline
          id={id}
          {...inputProps}
          data-testid={testId}
          editable={!disabled}
          placeholder={
            language === "en" ? placeholder : placeholder_ar ?? placeholder
          }
          onChange={(e) => {
            const text = e.nativeEvent.text;
            onChange(text);
            setInternalValue(text);
          }}
          className={`${baseInputClass} ${getInputClasses()} resize-none`}
        />
        {renderError()}
      </View>
    );
  }

  if (type === "date") {
    return (
      <DateSelect
        value={value}
        testId={testId}
        hasError={hasError}
        disabled={disabled}
        language={language}
        placeholder={placeholder}
        placeholder_ar={placeholder_ar}
        onDateChange={(date: Date | undefined) => {
          if (date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            onChange(`${y}-${m}-${d}`);
          } else {
            onChange("");
          }
        }}
      />
    );
  }

  if (type === "select") {
    const effectiveValue =
      selectType === "single" ? value || internalValue : value;
    const selectedLabel =
      selectType === "single"
        ? (() => {
            const selectedOption = options.find(
              (opt) => opt.value === effectiveValue
            );
            if (!selectedOption) return null;
            return language === "ar"
              ? selectedOption.label_ar || selectedOption.label
              : selectedOption.label;
          })()
        : null;

    const displayText =
      selectType === "single"
        ? selectedLabel ??
          (language === "en" ? placeholder : placeholder_ar ?? placeholder)
        : selectedItems.length > 0
        ? `${selectedItems.length} ${
            language === "en" ? "item(s) selected" : "العناصر المحددة"
          }`
        : language === "en"
        ? placeholder
        : placeholder_ar ?? placeholder;

    return (
      <View>
        <View className="relative flex flex-row items-center gap-xs">
          <TouchableOpacity
            onPress={disabled ? undefined : () => setIsOpen(true)}
            disabled={disabled}
            activeOpacity={0.7}
            className={`flex-1 flex-row items-center justify-between ${baseInputClass} ${getInputClasses()} ${
              disabled ? "opacity-60" : ""
            }`}
            accessibilityLabel={ariaLabel}
            accessibilityRole="combobox"
            accessibilityState={{ expanded: isOpen, disabled }}
            testID={testId}
          >
            <Text
              className={`flex-1 ${
                (selectType === "single" && selectedLabel) ||
                (selectType === "multi" && selectedItems.length > 0)
                  ? "text-text-default"
                  : "text-form-fields-input-form-placeholder"
              }`}
              numberOfLines={1}
            >
              {displayText}
            </Text>
            <View className={getIconColor()}>
              <SelectArrow />
            </View>
          </TouchableOpacity>
          {showAddButton && <AddButton onClick={() => setIsOpen(true)} />}
        </View>

        <BottomSheetModal
          ref={bottomSheetSelectRef}
          snapPoints={["50%"]}
          stackBehavior="push"
          enableDynamicSizing={false}
          enablePanDownToClose
          onChange={(index) => {
            if (index === -1) setIsOpen(false);
          }}
          backdropComponent={renderSelectBackdrop}
          backgroundStyle={{ backgroundColor: "#fff" }}
          handleIndicatorStyle={{ backgroundColor: "#ccc" }}
        >
          <BottomSheetScrollView
            style={{ paddingHorizontal: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {(title || title_ar) && (
              <Text className="mb-m text-bold-l text-text-default">
                {language === "en" ? title : title_ar ?? title}
              </Text>
            )}
            <BottomSheetTextInput
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder={language === "en" ? "Search..." : "بحث..."}
              className="mb-m w-full rounded-[5px] border border-form-fields-input-form-border bg-form-fields-input-form-bg p-m text-text-default"
              placeholderTextColor="#9ca3af"
            />
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected =
                  selectType === "single"
                    ? effectiveValue === option.value
                    : selectedItems.includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                    className={`flex-row items-center gap-m p-s ${
                      isSelected ? "bg-filter-search-selected-bg" : ""
                    }`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    {selectType === "multi" && (
                      <Checkbox
                        id={option.value}
                        checked={selectedItems.includes(option.value)}
                        onChange={(id) => handleSelect(id)}
                      />
                    )}
                    <CheckRadioLabel
                      label={option.label}
                      label_ar={option.label_ar}
                      disabled={false}
                      language={language}
                      onClick={() => handleSelect(option.value)}
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="p-m">
                <Text>
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="No options found"
                    value_ar="لم يتم العثور على خيارات"
                    className="text-text-dimmed"
                  />
                </Text>
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheetModal>
        {renderError()}
      </View>
    );
  }

  if (type === "uaeid") {
    const {
      onChange: _onChange,
      value: _value,
      ...uaeIdInputProps
    } = inputProps;
    return (
      <View>
        <View className="relative flex-row items-center">
          {icon && (
            <View className="absolute z-50 left-4 top-1/2 -translate-y-1/2">
              {renderIcon(icon)}
            </View>
          )}
          <TextInput
            id={id}
            {...uaeIdInputProps}
            editable={!disabled}
            maxLength={15}
            keyboardType="number-pad"
            value={internalValue}
            onChangeText={(text) => {
              const formatted = formatUAEID(text);
              setInternalValue(formatted);
              onChange(formatted);
            }}
            className={`${baseInputClass} ${getInputClasses()} ${
              icon ? "px-xxl" : ""
            }`}
          />
        </View>
        {renderError()}
      </View>
    );
  }

  if (type === "currency" || type === "phone") {
    const prefix = type === "currency" ? currencySymbol : phoneCode;
    const numericOnly = type === "phone"
      ? (text: string) => text.replace(/[^0-9]/g, "")
      : (text: string) => text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    return (
      <View>
        <View className="relative flex-row items-center">
          {icon ? (
            <View className="absolute z-50 left-4 top-1/2 -translate-y-1/2">
              {renderIcon(icon)}
            </View>
          ) : (
            <View className="absolute z-50 left-4 top-1/2 -translate-y-1/2">
              {renderPrefix(prefix)}
            </View>
          )}
          <TextInput
            id={id}
            {...inputProps}
            maxLength={15}
            data-testid={testId}
            keyboardType="numeric"
            value={value ? value : internalValue}
            onChange={(e) => {
              const filtered = numericOnly(e.nativeEvent.text);
              setInternalValue(filtered);
              onChange(filtered);
            }}
            className={`${baseInputClass} ${getInputClasses()} px-xxxl`}
          />
        </View>
        {renderError()}
      </View>
    );
  }

  if (type === "number") {
    return (
      <View>
        <View className="relative flex-row items-center">
          {icon && (
            <View className="absolute z-50 left-4 top-1/2 -translate-y-1/2">
              {renderIcon(icon)}
            </View>
          )}
          <TextInput
            id={id}
            {...inputProps}
            maxLength={15}
            data-testid={testId}
            keyboardType="numeric"
            value={value ? value : internalValue}
            onChange={(e) => {
              const filtered = e.nativeEvent.text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
              setInternalValue(filtered);
              onChange(filtered);
            }}
            className={`${baseInputClass} ${getInputClasses()} ${
              icon ? "px-xxl" : ""
            }`}
          />
        </View>
        {renderError()}
      </View>
    );
  }

  return (
    <View>
      <View className="relative flex flex-row items-center">
        {icon && (
          <View className="absolute z-50 left-4 top-1/2 -translate-y-1/2">
            {renderIcon(icon)}
          </View>
        )}
        <TextInput
          id={id}
          {...inputProps}
          editable={!disabled}
          value={value ? value : internalValue}
          keyboardType={"default"}
          placeholder={
            language === "en" ? placeholder : placeholder_ar ?? placeholder
          }
        />
      </View>
      {renderError()}
    </View>
  );
};
