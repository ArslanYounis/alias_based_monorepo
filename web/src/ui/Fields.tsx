import React, {
  useRef,
  useState,
  useEffect,
  cloneElement,
  type SVGProps,
  type ReactNode,
  isValidElement,
} from "react";
import { Checkbox } from "./Checkbox";
import { DateInput } from "./DateInput";
import { AddButton } from "./AddButton";
import { CheckRadioLabel } from "./CheckRadioLabel";
import SelectArrow from "@/assets/svg/selectArrow";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export interface Option {
  label?: string;
  label_ar?: string;
  value: string;
}

export interface FormFieldProps {
  type:
    | "text"
    | "date"
    | "select"
    | "textarea"
    | "uaeid"
    | "currency"
    | "phone"
    | "number";
  placeholder?: string;
  placeholder_ar?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  language?: "en" | "ar";
  icon?: React.ReactNode;
  options?: Option[];
  disabled?: boolean;
  currencySymbol?: ReactNode | string;
  phoneCode?: ReactNode | string;
  selectType?: "single" | "multi";
  title?: string;
  title_ar?: string;
  isPrint_Archive?: boolean; // Optional prop for Print & Archive context
  showAddButton?: boolean;
  id?: string;
  ariaLabel?: string;
  testId?: string;
}

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
  title = "",
  title_ar = "",
  isPrint_Archive = false,
  showAddButton = false,
  id,
  ariaLabel,
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined
  );
  const [internalValue, setInternalValue] = useState(value);
  const [searchValue, setSearchValue] = useState("");

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
    }
  }, [isOpen]);

  // For multi-select, derive selectedItems from value prop
  const selectedItems = React.useMemo(() => {
    if (selectType === "multi") {
      if (!value) return [];
      // Accept both comma-separated string and array (for future-proofing)
      if (Array.isArray(value)) return value;
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  }, [value, selectType]);

  useEffect(() => {
    if (triggerRef?.current) {
      setPopoverWidth(triggerRef?.current?.offsetWidth);
    }
  }, [isOpen]);

  // Update internal value when value prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const formatUAEID = (input: string): string => {
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

  const baseInputClass = `w-full ${
    isPrint_Archive
      ? "py-xs px-xs !h-[36px]"
      : type === "textarea"
      ? "p-m gap-m !h-[100px]"
      : "p-m gap-m !h-[50px]"
  } font-normal text-m text-text-default rounded-[5px] focus:outline-none placeholder:text-form-fields-input-form-placeholder`;

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
    if (hasError) {
      return "text-form-fields-error";
    }

    if (disabled) {
      return "text-form-fields-input-form-icon";
    }

    return "text-form-fields-input-form-icon";
  };

  const renderIcon = (iconNode: ReactNode): ReactNode => {
    // Narrow to an element with SVG props if possible (covers most icon components)
    if (isValidElement<SVGProps<SVGSVGElement>>(iconNode)) {
      // Extract known props with safe typing
      const existingClassName =
        (iconNode.props as { className?: string }).className ?? "";
      const existingStyle =
        (iconNode.props as { style?: React.CSSProperties }).style ?? {};

      // Merge className without using `any`
      return cloneElement(
        iconNode as React.ReactElement<
          SVGProps<SVGSVGElement> & {
            className?: string;
            style?: React.CSSProperties;
          }
        >,
        {
          className: `${existingClassName} ${getIconColor()}`.trim(),
          // preserve other inline style values (do not set color inline to keep tailwind utility classes)
          style: { ...existingStyle },
        }
      );
    }

    // fallback: if it's not a React element (string, number, fragment), return as-is
    return iconNode;
  };

  const renderPrefix = (symbolOrCode: ReactNode | string) => {
    if (typeof symbolOrCode === "string") {
      return (
        <span
          className={`text-m font-normal pointer-events-none ${getIconColor()}`}
        >
          {symbolOrCode}
        </span>
      );
    }
    if (isValidElement(symbolOrCode)) {
      return cloneElement(
        symbolOrCode as React.ReactElement<Record<string, unknown>>,
        {
          style: { color: getIconColor() },
        }
      );
    }
    return symbolOrCode;
  };

  const renderError = () =>
    hasError && errorMessage ? (
      <p className="text-form-fields-error text-xs mt-1 font-medium">
        <SharedLanguageSwitchRenderer
          language={language}
          value={errorMessage}
          value_ar={errorMessage_ar}
        />
      </p>
    ) : null;

  const inputProps = {
    placeholder:
      language === "en" ? placeholder : placeholder_ar || placeholder,
    disabled,
    value: value ? value : internalValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setInternalValue(e.target.value);
    },
    className: `${baseInputClass} ${getInputClasses()} ${
      icon ? "px-xxl" : ""
    }`.trim(),
  };

  const handleSelectChange = (id: string) => {
    if (selectType === "single") {
      const selectedOption = options.find((option) => option.value === id);

      if (selectedOption) {
        onChange(selectedOption.value);
      }

      setSearchValue(""); //  reset search
      setIsOpen(false);
    } else {
      let newItems: string[];

      if (selectedItems.includes(id)) {
        newItems = selectedItems.filter((item) => item !== id);
      } else {
        newItems = [...selectedItems, id];
      }

      onChange(newItems.join(", "));
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const filteredOptions = React.useMemo(() => {
    if (!searchValue.trim()) return options;

    const lower = searchValue.toLowerCase();

    return options.filter((option) => {
      const label =
        language === "ar" ? option.label_ar || option.label : option.label;

      return label?.toLowerCase().includes(lower);
    });
  }, [options, searchValue, language]);

  // TEXTAREA
  if (type === "textarea") {
    return (
      <div style={{ direction: language === "en" ? "ltr" : "rtl" }}>
        <textarea
          rows={3}
          {...inputProps}
          id={id}
          onChange={(e) => {
            onChange(e.target.value);
            setInternalValue(e.target.value);
          }}
          className={`${baseInputClass} ${getInputClasses()} resize-none`}
          data-testid={testId}
        />
        {renderError()}
      </div>
    );
  }

  // SELECT
  if (type === "select") {
    const selectedLabel =
      selectType === "single"
        ? (() => {
            const selectedOption = options.find((option) => {
              return option.value === value;
            });
            if (!selectedOption) return null;
            return language === "ar"
              ? selectedOption.label_ar || selectedOption.label
              : selectedOption.label;
          })()
        : null;

    return (
      <div
        className="flex flex-1 gap-xs"
        style={{ direction: language === "en" ? "ltr" : "rtl" }}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div
              ref={triggerRef}
              className={`flex items-center justify-between ${baseInputClass} ${getInputClasses()} ${
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
              tabIndex={disabled ? -1 : 0}
              onClick={disabled ? undefined : toggleDropdown}
              onKeyDown={
                disabled
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") toggleDropdown();
                    }
              }
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-disabled={disabled}
              aria-label={ariaLabel}
              id={id}
              data-testid={testId}
            >
              <div className="flex-1">
                {isOpen ? (
                  <input
                    autoFocus
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={language === "en" ? "Search..." : "بحث..."}
                    className="w-full bg-transparent outline-none text-text-default placeholder:text-form-fields-input-form-placeholder"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={
                      disabled
                        ? undefined
                        : (e) => {
                            const target = e.target as HTMLElement;

                            // If user is typing in search input → do nothing
                            if (target.tagName === "INPUT") return;

                            // if (e.key === "Enter") {
                            //   e.preventDefault();
                            //   toggleDropdown();
                            // }
                          }
                    }
                  />
                ) : (
                  <span
                    className={
                      (selectType === "single" && selectedLabel) ||
                      (selectType === "multi" && selectedItems.length > 0)
                        ? "text-text-default"
                        : "text-form-fields-input-form-placeholder"
                    }
                  >
                    {selectType === "single"
                      ? selectedLabel ||
                        (language === "en"
                          ? placeholder
                          : placeholder_ar ?? placeholder)
                      : selectedItems.length > 0
                      ? `${selectedItems.length} ${
                          language === "en"
                            ? "item(s) selected"
                            : "العناصر المحددة"
                        }`
                      : language === "en"
                      ? placeholder
                      : placeholder_ar ?? placeholder}
                  </span>
                )}
              </div>

              <div className="pointer-events-none">
                <SelectArrow className={getIconColor()} />
              </div>
            </div>
          </PopoverTrigger>
          {showAddButton && <AddButton onClick={toggleDropdown} />}
          <PopoverContent
            portaled={false}
            className={`p-l rounded-xs max-h-60 overflow-y-auto text-text-default bg-filter-dropdown-bg ${
              disabled ? "hidden" : "block"
            }  border-none`}
            align="start"
            sideOffset={8}
            style={popoverWidth ? { width: popoverWidth, zIndex: 999999 } : {}}
          >
            {(title || title_ar) && (
              <div
                className={`text-bold-l cursor-default select-none text-text-default`}
              >
                {language === "en" ? title : title_ar ?? title}
              </div>
            )}
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((option) => (
                <div
                  key={option.value}
                  className={`gap-m p-s cursor-pointer text-text-default ${
                    selectType === "single"
                      ? value === option.value
                        ? "bg-filter-search-selected-bg"
                        : "hover:bg-filter-search-selected-bg"
                      : "flex items-center"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectChange(option.value);
                  }}
                  role="option"
                  aria-selected={
                    selectType === "single"
                      ? value === option.value
                      : selectedItems.includes(option.value)
                  }
                >
                  {selectType === "multi" && (
                    <Checkbox
                      id={option.value}
                      checked={selectedItems.includes(option.value)}
                      onChange={(id) => handleSelectChange(id)}
                    />
                  )}
                  <CheckRadioLabel
                    label={option.label}
                    label_ar={option.label_ar}
                    disabled={false}
                    language={language}
                  />
                </div>
              ))
            ) : (
              <div className="p-m text-text-dimmed">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value="No options found"
                  value_ar="لم يتم العثور على خيارات"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
        {renderError()}
      </div>
    );
  }

  // UAE ID
  if (type === "uaeid") {
    return (
      <div style={{ direction: language === "en" ? "ltr" : "rtl" }}>
        <div className="relative flex items-center">
          {icon && (
            <span
              className={`absolute ${
                language === "en" ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2`}
            >
              {renderIcon(icon)}
            </span>
          )}
          <input
            type="text"
            maxLength={15}
            {...inputProps}
            id={id}
            value={value ? value : internalValue}
            onChange={(e) => {
              onChange(formatUAEID(e.target.value));
              setInternalValue(formatUAEID(e.target.value));
            }}
            className={`${baseInputClass} ${getInputClasses()} ${
              icon ? "px-xxl" : ""
            }`}
          />
        </div>
        {renderError()}
      </div>
    );
  }

  // DATE
  if (type === "date") {
    return (
      <DateInput
        placeholder={placeholder}
        placeholder_ar={placeholder_ar}
        hasError={hasError}
        icon={icon}
        disabled={disabled}
        language={language}
        value={value}
        testId={testId}
        onDateChange={(date) => {
          if (date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            onChange(`${y}-${m}-${d}`); // safe string
          } else {
            onChange("");
          }
        }}
      />
    );
  }

  // CURRENCY & PHONE
  if (type === "currency" || type === "phone") {
    const prefix = type === "currency" ? currencySymbol : phoneCode;
    return (
      <div style={{ direction: language === "en" ? "ltr" : "rtl" }}>
        <div className="relative flex items-center">
          {icon ? (
            <span
              className={`absolute ${
                language === "en" ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2`}
            >
              {renderIcon(icon)}
            </span>
          ) : (
            <span
              className={`absolute ${
                language === "en" ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2`}
              style={{ direction: "ltr" }}
            >
              {renderPrefix(prefix)}
            </span>
          )}
          <input
            type="number"
            {...inputProps}
            id={id}
            aria-label={ariaLabel}
            value={value ? value : internalValue}
            className={`${baseInputClass} ${getInputClasses()} px-xxxl`}
            data-testid={testId}
          />
        </div>
        {renderError()}
      </div>
    );
  }

  // NUMBER
  if (type === "number") {
    return (
      <div style={{ direction: language === "en" ? "ltr" : "rtl" }}>
        <div className="relative flex items-center">
          {icon && (
            <span
              className={`absolute ${
                language === "en" ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2`}
            >
              {renderIcon(icon)}
            </span>
          )}
          <input
            type="number"
            {...inputProps}
            id={id}
            aria-label={ariaLabel}
            value={value ? value : internalValue}
            className={`${baseInputClass} ${getInputClasses()} ${
              icon ? "px-xxl" : ""
            }`}
            data-testid={testId}
          />
        </div>
        {renderError()}
      </div>
    );
  }

  // DEFAULT (text)
  return (
    <div style={{ direction: language === "en" ? "ltr" : "rtl" }}>
      <div className="relative flex items-center">
        {icon && (
          <span
            className={`absolute ${
              language === "en" ? "left-4" : "right-4"
            } top-1/2 -translate-y-1/2`}
          >
            {renderIcon(icon)}
          </span>
        )}
        <input
          type="text"
          {...inputProps}
          id={id}
          aria-label={ariaLabel}
          value={value ? value : internalValue}
        />
      </div>
      {renderError()}
    </div>
  );
};
