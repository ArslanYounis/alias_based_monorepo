import type { HeaderProps, HeaderMenuItem } from "@shared/types";
import { Avatar } from "../Avatar";
import { Buttons } from "../Buttons";
import { IconButton } from "../IconButton";
import StatusUp from "@/assets/svg/statusUp";
import IconoirSettingsSvg from "@/assets/IconoirSettings";
import SelectDownArrow from "@/assets/icons/SelectDownArrow";
import { Breadcrumb } from "../Breadcrumb";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type { HeaderProps, HeaderMenuItem };

export const Header = ({
  language = "en",
  checkinButtonText = "Checkin",
  checkinButtonText_ar = "تسجيل الحضور",
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
        className={`flex items-center justify-between md:px-16 py-s h-[92px] ${
          isEditing ? "blur-xs pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center gap-m">
          <div className="hidden! md:flex!">
            <Breadcrumb language={language} items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex items-center gap-s">
          <Buttons
            title={languageText + " " + "English"}
            title_ar={languageText_ar + " " + "العربية"}
            size="m"
            type="primary"
            language={language}
            onClick={onToggleLanguage}
          />
          <div className="flex items-center gap-l mr-xxs">
            <IconButton
              icon={<IconoirSettingsSvg className="text-text-default" />}
            />
            <IconButton icon={<StatusUp className="text-text-default" />} />
          </div>

          <Buttons
            title={language === "ar" ? checkinButtonText_ar : checkinButtonText}
            size="m"
            type="secondary"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-s cursor-pointer bg-transparent border-0 p-0">
                <div className="relative w-[42px] h-[42px]">
                  <Avatar
                    imageUrl={avatarUrl}
                    status="complete"
                    badgeSize={18}
                  />
                </div>
                <p className="text-m text-text-default font-bold max-md:!hidden">
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
                  className={`cursor-pointer px-m py-xs hover:bg-structure-primary-0 ${
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
