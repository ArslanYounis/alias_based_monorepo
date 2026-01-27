import React, { useState } from "react";
import SharedLanguageSwitchRenderer from "../components/shared/SharedLanguageSwitchRenderer";

interface BreadcrumbItem {
  label: string;
  label_ar?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  selectedItemIndex?: number;
  isSelectedHover?: boolean;
  language?: "en" | "ar";
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => null },
    {
      label: "Level 1",
      label_ar: "المستوى 1",
      onClick: () => null,
    },
  ],
  selectedItemIndex,
  isSelectedHover = false,
  language = "en",
}) => {
  const [isHoveredOnSelected, setIsHoveredOnSelected] = useState(false);
  const finalSelectedItemIndex =
    selectedItemIndex !== undefined ? selectedItemIndex : items.length - 1;

  return (
    <nav className="text-text-dimmed">
      <ol className="flex items-center text-m gap-xxs py-xxs font-normal">
        {items.map((item, index) => {
          const isSelected = index === finalSelectedItemIndex;

          return (
            <React.Fragment key={index}>
              {index > 0 && <li className="text-text-dimmed px-s">/</li>}
              <li>
                {isSelected ? (
                  <span
                    className={`${
                      isSelectedHover && isHoveredOnSelected
                        ? "text-text-link cursor-pointer"
                        : "text-text-default cursor-default"
                    }`}
                    onMouseEnter={() => setIsHoveredOnSelected(true)}
                    onMouseLeave={() => setIsHoveredOnSelected(false)}
                    onClick={item?.onClick}
                  >
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={item.label}
                      value_ar={item.label_ar}
                    />
                  </span>
                ) : (
                  <span onClick={item?.onClick}>
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={item.label}
                      value_ar={item.label_ar}
                    />
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
