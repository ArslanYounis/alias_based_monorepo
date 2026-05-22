import React, { useState } from "react";
import type { LayoutSidebarProps } from "@shared/types";
import MenuHome from "@/assets/svg/MenuHome";
import LeftThirdIcon from "@/assets/svg/Leftthirdicon";
import MenuIconSvg from "@/assets/svg/Menu";
import UsersIconSvg from "@/assets/svg/UsersIcon";
import CrossIconSvg from "@/assets/icons/crossIconSvg";
import RightDoubleArrowIcon from "@/assets/svg/RightDoubleArrowIcon";
import LeaderboardStar from "@/assets/svg/LeaderboardStar";
import { IconButton } from "../IconButton";
import { Logo } from "../Logo";

interface MenuColumnProps extends LayoutSidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

type MenuItem = {
  label: string;
  label_ar?: string;
  icon: React.ElementType;
  path?: string;
  disabled?: boolean;
};

const menuItems: MenuItem[] = [
  {
    label: "Home",
    label_ar: " الصفحة الرئيسية",
    icon: MenuHome,
    path: "/home",
  },
  {
    label: "Community",
    label_ar: "المجتمع",
    icon: UsersIconSvg,
    path: "/community",
  },
  {
    label: "Services",
    label_ar: "الخدمات",
    icon: LeftThirdIcon,
    path: "/service",
  },
  {
    label: "Challenges",
    label_ar: "التحديات",
    icon: LeaderboardStar,
    path: "/challenges",
  },
];

export const MenuColumn: React.FC<MenuColumnProps> = ({
  currentPath,
  onNavigate,
  language = "en",
  theme: _theme,
  isEditing = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const activePath =
    currentPath ?? (typeof location !== "undefined" ? location.pathname : "");

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const bgColor = "bg-structure-menu-background";
  const hoverBgColor = "hover:bg-structure-menu-select-background";
  const activeBgColor = "bg-structure-menu-select-background";
  const textColor = "text-structure-menu-text";
  const hoverTextColor = "group-hover:text-structure-menu-select-text";
  const iconColor = "text-structure-menu-icon";

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`!hidden md:!flex flex-1 ${
          open
            ? "min-w-[235px] px-4 py-8 items-start"
            : "w-20 px-3 py-8 items-center"
        } ${bgColor} ${
          isEditing ? "blur-xs pointer-events-none" : ""
        } duration-300 flex-col relative h-[calc(100vh-80px)]`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="mb-8 text-center">
          <IconButton icon={<Logo type="hub" />} />
        </div>

        <div
          className={`flex flex-col space-y-1 w-full ${
            isEditing ? "blur-xs pointer-events-none" : ""
          }`}
        >
          {menuItems.map((item, index) => {
            const isActive = item.path && activePath === item.path;
            const Icon = item.icon;
            const isDisabled = !!item.disabled;

            return (
              <div
                key={index}
                role={isDisabled ? "button" : "link"}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                className={`rounded-[4px] py-2 px-2 flex items-center group ${textColor}
                  ${open ? "space-x-4" : "justify-center"}
                  ${isActive ? activeBgColor : hoverBgColor}
                  ${hoverTextColor}
                  ${
                    isDisabled
                      ? "cursor-not-allowed opacity-20"
                      : "cursor-pointer"
                  }
                `}
                onClick={() => {
                  if (isDisabled) return;
                  if (item.path) handleNavigate(item.path);
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                    if (item.path) handleNavigate(item.path);
                  }
                }}
              >
                <Icon
                  className={`${iconColor} group-hover:text-structure-menu-icon flex items-center shrink-0`}
                />
                <h2
                  className={`font-medium transition-all duration-300 ${
                    !open ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                >
                  {language === "ar" ? item.label_ar || item.label : item.label}
                </h2>
              </div>
            );
          })}
        </div>

        <div
          className={`absolute bottom-8 ${
            open
              ? language === "en"
                ? "left-4"
                : "right-4"
              : "left-1/2 -translate-x-1/2"
          } cursor-pointer flex items-center gap-2`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <>
              <RightDoubleArrowIcon
                className={`${iconColor} transform ${
                  language === "en" ? "rotate-180" : ""
                }`}
              />
              <h2 className={`font-medium ${textColor}`}>
                {language === "en" ? "Collapse" : " طي "}
              </h2>
            </>
          ) : (
            <RightDoubleArrowIcon
              className={`${iconColor} ${
                language === "ar" ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`flex items-center gap-2 md:!hidden absolute top-4 ${
          language === "ar" ? "right-4" : "left-4"
        }`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <button
          className="p-2 text-Base-White transition-all duration-300 cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIconSvg className="w-10 h-10" />
        </button>
        <div className="flex flex-col">
          <IconButton icon={<Logo type="hub" />} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full ${bgColor} transform z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out p-4 md:!hidden`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {sidebarOpen && (
          <button
            className="absolute top-4 right-4 z-50 p-2 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <CrossIconSvg className="w-8 h-8" />
          </button>
        )}
        <ul
          className={`space-y-4 mt-16 ${
            isEditing ? "blur-xs pointer-events-none" : ""
          }`}
        >
          {menuItems.map((item, index) => {
            const isActive = item.path && activePath === item.path;
            const Icon = item.icon;
            const isDisabled = !!item.disabled;

            return (
              <li
                key={index}
                role={isDisabled ? "button" : "link"}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                className={`rounded-md p-2 flex gap-4 items-center ${
                  isDisabled
                    ? "cursor-not-allowed opacity-20"
                    : "cursor-pointer"
                } ${isActive ? activeBgColor : hoverBgColor}`}
                onClick={() => {
                  if (isDisabled) return;
                  if (item.path) handleNavigate(item.path);
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                    if (item.path) handleNavigate(item.path);
                  }
                }}
              >
                <Icon
                  className={`${iconColor} group-hover:text-structure-menu-icon`}
                />
                <p className={`${textColor} font-medium`}>
                  {language === "ar" ? item.label_ar || item.label : item.label}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
