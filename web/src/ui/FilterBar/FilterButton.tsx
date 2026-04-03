import React from "react";
import FilterIcon from "@/assets/svg/filterIcon";

type FilterButtonProps = {
  label?: string;
  count?: number;
  isActive?: boolean;
  icon?: React.ReactElement;
  onClick?: () => void;
  className?: string;
};

const FilterButton: React.FC<FilterButtonProps> = ({
  label = "All Filters",
  count = 0,
  isActive = false,
  icon,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`w-fit rounded-xxs relative flex gap-s py-s px-m ${
        isActive
          ? "bg-filter-button-bg-selected border border-filter-button-stroke-selected"
          : ""
      } ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <div className="items-center flex gap-s">
        <div className="text-filter-button-text">
          {icon ? icon : <FilterIcon />}
        </div>
        <span className="text-m text-filter-button-text">{label}</span>
        {count > 0 && (
          <div className="flex justify-center items-center w-5 h-5 border-1.5 border-structure-primary-9 text-structure-primary-9">
            {count}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterButton;
