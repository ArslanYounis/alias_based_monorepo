import { FolderSymlinkIcon } from "lucide-react";
import OwnerSearch, { type OwnerSearchProps } from "./OwnerSearch";

export interface ComponentConfig<T> {
  id: string;
  icon: typeof FolderSymlinkIcon;
  name: string;
  Component: React.FC<T>;
  controls: Record<string, unknown>;
}

const OwnerSearchConfig: ComponentConfig<OwnerSearchProps> = {
  id: "ownerSearch",
  icon: FolderSymlinkIcon,
  name: "Owner Search",
  Component: OwnerSearch,
  controls: {
    title: {
      type: ["text", "code"],
      label: "Title",
      hasArabic: true,
      defaultValue: "",
      defaultValueAr: "",
      defaultCode: 'return ""',
      defaultCodeAr: 'return ""',
    },
    theme: {
      type: ["select"],
      label: "Theme",
      options: ["light", "dark"],
      defaultValue: "dark",
    },
    ownerTypeOptions: {
      type: ["code"],
      label: "Owner Type Options",
      defaultValue: {
        company: "By Company Owner",
        company_ar: "بواسطة مالك الشركة",
        owner: "By Owner",
        owner_ar: "بواسطة المالك",
      },
      defaultCode: `return {
  company: 'By Company Owner',
  company_ar: 'بواسطة مالك الشركة',
  owner: 'By Owner',
  owner_ar: 'بواسطة المالك',
}`,
    },
    selected: {
      type: ["code"],
      label: "Selected Owners",
      defaultValue: [],
      defaultCode: "return []",
    },
    onSubmit: {
      type: ["code"],
      label: "On Submit",
      defaultCode: "console.log('owner search submit', eventData)",
      isEvent: true,
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default OwnerSearchConfig;
