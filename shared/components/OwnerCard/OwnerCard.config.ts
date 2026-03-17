import { FolderSymlinkIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import OwnerCard, { type IOwnerCardProps } from "./OwnerCard";

const OwnerCardConfigs: ComponentConfig<IOwnerCardProps> = {
  id: "ownerDetail",
  icon: FolderSymlinkIcon,
  name: "Owner Cards",
  Component: OwnerCard,
  controls: {
    title: {
      type: ["text", "code"],
      label: "Title",
      hasArabic: true,
      defaultValue: "Owner",
      defaultValueAr: "Owner",
      defaultCode: 'return "Owner"',
      defaultCodeAr: 'return "Owner"',
    },
    isExpandable: {
      type: ["boolean", "code"],
      label: "Is Expandable?",
      defaultValue: true,
      defaultCode: "return true",
    },
    showViewButton: {
      type: ["boolean", "code"],
      label: "Show View Button",
      defaultValue: false,
      defaultCode: "return false",
    },
    showPlotsButton: {
      type: ["boolean", "code"],
      label: "Show Plots Button",
      defaultValue: false,
      defaultCode: "return false",
    },
    showEditButton: {
      type: ["boolean", "code"],
      label: "Show Edit Button",
      defaultValue: false,
      defaultCode: "return false",
    },
    showDeleteButton: {
      type: ["boolean", "code"],
      label: "Show Delete Button",
      defaultValue: false,
      defaultCode: "return false",
    },
    showChangeOwnerButton: {
      type: ["boolean", "code"],
      label: "Show Change Owner Button",
      defaultValue: false,
      defaultCode: "return false",
    },
    itemsPerRow: {
      type: ["select"],
      label: "Items Per Row",
      options: ["1", "2"],
      defaultValue: "1",
    },
    owners: {
      type: ["code"],
      label: "Owners",
      defaultValue: [],
      defaultCode: "return []",
    },
    defaultShowMore: {
      type: ["boolean", "code"],
      label: "Default Show More?",
      defaultValue: false,
      defaultCode: "return false",
    },
    onPressAction: {
      type: ["code"],
      label: "On Press any action",
      defaultCode: "console.log('action pressed', eventData)",
      isEvent: true,
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default OwnerCardConfigs;
