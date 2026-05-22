import type { CustomCheckboxProps } from "@shared/types";
import { useEffect, useState } from "react";

export type { CustomCheckboxProps };

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
  const checkedStyles =
    "bg-form-fields-checkbox-radio-cbr-bg-selected text-white border border-form-fields-checkbox-radio-cbr-border-selected";
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
