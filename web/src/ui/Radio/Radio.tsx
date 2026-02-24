import type { RadioProps } from "@shared/types";
import React, { useState, useEffect } from "react";

export type { RadioProps };

export const Radio: React.FC<RadioProps> = ({
  id,
  name,
  checked,
  disabled = false,
  hasError = false,
  onChange,
}) => {
  const isControlled = typeof checked === "boolean";
  const [isChecked, setIsChecked] = useState(!!checked);

  useEffect(() => {
    if (isControlled) {
      setIsChecked(!!checked);
    }
  }, [checked, isControlled]);

  let borderClasses = `border border-form-fields-checkbox-radio-cbr-border`;
  if (hasError) {
    borderClasses = "border-1 border-status-failed-solid";
  } else if (isChecked && disabled) {
    borderClasses =
      "border-6 border-form-fields-checkbox-radio-cbr-select-disable";
  } else if (isChecked) {
    borderClasses =
      "border-6 border-form-fields-checkbox-radio-cbr-bg-selected bg-form-fields-checkbox-radio-cb-icon-selected";
  } else if (disabled) {
    borderClasses = `border border-form-fields-checkbox-radio-cbr-select-disable`;
  }

  const handleChange = () => {
    if (disabled) return;
    if (!isControlled) {
      setIsChecked(true);
    }
    onChange?.(id, !isChecked);
  };

  return (
    <label
      htmlFor={id}
      className={`w-6 h-6 rounded-full cursor-pointer flex flex-col items-center justify-center ${
        disabled ? "cursor-not-allowed" : ""
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className="hidden"
        aria-invalid={hasError && isChecked}
      />
      <div className={`${borderClasses} w-6 h-6 rounded-full`} />
    </label>
  );
};
