import { MapIcon } from "lucide-react";
import { ComponentConfig } from "@shared/types/dls.types";
import ViewPlotDetail, { ViewPlotDetailProps } from "./ViewPlotDetail";

const ViewPlotDetailConfig: ComponentConfig<ViewPlotDetailProps> = {
  id: "viewPlotDetail",
  icon: MapIcon,
  name: "Plot Detail",
  Component: ViewPlotDetail,
  controls: {
    plotTitle: {
      type: ["text", "code"],
      label: "Plot Title",
      hasArabic: true,
      defaultValue: "Plot Title",
      defaultValueAr: "عنوان الأرض",
      defaultCode: 'return "Plot Title"',
      defaultCodeAr: 'return "عنوان الأرض"',
    },
    plotIds: {
      type: ["code"],
      label: "Plot IDs",
      hasArabic: false,
      defaultValue: [],
      defaultCode: "return []",
    },
    ownerText: {
      type: ["text", "code"],
      label: "Owner Text",
      hasArabic: true,
      defaultValue: "Owner",
      defaultValueAr: "المالك",
      defaultCode: 'return "Owner"',
      defaultCodeAr: 'return "المالك"',
    },
    showOwnerDetails: {
      type: ["boolean", "code"],
      label: "Show Owner Details",
      defaultValue: true,
      defaultCode: "return true",
    },
    theme: {
      type: ["select"],
      label: "Theme",
      options: ["light", "dark"],
      defaultValue: "dark",
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default ViewPlotDetailConfig;
