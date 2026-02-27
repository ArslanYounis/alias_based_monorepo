import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { RadioField } from "@/ui/RadioField";
import { CheckboxField } from "@/ui/CheckboxField";

interface ColumnButtonProps {
  label?: string;
  title?: string;
  columns?: string[];
  isDark?: boolean;
  selectedColumns?: string[];
  setSelectedColumns?: (cols: string[]) => void;
  type?: "singleSelect" | "multiSelect";
}

const ColumnButton: React.FC<ColumnButtonProps> = ({
  label = "Column 1 Name",
  title = "View Column",
  columns,
  isDark = false,
  selectedColumns = [],
  setSelectedColumns,
  type = "singleSelect",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleButtonClick = () => {
    if (!columns || columns.length === 0) return;
    setDropdownOpen((open) => !open);
  };

  const handleOptionClick = (col: string) => {
    if (!setSelectedColumns) return;
    if (type === "singleSelect") {
      setSelectedColumns([col]);
    } else {
      if (selectedColumns.includes(col)) {
        setSelectedColumns(selectedColumns.filter((c) => c !== col));
      } else {
        setSelectedColumns([...selectedColumns, col]);
      }
    }
  };

  const handleRadioChange = (value: string) => {
    handleOptionClick(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCheckboxChange = (_id: string, _checked: boolean) => {
    handleOptionClick(_id);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        className={`flex items-center gap-s px-m py-xxs rounded-xxs cursor-pointer w-[178px] h-[50px] text-Dark-6`}
        onClick={handleButtonClick}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown size={18} />
      </button>
      {dropdownOpen && columns && columns.length > 0 && (
        <div
          className={`absolute left-0 top-10 w-[350px] max-h-[280px] overflow-y-auto mt-2 rounded-xs p-l z-10 bg-filter-dropdown-bg`}
          style={{ boxShadow: "0px 16px 32px 0px #0000001A" }}
        >
          <p className={`text-bold-l mb-[24px] text-text-default`}>{title}</p>
          <div className="gap-m">
            {columns.map((col) => (
              <div key={col}>
                {type === "multiSelect" ? (
                  <CheckboxField
                    id={col}
                    label={col}
                    checked={selectedColumns.includes(col)}
                    onChange={(checked) => {
                      if (checked) {
                        handleOptionClick(col);
                      } else {
                        handleOptionClick(col);
                      }
                    }}
                    theme={isDark ? "dark" : "light"}
                  />
                ) : (
                  <RadioField
                    id={col}
                    label={col}
                    checked={selectedColumns[0] === col}
                    onChange={handleRadioChange}
                    theme={isDark ? "dark" : "light"}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnButton;
