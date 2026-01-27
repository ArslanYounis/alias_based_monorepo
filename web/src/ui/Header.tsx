import { Avatar } from "./Avatar";
import { Buttons } from "./Buttons";
import { IconButton } from "./IconButton";
import StatusUp from "@/assets/svg/statusUp";
import IconoirSettingsSvg from "@/assets/IconoirSettings";
import SelectDownArrow from "@/assets/icons/SelectDownArrow";
import { Breadcrumb, type BreadcrumbProps } from "./Breadcrumb";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface HeaderMenuItem {
  label: string;
  label_ar?: string;
  onClick: () => void;
  className?: string;
}

export interface HeaderProps {
  language?: "en" | "ar";
  checkinButtonText?: string;
  checkinButtonText_ar?: string;
  notificationsAriaLabel?: string;
  notificationsAriaLabel_ar?: string;
  notificationCount?: number;
  userName?: string;
  userName_ar?: string;
  avatarUrl?: string;
  languageText?: string;
  languageText_ar?: string;
  onToggleLanguage?: () => void;
  isEditing?: boolean;
  menuItems?: HeaderMenuItem[];
  breadcrumbItems?: BreadcrumbProps["items"];
}

export const Header = ({
  language = "en",
  checkinButtonText = "Checkin",
  checkinButtonText_ar = "تسجيل الحضور",
  // notificationsAriaLabel = "Notifications",
  // notificationsAriaLabel_ar = "الإشعارات",
  // notificationCount = 3,
  userName = "Farzana",
  userName_ar = "فرزانه",
  avatarUrl = "https://adrec-images.mastermind-mindset.com/user.png",
  languageText = "Language:",
  languageText_ar = "اللغة:",
  onToggleLanguage,
  menuItems = [],
  isEditing = false,
  breadcrumbItems = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => null },
    {
      label: "Level 1",
      label_ar: "المستوى 1",
      onClick: () => null,
    },
  ],
}: HeaderProps = {}) => {
  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <nav
        className={`flex items-center justify-between md:px-16 py-3 h-[92px] ${
          isEditing ? "blur-xs pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="hidden! md:flex!">
            <Breadcrumb language={language} items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Buttons
            title={languageText + " " + "English"}
            title_ar={languageText_ar + " " + "العربية"}
            size="m"
            type="primary"
            language={language}
            onClick={onToggleLanguage}
          />
          <div className="flex items-center gap-[24px] mr-1">
            <IconButton
              icon={<IconoirSettingsSvg className="text-text-default" />}
            />
            {/* <button
              aria-label={
                language === "ar"
                  ? notificationsAriaLabel_ar
                  : notificationsAriaLabel
              }
              className="relative text-text-default text-xl"
            >
              <IconoirBellSvg />
              {notificationCount && notificationCount > 0 ? (
                <span className="absolute -top-4 -right-3 border border-Red-9 bg-Red-9 text-button-primary-default-text text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                  {notificationCount}
                </span>
              ) : null}
            </button> */}
            <IconButton icon={<StatusUp className="text-text-default" />} />
          </div>

          <Buttons
            title={language === "ar" ? checkinButtonText_ar : checkinButtonText}
            size="m"
            type="secondary"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer bg-transparent border-0 p-0">
                <div className="relative w-[42px] h-[42px]">
                  <Avatar
                    imageUrl={avatarUrl}
                    status="complete"
                    badgeSize={18}
                  />
                </div>
                <p className="text-[16px] text-text-default font-bold max-md:!hidden">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={userName}
                    value_ar={userName_ar || userName}
                  />
                </p>
                <div className="!hidden md:!block">
                  <SelectDownArrow className="text-text-default" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[150px] w-auto px-0 py-0 border-0 shadow-lg"
            >
              {menuItems?.map((item, idx) => (
                <DropdownMenuItem
                  dir={language === "ar" ? "rtl" : "ltr"}
                  key={idx}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                    item.className || ""
                  }`}
                  onClick={item.onClick}
                >
                  {language === "ar" ? item.label_ar || item.label : item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
};
