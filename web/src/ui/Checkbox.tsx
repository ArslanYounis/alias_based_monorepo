import { useEffect, useState } from "react";

export interface CustomCheckboxProps {
  id: string;
  checked?: boolean;
  onChange?: (id: string, checked: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export const Checkbox = ({
  id,
  checked,
  onChange,
  disabled = false,
  hasError = false,
}: CustomCheckboxProps) => {
  const baseStyles =
    "text-form-fields-checkbox-radio-cb-icon border border-form-fields-checkbox-radio-cbr-border";
  const disabledStyles =
    "bg-form-fields-checkbox-radio-cbr-select-disable text-form-fields-checkbox-radio-cb-icon-selected border border-form-fields-checkbox-radio-cbr-select-disable cursor-not-allowed";
  const checkedStyles = "bg-[#008DCB] text-white border border-[#008DCB]";
  const errorStyles =
    "border-2 border-form-fields-error text-button-delete-hover-bg";

  const isControlled = typeof checked === "boolean";
  const [isChecked, setIsChecked] = useState(!!checked);

  useEffect(() => {
    if (isControlled) {
      setIsChecked(!!checked);
    }
  }, [checked, isControlled]);

  const handleChange = () => {
    if (disabled) return;
    // Always toggle for visual feedback
    if (!isControlled) {
      setIsChecked((prev) => !prev);
    }
    onChange?.(id, !isChecked);
  };

  // const getTickColor = () =>
  // {
  //   if (hasError && isChecked) return "text-[#EE3E43]"; // red tick when checked error
  //   if (hasError && !isChecked) return "black"; // black tick for unchecked error
  //   if (!isChecked) return "black"; // black tick for unchecked
  //   return "text-white"; // white tick for checked or disabled
  // };

  let styleClass = baseStyles;
  if (disabled) {
    styleClass = disabledStyles;
  } else if (hasError) {
    styleClass = errorStyles;
  } else if (isChecked) {
    styleClass = checkedStyles;
  }

  return (
    <div
      onClick={handleChange}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleChange();
        }
      }}
      className={`w-6 h-6 flex items-center justify-center rounded-xs transition-colors ${styleClass} ${
        disabled ? "pointer-events-none" : "cursor-pointer"
      }`}
    >
      <svg
        className={`w-3.5 h-3.5 `}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
};
