import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Info from "@/assets/svg/info";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateInputProps {
  placeholder?: string;
  placeholder_ar?: string;
  hasError?: boolean;
  icon?: React.ReactNode;
  label?: string;
  label_ar?: string;
  disabled?: boolean;
  onDateChange?: (date: Date | undefined) => void;
  required?: boolean;
  infoText?: string;
  infoText_ar?: string;
  errMessage?: string;
  errMessage_ar?: string;
  caption?: string;
  caption_ar?: string;
  captionPosition?: "left" | "right";
  language?: "en" | "ar";
  value?: string; // ISO date string
  testId?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  placeholder = "Select date",
  placeholder_ar = "اختر التاريخ",
  hasError,
  label,
  label_ar,
  disabled,
  onDateChange,
  infoText,
  infoText_ar,
  required = false,
  errMessage,
  errMessage_ar,
  caption,
  caption_ar,
  captionPosition = "left",
  language = "en",
  value,
  testId,
}) => {
  // If value is provided, use it as the source of truth
  const controlledDate = value ? new Date(value) : undefined;
  const [date, setDate] = React.useState<Date | undefined>(controlledDate);

  // Keep internal state in sync with value prop
  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onDateChange?.(selectedDate);
  };

  // Format date for display
  let displayDate = "";
  if (date) {
    if (language === "ar") {
      displayDate = date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      displayDate = format(date, "PPP");
    }
  }

  return (
    <div
      className="flex flex-col gap-[10px]"
      dir={language === "ar" ? "rtl" : "ltr"}
      data-testid={testId}
    >
      {label && (
        <label className="text-bold-xs font-medium flex items-center gap-xxs text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value={label}
            value_ar={label_ar}
          />
          {required && (
            <span className="text-form-fields-error text-xs">*</span>
          )}
          {infoText && (
            <div className="relative group inline-flex items-center">
              <Info className="w-4 h-4" fill={"form-fields-label-icon"} />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 w-max rounded bg-filter-dropdown-bg px-2 py-1 text-xs text-text-default opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={infoText}
                  value_ar={infoText_ar}
                />
              </span>
            </div>
          )}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            className={cn(
              "w-full flex justify-between px-m font-normal text-base items-center cursor-pointer h-[50px] placeholder:text-form-fields-input-form-placeholder",
              disabled
                ? "bg-form-fields-input-form-bg text-text-default border border-form-fields-input-form-border"
                : hasError
                ? "bg-form-fields-input-form-bg text-form-fields-input-form-placeholder border border-form-fields-error "
                : "bg-form-fields-input-form-bg text-form-fields-input-form-placeholder border border-form-fields-input-form-border"
            )}
          >
            <span
              className={cn(
                date
                  ? "text-text-default" // black text when date is selected
                  : "text-form-fields-input-form-placeholder", // placeholder color
                !date && hasError && "text-form-fields-error"
              )}
            >
              {date
                ? displayDate
                : language === "ar"
                ? placeholder_ar || placeholder
                : placeholder}
            </span>
            {
              <CalendarIcon
                style={{ width: "20px", height: "20px" }}
                className={cn(
                  "",
                  "text-text-default",
                  hasError ? " text-form-fields-input-form-icon" : ""
                )}
              />
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align={language === "ar" ? "start" : "end"}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabled}
            className="rounded-xs border text-text-default bg-filter-dropdown-bg"
            lang={language}
          />
        </PopoverContent>
      </Popover>
      {hasError && errMessage && (
        <p className="text-xs text-form-fields-error">
          <SharedLanguageSwitchRenderer
            language={language}
            value={errMessage}
            value_ar={errMessage_ar}
          />
        </p>
      )}
      {caption && (
        <p
          className={cn(
            "text-bold-xs",
            disabled
              ? "text-text-dimmed"
              : "text-form-fields-captions-text-color",
            captionPosition === "right" ? "text-right" : "text-left"
          )}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value={caption}
            value_ar={caption_ar}
          />
        </p>
      )}
    </div>
  );
};
