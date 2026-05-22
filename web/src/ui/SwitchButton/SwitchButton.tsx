import React from "react";
import type { SwitchButtonProps } from "@shared/types";
export type { SwitchButtonProps };

export const SwitchButton: React.FC<SwitchButtonProps> = ({
  type,
  onToggle,
}) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={type === "Standard"}
        onChange={onToggle}
      />
      <div className="w-[48px] h-[24px] border border-text-dimmed bg-Base-White peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:bg-Base-White transition-colors duration-300" />
      <div
        className={`absolute left-0.5 top-0.5 ${
          type === "Standard" ? "bg-text-link" : "bg-text-dimmed"
        } w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-5`}
      />
    </label>
  );
};
